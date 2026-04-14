// src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import { pool } from '../../server.js';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, error: 'Token requerido' });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Adjuntar usuario al request
    const [[user]] = await pool.execute(
      'SELECT id, rol_id, nombre, apellido, email, activo FROM usuarios WHERE id = ?',
      [payload.sub]
    );
    if (!user || !user.activo) {
      return res.status(401).json({ ok: false, error: 'Usuario inválido o inactivo' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ ok: false, error: 'Token inválido o expirado' });
  }
}

// Autorización por rol
export function authorize(...roles) {
  const ROL_MAP = { admin: 1, dueno: 2, barbero: 3 };
  return (req, res, next) => {
    const allowed = roles.map(r => ROL_MAP[r]);
    if (!allowed.includes(req.user.rol_id)) {
      return res.status(403).json({ ok: false, error: 'Sin permiso para esta acción' });
    }
    next();
  };
}

// Verifica que el usuario pertenezca a la sucursal solicitada
export async function belongsToSucursal(req, res, next) {
  const sucursalId = req.params.sucursalId || req.body.sucursal_id;
  if (!sucursalId) return next();

  // Admin ve todo
  if (req.user.rol_id === 1) return next();

  const [[row]] = await pool.execute(
    'SELECT 1 FROM usuario_sucursal WHERE usuario_id = ? AND sucursal_id = ? AND activo = 1',
    [req.user.id, sucursalId]
  );
  if (!row) return res.status(403).json({ ok: false, error: 'No pertenecés a esta sucursal' });
  next();
}
