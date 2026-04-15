// src/views/Auth/LoginView.jsx
import { useState } from "react";
import { useAuthStore } from "../../stores/auth.store";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../../components/Common";
import styles from "./LoginView.module.css";

export default function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/agenda");
    } catch (error) {
      alert("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 3l1.5 4.5L12 6l4.5-1.5L18 3" />
            <path d="M3 9v12h18V9" />
            <path d="M8 21v-6h8v6" />
            <path d="M3 9l4.5-6 4.5 6" />
          </svg>
        </div>
        <span className={styles.logoText}>Zenibarber</span>
        <span className={styles.logoSubtext}>Gestión de barbería</span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formFields}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="barbero@zenibarber.com"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <Button
          type="submit"
          variant="gold"
          fullWidth
          loading={isLoading}
          className={styles.submitBtn}
        >
          Entrar
        </Button>
      </form>

      <p className={styles.footer}>
        © 2024 Zenibarber. Todos los derechos reservados.
      </p>
    </div>
  );
}
