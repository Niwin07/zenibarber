import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: null,
  // 1. Inicializamos el token directamente del localStorage para que no se pierda al refrescar
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),

  login: async (email, password) => {
    try {
      const res = await axios.post("http://localhost:4000/api/v1/auth/login", {
        email,
        password,
      });

      const { token, usuario } = res.data;

      // 2. GUARDAMOS TODO EN EL STORE (Incluido el token)
      set({
        user: usuario,
        token: token,
        isAuthenticated: true,
      });

      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error en el login store:", error);
      throw error; // Para que el LoginView sepa que falló
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
