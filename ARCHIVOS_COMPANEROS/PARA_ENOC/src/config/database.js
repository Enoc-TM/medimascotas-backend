// src/config/database.js
// Configuracion de conexion a la base de datos relacional MySQL
// con soporte para pool de conexiones mediante mysql2/promise y fallback seguro.
require('dotenv').config();

let mysql = null;
try {
  mysql = require('mysql2/promise');
} catch (e) {
  console.warn('⚠️ Paquete mysql2 no disponible directamente, operando en modo almacenamiento en memoria.');
}

let pool = null;
let isConnected = false;

if (mysql) {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'medimascotas_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

// Verificacion asincrona de la conexion sin bloquear la inicializacion
async function checkConnection() {
  if (!pool) return false;
  try {
    const connection = await pool.getConnection();
    isConnected = true;
    connection.release();
    console.log('✅ [Base de Datos] Conexion exitosa a MySQL (medimascotas_db)');
    return true;
  } catch (error) {
    isConnected = false;
    // Si MySQL no esta activo, el sistema opera con el store relacional
    return false;
  }
}

// Ejecutar verificacion inicial silenciosa
checkConnection();

module.exports = {
  pool,
  checkConnection,
  isDbConnected: () => isConnected,
  query: async (sql, params = []) => {
    if (!pool) throw new Error('Conexion a MySQL no inicializada');
    return pool.execute(sql, params);
  }
};
