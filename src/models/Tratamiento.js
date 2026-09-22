// src/models/Tratamiento.js
// Modelo para la gestion de tratamientos clinicos (RF-08, RN-08)
// Asignado a: Esteban Fierro
const db = require('../config/database');
const store = require('../data/store');

class Tratamiento {
  static async findAll() {
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM tratamientos ORDER BY fecha_inicio DESC');
        return rows;
      } catch (err) {
        console.warn('Fallback a store en Tratamiento.findAll:', err.message);
      }
    }
    return store.tratamientos;
  }

  static async findById(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM tratamientos WHERE id = ?', [numId]);
        return rows[0] || null;
      } catch (err) {
        console.warn('Fallback a store en Tratamiento.findById:', err.message);
      }
    }
    return store.tratamientos.find(t => t.id === numId) || null;
  }

  static async findByDiagnosticoId(diagnostico_id) {
    const numId = parseInt(diagnostico_id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM tratamientos WHERE diagnostico_id = ?', [numId]);
        return rows;
      } catch (err) {
        console.warn('Fallback a store en Tratamiento.findByDiagnosticoId:', err.message);
      }
    }
    return store.tratamientos.filter(t => t.diagnostico_id === numId);
  }

  static async create({
    diagnostico_id,
    descripcion,
    duracion = 'Segun evolucion',
    fecha_inicio = new Date().toISOString().slice(0, 10),
    fecha_fin = null
  }) {
    const numDiagId = parseInt(diagnostico_id, 10);

    if (db.isDbConnected()) {
      try {
        const [result] = await db.query(
          `INSERT INTO tratamientos (diagnostico_id, descripcion, duracion, fecha_inicio, fecha_fin) 
           VALUES (?, ?, ?, ?, ?)`,
          [numDiagId, descripcion, duracion, fecha_inicio, fecha_fin]
        );
        return {
          id: result.insertId,
          diagnostico_id: numDiagId,
          descripcion,
          duracion,
          fecha_inicio,
          fecha_fin
        };
      } catch (err) {
        console.warn('Fallback a store en Tratamiento.create:', err.message);
      }
    }

    const nuevoTratamiento = {
      id: store.counters.tratamientos++,
      diagnostico_id: numDiagId,
      descripcion,
      duracion,
      fecha_inicio,
      fecha_fin
    };
    store.tratamientos.push(nuevoTratamiento);
    return nuevoTratamiento;
  }

  static async update(id, { descripcion, duracion, fecha_fin }) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        await db.query(
          `UPDATE tratamientos 
           SET descripcion = COALESCE(?, descripcion), 
               duracion = COALESCE(?, duracion), 
               fecha_fin = COALESCE(?, fecha_fin) 
           WHERE id = ?`,
          [descripcion || null, duracion || null, fecha_fin !== undefined ? fecha_fin : null, numId]
        );
        return this.findById(numId);
      } catch (err) {
        console.warn('Fallback a store en Tratamiento.update:', err.message);
      }
    }

    const trat = store.tratamientos.find(t => t.id === numId);
    if (!trat) return null;
    if (descripcion) trat.descripcion = descripcion;
    if (duracion) trat.duracion = duracion;
    if (fecha_fin !== undefined) trat.fecha_fin = fecha_fin;
    return trat;
  }

  static async delete(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        await db.query('DELETE FROM tratamientos WHERE id = ?', [numId]);
        return true;
      } catch (err) {
        console.warn('Fallback a store en Tratamiento.delete:', err.message);
      }
    }

    const index = store.tratamientos.findIndex(t => t.id === numId);
    if (index === -1) return false;
    store.tratamientos.splice(index, 1);
    return true;
  }
}

module.exports = Tratamiento;
