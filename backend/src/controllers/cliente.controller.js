import pool from "../config/db.js";

export const listarClientes = async (req, res, next) => {
  try {
    const { q } = req.query;
    const sucursalId = req.user.sucursal_id;
    let query =
      "SELECT id, nombre, apellido, telefono, email FROM clientes WHERE sucursal_id = ?";
    const params = [sucursalId];

    if (q) {
      query += " AND (nombre LIKE ? OR apellido LIKE ? OR telefono LIKE ?)";
      const searchTerm = `%${q}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    query += " ORDER BY nombre ASC LIMIT 20";

    const [clientes] = await pool.execute(query, params);
    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

export const obtenerCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sucursalId = req.user.sucursal_id;
    const [clientes] = await pool.execute(
      "SELECT * FROM clientes WHERE id = ? AND sucursal_id = ?",
      [id, sucursalId],
    );
    if (clientes.length === 0)
      return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(clientes[0]);
  } catch (error) {
    next(error);
  }
};

export const crearCliente = async (req, res, next) => {
  try {
    const { nombre, apellido, telefono, email } = req.body;
    const sucursalId = req.user.sucursal_id;
    const [result] = await pool.execute(
      "INSERT INTO clientes (nombre, apellido, telefono, email, sucursal_id) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, telefono, email || null, sucursalId],
    );
    res
      .status(201)
      .json({ id: result.insertId, message: "Cliente creado con éxito" });
  } catch (error) {
    next(error);
  }
};

export const actualizarCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, telefono, email } = req.body;
    const sucursalId = req.user.sucursal_id;
    const [result] = await pool.execute(
      "UPDATE clientes SET nombre = ?, apellido = ?, telefono = ?, email = ? WHERE id = ? AND sucursal_id = ?",
      [nombre, apellido, telefono, email || null, id, sucursalId],
    );
    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ message: "Cliente no encontrado o sin permisos" });
    res.json({ message: "Cliente actualizado con éxito" });
  } catch (error) {
    next(error);
  }
};
