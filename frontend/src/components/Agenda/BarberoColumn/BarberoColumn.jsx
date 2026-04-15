// src/components/Agenda/BarberoColumn/BarberoColumn.jsx
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { format } from "date-fns";
import { Avatar } from "../../Common";
import TurnoCard from "../TurnoCard";
import styles from "./BarberoColumn.module.css";

const SLOT_HEIGHT = 60;
const MINS_PER_SLOT = 60;

function SlotDropzone({ id, hora, barberoId, onSlotClick, hasConflict }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.slot} ${isOver ? styles.slotOver : ""} ${hasConflict ? styles.slotBusy : ""}`}
      style={{ height: SLOT_HEIGHT }}
      onClick={() => onSlotClick(barberoId, hora)}
    />
  );
}

function DraggableTurno({ turno, horaInicio }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: turno.id,
  });

  const inicio = new Date(turno.inicio);
  const fin = turno.fin_estimado
    ? new Date(turno.fin_estimado)
    : new Date(inicio.getTime() + 30 * 60_000);

  const startMins = (inicio.getHours() - horaInicio) * 60 + inicio.getMinutes();
  const durationMins = (fin - inicio) / 60_000;

  const top = (startMins / MINS_PER_SLOT) * SLOT_HEIGHT;
  const height = Math.max((durationMins / MINS_PER_SLOT) * SLOT_HEIGHT, 36);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={styles.turnoWrapper}
      style={{ top, height }}
    >
      <TurnoCard turno={turno} isDragging={isDragging} />
    </div>
  );
}

export default function BarberoColumn({
  barbero,
  fecha,
  turnos,
  horaInicio,
  horaFin,
  onSlotClick,
}) {
  const horas = Array.from(
    { length: horaFin - horaInicio },
    (_, i) => horaInicio + i,
  );

  const horasBusy = new Set(turnos.map((t) => new Date(t.inicio).getHours()));
  const totalHeight = horas.length * SLOT_HEIGHT;

  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <Avatar
          src={barbero.avatar_url}
          name={`${barbero.nombre} ${barbero.apellido}`}
          size="sm"
          className={styles.avatar}
        />
        {!barbero.avatar_url && (
          <div className={styles.avatarFallback}>
            {barbero.nombre?.[0]}{barbero.apellido?.[0]}
          </div>
        )}
        <span className={styles.nombre}>{barbero.nombre}</span>
      </div>

      <div className={styles.gridArea} style={{ height: totalHeight }}>
        {horas.map((h) => {
          const horaStr = format(
            new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), h),
            "HH:mm",
          );
          return (
            <SlotDropzone
              key={h}
              id={`${barbero.id}::${horaStr}`}
              hora={horaStr}
              barberoId={barbero.id}
              onSlotClick={onSlotClick}
              hasConflict={horasBusy.has(h)}
            />
          );
        })}

        {turnos.map((turno) => (
          <DraggableTurno
            key={turno.id}
            turno={turno}
            horaInicio={horaInicio}
          />
        ))}
      </div>
    </div>
  );
}
