const express = require('express');
const router = express.Router();
const vacunasController = require('../controllers/vacunasController');

router.post('/', vacunasController.create);
router.get('/', vacunasController.getAll);
router.get('/mascota/:mascotaId', vacunasController.getByMascota);

module.exports = router;
