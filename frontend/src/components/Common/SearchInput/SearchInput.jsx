// src/components/Common/SearchInput/SearchInput.jsx
import { forwardRef } from "react";
import styles from "./SearchInput.module.css";

const SearchInput = forwardRef(function SearchInput(
  { value, onChange, placeholder = "Buscar...", className = "", ...props },
  ref
) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        ref={ref}
        type="text"
        className={styles.input}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
      {value && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange({ target: { value: "" } })}
          aria-label="Limpiar búsqueda"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
});

export default SearchInput;
