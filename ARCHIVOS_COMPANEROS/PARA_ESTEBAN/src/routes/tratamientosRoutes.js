// src/routes/tratamientosRoutes.js
// Rutas REST para la entidad Tratamientos (RF-08, RN-08)
// Asignado a: Esteban Fierro
const express = require('express');
const router = express.Router();
const tratamientosController = require('../controllers/tratamientosController');

// Listar todos los tratamientos
router.get('/', tratamientosController.getAll);

// Obtener tratamientos de un diagnostico especifico
router.get('/diagnostico/:diagnosticoId', tratamientosController.getByDiagnostico);

// Obtener detalle de un tratamiento
router.get('/:id', tratamientosController.getById);

// Registrar nuevo tratamiento clinico (RN-08)
router.post('/', tratamientosController.create);

// Actualizar tratamiento
router.put('/:id', tratamientosController.update);

// Eliminar tratamiento
router.delete('/:id', tratamientosController.delete);

module.exports = router;
