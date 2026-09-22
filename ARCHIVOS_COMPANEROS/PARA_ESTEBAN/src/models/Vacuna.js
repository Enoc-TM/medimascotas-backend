// src/models/Vacuna.js
// Modelo para la gestion de vacunas aplicadas y carnet de inmunizacion (RF-10, CU-06, RN-10, RN-15)
// Asignado a: Esteban Fierro
const db = require('../config/database');
const store = require('../data/store');

class Vacuna {
  static async findAll() {
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM vacunas ORDER BY fecha_aplicacion DESC');
        return rows;
      } catch (err) {
        console.warn('Fallback a store en Vacuna.findAll:', err.message);
      }
    }
    return store.vacunas;
  }

  static async findById(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM vacunas WHERE id = ?', [numId]);
        return rows[0] || null;
      } catch (err) {
        console.warn('Fallback a store en Vacuna.findById:', err.message);
      }
    }
    return store.vacunas.find(v => v.id === numId) || null;
  }

  static async findByMascotaId(mascota_id) {
    const numId = parseInt(mascota_id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM vacunas WHERE mascota_id = ? ORDER BY fecha_aplicacion DESC', [numId]);
        return rows;
      } catch (err) {
        console.warn('Fallback a store en Vacuna.findByMascotaId:', err.message);
      }
    }
    return store.vacunas.filter(v => v.mascota_id === numId);
  }

  static async create({
    mascota_id,
    tipo_vacuna,
    fecha_aplicacion,
    dosis = 'Dosis unica',
    proxima_dosis = null,
    veterinario_id = 1,
    observaciones = ''
  }) {
    const numMascotaId = parseInt(mascota_id, 10);
    const numVetId = parseInt(veterinario_id, 10) || 1;

    if (db.isDbConnected()) {
      try {
        const [result] = await db.query(
          `INSERT INTO vacunas 
           (mascota_id, veterinario_id, tipo_vacuna, fecha_aplicacion, dosis, proxima_dosis, observaciones) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [numMascotaId, numVetId, tipo_vacuna, fecha_aplicacion, dosis, proxima_dosis, observaciones]
        );
        return {
          id: result.insertId,
          mascota_id: numMascotaId,
          veterinario_id: numVetId,
          tipo_vacuna,
          fecha_aplicacion,
          dosis,
          proxima_dosis,
          observaciones,
          fecha_registro: new Date().toISOString()
        };
      } catch (err) {
        console.warn('Fallback a store en Vacuna.create:', err.message);
      }
    }

    const nuevaVacuna = {
      id: store.counters.vacunas++,
      mascota_id: numMascotaId,
      tipo_vacuna,
      fecha_aplicacion,
      dosis,
      proxima_dosis,
      veterinario_id: numVetId,
      observaciones,
      fecha_registro: new Date().toISOString()
    };
    store.vacunas.push(nuevaVacuna);
    return nuevaVacuna;
  }

  static async update(id, { tipo_vacuna, dosis, proxima_dosis, observaciones }) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        await db.query(
          `UPDATE vacunas 
           SET tipo_vacuna = COALESCE(?, tipo_vacuna), 
               dosis = COALESCE(?, dosis), 
               proxima_dosis = COALESCE(?, proxima_dosis), 
               observaciones = COALESCE(?, observaciones) 
           WHERE id = ?`,
          [tipo_vacuna || null, dosis || null, proxima_dosis || null, observaciones !== undefined ? observaciones : null, numId]
        );
        return this.findById(numId);
      } catch (err) {
        console.warn('Fallback a store en Vacuna.update:', err.message);
      }
    }

    const vacuna = store.vacunas.find(v => v.id === numId);
    if (!vacuna) return null;
    if (tipo_vacuna) vacuna.tipo_vacuna = tipo_vacuna;
    if (dosis) vacuna.dosis = dosis;
    if (proxima_dosis !== undefined) vacuna.proxima_dosis = proxima_dosis;
    if (observaciones !== undefined) vacuna.observaciones = observaciones;
    return vacuna;
  }
}

module.exports = Vacuna;
