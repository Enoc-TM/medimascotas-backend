// src/app.js
// Configuración principal del servidor Express
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Rutas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const mascotasRoutes = require('./routes/mascotasRoutes');
const propietariosRoutes = require('./routes/propietariosRoutes');
const db = require('./config/database');

// Configuración de CORS
// Permite conexiones desde el Frontend local (Vite en 5173) y desde Vercel en la nube
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'https://medimascotas-frontend.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origen (como Postman o curl)
    if (!origin) return callback(null, true);

    // Permitir si coincide exactamente con la lista
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Permitir cualquier subdominio de Vercel (*.vercel.app)
    if (origin.endsWith('.vercel.app')) return callback(null, true);

    // Si está en desarrollo, permitir cualquier origen
    if (process.env.NODE_ENV !== 'production') return callback(null, true);

    return callback(new Error(`Bloqueado por CORS: Origen ${origin} no permitido`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token']
}));

// Middlewares globales
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de estado / bienvenida
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Servidor API MediMascotas en línea',
    estado: 'activo',
    baseDeDatos: db.isDbConnected() ? 'MySQL conectado' : 'Modo memoria (Tolerante a fallos)',
    modulos: ['auth', 'users', 'mascotas', 'propietarios']
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: db.isDbConnected() ? 'connected' : 'memory_fallback',
    timestamp: new Date().toISOString()
  });
});

// Enrutadores principales
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mascotas', mascotasRoutes);
app.use('/api/propietarios', propietariosRoutes);

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada en el backend',
    metodo: req.method,
    url: req.originalUrl
  });
});

// Manejo de errores globales (500)
app.use((err, req, res, next) => {
  console.error('Error no controlado en el servidor:', err);
  res.status(500).json({
    error: 'Error interno en el servidor',
    detalle: err.message
  });
});

module.exports = app;
