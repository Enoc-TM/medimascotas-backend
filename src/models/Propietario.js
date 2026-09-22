// src/models/Propietario.js
// Modelo para la gestion de propietarios de mascotas (RF-03, CU-02, RN-02)
// Asignado a: Enoc Tamayo
const db = require('../config/database');
const store = require('../data/store');

class Propietario {
  static async findAll({ search } = {}) {
    if (db.isDbConnected()) {
      try {
        let sql = 'SELECT * FROM propietarios WHERE activo = TRUE';
        const params = [];
        if (search) {
          sql += ' AND (LOWER(nombre) LIKE ? OR identificacion LIKE ?)';
          const q = `%${search.toLowerCase()}%`;
          params.push(q, `%${search}%`);
        }
        const [rows] = await db.query(sql, params);
        return rows;
      } catch (err) {
        console.warn('Fallback a store en Propietario.findAll:', err.message);
      }
    }

    let list = store.propietarios.filter(p => p.activo !== false);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.nombre.toLowerCase().includes(q) || p.identificacion.includes(q)
      );
    }
    return list;
  }

  static async findById(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM propietarios WHERE id = ?', [numId]);
        return rows[0] || null;
      } catch (err) {
        console.warn('Fallback a store en Propietario.findById:', err.message);
      }
    }
    return store.propietarios.find(p => p.id === numId) || null;
  }

  static async findByIdentificacion(identificacion) {
    const doc = String(identificacion).trim();
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM propietarios WHERE identificacion = ?', [doc]);
        return rows[0] || null;
      } catch (err) {
        console.warn('Fallback a store en Propietario.findByIdentificacion:', err.message);
      }
    }
    return store.propietarios.find(p => p.identificacion === doc) || null;
  }

  static async create({ identificacion, nombre, telefono, direccion = '', email = '' }) {
    const doc = String(identificacion).trim();
    if (db.isDbConnected()) {
      try {
        const [result] = await db.query(
          'INSERT INTO propietarios (identificacion, nombre, telefono, direccion, email, activo) VALUES (?, ?, ?, ?, ?, TRUE)',
          [doc, nombre, telefono, direccion, email]
        );
        return {
          id: result.insertId,
          identificacion: doc,
          nombre,
          telefono,
          direccion,
          email,
          activo: true,
          fecha_registro: new Date().toISOString()
        };
      } catch (err) {
        console.warn('Fallback a store en Propietario.create:', err.message);
      }
    }

    const nuevoPropietario = {
      id: store.counters.propietarios++,
      identificacion: doc,
      nombre,
      telefono,
      direccion,
      email,
      activo: true,
      fecha_registro: new Date().toISOString()
    };
    store.propietarios.push(nuevoPropietario);
    return nuevoPropietario;
  }

  static async update(id, { nombre, telefono, direccion, email }) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        await db.query(
          `UPDATE propietarios 
           SET nombre = COALESCE(?, nombre), 
               telefono = COALESCE(?, telefono), 
               direccion = COALESCE(?, direccion), 
               email = COALESCE(?, email) 
           WHERE id = ?`,
          [nombre || null, telefono || null, direccion !== undefined ? direccion : null, email !== undefined ? email : null, numId]
        );
        return this.findById(numId);
      } catch (err) {
        console.warn('Fallback a store en Propietario.update:', err.message);
      }
    }

    const propietario = store.propietarios.find(p => p.id === numId);
    if (!propietario) return null;
    if (nombre) propietario.nombre = nombre;
    if (telefono) propietario.telefono = telefono;
    if (direccion !== undefined) propietario.direccion = direccion;
    if (email !== undefined) propietario.email = email;
    return propietario;
  }

  static async delete(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        await db.query('UPDATE propietarios SET activo = FALSE WHERE id = ?', [numId]);
        return true;
      } catch (err) {
        console.warn('Fallback a store en Propietario.delete:', err.message);
      }
    }

    const propietario = store.propietarios.find(p => p.id === numId);
    if (!propietario) return false;
    propietario.activo = false;
    return true;
  }
}

module.exports = Propietario;
