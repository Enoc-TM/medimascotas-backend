// src/controllers/mascotasController.js
// Controlador para el registro, busqueda y administracion de mascotas (RF-04, RF-12, RF-13, RF-14, CU-03, RN-01, RN-03, RN-04, RN-11)
// Asignado a: Santiago Avila
const Mascota = require('../models/Mascota');
const Propietario = require('../models/Propietario');
const HistorialMedico = require('../models/HistorialMedico');

exports.create = async (req, res, next) => {
  try {
    const {
      nombre,
      especie,
      raza = 'Criollo / Mestizo',
      edad,
      sexo = 'Indefinido',
      peso_kg = 0,
      propietario_id,
      codigo_chip
    } = req.body;

    // RN-14: Validacion de datos obligatorios
    if (!nombre || !especie || propietario_id === undefined) {
      return res.status(400).json({
        error: 'RN-14: Los campos nombre, especie y propietario_id son obligatorios'
      });
    }

    // RN-01: Asociacion de mascotas obligatoria
    const propietario = await Propietario.findById(propietario_id);
    if (!propietario || propietario.activo === false) {
      return res.status(400).json({
        error: 'RN-01: Toda mascota registrada debe estar obligatoriamente asociada a un propietario valido'
      });
    }

    // RN-03: Identificacion unica de mascota (codigo_chip)
    const chipFinal = codigo_chip || ('CHIP-' + Date.now().toString().slice(-6));
    const chipExiste = await Mascota.findByChip(chipFinal);
    if (chipExiste) {
      return res.status(400).json({
        error: 'RN-03: Ya existe una mascota con este identificador unico (codigo_chip)'
      });
    }

    const nuevaMascota = await Mascota.create({
      codigo_chip: chipFinal,
      nombre,
      especie,
      raza,
      edad: Number(edad) || 0,
      sexo,
      peso_kg: Number(peso_kg) || 0,
      propietario_id: propietario.id
    });

    // RN-04: Creacion automatica de historial clinico
    const nuevoHistorial = await HistorialMedico.create({
      mascota_id: nuevaMascota.id,
      antecedentes: req.body.antecedentes || 'Sin antecedentes registrados al momento del alta.',
      alergias: req.body.alergias || [],
      observaciones_generales: req.body.observaciones_iniciales || 'Historial clinico inicializado automaticamente.'
    });

    return res.status(201).json({
      mensaje: 'Mascota registrada exitosamente e historial clinico creado automaticamente',
      mascota: nuevaMascota,
      historial_clinico: nuevoHistorial
    });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { search, especie } = req.query;
    const list = await Mascota.findAll({ search, especie });
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const mascota = await Mascota.findById(id);

    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    const propietario = await Propietario.findById(mascota.propietario_id);
    const historial = await HistorialMedico.findByMascotaId(mascota.id);

    return res.status(200).json({
      ...mascota,
      propietario: propietario || null,
      historial_id: historial ? historial.id : null
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await Mascota.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    return res.status(200).json({
      mensaje: 'Datos de la mascota actualizados exitosamente',
      mascota: updated
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const mascota = await Mascota.findById(id);

    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    const historial = await HistorialMedico.findByMascotaId(id);

    // RN-11: Restriccion de eliminacion de mascotas (eliminacion logica si posee historial)
    if (historial) {
      await Mascota.delete(id);
      return res.status(200).json({
        mensaje: 'RN-11: La mascota posee historial clinico registrado. Se aplico eliminacion logica (inactiva) para preservar la integridad de los datos.',
        eliminacion_logica: true,
        mascota_id: id,
        activo: false
      });
    }

    await Mascota.delete(id);
    return res.status(200).json({
      mensaje: 'Mascota eliminada del sistema',
      mascota_id: id
    });
  } catch (err) {
    next(err);
  }
};
