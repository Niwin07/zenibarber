// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./stores/auth.store";

// Vistas
import LoginView from "./views/Auth/LoginView";
import AgendaView from "./views/Agenda/AgendaView";
import StockView from "./views/Stock/StockView";
import ClientesView from "./views/Clientes/ClientesView";
import PerfilView from "./views/Perfil/PerfilView";
import AppShell from "./components/Layout/AppShell";

import "./styles/global.css";

const qc = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppShell />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/agenda" replace />} />
            <Route path="agenda" element={<AgendaView />} />
            <Route path="stock" element={<StockView />} />
            <Route path="clientes" element={<ClientesView />} />
            <Route path="perfil" element={<PerfilView />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            borderRadius: "12px",
            boxShadow: "var(--shadow-lg)",
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
          },
        }}
      />
    </QueryClientProvider>
  );
}
