// src/models/Consulta.js
// Modelo para la gestion de consultas veterinarias (RF-06, CU-04, RN-05, RN-06, RN-12, RN-15)
// Asignado a: Esteban Fierro
const db = require('../config/database');
const store = require('../data/store');

class Consulta {
  static async findAll() {
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM consultas ORDER BY fecha DESC, hora DESC');
        return rows;
      } catch (err) {
        console.warn('Fallback a store en Consulta.findAll:', err.message);
      }
    }
    return store.consultas;
  }

  static async findById(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM consultas WHERE id = ?', [numId]);
        return rows[0] || null;
      } catch (err) {
        console.warn('Fallback a store en Consulta.findById:', err.message);
      }
    }
    return store.consultas.find(c => c.id === numId) || null;
  }

  static async findByMascotaId(mascota_id) {
    const numId = parseInt(mascota_id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM consultas WHERE mascota_id = ? ORDER BY fecha DESC', [numId]);
        return rows;
      } catch (err) {
        console.warn('Fallback a store en Consulta.findByMascotaId:', err.message);
      }
    }
    return store.consultas.filter(c => c.mascota_id === numId);
  }

  static async create({
    historial_id = null,
    mascota_id,
    veterinario_id,
    veterinario_nombre,
    fecha,
    hora = '08:00',
    motivo,
    observaciones = '',
    diagnosticos = [],
    tratamientos = [],
    medicamentos = [],
    estado = 'completada'
  }) {
    const numMascotaId = parseInt(mascota_id, 10);
    const numVetId = parseInt(veterinario_id, 10);

    if (db.isDbConnected()) {
      try {
        const [result] = await db.query(
          `INSERT INTO consultas 
           (historial_id, mascota_id, veterinario_id, veterinario_nombre, fecha, hora, motivo, observaciones, estado) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [historial_id, numMascotaId, numVetId, veterinario_nombre, fecha, hora, motivo, observaciones, estado]
        );
        const consultaId = result.insertId;

        return {
          id: consultaId,
          historial_id,
          mascota_id: numMascotaId,
          veterinario_id: numVetId,
          veterinario_nombre,
          fecha,
          hora,
          motivo,
          observaciones,
          diagnosticos,
          tratamientos,
          medicamentos,
          estado
        };
      } catch (err) {
        console.warn('Fallback a store en Consulta.create:', err.message);
      }
    }

    const nuevaConsulta = {
      id: store.counters.consultas++,
      historial_id,
      mascota_id: numMascotaId,
      veterinario_id: numVetId,
      veterinario_nombre,
      fecha,
      hora,
      motivo,
      observaciones,
      diagnosticos,
      tratamientos,
      medicamentos,
      estado
    };
    store.consultas.push(nuevaConsulta);
    return nuevaConsulta;
  }

  static async update(id, { observaciones, estado }) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        await db.query(
          `UPDATE consultas 
           SET observaciones = COALESCE(?, observaciones), 
               estado = COALESCE(?, estado) 
           WHERE id = ?`,
          [observaciones !== undefined ? observaciones : null, estado || null, numId]
        );
        return this.findById(numId);
      } catch (err) {
        console.warn('Fallback a store en Consulta.update:', err.message);
      }
    }

    const consulta = store.consultas.find(c => c.id === numId);
    if (!consulta) return null;
    if (observaciones !== undefined) consulta.observaciones = observaciones;
    if (estado && ['completada', 'en_progreso', 'cancelada'].includes(estado)) {
      consulta.estado = estado;
    }
    return consulta;
  }
}

module.exports = Consulta;
