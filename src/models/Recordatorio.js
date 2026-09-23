// src/models/Recordatorio.js
// Modelo para la gestion de recordatorios de citas, vacunas y tratamientos
// Entidad oficial de MediMascotas (especificada en el documento de requerimientos)
// Asignado a: Santiago Avila
const db = require('../config/database');
const store = require('../data/store');

class Recordatorio {
  static async findAll({ estado, mascota_id } = {}) {
    if (db.isDbConnected()) {
      try {
        let sql = 'SELECT * FROM recordatorios WHERE 1=1';
        const params = [];
        if (estado) {
          sql += ' AND estado = ?';
          params.push(estado);
        }
        if (mascota_id) {
          sql += ' AND mascota_id = ?';
          params.push(parseInt(mascota_id, 10));
        }
        sql += ' ORDER BY fecha_recordatorio ASC';
        const [rows] = await db.query(sql, params);
        return rows;
      } catch (err) {
        console.warn('Fallback a store en Recordatorio.findAll:', err.message);
      }
    }

    let list = store.recordatorios;
    if (estado) {
      list = list.filter(r => r.estado === estado);
    }
    if (mascota_id) {
      const mId = parseInt(mascota_id, 10);
      list = list.filter(r => r.mascota_id === mId);
    }
    return list;
  }

  static async findById(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM recordatorios WHERE id = ?', [numId]);
        return rows[0] || null;
      } catch (err) {
        console.warn('Fallback a store en Recordatorio.findById:', err.message);
      }
    }
    return store.recordatorios.find(r => r.id === numId) || null;
  }

  static async findByMascotaId(mascota_id) {
    const numId = parseInt(mascota_id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM recordatorios WHERE mascota_id = ? ORDER BY fecha_recordatorio ASC', [numId]);
        return rows;
      } catch (err) {
        console.warn('Fallback a store en Recordatorio.findByMascotaId:', err.message);
      }
    }
    return store.recordatorios.filter(r => r.mascota_id === numId);
  }

  static async create({
    mascota_id,
    tipo = 'consulta',
    titulo,
    descripcion = '',
    fecha_recordatorio,
    estado = 'pendiente'
  }) {
    const numMascotaId = parseInt(mascota_id, 10);
    const tipoValido = ['vacuna', 'consulta', 'tratamiento', 'medicamento'].includes(tipo) ? tipo : 'consulta';
    const estadoValido = ['pendiente', 'completado', 'cancelado'].includes(estado) ? estado : 'pendiente';

    if (db.isDbConnected()) {
      try {
        const [result] = await db.query(
          `INSERT INTO recordatorios 
           (mascota_id, tipo, titulo, descripcion, fecha_recordatorio, estado) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [numMascotaId, tipoValido, titulo, descripcion, fecha_recordatorio, estadoValido]
        );
        return {
          id: result.insertId,
          mascota_id: numMascotaId,
          tipo: tipoValido,
          titulo,
          descripcion,
          fecha_recordatorio,
          estado: estadoValido,
          fecha_creacion: new Date().toISOString()
        };
      } catch (err) {
        console.warn('Fallback a store en Recordatorio.create:', err.message);
      }
    }

    const nuevoRecordatorio = {
      id: store.counters.recordatorios++,
      mascota_id: numMascotaId,
      tipo: tipoValido,
      titulo,
      descripcion,
      fecha_recordatorio,
      estado: estadoValido,
      fecha_creacion: new Date().toISOString()
    };
    store.recordatorios.push(nuevoRecordatorio);
    return nuevoRecordatorio;
  }

  static async update(id, { tipo, titulo, descripcion, fecha_recordatorio, estado }) {
    const numId = parseInt(id, 10);
    const tipoVal = tipo && ['vacuna', 'consulta', 'tratamiento', 'medicamento'].includes(tipo) ? tipo : null;
    const estVal = estado && ['pendiente', 'completado', 'cancelado'].includes(estado) ? estado : null;

    if (db.isDbConnected()) {
      try {
        await db.query(
          `UPDATE recordatorios 
           SET tipo = COALESCE(?, tipo), 
               titulo = COALESCE(?, titulo), 
               descripcion = COALESCE(?, descripcion), 
               fecha_recordatorio = COALESCE(?, fecha_recordatorio), 
               estado = COALESCE(?, estado) 
           WHERE id = ?`,
          [tipoVal, titulo || null, descripcion !== undefined ? descripcion : null, fecha_recordatorio || null, estVal, numId]
        );
        return this.findById(numId);
      } catch (err) {
        console.warn('Fallback a store en Recordatorio.update:', err.message);
      }
    }

    const rec = store.recordatorios.find(r => r.id === numId);
    if (!rec) return null;
    if (tipoVal) rec.tipo = tipoVal;
    if (titulo) rec.titulo = titulo;
    if (descripcion !== undefined) rec.descripcion = descripcion;
    if (fecha_recordatorio) rec.fecha_recordatorio = fecha_recordatorio;
    if (estVal) rec.estado = estVal;
    return rec;
  }

  static async delete(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        await db.query('DELETE FROM recordatorios WHERE id = ?', [numId]);
        return true;
      } catch (err) {
        console.warn('Fallback a store en Recordatorio.delete:', err.message);
      }
    }

    const index = store.recordatorios.findIndex(r => r.id === numId);
    if (index === -1) return false;
    store.recordatorios.splice(index, 1);
    return true;
  }
}

module.exports = Recordatorio;
