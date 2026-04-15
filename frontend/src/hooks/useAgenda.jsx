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
