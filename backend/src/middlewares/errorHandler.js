// src/middlewares/errorHandler.js
export function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR ${status}]`, err);
  }

  res.status(status).json({
    ok: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

// src/middlewares/notFound.js — lo exportamos aquí por simplicidad
export function notFound(req, res) {
  res.status(404).json({ ok: false, error: `Ruta no encontrada: ${req.originalUrl}` });
}
