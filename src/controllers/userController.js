// src/controllers/userController.js
// Controlador de Usuarios adaptado al esquema de seguridad y rutas del proyecto
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const Mascota = require('../models/Mascota');
const Consulta = require('../models/Consulta');
const Recordatorio = require('../models/Recordatorio');

class UserController {
  /**
   * RUTA PÚBLICA: GET /api/users/public-profile/:id
   * Obtiene la información pública básica de un usuario (ej. veterinario o tutor)
   */
  async getPublicProfile(req, res) {
    try {
      const userId = parseInt(req.params.id, 10);
      const usuario = await Usuario.findById(userId);

      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Devolver solo campos públicos sin contraseñas ni datos sensibles
      res.json({
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        telefono: usuario.telefono
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * RUTA PRIVADA: GET /api/users/profile
   * Obtiene el perfil completo del usuario autenticado (extraído de req.user.id)
   */
  async getProfile(req, res) {
    try {
      const userId = req.params.id ? parseInt(req.params.id, 10) : req.user.id;
      const usuario = await Usuario.findById(userId);

      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const { password: _, ...usuarioSinPass } = usuario;
      res.json(usuarioSinPass);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * RUTA PRIVADA: PUT /api/users/update
   * Actualiza los datos del usuario autenticado
   */
  async update(req, res) {
    try {
      const userId = req.params.id ? parseInt(req.params.id, 10) : req.user.id;
      const { nombre, telefono } = req.body;

      const usuarioActualizado = await Usuario.update(userId, { nombre, telefono });

      if (!usuarioActualizado) {
        return res.status(404).json({ message: 'Usuario no encontrado para actualizar' });
      }

      res.json({
        message: 'Usuario actualizado correctamente',
        usuario: usuarioActualizado
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * RUTA PRIVADA: DELETE /api/users/delete
   * Elimina la cuenta del usuario autenticado
   */
  async delete(req, res) {
    try {
      const userId = req.user.id;
      await Usuario.delete(userId);
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * RUTA PRIVADA: POST /api/users/change-password
   * Cambia la contraseña validando la anterior con bcrypt
   */
  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Debe ingresar la contraseña actual y la nueva' });
      }

      const usuario = await Usuario.findById(userId);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Validar contraseña actual con bcrypt (o texto plano para semillas)
      let valida = false;
      if (usuario.password && (usuario.password.startsWith('$2a$') || usuario.password.startsWith('$2b$'))) {
        valida = await bcrypt.compare(oldPassword, usuario.password);
      } else {
        valida = (usuario.password === oldPassword);
      }

      if (!valida) {
        return res.status(400).json({ message: 'Contraseña actual incorrecta' });
      }

      // Hashear la nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await Usuario.changePassword(userId, hashedPassword);

      res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * RUTA PRIVADA: GET /api/users/dashboard
   * Resumen y estadísticas adaptadas al rol de MediMascotas
   */
  async getDashboard(req, res) {
    try {
      const userId = req.user.id;
      const usuario = await Usuario.findById(userId);

      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const [mascotas, consultas, recordatorios] = await Promise.all([
        Mascota.findAll().catch(() => []),
        Consulta.findAll().catch(() => []),
        Recordatorio.findAll().catch(() => [])
      ]);

      const { password: _, ...userSafe } = usuario;

      res.json({
        user: userSafe,
        sistema: 'MediMascotas v2.0',
        estadisticas: {
          total_mascotas: Array.isArray(mascotas) ? mascotas.length : 0,
          total_consultas: Array.isArray(consultas) ? consultas.length : 0,
          recordatorios_pendientes: Array.isArray(recordatorios) ? recordatorios.length : 0
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * RUTA PRIVADA: GET /api/users/usuarios (o GET /api/users)
   * Lista general de usuarios (para administración)
   */
  async getUsuarios(req, res) {
    try {
      const { rol } = req.query;
      const usuarios = await Usuario.findAll({ rol });
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

const controller = new UserController();

// Aliases para máxima compatibilidad con código existente
controller.getPerfil = controller.getProfile.bind(controller);
controller.updatePerfil = controller.update.bind(controller);
controller.getPublicProfile = controller.getPublicProfile.bind(controller);
controller.getProfile = controller.getProfile.bind(controller);
controller.update = controller.update.bind(controller);
controller.delete = controller.delete.bind(controller);
controller.changePassword = controller.changePassword.bind(controller);
controller.getDashboard = controller.getDashboard.bind(controller);
controller.getUsuarios = controller.getUsuarios.bind(controller);

module.exports = controller;
