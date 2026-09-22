// src/controllers/historialesController.js
// Controlador para la visualizacion del historial clinico consolidado y generacion de reportes (RF-05, RF-11, RF-15, CU-05)
// Asignado a: Santiago Avila
const HistorialMedico = require('../models/HistorialMedico');
const Mascota = require('../models/Mascota');
const Propietario = require('../models/Propietario');
const Consulta = require('../models/Consulta');
const Vacuna = require('../models/Vacuna');
const Diagnostico = require('../models/Diagnostico');
const Tratamiento = require('../models/Tratamiento');
const Medicamento = require('../models/Medicamento');

exports.getByMascotaId = async (req, res, next) => {
  try {
    const mascotaId = parseInt(req.params.mascotaId, 10);
    const mascota = await Mascota.findById(mascotaId);

    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    const propietario = await Propietario.findById(mascota.propietario_id);
    const historial = await HistorialMedico.findByMascotaId(mascotaId);
    const consultas = await Consulta.findByMascotaId(mascotaId);
    const vacunas = await Vacuna.findByMascotaId(mascotaId);

    return res.status(200).json({
      mascota: {
        id: mascota.id,
        codigo_chip: mascota.codigo_chip,
        nombre: mascota.nombre,
        especie: mascota.especie,
        raza: mascota.raza,
        edad: mascota.edad,
        peso_kg: mascota.peso_kg,
        sexo: mascota.sexo,
        activo: mascota.activo
      },
      propietario: propietario || null,
      historial_base: historial || null,
      resumen_clinico: {
        total_consultas: consultas.length,
        total_vacunas: vacunas.length,
        ultima_atencion: consultas.length > 0 ? consultas[0].fecha : null
      },
      consultas,
      vacunas
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAntecedentes = async (req, res, next) => {
  try {
    const mascotaId = parseInt(req.params.mascotaId, 10);
    const historial = await HistorialMedico.findByMascotaId(mascotaId);

    if (!historial) {
      return res.status(404).json({ error: 'Historial clinico no encontrado para esta mascota' });
    }

    const updated = await HistorialMedico.updateAntecedentes(mascotaId, req.body);

    return res.status(200).json({
      mensaje: 'Antecedentes clinicos actualizados exitosamente',
      historial: updated
    });
  } catch (err) {
    next(err);
  }
};

exports.getReporte = async (req, res, next) => {
  try {
    const mascotaId = parseInt(req.params.mascotaId, 10);
    const mascota = await Mascota.findById(mascotaId);

    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    const propietario = await Propietario.findById(mascota.propietario_id);
    const historial = await HistorialMedico.findByMascotaId(mascotaId);
    const consultas = await Consulta.findByMascotaId(mascotaId);
    const vacunas = await Vacuna.findByMascotaId(mascotaId);

    // Formatear consultas para el reporte asegurando diagnosticos y medicamentos legibles
    const historialConsultas = await Promise.all(
      consultas.map(async (c) => {
        let diagDesc = '';
        let tratDesc = '';
        let medDesc = '';

        if (c.diagnosticos && Array.isArray(c.diagnosticos) && c.diagnosticos.length > 0) {
          diagDesc = c.diagnosticos.map(d => d.descripcion).join('; ');
        } else {
          const diags = await Diagnostico.findByConsultaId(c.id);
          diagDesc = diags.map(d => d.descripcion).join('; ');
        }

        if (c.tratamientos && Array.isArray(c.tratamientos) && c.tratamientos.length > 0) {
          tratDesc = c.tratamientos.map(t => t.descripcion).join('; ');
        }

        if (c.medicamentos && Array.isArray(c.medicamentos) && c.medicamentos.length > 0) {
          medDesc = c.medicamentos.map(m => `${m.nombre} (${m.dosis})`).join(', ');
        } else {
          const meds = await Medicamento.findByConsultaId(c.id);
          medDesc = meds.map(m => `${m.nombre} (${m.dosis})`).join(', ');
        }

        return {
          fecha: c.fecha,
          veterinario: c.veterinario_nombre,
          motivo: c.motivo,
          diagnosticos: diagDesc || 'Evaluacion de rutina',
          tratamientos: tratDesc || 'Sin tratamiento farmacologico',
          medicamentos: medDesc || 'Ninguno'
        };
      })
    );

    return res.status(200).json({
      tipo_reporte: 'HISTORIAL CLINICO VETERINARIO OFICIAL',
      institucion: 'MediMascotas - Sistema de Gestion Clinica',
      fecha_emision: new Date().toISOString(),
      paciente: {
        nombre: mascota.nombre,
        identificador: mascota.codigo_chip,
        especie: mascota.especie,
        raza: mascota.raza,
        edad_anos: mascota.edad,
        peso_kg: mascota.peso_kg
      },
      tutor: propietario ? {
        nombre: propietario.nombre,
        identificacion: propietario.identificacion,
        contacto: propietario.telefono
      } : null,
      cuadro_alergias: historial ? (historial.alergias || []) : [],
      antecedentes_patologicos: historial ? historial.antecedentes : 'Sin registros',
      historial_consultas: historialConsultas,
      esquema_vacunal: vacunas.map(v => ({
        vacuna: v.tipo_vacuna,
        fecha_aplicacion: v.fecha_aplicacion,
        dosis: v.dosis,
        proximo_refuerzo: v.proxima_dosis
      }))
    });
  } catch (err) {
    next(err);
  }
};
