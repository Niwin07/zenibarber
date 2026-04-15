// src/components/Common/Input/Input.jsx
import { forwardRef } from "react";
import styles from "./Input.module.css";

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon: Icon,
    className = "",
    fullWidth = true,
    ...props
  },
  ref
) {
  return (
    <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ""}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={`${styles.inputWrapper} ${error ? styles.hasError : ""}`}>
        {Icon && <Icon className={styles.icon} />}
        <input ref={ref} className={`${styles.input} ${Icon ? styles.withIcon : ""} ${className}`} {...props} />
      </div>
      {error && <span className={styles.error}>{error}</span>}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
    </div>
  );
});

export default Input;
