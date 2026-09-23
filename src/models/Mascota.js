// src/models/Mascota.js
// Modelo para la gestion de mascotas y pacientes veterinarios (RF-04, CU-03, RN-01, RN-03, RN-04, RN-11)
// Asignado a: Santiago Avila
const db = require('../config/database');
const store = require('../data/store');

class Mascota {
  static async findAll({ search, especie } = {}) {
    if (db.isDbConnected()) {
      try {
        let sql = `
          SELECT m.*, p.nombre AS propietario_nombre, p.identificacion AS propietario_identificacion 
          FROM mascotas m
          JOIN propietarios p ON m.propietario_id = p.id
          WHERE m.activo = TRUE
        `;
        const params = [];

        if (search) {
          sql += ` AND (LOWER(m.nombre) LIKE ? OR p.identificacion LIKE ? OR LOWER(p.nombre) LIKE ?)`;
          const q = `%${search.toLowerCase()}%`;
          params.push(q, `%${search}%`, q);
        }

        if (especie) {
          sql += ` AND LOWER(m.especie) = ?`;
          params.push(especie.toLowerCase());
        }

        const [rows] = await db.query(sql, params);
        return rows;
      } catch (err) {
        console.warn('Fallback a store en Mascota.findAll:', err.message);
      }
    }

    let list = store.mascotas.filter(m => m.activo !== false);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m => {
        const matchNombre = m.nombre.toLowerCase().includes(q);
        const propietario = store.propietarios.find(p => p.id === m.propietario_id);
        const matchPropietario = propietario && (
          propietario.identificacion.includes(q) ||
          propietario.nombre.toLowerCase().includes(q)
        );
        return matchNombre || matchPropietario;
      });
    }

    if (especie) {
      list = list.filter(m => m.especie.toLowerCase() === especie.toLowerCase());
    }

    return list.map(m => {
      const prop = store.propietarios.find(p => p.id === m.propietario_id);
      return {
        ...m,
        propietario_nombre: prop ? prop.nombre : 'Desconocido',
        propietario_identificacion: prop ? prop.identificacion : 'N/A'
      };
    });
  }

  static async findById(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM mascotas WHERE id = ?', [numId]);
        return rows[0] || null;
      } catch (err) {
        console.warn('Fallback a store en Mascota.findById:', err.message);
      }
    }
    return store.mascotas.find(m => m.id === numId) || null;
  }

  static async findByChip(codigo_chip) {
    const chip = String(codigo_chip).trim();
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM mascotas WHERE codigo_chip = ?', [chip]);
        return rows[0] || null;
      } catch (err) {
        console.warn('Fallback a store en Mascota.findByChip:', err.message);
      }
    }
    return store.mascotas.find(m => m.codigo_chip === chip) || null;
  }

  static async findByPropietarioId(propietario_id) {
    const numId = parseInt(propietario_id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query('SELECT * FROM mascotas WHERE propietario_id = ? AND activo = TRUE', [numId]);
        return rows;
      } catch (err) {
        console.warn('Fallback a store en Mascota.findByPropietarioId:', err.message);
      }
    }
    return store.mascotas.filter(m => m.propietario_id === numId && m.activo !== false);
  }

  static async create({
    codigo_chip,
    nombre,
    especie,
    raza = 'Criollo / Mestizo',
    edad = 0,
    sexo = 'Indefinido',
    peso_kg = 0,
    propietario_id
  }) {
    if (db.isDbConnected()) {
      try {
        const [result] = await db.query(
          `INSERT INTO mascotas 
           (codigo_chip, nombre, especie, raza, edad, sexo, peso_kg, propietario_id, activo) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
          [codigo_chip, nombre, especie, raza, edad, sexo, peso_kg, propietario_id]
        );
        return {
          id: result.insertId,
          codigo_chip,
          nombre,
          especie,
          raza,
          edad,
          sexo,
          peso_kg,
          propietario_id,
          activo: true,
          fecha_registro: new Date().toISOString()
        };
      } catch (err) {
        console.warn('Fallback a store en Mascota.create:', err.message);
      }
    }

    const nuevaMascota = {
      id: store.counters.mascotas++,
      codigo_chip,
      nombre,
      especie,
      raza,
      edad: Number(edad) || 0,
      sexo,
      peso_kg: Number(peso_kg) || 0,
      propietario_id: parseInt(propietario_id, 10),
      activo: true,
      fecha_registro: new Date().toISOString()
    };
    store.mascotas.push(nuevaMascota);
    return nuevaMascota;
  }

  static async update(id, { nombre, edad, peso_kg, raza, sexo }) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        await db.query(
          `UPDATE mascotas 
           SET nombre = COALESCE(?, nombre), 
               edad = COALESCE(?, edad), 
               peso_kg = COALESCE(?, peso_kg), 
               raza = COALESCE(?, raza), 
               sexo = COALESCE(?, sexo) 
           WHERE id = ?`,
          [nombre || null, edad !== undefined ? edad : null, peso_kg !== undefined ? peso_kg : null, raza || null, sexo || null, numId]
        );
        return this.findById(numId);
      } catch (err) {
        console.warn('Fallback a store en Mascota.update:', err.message);
      }
    }

    const mascota = store.mascotas.find(m => m.id === numId);
    if (!mascota) return null;
    if (nombre) mascota.nombre = nombre;
    if (edad !== undefined) mascota.edad = Number(edad);
    if (peso_kg !== undefined) mascota.peso_kg = Number(peso_kg);
    if (raza) mascota.raza = raza;
    if (sexo) mascota.sexo = sexo;
    return mascota;
  }

  static async delete(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        await db.query('UPDATE mascotas SET activo = FALSE WHERE id = ?', [numId]);
        return true;
      } catch (err) {
        console.warn('Fallback a store en Mascota.delete:', err.message);
      }
    }

    const mascota = store.mascotas.find(m => m.id === numId);
    if (!mascota) return false;
    mascota.activo = false;
    return true;
  }
}

module.exports = Mascota;
