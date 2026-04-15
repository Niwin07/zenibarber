// src/components/Common/Badge/Badge.jsx
import styles from "./Badge.module.css";

const VARIANTS = {
  default: styles.default,
  success: styles.success,
  warning: styles.warning,
  error: styles.error,
  info: styles.info,
  gold: styles.gold,
};

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  icon: Icon,
  className = "",
  ...props
}) {
  const classes = [
    styles.badge,
    VARIANTS[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...props}>
      {Icon && <Icon className={styles.icon} />}
      {children}
    </span>
  );
}
