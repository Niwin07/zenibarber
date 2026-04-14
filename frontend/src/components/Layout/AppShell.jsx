// src/components/Layout/AppShell.jsx
import { Outlet, NavLink } from "react-router-dom";
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

// Íconos SVG inline estilo iOS SF Symbols
function CalendarIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="4" width="18" height="18" rx="4" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </svg>
  );
}
function BoxIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
      <path d="M12 3v18M3 8l9 5 9-5" />
    </svg>
  );
}
function PeopleIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="9" cy="7" r="3" />
      <path d="M2 21v-1a7 7 0 0 1 14 0v1" />
      <circle cx="18" cy="7" r="2.5" />
      <path d="M22 21v-1a5 5 0 0 0-7-4.6" />
    </svg>
  );
}
function PersonIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
    </svg>
  );
}
