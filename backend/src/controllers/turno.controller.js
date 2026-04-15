// src/controllers/turno.controller.js
import pool from "../config/db.js";

// GET /api/v1/turnos?sucursal_id=1&fecha=2025-07-15
export async function listarTurnos(req, res, next) {
  try {
    const { sucursal_id, fecha, barbero_id } = req.query;

    let sql = `
      SELECT
        t.id, t.inicio, t.fin_estimado, t.fin_real, t.precio_cobrado,
        t.notas, t.canal_origen,
        et.nombre  AS estado,
        s.nombre   AS servicio, s.duracion_min,
        u.nombre   AS barbero_nombre, u.apellido AS barbero_apellido,
        u.avatar_url,
        c.nombre   AS cliente_nombre, c.apellido AS cliente_apellido, c.telefono
      FROM turnos t
      JOIN estados_turno      et ON et.id = t.estado_id
      JOIN servicios           s  ON s.id  = t.servicio_id
      JOIN usuarios            u  ON u.id  = t.barbero_id
      LEFT JOIN clientes       c  ON c.id  = t.cliente_id
      WHERE t.sucursal_id = ?
    `;
    const params = [sucursal_id];

    if (fecha) {
      sql += " AND DATE(t.inicio) = ?";
      params.push(fecha);
    }
    if (barbero_id) {
      sql += " AND t.barbero_id = ?";
      params.push(barbero_id);
    }

    sql += " ORDER BY t.inicio ASC";

    const [rows] = await pool.execute(sql, params);
    res.json({ ok: true, data: rows });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/turnos
export async function crearTurno(req, res, next) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { sucursal_id, barbero_id, cliente_id, servicio_id, inicio, notas } =
      req.body;

    // Calcular fin estimado desde duración del servicio
    const [[srv]] = await conn.execute(
      "SELECT duracion_min, precio FROM servicios WHERE id = ?",
      [servicio_id],
    );
    if (!srv)
      throw Object.assign(new Error("Servicio no encontrado"), { status: 404 });

    const finEstimado = new Date(
      new Date(inicio).getTime() + srv.duracion_min * 60_000,
    );
    const estadoReservadoId = 1;

    const [result] = await conn.execute(
      `
      INSERT INTO turnos
        (sucursal_id, barbero_id, cliente_id, servicio_id, estado_id,
         inicio, fin_estimado, precio_cobrado, notas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        sucursal_id,
        barbero_id,
        cliente_id || null,
        servicio_id,
        estadoReservadoId,
        inicio,
        finEstimado,
        srv.precio,
        notas || null,
      ],
    );

    // Auditoría
    await conn.execute(
      "INSERT INTO turno_historial (turno_id, estado_nuevo_id, usuario_id) VALUES (?,?,?)",
      [result.insertId, estadoReservadoId, req.user.id],
    );

    await conn.commit();
    res.status(201).json({ ok: true, data: { id: result.insertId } });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
}

// PATCH /api/v1/turnos/:id/estado
export async function cambiarEstado(req, res, next) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { id } = req.params;
    const { estado_id, razon } = req.body;

    const [[turno]] = await conn.execute(
      "SELECT estado_id FROM turnos WHERE id = ?",
      [id],
    );
    if (!turno)
      throw Object.assign(new Error("Turno no encontrado"), { status: 404 });

    await conn.execute(
      "UPDATE turnos SET estado_id = ?, fin_real = IF(?,NOW(),NULL) WHERE id = ?",
      [estado_id, estado_id === 4 /* completado */, id],
    );
    await conn.execute(
      `INSERT INTO turno_historial
         (turno_id, estado_anterior_id, estado_nuevo_id, usuario_id, razon)
       VALUES (?,?,?,?,?)`,
      [id, turno.estado_id, estado_id, req.user.id, razon || null],
    );

    await conn.commit();
    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
}

// POST /api/v1/turnos/:id/cerrar  — registra productos usados y descuenta stock
export async function cerrarTurno(req, res, next) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { id } = req.params;
    const { productos = [], precio_cobrado } = req.body;
    // productos: [{ producto_id, cantidad, tipo: 'venta'|'consumo_interno', precio_unit? }]

    const [[turno]] = await conn.execute(
      "SELECT sucursal_id, estado_id FROM turnos WHERE id = ?",
      [id],
    );
    if (!turno)
      throw Object.assign(new Error("Turno no encontrado"), { status: 404 });
    if (turno.estado_id === 4)
      throw Object.assign(new Error("Turno ya completado"), { status: 400 });

    // 1. Actualizar precio cobrado y estado
    await conn.execute(
      "UPDATE turnos SET estado_id = 4, fin_real = NOW(), precio_cobrado = ? WHERE id = ?",
      [precio_cobrado, id],
    );

    // 2. Registrar productos del turno + movimientos de stock
    for (const p of productos) {
      // Insertar en turno_productos
      await conn.execute(
        "INSERT INTO turno_productos (turno_id, producto_id, cantidad, tipo, precio_unit) VALUES (?,?,?,?,?)",
        [id, p.producto_id, p.cantidad, p.tipo, p.precio_unit || null],
      );

      // Descontar del stock
      await conn.execute(
        "UPDATE stock SET cantidad_actual = cantidad_actual - ? WHERE sucursal_id = ? AND producto_id = ?",
        [p.cantidad, turno.sucursal_id, p.producto_id],
      );

      // Tipo movimiento: 'venta' = 2, 'consumo_interno' = 3
      const tipoMov = p.tipo === "venta" ? 2 : 3;
      await conn.execute(
        `INSERT INTO movimientos_stock
           (sucursal_id, producto_id, tipo_id, cantidad, turno_id, usuario_id)
         VALUES (?,?,?,?,?,?)`,
        [
          turno.sucursal_id,
          p.producto_id,
          tipoMov,
          p.cantidad,
          id,
          req.user.id,
        ],
      );
    }

    // 3. Auditoría de estado
    await conn.execute(
      "INSERT INTO turno_historial (turno_id, estado_anterior_id, estado_nuevo_id, usuario_id) VALUES (?,?,4,?)",
      [id, turno.estado_id, req.user.id],
    );

    await conn.commit();
    res.json({ ok: true, message: "Turno cerrado y stock actualizado" });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
}
