// src/routes/recordatoriosRoutes.js
// Rutas REST para la entidad Recordatorios (Citas, Vacunas y Tratamientos)
// Asignado a: Santiago Avila
const express = require('express');
const router = express.Router();
const recordatoriosController = require('../controllers/recordatoriosController');

// Listar todos los recordatorios (con filtro opcional ?estado= o ?mascota_id=)
router.get('/', recordatoriosController.getAll);

// Obtener recordatorios de una mascota especifica
router.get('/mascota/:mascotaId', recordatoriosController.getByMascota);

// Obtener detalle de un recordatorio
router.get('/:id', recordatoriosController.getById);

// Programar nuevo recordatorio
router.post('/', recordatoriosController.create);

// Actualizar recordatorio (modificar fecha o marcar como completado)
router.put('/:id', recordatoriosController.update);

// Eliminar recordatorio
router.delete('/:id', recordatoriosController.delete);

module.exports = router;
