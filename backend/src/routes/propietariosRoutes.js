// src/routes/propietariosRoutes.js
// Rutas REST para clientes / propietarios
const express = require('express');
const router = express.Router();
const propietariosController = require('../controllers/propietariosController');

router.get('/', propietariosController.getAll);
router.get('/:id', propietariosController.getById);

module.exports = router;
