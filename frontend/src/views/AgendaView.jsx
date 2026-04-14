// src/views/Agenda/AgendaView.jsx
// Calendario con columnas por barbero + drag & drop (dnd-kit)

import { useState } from "react";
import { format, addDays, subDays, isToday } from "date-fns";
import { es } from "date-fns/locale";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";
import { useAgenda } from "../../hooks/useAgenda";
import TurnoCard from "../../components/Agenda/TurnoCard";
import TimeColumn from "../../components/Agenda/TimeColumn";
import BarberoColumn from "../../components/Agenda/BarberoColumn";
import NuevoTurnoModal from "../../components/Agenda/NuevoTurnoModal";
import styles from "./AgendaView.module.css";

const HORA_INICIO = 8;
const HORA_FIN = 21;

export default function AgendaView() {
  const [fecha, setFecha] = useState(new Date());
  const [activeTurno, setActiveTurno] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [slotSeleccionado, setSlotSeleccionado] = useState(null);

  const { barberos, turnos, moverTurno, isLoading } = useAgenda(fecha);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  function handleDragStart({ active }) {
    setActiveTurno(turnos.find((t) => t.id === active.id));
  }

  function handleDragEnd({ active, over }) {
    setActiveTurno(null);
    if (!over) return;
    const [barberoId, horaStr] = over.id.split("::");
    moverTurno(active.id, { barberoId, hora: horaStr });
  }

  function handleSlotClick(barberoId, hora) {
    setSlotSeleccionado({ barberoId, hora });
    setModalOpen(true);
  }

  const fechaLabel = isToday(fecha)
    ? "Hoy"
    : format(fecha, "EEEE d 'de' MMMM", { locale: es });

  return (
    <div className={styles.container}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.dateNav}>
          <button
            className={styles.navBtn}
            onClick={() => setFecha(subDays(fecha, 1))}
          >
            ‹
          </button>
          <div className={styles.dateLabel}>
            <span className={styles.dayName}>{fechaLabel}</span>
            <span className={styles.fullDate}>
              {format(fecha, "dd/MM/yyyy")}
            </span>
          </div>
          <button
            className={styles.navBtn}
            onClick={() => setFecha(addDays(fecha, 1))}
          >
            ›
          </button>
        </div>
        <button
          className={`btn btn-primary ${styles.newBtn}`}
          onClick={() => {
            setSlotSeleccionado(null);
            setModalOpen(true);
          }}
        >
          + Turno
        </button>
      </header>

      {/* ── Grilla ── */}
      <div className={styles.gridWrapper}>
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className={styles.grid}>
              {/* Columna de horas */}
              <TimeColumn horaInicio={HORA_INICIO} horaFin={HORA_FIN} />

              {/* Columna por barbero */}
              {barberos.map((barbero) => (
                <BarberoColumn
                  key={barbero.id}
                  barbero={barbero}
                  fecha={fecha}
                  turnos={turnos.filter((t) => t.barbero_id === barbero.id)}
                  horaInicio={HORA_INICIO}
                  horaFin={HORA_FIN}
                  onSlotClick={handleSlotClick}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTurno && <TurnoCard turno={activeTurno} isDragging />}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* ── Modal nuevo turno ── */}
      {modalOpen && (
        <NuevoTurnoModal
          slot={slotSeleccionado}
          fecha={fecha}
          barberos={barberos}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
