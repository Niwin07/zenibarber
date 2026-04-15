// src/views/Stock/StockView.jsx
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import { useSucursalStore } from "../../stores/sucursal.store";
import { Badge, List, ListItem, EmptyState, Spinner } from "../../components/Common";
import styles from "./StockView.module.css";

export default function StockView() {
  const sucursalId = useSucursalStore((s) => s.sucursalActual?.id);

  const { data: productos = [], isLoading } = useQuery({
    queryKey: ["stock", sucursalId],
    queryFn: () =>
      api
        .get("/productos", { params: { sucursal_id: sucursalId } })
        .then((r) => r.data.data),
    enabled: !!sucursalId,
  });

  const umbral = 10;
  const bajoStock = productos.filter(
    (p) => p.stock_actual <= (p.stock_minimo ?? umbral)
  );

  const getStockStatus = (producto) => {
    const min = producto.stock_minimo ?? umbral;
    if (producto.stock_actual === 0)
      return { label: "Sin stock", variant: "error" };
    if (producto.stock_actual <= min * 0.5)
      return { label: "Crítico", variant: "error" };
    if (producto.stock_actual <= min)
      return { label: "Bajo", variant: "warning" };
    return { label: "OK", variant: "success" };
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Stock</h1>
        {bajoStock.length > 0 && (
          <Badge variant="warning" size="md">
            {bajoStock.length} alerta{bajoStock.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </header>

      {bajoStock.length > 0 && (
        <div className={styles.alertCard}>
          <div className={styles.alertTitle}>Productos con stock bajo</div>
          {bajoStock.map((p) => (
            <div key={p.id} className={styles.alertItem}>
              <span className={styles.alertItemName}>{p.nombre}</span>
              <span className={styles.alertItemCount}>
                {p.stock_actual} / {p.stock_minimo ?? umbral}
              </span>
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <Spinner size="lg" />
        </div>
      ) : productos.length === 0 ? (
        <EmptyState
          title="Sin productos"
          description="No hay productos en el inventario."
        />
      ) : (
        <List>
          {productos.map((producto) => {
            const status = getStockStatus(producto);
            return (
              <ListItem
                key={producto.id}
                left={<div className={styles.productIcon}>📦</div>}
                right={<Badge variant={status.variant} size="sm">{status.label}</Badge>}
              >
                <div className={styles.productInfo}>
                  <div className={styles.productName}>{producto.nombre}</div>
                  <div className={styles.productStock}>
                    {producto.stock_actual} unidades
                  </div>
                </div>
              </ListItem>
            );
          })}
        </List>
      )}
    </div>
  );
}
