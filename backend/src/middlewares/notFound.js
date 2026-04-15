// src/middlewares/notFound.js

export const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error); // Le pasa el error al errorHandler global
};
