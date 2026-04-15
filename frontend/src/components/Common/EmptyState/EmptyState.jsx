// src/components/Common/EmptyState/EmptyState.jsx
import styles from "./EmptyState.module.css";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {Icon && (
        <div className={styles.iconWrapper}>
          <Icon className={styles.icon} />
        </div>
      )}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
