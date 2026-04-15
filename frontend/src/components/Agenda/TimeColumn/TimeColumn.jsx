// src/components/Agenda/TimeColumn/TimeColumn.jsx
import styles from "./TimeColumn.module.css";

const SLOT_HEIGHT = 60;

export default function TimeColumn({ horaInicio, horaFin }) {
  const horas = Array.from(
    { length: horaFin - horaInicio + 1 },
    (_, i) => horaInicio + i,
  );

  return (
    <div className={styles.column}>
      <div className={styles.headerSpacer} />
      {horas.map((h) => (
        <div key={h} className={styles.slot} style={{ height: SLOT_HEIGHT }}>
          <span className={styles.label}>{String(h).padStart(2, "0")}:00</span>
        </div>
      ))}
    </div>
  );
}
