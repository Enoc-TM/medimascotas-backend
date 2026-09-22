// src/controllers/authController.js
// Controlador para autenticacion, registro y perfil de usuarios (RF-01, RF-02, CU-01, RN-12)
// Asignado a: Enoc Tamayo
const Usuario = require('../models/Usuario');

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

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password,
      rol,
      telefono
    });

    return res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: nuevoUsuario
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Debe ingresar email y password'
      });
    }

    const usuario = await Usuario.findByEmail(email);

    if (!usuario || usuario.password !== password) {
      return res.status(401).json({
        error: 'Credenciales invalidas: correo o contrasena incorrectos'
      });
    }

    const { password: _, ...usuarioSinPass } = usuario;
    return res.status(200).json({
      mensaje: 'Inicio de sesion exitoso',
      token: 'mock-jwt-token-' + usuario.id + '-' + Date.now(),
      usuario: usuarioSinPass
    });
  } catch (err) {
    next(err);
  }
};

exports.getPerfil = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { password: _, ...usuarioSinPass } = usuario;
    return res.status(200).json(usuarioSinPass);
  } catch (err) {
    next(err);
  }
};

exports.updatePerfil = async (req, res, next) => {
  try {
    const usuarioActualizado = await Usuario.update(req.params.id, req.body);

    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json({
      mensaje: 'Perfil actualizado correctamente',
      usuario: usuarioActualizado
    });
  } catch (err) {
    next(err);
  }
};

exports.getUsuarios = async (req, res, next) => {
  try {
    const { rol } = req.query;
    const usuarios = await Usuario.findAll({ rol });
    return res.status(200).json(usuarios);
  } catch (err) {
    next(err);
  }
};
