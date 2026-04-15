// backend/src/controllers/auth.controller.js
import db from "../config/db.js"; // <--- ESTO ES LO QUE FALTA
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const testHash = await bcrypt.hash("1234", 10);
  const testMatch = await bcrypt.compare("1234", testHash);
  console.log("¿Prueba interna funciona?:", testMatch);

  const { email, password } = req.body;

  try {
    const [users] = await db.query(
      `SELECT u.*, us.sucursal_id 
             FROM usuarios u 
             LEFT JOIN usuario_sucursal us ON u.id = us.usuario_id 
             WHERE u.email = ?`,
      [email],
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const user = users[0];

    console.log("Password recibida:", password);
    console.log("Hash en DB:", user.password_hash);
    // Forzamos a que sea string por si llega como Buffer
    // Forzamos string y aplicamos .trim() para borrar espacios invisibles
    const hashEnDB = user.password_hash.toString().trim();

    console.log("Password:", password);
    console.log("Hash Limpio:", hashEnDB);

    const isMatch = await bcrypt.compare(password, hashEnDB);
    console.log("¿Match final?:", isMatch); // ESTO TIENE QUE DAR TRUE
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // 3. Generar token y responder (asegurándonos de no mandar el hash al front)
    const token = jwt.sign(
      { id: user.id, rol_id: user.rol_id },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    delete user.password_hash; // Seguridad ante todo, pa

    res.json({
      token,
      usuario: user,
    });
  } catch (error) {
    console.error(error); // Esto te va a mostrar el error real en la terminal del back
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const refresh = async (req, res) => {
  res.json({ message: "Token refrescado (simulado)" });
};

export const logout = async (req, res) => {
  res.json({ message: "Sesión cerrada correctamente" });
};

export const me = async (req, res) => {
  // Esto devuelve el usuario actual si el token es válido
  res.json({ usuario: req.user });
};
