// src/controllers/vacunasController.js
const store = require('../data/store');

exports.create = (req, res) => {
  const {
    mascota_id,
    tipo_vacuna,
    fecha_aplicacion,
    dosis = 'Dosis unica',
    proxima_dosis = null,
    veterinario_id,
    observaciones = ''
  } = req.body;

  // RN-14: Validacion de datos obligatorios
  if (!mascota_id || !tipo_vacuna || !fecha_aplicacion) {
    return res.status(400).json({
      error: 'RN-14: Los campos mascota_id, tipo_vacuna y fecha_aplicacion son obligatorios'
    });
  }

  // RN-10: Registro de vacunas valido (mascota existe)
  const mascota = store.mascotas.find(m => m.id === parseInt(mascota_id, 10) && m.activo !== false);
  if (!mascota) {
    return res.status(404).json({
      error: 'RN-10: Las vacunas solo pueden registrarse si la mascota existe en el sistema'
    });
  }

  // RN-15: Coherencia de fechas
  const fechaVacuna = new Date(fecha_aplicacion);
  if (isNaN(fechaVacuna.getTime())) {
    return res.status(400).json({
      error: 'RN-15: La fecha de aplicacion de la vacuna no es valida'
    });
  }

  const nuevaVacuna = {
    id: store.counters.vacunas++,
    mascota_id: mascota.id,
    tipo_vacuna,
    fecha_aplicacion,
    dosis,
    proxima_dosis,
    veterinario_id: Number(veterinario_id) || 1,
    observaciones
  };

  store.vacunas.push(nuevaVacuna);

  return res.status(201).json({
    mensaje: 'Vacuna registrada exitosamente en el carnet de la mascota',
    vacuna: nuevaVacuna
  });
};

exports.getByMascota = (req, res) => {
  const mascotaId = parseInt(req.params.mascotaId, 10);
  const vacunas = store.vacunas.filter(v => v.mascota_id === mascotaId);
  return res.status(200).json(vacunas);
};

exports.getAll = (req, res) => {
  return res.status(200).json(store.vacunas);
};
