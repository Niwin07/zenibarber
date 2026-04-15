import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Cargamos las variables del .env
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "zenibarber",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // La zona horaria clave para que los turnos en Argentina no se desfasen
  timezone: "-03:00",
});

// Acá está la magia que pide el error: la exportación por defecto
export default pool;
