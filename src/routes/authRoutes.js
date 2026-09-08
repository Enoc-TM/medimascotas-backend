const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/perfil/:id', authController.getPerfil);
router.put('/perfil/:id', authController.updatePerfil);
router.get('/usuarios', authController.getUsuarios);

module.exports = router;
