const express = require('express');
const router = express.Router();
const consultasController = require('../controllers/consultasController');

router.post('/', consultasController.create);
router.get('/', consultasController.getAll);
router.get('/:id', consultasController.getById);
router.get('/mascota/:mascotaId', consultasController.getByMascota);
router.put('/:id', consultasController.update);

module.exports = router;
