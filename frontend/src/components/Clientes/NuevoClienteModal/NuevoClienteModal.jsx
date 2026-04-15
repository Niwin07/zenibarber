// src/components/Clientes/NuevoClienteModal/NuevoClienteModal.jsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../services/api";
import { useSucursalStore } from "../../../stores/sucursal.store";
import { Modal, Button, Input } from "../../Common";
import toast from "react-hot-toast";

export default function NuevoClienteModal({ onClose }) {
  const qc = useQueryClient();
  const sucursalId = useSucursalStore((s) => s.sucursalActual?.id);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    notas: "",
  });

  const crearMutation = useMutation({
    mutationFn: (payload) => api.post("/clientes", payload),
    onSuccess: () => {
      qc.invalidateQueries(["clientes", sucursalId]);
      toast.success("Cliente agregado");
      onClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error ?? "No se pudo crear el cliente");
    },
  });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre.trim()) return toast.error("El nombre es obligatorio");
    crearMutation.mutate({ ...form, sucursal_id: sucursalId });
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Nuevo cliente"
      footer={
        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <Button type="button" variant="ghost" onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="cliente-form"
            variant="primary"
            loading={crearMutation.isPending}
            fullWidth
          >
            Guardar
          </Button>
        </div>
      }
    >
      <form id="cliente-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <Input
          label="Nombre *"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Juan"
          required
        />
        <Input
          label="Apellido"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          placeholder="Pérez"
        />
        <Input
          label="Teléfono"
          name="telefono"
          type="tel"
          value={form.telefono}
          onChange={handleChange}
          placeholder="+54 11 1234 5678"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="juan@mail.com"
        />
        <div>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px", display: "block" }}>
            Notas
          </label>
          <textarea
            name="notas"
            value={form.notas}
            onChange={handleChange}
            placeholder="Observaciones opcionales..."
            rows={2}
            style={{ width: "100%", padding: "var(--space-3) var(--space-4)", background: "var(--bg-tertiary)", border: "none", borderRadius: "var(--radius-md)", fontSize: "15px", color: "var(--text-primary)", resize: "vertical", minHeight: "60px" }}
          />
        </div>
      </form>
    </Modal>
  );
}
