// src/components/Agenda/TurnoCard/TurnoCard.jsx
import { Badge } from "../../Common";
import styles from "./TurnoCard.module.css";

const ESTADO_CONFIG = {
  reservado: { variant: "info", label: "Reservado" },
  confirmado: { variant: "success", label: "Confirmado" },
  en_curso: { variant: "warning", label: "En curso" },
  completado: { variant: "success", label: "Completado" },
  cancelado: { variant: "error", label: "Cancelado" },
};

export default function TurnoCard({ turno, isDragging = false, style }) {
  const estado =
    ESTADO_CONFIG[turno.estado?.toLowerCase()] ?? ESTADO_CONFIG.reservado;
  const clienteNombre = turno.cliente_nombre
    ? `${turno.cliente_nombre} ${turno.cliente_apellido ?? ""}`.trim()
    : "Sin cliente";

  const inicio = new Date(turno.inicio);
  const fin = turno.fin_estimado ? new Date(turno.fin_estimado) : null;
  const horaInicio = inicio.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const horaFin = fin
    ? fin.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div
      className={`${styles.card} ${isDragging ? styles.dragging : ""}`}
      style={style}
    >
      <div className={styles.colorBar} data-estado={turno.estado?.toLowerCase()} />
      <div className={styles.body}>
        <span className={styles.hora}>
          {horaInicio}
          {horaFin ? ` - ${horaFin}` : ""}
        </span>
        <p className={styles.cliente}>{clienteNombre}</p>
        <p className={styles.servicio}>{turno.servicio}</p>
        <div className={styles.footer}>
          <Badge variant={estado.variant} size="sm">{estado.label}</Badge>
          {turno.duracion_min && (
            <span className={styles.duracion}>{turno.duracion_min} min</span>
          )}
        </div>
      </div>
    </div>
  );
}
