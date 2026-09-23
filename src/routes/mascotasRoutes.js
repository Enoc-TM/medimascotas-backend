const express = require('express');
const router = express.Router();
const mascotasController = require('../controllers/mascotasController');

router.post('/', mascotasController.create);
router.get('/', mascotasController.getAll);
router.get('/:id', mascotasController.getById);
router.put('/:id', mascotasController.update);
router.delete('/:id', mascotasController.delete);

module.exports = router;
