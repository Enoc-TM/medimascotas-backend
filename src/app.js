const express = require('express');
const apiRoutes = require('./routes/index');

const app = express();

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raiz de bienvenida y estado del servicio
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Servidor MediMascotas en linea',
    estado: 'ok',
    version: '1.0.0',
    documentacion_api: '/api'
  });
});

// Montaje de rutas de la API REST
app.use('/api', apiRoutes);

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    metodo: req.method,
    url: req.originalUrl
  });
});

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error interno:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
