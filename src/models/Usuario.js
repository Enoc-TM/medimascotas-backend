// src/models/Usuario.js
// Modelo para la gestion de usuarios, roles y autenticacion (RF-01, CU-01, RN-12)
// Asignado a: Enoc Tamayo
const db = require('../config/database');
const store = require('../data/store');

class Usuario {
  static async findAll({ rol } = {}) {
    if (db.isDbConnected()) {
      try {
        let sql = 'SELECT id, nombre, email, rol, telefono, fecha_creacion FROM usuarios';
        const params = [];
        if (rol) {
          sql += ' WHERE rol = ?';
          params.push(rol);
        }
        const [rows] = await db.query(sql, params);
        return rows;
      } catch (err) {
        console.warn('Fallback a store en Usuario.findAll:', err.message);
      }
    }
    let list = store.usuarios;
    if (rol) {
      list = list.filter(u => u.rol === rol);
    }
    return list.map(({ password, ...u }) => u);
  }

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
        console.warn('Fallback a store en Usuario.findById:', err.message);
      }
    }
    return store.usuarios.find(u => u.id === numId) || null;
  }

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
        console.warn('Fallback a store en Usuario.findByEmail:', err.message);
      }
    }
    return store.usuarios.find(u => u.email.toLowerCase() === mail) || null;
  }

  static async create({ nombre, email, password, rol = 'propietario', telefono = '' }) {
    const rolValido = ['admin', 'veterinario', 'propietario'].includes(rol) ? rol : 'propietario';
    const emailNorm = email.toLowerCase().trim();

    if (db.isDbConnected()) {
      try {
        const [result] = await db.query(
          'INSERT INTO usuarios (nombre, email, password, rol, telefono) VALUES (?, ?, ?, ?, ?)',
          [nombre, emailNorm, password, rolValido, telefono]
        );
        return {
          id: result.insertId,
          nombre,
          email: emailNorm,
          rol: rolValido,
          telefono,
          fecha_creacion: new Date().toISOString()
        };
      } catch (err) {
        console.warn('Fallback a store en Usuario.create:', err.message);
      }
    }

    const nuevoUsuario = {
      id: store.counters.usuarios++,
      nombre,
      email: emailNorm,
      password,
      rol: rolValido,
      telefono,
      fecha_creacion: new Date().toISOString()
    };
    store.usuarios.push(nuevoUsuario);
    const { password: _, ...sinPass } = nuevoUsuario;
    return sinPass;
  }

  static async update(id, { nombre, telefono }) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        await db.query(
          'UPDATE usuarios SET nombre = COALESCE(?, nombre), telefono = COALESCE(?, telefono) WHERE id = ?',
          [nombre || null, telefono || null, numId]
        );
        return this.findById(numId);
      } catch (err) {
        console.warn('Fallback a store en Usuario.update:', err.message);
      }
    }

    const usuario = store.usuarios.find(u => u.id === numId);
    if (!usuario) return null;
    if (nombre) usuario.nombre = nombre;
    if (telefono !== undefined) usuario.telefono = telefono;
    const { password: _, ...sinPass } = usuario;
    return sinPass;
  }
}

module.exports = Usuario;
