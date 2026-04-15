// src/components/Common/Select/Select.jsx
import { forwardRef } from "react";
import styles from "./Select.module.css";

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder, className = "", ...props },
  ref
) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <select
        ref={ref}
        className={`${styles.select} ${error ? styles.hasError : ""} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
});

export default Select;
