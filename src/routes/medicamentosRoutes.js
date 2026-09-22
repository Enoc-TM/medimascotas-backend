// src/routes/medicamentosRoutes.js
// Rutas REST para la entidad Medicamentos (RF-09, RN-09)
// Asignado a: Santiago Avila
const express = require('express');
const router = express.Router();
const medicamentosController = require('../controllers/medicamentosController');

// Listar todos los medicamentos formulados
router.get('/', medicamentosController.getAll);

// Obtener medicamentos formulados en una consulta especifica
router.get('/consulta/:consultaId', medicamentosController.getByConsulta);

// Obtener detalle de un medicamento formulado
router.get('/:id', medicamentosController.getById);

// Formular/registrar medicamento en consulta (RN-09)
router.post('/', medicamentosController.create);

// Actualizar indicaciones o dosis de medicamento
router.put('/:id', medicamentosController.update);

// Eliminar medicamento de la formulacion
router.delete('/:id', medicamentosController.delete);

module.exports = router;
