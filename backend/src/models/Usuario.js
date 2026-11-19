// src/models/Usuario.js
// Modelo para la gestión de usuarios en la base de datos MySQL
const db = require('../config/database');

class Usuario {
  /**
   * Buscar usuario por correo electrónico (usado en Login y verificación de Registro)
   */
  static async findByEmail(email) {
    const mail = (email || '').toLowerCase().trim();
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query(
          'SELECT id, nombre, email, password, rol, telefono, fecha_creacion FROM usuarios WHERE LOWER(email) = ?',
          [mail]
        );
        return rows[0] || null;
      } catch (err) {
        console.error('Error en Usuario.findByEmail (MySQL):', err.message);
      }
    }
    // Fallback memoria
    return db.memoryStore.usuarios.find(u => u.email.toLowerCase() === mail) || null;
  }

  /**
   * Buscar usuario por ID (usado en perfil y verificación de token)
   */
  static async findById(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query(
          'SELECT id, nombre, email, password, rol, telefono, fecha_creacion FROM usuarios WHERE id = ?',
          [numId]
        );
        return rows[0] || null;
      } catch (err) {
        console.error('Error en Usuario.findById (MySQL):', err.message);
      }
    }
    // Fallback memoria
    return db.memoryStore.usuarios.find(u => u.id === numId) || null;
  }

  /**
   * Crear un nuevo usuario (usado en Registro)
   */
  static async create({ nombre, email, password, rol = 'propietario', telefono = '' }) {
    const emailNorm = email.toLowerCase().trim();
    const rolValido = ['admin', 'veterinario', 'propietario'].includes(rol) ? rol : 'propietario';

    if (db.isDbConnected()) {
      try {
        const [result] = await db.query(
          'INSERT INTO usuarios (nombre, email, password, rol, telefono) VALUES (?, ?, ?, ?, ?)',
          [nombre.trim(), emailNorm, password, rolValido, telefono.trim()]
        );
        return {
          id: result.insertId,
          nombre: nombre.trim(),
          email: emailNorm,
          rol: rolValido,
          telefono: telefono.trim(),
          fecha_creacion: new Date()
        };
      } catch (err) {
        console.error('Error en Usuario.create (MySQL):', err.message);
        throw err;
      }
    }

    // Fallback memoria
    const nuevo = {
      id: db.memoryStore.nextId++,
      nombre: nombre.trim(),
      email: emailNorm,
      password,
      rol: rolValido,
      telefono: telefono.trim(),
      fecha_creacion: new Date().toISOString()
    };
    db.memoryStore.usuarios.push(nuevo);
    return nuevo;
  }

  /**
   * Actualizar nombre y teléfono del usuario (usado en Editar Perfil)
   */
  static async update(id, { nombre, telefono }) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        await db.query(
          'UPDATE usuarios SET nombre = COALESCE(?, nombre), telefono = COALESCE(?, telefono) WHERE id = ?',
          [nombre ? nombre.trim() : null, telefono !== undefined ? telefono.trim() : null, numId]
        );
        return await this.findById(numId);
      } catch (err) {
        console.error('Error en Usuario.update (MySQL):', err.message);
        throw err;
      }
    }

    // Fallback memoria
    const usuario = db.memoryStore.usuarios.find(u => u.id === numId);
    if (usuario) {
      if (nombre) usuario.nombre = nombre.trim();
      if (telefono !== undefined) usuario.telefono = telefono.trim();
      return usuario;
    }
    return null;
  }

  /**
   * Eliminar un usuario permanentemente de la base de datos (usado en Eliminar Perfil)
   */
  static async delete(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [numId]);
        return result.affectedRows > 0;
      } catch (err) {
        console.error('Error en Usuario.delete (MySQL):', err.message);
        throw err;
      }
    }

    // Fallback memoria
    const idx = db.memoryStore.usuarios.findIndex(u => u.id === numId);
    if (idx !== -1) {
      db.memoryStore.usuarios.splice(idx, 1);
      return true;
    }
    return false;
  }

  /**
   * Listar todos los usuarios
   */
  static async findAll() {
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT id, nombre, email, rol, telefono, fecha_creacion FROM usuarios ORDER BY id DESC');
        return rows;
      } catch (err) {
        console.error('Error en Usuario.findAll (MySQL):', err.message);
      }
    }
    return db.memoryStore.usuarios.map(({ password, ...u }) => u);
  }
}

module.exports = Usuario;
