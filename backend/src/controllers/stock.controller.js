// ============================================================
// src/controllers/stock.controller.js  (adjunto aquí por brevedad)
// ============================================================

// GET /api/v1/stock?sucursal_id=1
export async function listarStock(req, res, next) {
  try {
    const { sucursal_id } = req.query;
    const [rows] = await pool.execute(
      `
      SELECT
        s.id AS stock_id,
        p.id AS producto_id, p.nombre AS producto,
        c.nombre AS categoria,
        s.cantidad_actual, s.cantidad_minima, p.unidad,
        p.precio_venta,
        IF(s.cantidad_actual <= s.cantidad_minima, 1, 0) AS alerta_reposicion
      FROM stock s
      JOIN productos           p ON p.id = s.producto_id
      JOIN categorias_producto c ON c.id = p.categoria_id
      WHERE s.sucursal_id = ?
      ORDER BY c.nombre, p.nombre
    `,
      [sucursal_id],
    );

    res.json({ ok: true, data: rows });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/stock/ingreso — ingreso manual de mercadería
export async function ingresarStock(req, res, next) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { sucursal_id, producto_id, cantidad, notas } = req.body;

    await conn.execute(
      `INSERT INTO stock (sucursal_id, producto_id, cantidad_actual)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE cantidad_actual = cantidad_actual + VALUES(cantidad_actual)`,
      [sucursal_id, producto_id, cantidad],
    );

    await conn.execute(
      `INSERT INTO movimientos_stock
         (sucursal_id, producto_id, tipo_id, cantidad, usuario_id, notas)
       VALUES (?,?,1,?,?,?)`,
      [sucursal_id, producto_id, cantidad, req.user.id, notas || null],
    );

    await conn.commit();
    res.status(201).json({ ok: true });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
}
