// src/routes/user.routes.js
// Rutas protegidas de usuario (Requieren Token JWT)
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/auth.middleware');

// Todas estas rutas pasan primero por el middleware verifyToken:
router.use(verifyToken);

// 1. Obtener información del perfil
router.get('/profile', (req, res) => userController.getProfile(req, res));

// 2. Actualizar datos del usuario (Nombre, Teléfono)
router.put('/update', (req, res) => userController.update(req, res));

// 3. Eliminar cuenta del usuario en la base de datos
router.delete('/delete', (req, res) => userController.delete(req, res));

// 4. Obtener información resumida para el Dashboard
router.get('/dashboard', (req, res) => userController.getDashboard(req, res));

module.exports = router;
