import { create } from "zustand";
import { api } from "../services/api";

export const useSucursalStore = create((set) => ({
  sucursales: [],
  isLoading: false,
  fetchSucursales: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get("/sucursales");
      set({ sucursales: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching sucursales:", error);
      set({ isLoading: false });
    }
  },
}));
