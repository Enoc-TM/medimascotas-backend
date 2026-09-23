// src/config/database.js
// Configuracion base de base de datos con soporte fallback a memoria (store)

const db = {
  isDbConnected: () => false,
  query: async () => [[]]
};

module.exports = db;
