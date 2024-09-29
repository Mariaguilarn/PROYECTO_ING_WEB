const express = require('express');
const router = express.Router();

// Controladoresssss
const userController = require('../controllers/userController');

// Ruta para registrar un nuevo usuarioouuu
router.post('/register', userController.registerUser);

// Ruta para iniciar sesiónnnnnnnnnnnnn
router.post('/login', userController.loginUser);

module.exports = router;
