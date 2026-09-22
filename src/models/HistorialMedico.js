// src/models/HistorialMedico.js
// Modelo para la gestion de historiales medicos veterinarios (RF-05, RF-11, RF-15, CU-05, RN-04)
// Asignado a: Santiago Avila
const db = require('../config/database');
const store = require('../data/store');

class HistorialMedico {
  static async findByMascotaId(mascota_id) {
    const numId = parseInt(mascota_id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM historiales_medicos WHERE mascota_id = ?', [numId]);
        if (rows[0]) {
          const row = rows[0];
          return {
            ...row,
            alergias: typeof row.alergias === 'string' ? JSON.parse(row.alergias) : (row.alergias || [])
          };
        }
        return null;
      } catch (err) {
        console.warn('Fallback a store en HistorialMedico.findByMascotaId:', err.message);
      }
    }
    return store.historiales.find(h => h.mascota_id === numId) || null;
  }

  static async findById(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM historiales_medicos WHERE id = ?', [numId]);
        if (rows[0]) {
          const row = rows[0];
          return {
            ...row,
            alergias: typeof row.alergias === 'string' ? JSON.parse(row.alergias) : (row.alergias || [])
          };
        }
        return null;
      } catch (err) {
        console.warn('Fallback a store en HistorialMedico.findById:', err.message);
      }
    }
    return store.historiales.find(h => h.id === numId) || null;
  }

  static async create({
    mascota_id,
    antecedentes = 'Sin antecedentes registrados al momento del alta.',
    alergias = [],
    observaciones_generales = 'Historial clinico inicializado automaticamente.'
  }) {
    const numMascotaId = parseInt(mascota_id, 10);
    const alergiasArr = Array.isArray(alergias) ? alergias : [alergias];

    if (db.isDbConnected()) {
      try {
        const [result] = await db.query(
          `INSERT INTO historiales_medicos 
           (mascota_id, antecedentes, alergias, observaciones_generales) 
           VALUES (?, ?, ?, ?)`,
          [numMascotaId, antecedentes, JSON.stringify(alergiasArr), observaciones_generales]
        );
        return {
          id: result.insertId,
          mascota_id: numMascotaId,
          antecedentes,
          alergias: alergiasArr,
          observaciones_generales,
          fecha_creacion: new Date().toISOString()
        };
      } catch (err) {
        console.warn('Fallback a store en HistorialMedico.create:', err.message);
      }
    }

    const nuevoHistorial = {
      id: store.counters.historiales++,
      mascota_id: numMascotaId,
      antecedentes,
      alergias: alergiasArr,
      fecha_creacion: new Date().toISOString(),
      observaciones_generales
    };
    store.historiales.push(nuevoHistorial);
    return nuevoHistorial;
  }

  static async updateAntecedentes(mascota_id, { antecedentes, alergias, observaciones_generales }) {
    const numId = parseInt(mascota_id, 10);
    const alergiasJson = alergias !== undefined ? JSON.stringify(Array.isArray(alergias) ? alergias : [alergias]) : null;

    if (db.isDbConnected()) {
      try {
        await db.query(
          `UPDATE historiales_medicos 
           SET antecedentes = COALESCE(?, antecedentes), 
               alergias = COALESCE(?, alergias), 
               observaciones_generales = COALESCE(?, observaciones_generales) 
           WHERE mascota_id = ?`,
          [antecedentes || null, alergiasJson, observaciones_generales || null, numId]
        );
        return this.findByMascotaId(numId);
      } catch (err) {
        console.warn('Fallback a store en HistorialMedico.updateAntecedentes:', err.message);
      }
    }

    const historial = store.historiales.find(h => h.mascota_id === numId);
    if (!historial) return null;
    if (antecedentes !== undefined) historial.antecedentes = antecedentes;
    if (alergias !== undefined) historial.alergias = Array.isArray(alergias) ? alergias : [alergias];
    if (observaciones_generales !== undefined) historial.observaciones_generales = observaciones_generales;
    return historial;
  }
}

module.exports = HistorialMedico;
