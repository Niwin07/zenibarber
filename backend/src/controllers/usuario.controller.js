import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const listarUsuarios = async (req, res, next) => {
  try {
    // Traemos a los barberos de la misma sucursal del admin
    const sucursalId = req.user.sucursal_id;
    const [usuarios] = await pool.execute(
      "SELECT id, nombre, email, rol, telefono, estado FROM usuarios WHERE sucursal_id = ?",
      [sucursalId],
    );
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
};

export const crearUsuario = async (req, res, next) => {
  try {
    // Validamos que solo el dueño (admin) pueda crear empleados
    if (req.user.rol !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo los administradores pueden crear usuarios" });
    }

    const { nombre, email, password, rol, telefono } = req.body;
    const sucursalId = req.user.sucursal_id;

    // Encriptamos la clave antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      "INSERT INTO usuarios (nombre, email, password, rol, telefono, sucursal_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        nombre,
        email,
        hashedPassword,
        rol || "barbero",
        telefono || null,
        sucursalId,
      ],
    );

    res
      .status(201)
      .json({ id: result.insertId, message: "Usuario creado con éxito" });
  } catch (error) {
    next(error);
  }
};
