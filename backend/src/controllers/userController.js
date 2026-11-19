// src/controllers/userController.js
// Controlador para las operaciones del usuario autenticado (Perfil, Edición, Eliminación y Dashboard)
const Usuario = require('../models/Usuario');
const db = require('../config/database');

class UserController {
  /**
   * RUTA PROTEGIDA: GET /api/users/profile
   * Obtiene la información del usuario autenticado a partir del token JWT
   */
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const usuario = await Usuario.findById(userId);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado en la base de datos' });
      }

      const { password: _, ...usuarioSinPass } = usuario;
      return res.json(usuarioSinPass);
    } catch (error) {
      console.error('Error en getProfile:', error);
      return res.status(500).json({ error: 'Error al consultar el perfil' });
    }
  }

  /**
   * RUTA PROTEGIDA: PUT /api/users/update
   * Actualiza los datos del usuario en la base de datos
   */
  async update(req, res) {
    try {
      const userId = req.user.id;
      const { nombre, telefono } = req.body;

      if (!nombre) {
        return res.status(400).json({ error: 'El nombre es obligatorio' });
      }

      const usuarioActualizado = await Usuario.update(userId, { nombre, telefono });

      if (!usuarioActualizado) {
        return res.status(404).json({ error: 'Usuario no encontrado para actualizar' });
      }

      const { password: _, ...usuarioSinPass } = usuarioActualizado;

      return res.json({
        mensaje: 'Perfil actualizado exitosamente en la base de datos',
        usuario: usuarioSinPass
      });
    } catch (error) {
      console.error('Error en update:', error);
      return res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
  }

  /**
   * RUTA PROTEGIDA: DELETE /api/users/delete
   * Elimina la cuenta y los registros del usuario en la base de datos
   */
  async delete(req, res) {
    try {
      const userId = req.user.id;
      const eliminado = await Usuario.delete(userId);

      if (!eliminado) {
        return res.status(404).json({ error: 'Usuario no encontrado para eliminar' });
      }

      return res.json({
        mensaje: 'Usuario eliminado exitosamente de la base de datos',
        eliminado: true
      });
    } catch (error) {
      console.error('Error en delete:', error);
      return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  }

  /**
   * RUTA PROTEGIDA: GET /api/users/dashboard
   * Resumen informativo para el panel principal
   */
  async getDashboard(req, res) {
    try {
      const userId = req.user.id;
      const usuario = await Usuario.findById(userId);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const { password: _, ...usuarioSinPass } = usuario;

      return res.json({
        mensaje: 'Bienvenido al Dashboard de MediMascotas',
        usuario: usuarioSinPass,
        estadoSistema: {
          baseDeDatos: db.isDbConnected() ? 'Conectado a MySQL' : 'Modo memoria de prueba',
          servidor: 'En línea',
          horaServidor: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error en getDashboard:', error);
      return res.status(500).json({ error: 'Error al cargar el dashboard' });
    }
  }
}

module.exports = new UserController();
