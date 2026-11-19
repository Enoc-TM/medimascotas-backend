// src/routes/mascotasRoutes.js
// Rutas REST para la gestión de Mascotas
const express = require('express');
const router = express.Router();
const mascotasController = require('../controllers/mascotasController');
const verifyToken = require('../middlewares/auth.middleware');

// Listar todas las mascotas (con filtros por busqueda, especie o propietario)
router.get('/', mascotasController.getAll);

// Obtener detalle de una mascota
router.get('/:id', mascotasController.getById);

// Registrar nueva mascota (con token verificado)
router.post('/', verifyToken, mascotasController.create);

// Actualizar mascota (con token verificado)
router.put('/:id', verifyToken, mascotasController.update);

// Eliminar mascota (con token verificado)
router.delete('/:id', verifyToken, mascotasController.delete);

module.exports = router;
