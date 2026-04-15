import pool from "../config/db.js";

export const listarSucursales = async (req, res, next) => {
  try {
    const { id, rol } = req.user;
    if (rol === "admin") {
      const [sucursales] = await pool.execute(
        'SELECT id, nombre, direccion, telefono FROM sucursales WHERE estado = "activo"',
      );
      return res.json(sucursales);
    } else {
      const [sucursales] = await pool.execute(
        `SELECT s.id, s.nombre, s.direccion, s.telefono 
                 FROM sucursales s 
                 INNER JOIN usuario_sucursal us ON s.id = us.sucursal_id 
                 WHERE us.usuario_id = ? AND s.estado = "activo"`,
        [id],
      );
      return res.json(sucursales);
    }
  } catch (error) {
    next(error);
  }
};

export const crearSucursal = async (req, res, next) => {
  try {
    if (req.user.rol !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para crear sucursales" });
    }
    const { nombre, direccion, telefono } = req.body;
    const [result] = await pool.execute(
      "INSERT INTO sucursales (nombre, direccion, telefono) VALUES (?, ?, ?)",
      [nombre, direccion, telefono || null],
    );
    res
      .status(201)
      .json({ id: result.insertId, message: "Sucursal creada con éxito" });
  } catch (error) {
    next(error);
  }
};
