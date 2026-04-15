// src/components/Agenda/NuevoTurnoModal/NuevoTurnoModal.jsx
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { api } from "../../../services/api";
import { useSucursalStore } from "../../../stores/sucursal.store";
import { Modal, Button, Select } from "../../Common";
import toast from "react-hot-toast";
import styles from "./NuevoTurnoModal.module.css";

export default function NuevoTurnoModal({ slot, fecha, barberos, onClose }) {
  const qc = useQueryClient();
  const sucursalId = useSucursalStore((s) => s.sucursalActual?.id);
  const fechaStr = format(fecha, "yyyy-MM-dd");

  const [form, setForm] = useState({
    barbero_id: slot?.barberoId ?? barberos[0]?.id ?? "",
    servicio_id: "",
    inicio: slot?.hora ? `${fechaStr}T${slot.hora}:00` : `${fechaStr}T09:00:00`,
    notas: "",
  });

  const [busqueda, setBusqueda] = useState("");
  const [clienteId, setClienteId] = useState(null);

  const { data: servicios = [] } = useQuery({
    queryKey: ["servicios", sucursalId],
    queryFn: () =>
      api.get(`/servicios?sucursal_id=${sucursalId}`).then((r) => r.data.data),
    enabled: !!sucursalId,
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes-search", busqueda],
    queryFn: () =>
      api
        .get(`/clientes?q=${busqueda}&sucursal_id=${sucursalId}`)
        .then((r) => r.data.data),
    enabled: busqueda.length >= 2,
  });

  const crearMutation = useMutation({
    mutationFn: (payload) => api.post("/turnos", payload),
    onSuccess: () => {
      qc.invalidateQueries(["turnos", sucursalId, fechaStr]);
      toast.success("Turno creado");
      onClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error ?? "No se pudo crear el turno");
    },
  });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.servicio_id) return toast.error("Seleccioná un servicio");
    if (!form.barbero_id) return toast.error("Seleccioná un barbero");

    crearMutation.mutate({
      sucursal_id: sucursalId,
      barbero_id: Number(form.barbero_id),
      servicio_id: Number(form.servicio_id),
      inicio: form.inicio,
      notas: form.notas || null,
      cliente_id: clienteId ?? null,
    });
  }

  const barberoOptions = barberos.map((b) => ({
    value: b.id,
    label: `${b.nombre} ${b.apellido}`,
  }));

  const servicioOptions = servicios.map((s) => ({
    value: s.id,
    label: `${s.nombre} (${s.duracion_min} min)`,
  }));

  return (
    <Modal isOpen onClose={onClose} title="Nuevo turno" showHandle>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Select
          label="Barbero"
          options={barberoOptions}
          name="barbero_id"
          value={form.barbero_id}
          onChange={handleChange}
          placeholder="Seleccionar..."
          required
        />

        <Select
          label="Servicio"
          options={servicioOptions}
          name="servicio_id"
          value={form.servicio_id}
          onChange={handleChange}
          placeholder="Seleccionar..."
          required
        />

        <div className={styles.inputWrapper}>
          <label className={styles.label} style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px", display: "block" }}>
            Inicio
          </label>
          <input
            type="datetime-local"
            name="inicio"
            value={form.inicio}
            onChange={handleChange}
            style={{ width: "100%", height: "var(--input-height)", padding: "0 var(--space-4)", background: "var(--bg-tertiary)", border: "none", borderRadius: "var(--radius-md)", fontSize: "15px", color: "var(--text-primary)" }}
            required
          />
        </div>

        <div className={styles.inputWrapper} style={{ position: "relative" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px", display: "block" }}>
            Cliente
          </label>
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setClienteId(null);
            }}
            style={{ width: "100%", height: "var(--input-height)", padding: "0 var(--space-4)", background: "var(--bg-tertiary)", border: "none", borderRadius: "var(--radius-md)", fontSize: "15px", color: "var(--text-primary)" }}
          />
          {clientes.length > 0 && !clienteId && (
            <ul className={styles.dropdown}>
              {clientes.slice(0, 5).map((c) => (
                <li
                  key={c.id}
                  className={styles.dropdownItem}
                  onClick={() => {
                    setClienteId(c.id);
                    setBusqueda(`${c.nombre} ${c.apellido}`);
                  }}
                >
                  <strong>{c.nombre} {c.apellido}</strong>
                  <span>{c.telefono}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

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

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={crearMutation.isPending}>
            Crear turno
          </Button>
        </div>
      </form>
    </Modal>
  );
}
