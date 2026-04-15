// src/views/Clientes/ClientesView.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import { useSucursalStore } from "../../stores/sucursal.store";
import { Button, SearchInput, Avatar, Badge, List, ListItem, EmptyState, Spinner } from "../../components/Common";
import NuevoClienteModal from "../../components/Clientes/NuevoClienteModal";
import styles from "./ClientesView.module.css";

export default function ClientesView() {
  const sucursalId = useSucursalStore((s) => s.sucursalActual?.id);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ["clientes", sucursalId, busqueda],
    queryFn: () =>
      api
        .get("/clientes", {
          params: { q: busqueda, sucursal_id: sucursalId },
        })
        .then((r) => r.data.data),
    enabled: !!sucursalId,
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Clientes</h1>
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
          + Agregar
        </Button>
      </header>

      <div className={styles.searchWrapper}>
        <SearchInput
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o teléfono..."
        />
      </div>

      <div className={styles.content}>
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <Spinner size="lg" />
          </div>
        ) : clientes.length === 0 ? (
          <EmptyState
            title="No hay clientes"
            description="Agregá tu primer cliente para comenzar a gestionar turnos."
            action={
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                + Agregar cliente
              </Button>
            }
          />
        ) : (
          <List>
            {clientes.map((cliente) => (
              <ListItem
                key={cliente.id}
                left={
                  <Avatar
                    name={`${cliente.nombre} ${cliente.apellido}`}
                    size="md"
                  />
                }
                right={<Badge variant="info" size="sm">Ver</Badge>}
              >
                <div className={styles.clientInfo}>
                  <div className={styles.clientName}>
                    {cliente.nombre} {cliente.apellido}
                  </div>
                  <div className={styles.clientPhone}>{cliente.telefono}</div>
                </div>
              </ListItem>
            ))}
          </List>
        )}
      </div>

      {modalOpen && <NuevoClienteModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
