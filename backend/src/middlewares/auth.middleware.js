// src/middlewares/auth.middleware.js
// Middleware para verificar la validez del token JWT en rutas protegidas
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // 1. Obtener el token de los headers (Authorization o x-access-token)
  const authHeader = req.headers['authorization'] || req.headers['x-access-token'];

  if (!authHeader) {
    return res.status(401).json({
      error: 'Acceso denegado: No se proporcionó un token de autenticación'
    });
  }

  try {
    // 2. Extraer token eliminando el prefijo 'Bearer '
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
    const secret = process.env.JWT_SECRET || 'medimascotas_super_secret_jwt_key_2026_uniminuto';

    // 3. Verificar y decodificar el token
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // { id, email, rol, iat, exp }
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Token inválido o expirado. Inicie sesión nuevamente'
    });
  }
};

module.exports = verifyToken;
