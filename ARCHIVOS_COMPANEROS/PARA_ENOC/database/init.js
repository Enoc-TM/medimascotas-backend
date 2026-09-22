// database/init.js
// Script para inicializar la base de datos MySQL ejecutando schema.sql
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDb() {
  console.log('🚀 Conectando a MySQL para inicializar medimascotas_db...');

  // Conexion inicial sin base de datos para poder crearla si no existe
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    const sqlPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 Ejecutando schema.sql...');
    await connection.query(sql);

    console.log('✅ Base de datos medimascotas_db inicializada correctamente con tablas y datos semilla.');
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error.message);
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  initDb();
}

module.exports = initDb;
