// src/middlewares/auth.middleware.js
// Middleware para verificar que la peticion tenga un token JWT valido
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // 1. Obtener el token de las cabeceras (headers)
  const token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) {
    return res.status(401).json({
      error: 'Token no proporcionado',
      mensaje: 'Token no proporcionado',
      message: 'Token no proporcionado'
    });
  }

  try {
    // 2. Limpiar 'Bearer ' y verificar el token con la clave secreta
    const tokenLimpio = token.replace('Bearer ', '').trim();
    const decoded = jwt.verify(tokenLimpio, process.env.JWT_SECRET || 'medimascotas_jwt_secret_key_2026_uniminuto');
    
    // Guardamos los datos decodificados en req.user
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Token inválido o expirado',
      mensaje: 'Token inválido o expirado',
      message: 'Token inválido o expirado'
    });
  }
};

module.exports = verifyToken;
