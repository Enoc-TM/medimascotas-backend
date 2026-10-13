// src/controllers/authController.js
// Controlador para autenticacion y registro publico de usuarios (RF-01, RF-02, CU-01, RN-12)
// Asignado a: Enoc Tamayo
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const userController = require('./userController');

const JWT_SECRET = process.env.JWT_SECRET || 'medimascotas_jwt_secret_key_2026_uniminuto';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * URL Publica: POST /api/auth/register
 * Registro de un nuevo usuario con contrasena encriptada y emision de token JWT
 */
exports.register = async (req, res, next) => {
  try {
    const { nombre, email, password, rol = 'propietario', telefono = '' } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: 'Campos obligatorios incompletos: nombre, email y password son requeridos'
      });
    }

    const existe = await Usuario.findByEmail(email);
    if (existe) {
      return res.status(400).json({
        error: 'Ya existe un usuario registrado con este correo electronico'
      });
    }

    // Encriptar contrasena con bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol,
      telefono
    });

    // Generar token JWT firmado
    const token = jwt.sign(
      { id: nuevoUsuario.id, email: nuevoUsuario.email, rol: nuevoUsuario.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: nuevoUsuario
    });
  } catch (err) {
    next(err);
  }
};

/**
 * URL Publica: POST /api/auth/login
 * Inicio de sesion, validacion de contrasena y retorno de token JWT real
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Debe ingresar email y password'
      });
    }

    const usuario = await Usuario.findByEmail(email);

    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales invalidas: correo o contrasena incorrectos'
      });
    }

    // Validacion con soporte tanto para bcrypt como para contrasenas semilla en texto plano
    let passwordValido = false;
    if (usuario.password && (usuario.password.startsWith('$2a$') || usuario.password.startsWith('$2b$'))) {
      passwordValido = await bcrypt.compare(password, usuario.password);
    } else {
      passwordValido = (usuario.password === password);
    }

    if (!passwordValido) {
      return res.status(401).json({
        error: 'Credenciales invalidas: correo o contrasena incorrectos'
      });
    }

    // Generar token JWT firmado
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password: _, ...usuarioSinPass } = usuario;
    return res.status(200).json({
      mensaje: 'Inicio de sesion exitoso',
      token,
      usuario: usuarioSinPass
    });
  } catch (err) {
    next(err);
  }
};

// Delegaciones a userController para retrocompatibilidad
exports.getPerfil = userController.getPerfil;
exports.updatePerfil = userController.updatePerfil;
exports.getUsuarios = userController.getUsuarios;
