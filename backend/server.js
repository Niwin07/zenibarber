// ============================================================
//  ZENIBARBER — Entry Point del Backend
//  Stack: Node.js + Express + MySQL2
// ============================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createPool } from './src/config/db.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import { notFound } from './src/middlewares/notFound.js';

// Rutas
import authRoutes       from './src/routes/auth.routes.js';
import sucursalRoutes   from './src/routes/sucursal.routes.js';
import usuarioRoutes    from './src/routes/usuario.routes.js';
import turnoRoutes      from './src/routes/turno.routes.js';
import stockRoutes      from './src/routes/stock.routes.js';
import productoRoutes   from './src/routes/producto.routes.js';
import clienteRoutes    from './src/routes/cliente.routes.js';
import servicioRoutes   from './src/routes/servicio.routes.js';

// ── Bootstrap ────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 4000;

// ── Conexión a la base de datos ──────────────────────────────
export const pool = createPool();

// Verificar conexión al iniciar
try {
  const conn = await pool.getConnection();
  console.log('✅  MySQL conectado correctamente');
  conn.release();
} catch (err) {
  console.error('❌  No se pudo conectar a MySQL:', err.message);
  process.exit(1);
}

// ── Middlewares globales ─────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Rutas de la API ──────────────────────────────────────────
const API = '/api/v1';

app.use(`${API}/auth`,       authRoutes);
app.use(`${API}/sucursales`, sucursalRoutes);
app.use(`${API}/usuarios`,   usuarioRoutes);
app.use(`${API}/turnos`,     turnoRoutes);
app.use(`${API}/stock`,      stockRoutes);
app.use(`${API}/productos`,  productoRoutes);
app.use(`${API}/clientes`,   clienteRoutes);
app.use(`${API}/servicios`,  servicioRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date() }));

// ── Error handlers ───────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  Zenibarber API corriendo en http://localhost:${PORT}`);
});
