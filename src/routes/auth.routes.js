// src/routes/auth.routes.js
// Rutas PUBLICAS: No requieren token de autenticacion
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 1. Registro de nuevo usuario (veterinario, admin o propietario)
router.post('/register', authController.register);

// 2. Inicio de sesion y generacion del token JWT
router.post('/login', authController.login);

module.exports = router;
