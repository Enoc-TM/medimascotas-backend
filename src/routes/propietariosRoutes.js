const express = require('express');
const router = express.Router();
const propietariosController = require('../controllers/propietariosController');

router.post('/', propietariosController.create);
router.get('/', propietariosController.getAll);
router.get('/:id', propietariosController.getById);
router.put('/:id', propietariosController.update);
router.delete('/:id', propietariosController.delete);
router.get('/:id/mascotas', propietariosController.getMascotas);

module.exports = router;
