// src/models/Medicamento.js
// Modelo para la gestion de medicamentos formulados en consulta (RF-09, RN-09)
// Asignado a: Santiago Avila
const db = require('../config/database');
const store = require('../data/store');

class Medicamento {
  static async findAll() {
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM medicamentos');
        return rows;
      } catch (err) {
        console.warn('Fallback a store en Medicamento.findAll:', err.message);
      }
    }
    return store.medicamentos;
  }

  static async findById(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM medicamentos WHERE id = ?', [numId]);
        return rows[0] || null;
      } catch (err) {
        console.warn('Fallback a store en Medicamento.findById:', err.message);
      }
    }
    return store.medicamentos.find(m => m.id === numId) || null;
  }

  static async findByConsultaId(consulta_id) {
    const numId = parseInt(consulta_id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM medicamentos WHERE consulta_id = ?', [numId]);
        return rows;
      } catch (err) {
        console.warn('Fallback a store en Medicamento.findByConsultaId:', err.message);
      }
    }
    return store.medicamentos.filter(m => m.consulta_id === numId);
  }

  static async create({
    consulta_id,
    nombre,
    dosis = 'Segun peso',
    frecuencia = 'Cada 12 horas',
    duracion = '7 dias',
    indicaciones = 'Via oral'
  }) {
    const numConsultaId = parseInt(consulta_id, 10);

    if (db.isDbConnected()) {
      try {
        const [result] = await db.query(
          `INSERT INTO medicamentos (consulta_id, nombre, dosis, frecuencia, duracion, indicaciones) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [numConsultaId, nombre, dosis, frecuencia, duracion, indicaciones]
        );
        return {
          id: result.insertId,
          consulta_id: numConsultaId,
          nombre,
          dosis,
          frecuencia,
          duracion,
          indicaciones
        };
      } catch (err) {
        console.warn('Fallback a store en Medicamento.create:', err.message);
      }
    }

    const nuevoMedicamento = {
      id: store.counters.medicamentos++,
      consulta_id: numConsultaId,
      nombre,
      dosis,
      frecuencia,
      duracion,
      indicaciones
    };
    store.medicamentos.push(nuevoMedicamento);
    return nuevoMedicamento;
  }

  static async update(id, { nombre, dosis, frecuencia, duracion, indicaciones }) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        await db.query(
          `UPDATE medicamentos 
           SET nombre = COALESCE(?, nombre), 
               dosis = COALESCE(?, dosis), 
               frecuencia = COALESCE(?, frecuencia), 
               duracion = COALESCE(?, duracion), 
               indicaciones = COALESCE(?, indicaciones) 
           WHERE id = ?`,
          [nombre || null, dosis || null, frecuencia || null, duracion || null, indicaciones || null, numId]
        );
        return this.findById(numId);
      } catch (err) {
        console.warn('Fallback a store en Medicamento.update:', err.message);
      }
    }

    const med = store.medicamentos.find(m => m.id === numId);
    if (!med) return null;
    if (nombre) med.nombre = nombre;
    if (dosis) med.dosis = dosis;
    if (frecuencia) med.frecuencia = frecuencia;
    if (duracion) med.duracion = duracion;
    if (indicaciones !== undefined) med.indicaciones = indicaciones;
    return med;
  }

  static async delete(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        await db.query('DELETE FROM medicamentos WHERE id = ?', [numId]);
        return true;
      } catch (err) {
        console.warn('Fallback a store en Medicamento.delete:', err.message);
      }
    }

    const index = store.medicamentos.findIndex(m => m.id === numId);
    if (index === -1) return false;
    store.medicamentos.splice(index, 1);
    return true;
  }
}

module.exports = Medicamento;
