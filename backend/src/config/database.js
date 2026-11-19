// src/config/database.js
// Configuración de conexión a MySQL con soporte para Local (XAMPP) y Cloud (Aiven)
// Incluye almacén en memoria con datos semilla para despliegues tolerantes a fallos (Render)
require('dotenv').config();

let mysql = null;
try {
  mysql = require('mysql2/promise');
} catch (e) {
  console.warn('⚠️ Paquete mysql2 no disponible directamente.');
}

let pool = null;
let isConnected = false;

if (mysql) {
  const isAiven = process.env.DB_HOST && (process.env.DB_HOST.includes('aivencloud.com') || process.env.DB_SSL === 'true');

  const poolOptions = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'medimascotas_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  // En servidores de nube como Aiven, se requiere SSL
  if (isAiven) {
    poolOptions.ssl = { rejectUnauthorized: false };
  }

  pool = mysql.createPool(poolOptions);
}

// Almacén en memoria de respaldo para desarrollo si MySQL no está iniciado o en Render
const memoryStore = {
  usuarios: [
    {
      id: 1,
      nombre: 'Enoc Tamayo',
      email: 'enoc@ejemplo.com',
      password: '$2a$10$wN3tN39jV5v9r9s3d0Z7UekTzKzq79yUoJ3F0H1d.V1L.mIuRj.Q6', // Password123!
      rol: 'admin',
      telefono: '3129876543',
      fecha_creacion: new Date().toISOString()
    },
    {
      id: 2,
      nombre: 'Esteban Fierro',
      email: 'esteban@ejemplo.com',
      password: '$2a$10$wN3tN39jV5v9r9s3d0Z7UekTzKzq79yUoJ3F0H1d.V1L.mIuRj.Q6', // Password123!
      rol: 'propietario',
      telefono: '3157778899',
      fecha_creacion: new Date().toISOString()
    }
  ],
  propietarios: [
    {
      id: 1,
      identificacion: '1010203040',
      nombre: 'Esteban Fierro',
      telefono: '3157778899',
      direccion: 'Calle 45 # 12-34, Bogotá',
      email: 'esteban.fierro@gmail.com',
      activo: true,
      fecha_registro: new Date().toISOString()
    },
    {
      id: 2,
      identificacion: '1098765432',
      nombre: 'Enoc Tamayo',
      telefono: '3164445566',
      direccion: 'Carrera 15 # 80-20, Bogotá',
      email: 'enoc.tamayo@gmail.com',
      activo: true,
      fecha_registro: new Date().toISOString()
    },
    {
      id: 3,
      identificacion: '52998811',
      nombre: 'Laura Marcela Ortiz',
      telefono: '3118889900',
      direccion: 'Av Boyaca # 170-40, Bogotá',
      email: 'laura.ortiz@gmail.com',
      activo: true,
      fecha_registro: new Date().toISOString()
    }
  ],
  mascotas: [
    {
      id: 1,
      codigo_chip: 'CHIP-982101',
      nombre: 'Lucas',
      especie: 'Canino',
      raza: 'Golden Retriever',
      edad: 3,
      sexo: 'Macho',
      peso_kg: 28.5,
      propietario_id: 1,
      propietario_nombre: 'Esteban Fierro',
      propietario_identificacion: '1010203040',
      activo: true,
      fecha_registro: new Date().toISOString()
    },
    {
      id: 2,
      codigo_chip: 'CHIP-451299',
      nombre: 'Mishi',
      especie: 'Felino',
      raza: 'Siamés',
      edad: 2,
      sexo: 'Hembra',
      peso_kg: 4.2,
      propietario_id: 2,
      propietario_nombre: 'Enoc Tamayo',
      propietario_identificacion: '1098765432',
      activo: true,
      fecha_registro: new Date().toISOString()
    },
    {
      id: 3,
      codigo_chip: 'CHIP-LAB-7744',
      nombre: 'Rocky',
      especie: 'Canino',
      raza: 'Labrador Retriever',
      edad: 4,
      sexo: 'Macho',
      peso_kg: 32.0,
      propietario_id: 1,
      propietario_nombre: 'Esteban Fierro',
      propietario_identificacion: '1010203040',
      activo: true,
      fecha_registro: new Date().toISOString()
    }
  ],
  counters: {
    usuarios: 3,
    propietarios: 4,
    mascotas: 4
  }
};

// Verificación asíncrona de conexión
async function checkConnection() {
  if (!pool) return false;
  try {
    const connection = await pool.getConnection();
    isConnected = true;
    connection.release();
    console.log('✅ [MySQL] Conexión establecida con éxito a la base de datos:', process.env.DB_NAME || 'medimascotas_db');
    return true;
  } catch (error) {
    isConnected = false;
    console.warn('⚠️ [MySQL] No se pudo conectar a MySQL local. Usando almacén en memoria temporal con clientes y mascotas iniciales.');
    return false;
  }
}

checkConnection();

module.exports = {
  pool,
  checkConnection,
  isDbConnected: () => isConnected,
  memoryStore,
  query: async (sql, params = []) => {
    if (!pool) throw new Error('Pool de conexión MySQL no disponible');
    return pool.execute(sql, params);
  }
};
