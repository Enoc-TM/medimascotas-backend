// src/models/Diagnostico.js
// Modelo para la gestion de diagnosticos medicos (RF-07, RN-07)
// Asignado a: Santiago Avila
const db = require('../config/database');
const store = require('../data/store');

class Diagnostico {
  static async findAll() {
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM diagnosticos ORDER BY fecha DESC');
        return rows;
      } catch (err) {
        console.warn('Fallback a store en Diagnostico.findAll:', err.message);
      }
    }
    return store.diagnosticos;
  }

  static async findById(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM diagnosticos WHERE id = ?', [numId]);
        return rows[0] || null;
      } catch (err) {
        console.warn('Fallback a store en Diagnostico.findById:', err.message);
      }
    }
    return store.diagnosticos.find(d => d.id === numId) || null;
  }

  static async findByConsultaId(consulta_id) {
    const numId = parseInt(consulta_id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM diagnosticos WHERE consulta_id = ?', [numId]);
        return rows;
      } catch (err) {
        console.warn('Fallback a store en Diagnostico.findByConsultaId:', err.message);
      }
    }
    return store.diagnosticos.filter(d => d.consulta_id === numId);
  }

  static async create({ consulta_id, descripcion, gravedad = 'leve', fecha = new Date().toISOString().slice(0, 10) }) {
    const numConsultaId = parseInt(consulta_id, 10);
    const grav = ['leve', 'moderada', 'grave'].includes(gravedad) ? gravedad : 'leve';

    if (db.isDbConnected()) {
      try {
        const [result] = await db.query(
          'INSERT INTO diagnosticos (consulta_id, descripcion, gravedad, fecha) VALUES (?, ?, ?, ?)',
          [numConsultaId, descripcion, grav, fecha]
        );
        return {
          id: result.insertId,
          consulta_id: numConsultaId,
          descripcion,
          gravedad: grav,
          fecha
        };
      } catch (err) {
        console.warn('Fallback a store en Diagnostico.create:', err.message);
      }
    }

    const nuevoDiagnostico = {
      id: store.counters.diagnosticos++,
      consulta_id: numConsultaId,
      descripcion,
      gravedad: grav,
      fecha
    };
    store.diagnosticos.push(nuevoDiagnostico);
    return nuevoDiagnostico;
  }

  static async update(id, { descripcion, gravedad }) {
    const numId = parseInt(id, 10);
    const grav = gravedad && ['leve', 'moderada', 'grave'].includes(gravedad) ? gravedad : null;

    if (db.isDbConnected()) {
      try {
        await db.query(
          'UPDATE diagnosticos SET descripcion = COALESCE(?, descripcion), gravedad = COALESCE(?, gravedad) WHERE id = ?',
          [descripcion || null, grav, numId]
        );
        return this.findById(numId);
      } catch (err) {
        console.warn('Fallback a store en Diagnostico.update:', err.message);
      }
    }

    const diag = store.diagnosticos.find(d => d.id === numId);
    if (!diag) return null;
    if (descripcion) diag.descripcion = descripcion;
    if (grav) diag.gravedad = grav;
    return diag;
  }

  static async delete(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        await db.query('DELETE FROM diagnosticos WHERE id = ?', [numId]);
        return true;
      } catch (err) {
        console.warn('Fallback a store en Diagnostico.delete:', err.message);
      }
    }

    const index = store.diagnosticos.findIndex(d => d.id === numId);
    if (index === -1) return false;
    store.diagnosticos.splice(index, 1);
    return true;
  }
}

module.exports = Diagnostico;
