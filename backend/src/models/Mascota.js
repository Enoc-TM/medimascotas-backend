// src/models/Mascota.js
// Modelo para la gestión de mascotas / pacientes veterinarios
const db = require('../config/database');
const Propietario = require('./Propietario');

class Mascota {
  static async findAll({ search, especie, propietario_id } = {}) {
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
          sql += ` AND (LOWER(m.nombre) LIKE ? OR LOWER(m.raza) LIKE ? OR LOWER(p.nombre) LIKE ? OR p.identificacion LIKE ?)`;
          const q = `%${search.toLowerCase()}%`;
          params.push(q, q, q, `%${search}%`);
        }

        if (especie) {
          sql += ` AND LOWER(m.especie) = ?`;
          params.push(especie.toLowerCase());
        }

        if (propietario_id) {
          sql += ` AND m.propietario_id = ?`;
          params.push(Number(propietario_id));
        }

        sql += ` ORDER BY m.id DESC`;

        const [rows] = await db.query(sql, params);
        return rows;
      } catch (err) {
        console.warn('Fallback a memoria en Mascota.findAll:', err.message);
      }
    }

    let list = (db.memoryStore.mascotas || []).filter(m => m.activo !== false);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m => {
        const matchNombre = (m.nombre || '').toLowerCase().includes(q);
        const matchRaza = (m.raza || '').toLowerCase().includes(q);
        const prop = (db.memoryStore.propietarios || []).find(p => p.id === m.propietario_id);
        const matchProp = prop && (
          (prop.nombre || '').toLowerCase().includes(q) ||
          (prop.identificacion || '').includes(q)
        );
        return matchNombre || matchRaza || matchProp;
      });
    }

    if (especie) {
      list = list.filter(m => (m.especie || '').toLowerCase() === especie.toLowerCase());
    }

    if (propietario_id) {
      list = list.filter(m => Number(m.propietario_id) === Number(propietario_id));
    }

    return list.map(m => {
      const prop = (db.memoryStore.propietarios || []).find(p => p.id === m.propietario_id);
      return {
        ...m,
        propietario_nombre: prop ? prop.nombre : (m.propietario_nombre || 'Cliente'),
        propietario_identificacion: prop ? prop.identificacion : (m.propietario_identificacion || 'N/A')
      };
    });
  }

  static async findById(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        const sql = `
          SELECT m.*, p.nombre AS propietario_nombre, p.identificacion AS propietario_identificacion, p.telefono AS propietario_telefono
          FROM mascotas m
          JOIN propietarios p ON m.propietario_id = p.id
          WHERE m.id = ? AND m.activo = TRUE
        `;
        const [rows] = await db.query(sql, [numId]);
        return rows[0] || null;
      } catch (err) {
        console.warn('Fallback a memoria en Mascota.findById:', err.message);
      }
    }

    const m = (db.memoryStore.mascotas || []).find(item => item.id === numId && item.activo !== false);
    if (!m) return null;
    const prop = (db.memoryStore.propietarios || []).find(p => p.id === m.propietario_id);
    return {
      ...m,
      propietario_nombre: prop ? prop.nombre : (m.propietario_nombre || 'Cliente'),
      propietario_identificacion: prop ? prop.identificacion : (m.propietario_identificacion || 'N/A'),
      propietario_telefono: prop ? prop.telefono : ''
    };
  }

  static async create({
    codigo_chip,
    nombre,
    especie,
    raza = 'Criollo / Mestizo',
    edad = 0,
    sexo = 'Macho',
    peso_kg = 0,
    propietario_id
  }) {
    const chipFinal = codigo_chip || `CHIP-${Date.now().toString().slice(-6)}`;
    const propId = Number(propietario_id) || 1;

    if (db.isDbConnected()) {
      try {
        const [result] = await db.query(
          `INSERT INTO mascotas 
           (codigo_chip, nombre, especie, raza, edad, sexo, peso_kg, propietario_id, activo) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
          [chipFinal, nombre, especie, raza, Number(edad), sexo, Number(peso_kg), propId]
        );
        return await this.findById(result.insertId);
      } catch (err) {
        console.warn('Fallback a memoria en Mascota.create:', err.message);
      }
    }

    const prop = (db.memoryStore.propietarios || []).find(p => p.id === propId);
    const nuevaMascota = {
      id: db.memoryStore.counters.mascotas++,
      codigo_chip: chipFinal,
      nombre,
      especie,
      raza,
      edad: Number(edad) || 0,
      sexo,
      peso_kg: Number(peso_kg) || 0,
      propietario_id: propId,
      propietario_nombre: prop ? prop.nombre : 'Cliente',
      propietario_identificacion: prop ? prop.identificacion : 'N/A',
      activo: true,
      fecha_registro: new Date().toISOString()
    };
    db.memoryStore.mascotas.push(nuevaMascota);
    return nuevaMascota;
  }

  static async update(id, { nombre, especie, raza, edad, sexo, peso_kg, propietario_id }) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        await db.query(
          `UPDATE mascotas 
           SET nombre = COALESCE(?, nombre),
               especie = COALESCE(?, especie),
               raza = COALESCE(?, raza), 
               edad = COALESCE(?, edad), 
               sexo = COALESCE(?, sexo), 
               peso_kg = COALESCE(?, peso_kg),
               propietario_id = COALESCE(?, propietario_id)
           WHERE id = ?`,
          [
            nombre || null,
            especie || null,
            raza || null,
            edad !== undefined ? Number(edad) : null,
            sexo || null,
            peso_kg !== undefined ? Number(peso_kg) : null,
            propietario_id ? Number(propietario_id) : null,
            numId
          ]
        );
        return await this.findById(numId);
      } catch (err) {
        console.warn('Fallback a memoria en Mascota.update:', err.message);
      }
    }

    const index = (db.memoryStore.mascotas || []).findIndex(m => m.id === numId);
    if (index === -1) return null;
    const current = db.memoryStore.mascotas[index];
    if (nombre) current.nombre = nombre;
    if (especie) current.especie = especie;
    if (raza) current.raza = raza;
    if (edad !== undefined) current.edad = Number(edad);
    if (sexo) current.sexo = sexo;
    if (peso_kg !== undefined) current.peso_kg = Number(peso_kg);
    if (propietario_id) {
      current.propietario_id = Number(propietario_id);
      const prop = (db.memoryStore.propietarios || []).find(p => p.id === current.propietario_id);
      if (prop) {
        current.propietario_nombre = prop.nombre;
        current.propietario_identificacion = prop.identificacion;
      }
    }
    return current;
  }

  static async delete(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        await db.query('UPDATE mascotas SET activo = FALSE WHERE id = ?', [numId]);
        return true;
      } catch (err) {
        console.warn('Fallback a memoria en Mascota.delete:', err.message);
      }
    }

    const mascota = (db.memoryStore.mascotas || []).find(m => m.id === numId);
    if (!mascota) return false;
    mascota.activo = false;
    return true;
  }
}

module.exports = Mascota;
