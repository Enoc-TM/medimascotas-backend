const express = require('express');
const router = express.Router();
const historialesController = require('../controllers/historialesController');

router.get('/:mascotaId', historialesController.getByMascotaId);
router.put('/:mascotaId/antecedentes', historialesController.updateAntecedentes);
router.get('/:mascotaId/reporte', historialesController.getReporte);

module.exports = router;
