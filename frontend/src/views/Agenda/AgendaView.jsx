// src/views/Agenda/AgendaView.jsx
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
import { TimeColumn, BarberoColumn, TurnoCard, NuevoTurnoModal } from "../../components/Agenda";
import { Button, Spinner } from "../../components/Common";
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
      <header className={styles.header}>
        <div className={styles.dateNav}>
          <button
            className={styles.navBtn}
            onClick={() => setFecha(subDays(fecha, 1))}
            aria-label="Día anterior"
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
            aria-label="Día siguiente"
          >
            ›
          </button>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setSlotSeleccionado(null);
            setModalOpen(true);
          }}
          className={styles.newBtn}
        >
          + Turno
        </Button>
      </header>

      <div className={styles.gridWrapper}>
        {isLoading ? (
          <div className={styles.loading}>
            <Spinner size="lg" />
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className={styles.grid}>
              <TimeColumn horaInicio={HORA_INICIO} horaFin={HORA_FIN} />

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
