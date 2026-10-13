// src/routes/user.routes.js
// Rutas de Usuario: Separación de rutas públicas y privadas
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/auth.middleware');

// ==========================================
// 1. RUTAS PÚBLICAS (Sin token)
// ==========================================
// Perfil público (información accesible sin iniciar sesión)
router.get('/public-profile/:id', userController.getPublicProfile);
router.get('/perfil-publico/:id', userController.getPublicProfile);

// ==========================================
// 2. RUTAS PRIVADAS (Protegidas con verifyToken)
// ==========================================
// Perfil privado del usuario autenticado
router.get('/profile', verifyToken, userController.getProfile);
router.get('/perfil', verifyToken, userController.getProfile);
router.get('/perfil/:id', verifyToken, userController.getProfile);

// Actualizar datos del usuario
router.put('/update', verifyToken, userController.update);
router.put('/perfil/:id', verifyToken, userController.update);

// Eliminar cuenta del usuario
router.delete('/delete', verifyToken, userController.delete);

// Dashboard con resumen y métricas de MediMascotas
router.get('/dashboard', verifyToken, userController.getDashboard);

// Cambio de contraseña seguro con verificación previa
router.post('/change-password', verifyToken, userController.changePassword);

// Listar usuarios (gestión)
router.get('/usuarios', verifyToken, userController.getUsuarios);
router.get('/', verifyToken, userController.getUsuarios);

module.exports = router;
