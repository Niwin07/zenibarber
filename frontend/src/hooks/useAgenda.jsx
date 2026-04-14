// src/hooks/useAgenda.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { api } from "../services/api";
import toast from "react-hot-toast";
import { useSucursalStore } from "../stores/sucursal.store";

export function useAgenda(fecha) {
  const qc = useQueryClient();
  const sucursalId = useSucursalStore((s) => s.sucursalActual?.id);
  const fechaStr = format(fecha, "yyyy-MM-dd");

  const { data: barberos = [], isLoading: loadingBarberos } = useQuery({
    queryKey: ["barberos", sucursalId],
    queryFn: () =>
      api
        .get(`/usuarios?sucursal_id=${sucursalId}&rol=barbero`)
        .then((r) => r.data.data),
    enabled: !!sucursalId,
  });

  const { data: turnos = [], isLoading: loadingTurnos } = useQuery({
    queryKey: ["turnos", sucursalId, fechaStr],
    queryFn: () =>
      api
        .get(`/turnos?sucursal_id=${sucursalId}&fecha=${fechaStr}`)
        .then((r) => r.data.data),
    enabled: !!sucursalId,
  });

  const moverMutation = useMutation({
    mutationFn: ({ turnoId, destino }) =>
      api.patch(`/turnos/${turnoId}/mover`, destino),
    onSuccess: () => {
      qc.invalidateQueries(["turnos", sucursalId, fechaStr]);
    },
    onError: () => toast.error("No se pudo mover el turno"),
  });

  return {
    barberos,
    turnos,
    isLoading: loadingBarberos || loadingTurnos,
    moverTurno: (turnoId, destino) =>
      moverMutation.mutate({ turnoId, destino }),
  };
}

// ─────────────────────────────────────────────────────────────
// src/hooks/useAuth.js
import { useAuthStore } from "../stores/auth.store";
import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const { user, token, setAuth, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (creds) => api.post("/auth/login", creds),
    onSuccess: ({ data }) => {
      setAuth(data.data.user, data.data.accessToken);
      navigate("/agenda");
    },
    onError: () => toast.error("Credenciales incorrectas"),
  });

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    clearAuth();
    navigate("/login");
  };

  return {
    user,
    token,
    login: loginMutation.mutate,
    logout,
    isLoading: loginMutation.isPending,
  };
}

// ─────────────────────────────────────────────────────────────
// src/services/api.js
import axios from "axios";
import { useAuthStore } from "../stores/auth.store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1",
  withCredentials: true,
});

// Attach JWT automáticamente
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh token si 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await api.post("/auth/refresh");
        useAuthStore.getState().setAuth(null, data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);

// ─────────────────────────────────────────────────────────────
// src/stores/auth.store.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),
    }),
    { name: "zenibarber-auth", partialize: (s) => ({ token: s.token }) },
  ),
);

// ─────────────────────────────────────────────────────────────
// src/stores/sucursal.store.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSucursalStore = create(
  persist(
    (set) => ({
      sucursalActual: null,
      setSucursal: (s) => set({ sucursalActual: s }),
    }),
    { name: "zenibarber-sucursal" },
  ),
);
