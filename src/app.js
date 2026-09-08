const express = require('express');

const app = express();

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta base inicial (Estructura base sin routers ni controladores)
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Servidor base MediMascotas activo',
    estado: 'ok',
    version: '1.0.0',
    descripcion: 'Estructura inicial del proyecto antes de modularizar routers y controladores'
  });
});

module.exports = app;
