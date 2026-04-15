// src/views/Perfil/PerfilView.jsx
import { useAuthStore } from "../../stores/auth.store";
import { Button, Card, List, ListItem } from "../../components/Common";
import styles from "./PerfilView.module.css";

export default function PerfilView() {
  const { user, logout } = useAuthStore();

  const getRoleLabel = (rol) => {
    const roles = {
      admin: "Administrador",
      barbero: "Barbero",
      supervisor: "Supervisor",
    };
    return roles[rol] || rol;
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          {user?.nombre?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <h2 className={styles.userName}>
          {user?.nombre} {user?.apellido}
        </h2>
        <p className={styles.userRole}>{getRoleLabel(user?.rol)}</p>
      </div>

      <Card variant="default" padding="none" className={styles.infoCard}>
        <List>
          <ListItem>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>{user?.email || "-"}</span>
          </ListItem>
          <ListItem>
            <span className={styles.infoLabel}>Sucursal</span>
            <span className={styles.infoValue}>
              {user?.sucursal_id || "-"}
            </span>
          </ListItem>
        </List>
      </Card>

      <Button
        variant="danger"
        fullWidth
        onClick={logout}
        className={styles.logoutBtn}
      >
        Cerrar Sesión
      </Button>
    </div>
  );
}
