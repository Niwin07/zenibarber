// src/components/Layout/AppShell/AppShell.jsx
import { Outlet, NavLink } from "react-router-dom";
import { CalendarIcon, BoxIcon, PeopleIcon, PersonIcon } from "./Icons";
import styles from "./AppShell.module.css";

const NAV_ITEMS = [
  { to: "/agenda", label: "Agenda", icon: CalendarIcon },
  { to: "/stock", label: "Stock", icon: BoxIcon },
  { to: "/clientes", label: "Clientes", icon: PeopleIcon },
  { to: "/perfil", label: "Perfil", icon: PersonIcon },
];

export default function AppShell() {
  return (
    <div className={styles.shell}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <nav className={styles.tabBar}>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.tabItem} ${isActive ? styles.active : ""}`
            }
          >
            <Icon className={styles.tabIcon} />
            <span className={styles.tabLabel}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
