// src/models/Propietario.js
// Modelo para la gestión de clientes / propietarios de mascotas
const db = require('../config/database');

class Propietario {
  static async findAll() {
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query(
          'SELECT id, identificacion, nombre, telefono, direccion, email, activo, fecha_registro FROM propietarios WHERE activo = TRUE ORDER BY nombre ASC'
        );
        return rows;
      } catch (err) {
        console.warn('Fallback a memoria en Propietario.findAll:', err.message);
      }
    }
    return (db.memoryStore.propietarios || []).filter(p => p.activo !== false);
  }

  static async findById(id) {
    const numId = parseInt(id, 10);
    if (db.isDbConnected()) {
      try {
        const [rows] = await db.query(
          'SELECT id, identificacion, nombre, telefono, direccion, email, activo, fecha_registro FROM propietarios WHERE id = ?',
          [numId]
        );
        return rows[0] || null;
      } catch (err) {
        console.warn('Fallback a memoria en Propietario.findById:', err.message);
      }
    }
    return (db.memoryStore.propietarios || []).find(p => p.id === numId) || null;
  }
}

module.exports = Propietario;
