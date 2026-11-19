// src/routes/auth.routes.js
// Rutas públicas de autenticación (Registro y Login)
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 1. Registro de nuevo usuario en la base de datos
router.post('/register', authController.register);

// 2. Inicio de sesión y verificación de credenciales
router.post('/login', authController.login);

module.exports = router;
