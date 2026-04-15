// src/components/Common/Button/Button.jsx
import styles from "./Button.module.css";

const VARIANTS = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
  danger: styles.danger,
  gold: styles.gold,
};

const SIZES = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = "left",
  className = "",
  ...props
}) {
  const classes = [
    styles.button,
    VARIANTS[variant],
    SIZES[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <span className={styles.spinner} />
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className={styles.icon} />}
          <span>{children}</span>
          {Icon && iconPosition === "right" && (
            <Icon className={styles.icon} />
          )}
        </>
      )}
    </button>
  );
}
