// src/components/Common/List/List.jsx
import styles from "./List.module.css";

export function List({ children, className = "", ...props }) {
  return (
    <div className={`${styles.list} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function ListItem({
  children,
  left,
  right,
  onClick,
  className = "",
  ...props
}) {
  const classes = [styles.item, onClick && styles.clickable, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} onClick={onClick} {...props}>
      {left && <div className={styles.left}>{left}</div>}
      <div className={styles.content}>{children}</div>
      {right && <div className={styles.right}>{right}</div>}
    </div>
  );
}
