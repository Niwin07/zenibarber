// src/routes/turno.routes.js
import { Router } from 'express';
import { authenticate, authorize, belongsToSucursal } from '../middlewares/auth.middleware.js';
import {
  listarTurnos, crearTurno, cambiarEstado, cerrarTurno
} from '../controllers/turno.controller.js';

const router = Router();

router.use(authenticate);

router.get('/',          belongsToSucursal, listarTurnos);
router.post('/',         belongsToSucursal, crearTurno);
router.patch('/:id/estado', cambiarEstado);
router.post('/:id/cerrar',  cambiarEstado, cerrarTurno);

export default router;


// ─────────────────────────────────────────────────────────────
// src/routes/stock.routes.js
import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { listarStock, ingresarStock } from '../controllers/turno.controller.js'; // re-exported above

const stockRouter = Router();
stockRouter.use(authenticate);
stockRouter.get('/',        listarStock);
stockRouter.post('/ingreso', authorize('admin', 'dueno'), ingresarStock);

export { stockRouter as default };


// ─────────────────────────────────────────────────────────────
// src/routes/auth.routes.js
import { Router } from 'express';
import { login, logout, refresh, me } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const authRouter = Router();
authRouter.post('/login',   login);
authRouter.post('/logout',  authenticate, logout);
authRouter.post('/refresh', refresh);
authRouter.get('/me',       authenticate, me);

export { authRouter as default };


// ─────────────────────────────────────────────────────────────
// src/routes/sucursal.routes.js
import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const sucursalRouter = Router();
sucursalRouter.use(authenticate);

// Implementación inline simple (expandir en controllers/sucursal.controller.js)
import { pool } from '../../server.js';

sucursalRouter.get('/', async (req, res, next) => {
  try {
    const isAdmin = req.user.rol_id === 1;
    const [rows] = isAdmin
      ? await pool.execute('SELECT * FROM sucursales WHERE activa = 1')
      : await pool.execute(`
          SELECT s.* FROM sucursales s
          JOIN usuario_sucursal us ON us.sucursal_id = s.id
          WHERE us.usuario_id = ? AND us.activo = 1 AND s.activa = 1
        `, [req.user.id]);

    res.json({ ok: true, data: rows });
  } catch (err) { next(err); }
});

sucursalRouter.post('/', authorize('admin'), async (req, res, next) => {
  try {
    const { nombre, direccion, telefono, email } = req.body;
    const [r] = await pool.execute(
      'INSERT INTO sucursales (nombre, direccion, telefono, email) VALUES (?,?,?,?)',
      [nombre, direccion, telefono, email]
    );
    res.status(201).json({ ok: true, data: { id: r.insertId } });
  } catch (err) { next(err); }
});

export { sucursalRouter as default };
