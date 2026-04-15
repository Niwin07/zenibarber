// src/components/Common/Spinner/Spinner.jsx
import styles from "./Spinner.module.css";

export default function Spinner({ size = "md", className = "" }) {
  return (
    <div className={`${styles.spinner} ${styles[size]} ${className}`} />
  );
}
