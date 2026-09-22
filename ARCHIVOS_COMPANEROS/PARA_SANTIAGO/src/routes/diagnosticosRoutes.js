// src/routes/diagnosticosRoutes.js
// Rutas REST para la entidad Diagnosticos (RF-07, RN-07)
// Asignado a: Santiago Avila
const express = require('express');
const router = express.Router();
const diagnosticosController = require('../controllers/diagnosticosController');

// Listar todos los diagnosticos
router.get('/', diagnosticosController.getAll);

// Obtener diagnosticos de una consulta especifica
router.get('/consulta/:consultaId', diagnosticosController.getByConsulta);

// Obtener detalle de un diagnostico
router.get('/:id', diagnosticosController.getById);

// Registrar nuevo diagnostico clinico
router.post('/', diagnosticosController.create);

// Actualizar diagnostico
router.put('/:id', diagnosticosController.update);

// Eliminar diagnostico
router.delete('/:id', diagnosticosController.delete);

module.exports = router;
