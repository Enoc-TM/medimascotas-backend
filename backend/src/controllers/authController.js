// src/controllers/authController.js
// Controlador de Registro y Login con encriptación bcrypt y tokens JWT
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const JWT_SECRET = process.env.JWT_SECRET || 'medimascotas_super_secret_jwt_key_2026_uniminuto';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * RUTA PÚBLICA: POST /api/auth/register
 * Crea un nuevo usuario en la base de datos con contraseña hasheada y retorna token
 */
exports.register = async (req, res) => {
  try {
    const { nombre, email, password, telefono = '', rol = 'propietario' } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: 'Campos obligatorios incompletos: nombre, email y contraseña son requeridos'
      });
    }

    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.findByEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({
        error: 'Ya existe un usuario registrado con este correo electrónico'
      });
    }

    // Encriptar la contraseña con bcrypt (10 rondas de salt)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar en la base de datos MySQL
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

    const { password: _, ...usuarioSinPass } = nuevoUsuario;

    return res.status(201).json({
      mensaje: 'Usuario registrado exitosamente en la base de datos',
      token,
      usuario: usuarioSinPass
    });
  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({ error: 'Error interno al registrar usuario' });
  }
};

/**
 * RUTA PÚBLICA: POST /api/auth/login
 * Autentica usuario verificando contraseña con bcrypt y genera token JWT
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Debe ingresar su correo electrónico y contraseña'
      });
    }

    // Buscar usuario en base de datos
    const usuario = await Usuario.findByEmail(email);
    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas: correo no encontrado'
      });
    }

    // Verificar contraseña (soporta bcrypt y texto plano para semillas)
    let passwordValido = false;
    if (usuario.password && (usuario.password.startsWith('$2a$') || usuario.password.startsWith('$2b$'))) {
      passwordValido = await bcrypt.compare(password, usuario.password);
    } else {
      passwordValido = (usuario.password === password);
    }

    if (!passwordValido) {
      return res.status(401).json({
        error: 'Credenciales inválidas: contraseña incorrecta'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password: _, ...usuarioSinPass } = usuario;

    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: usuarioSinPass
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error interno al iniciar sesión' });
  }
};
