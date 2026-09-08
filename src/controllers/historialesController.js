const store = require('../data/store');

exports.getByMascotaId = (req, res) => {
  const mascotaId = parseInt(req.params.mascotaId, 10);
  const mascota = store.mascotas.find(m => m.id === mascotaId);

  if (!mascota) {
    return res.status(404).json({ error: 'Mascota no encontrada' });
  }

  const propietario = store.propietarios.find(p => p.id === mascota.propietario_id);
  const historial = store.historiales.find(h => h.mascota_id === mascotaId);
  const consultas = store.consultas.filter(c => c.mascota_id === mascotaId);
  const vacunas = store.vacunas.filter(v => v.mascota_id === mascotaId);

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
      ultima_atencion: consultas.length > 0 ? consultas[consultas.length - 1].fecha : null
    },
    consultas,
    vacunas
  });
};

exports.updateAntecedentes = (req, res) => {
  const mascotaId = parseInt(req.params.mascotaId, 10);
  const historial = store.historiales.find(h => h.mascota_id === mascotaId);

  if (!historial) {
    return res.status(404).json({ error: 'Historial clinico no encontrado para esta mascota' });
  }

  const { antecedentes, alergias, observaciones_generales } = req.body;
  if (antecedentes !== undefined) historial.antecedentes = antecedentes;
  if (alergias !== undefined) historial.alergias = Array.isArray(alergias) ? alergias : [alergias];
  if (observaciones_generales !== undefined) historial.observaciones_generales = observaciones_generales;

  return res.status(200).json({
    mensaje: 'Antecedentes clinicos actualizados exitosamente',
    historial
  });
};

exports.getReporte = (req, res) => {
  const mascotaId = parseInt(req.params.mascotaId, 10);
  const mascota = store.mascotas.find(m => m.id === mascotaId);

  if (!mascota) {
    return res.status(404).json({ error: 'Mascota no encontrada' });
  }

  const propietario = store.propietarios.find(p => p.id === mascota.propietario_id);
  const historial = store.historiales.find(h => h.mascota_id === mascotaId);
  const consultas = store.consultas.filter(c => c.mascota_id === mascotaId);
  const vacunas = store.vacunas.filter(v => v.mascota_id === mascotaId);

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
    cuadro_alergias: historial ? historial.alergias : [],
    antecedentes_patologicos: historial ? historial.antecedentes : 'Sin registros',
    historial_consultas: consultas.map(c => ({
      fecha: c.fecha,
      veterinario: c.veterinario_nombre,
      motivo: c.motivo,
      diagnosticos: c.diagnosticos.map(d => d.descripcion).join('; '),
      tratamientos: c.tratamientos.map(t => t.descripcion).join('; '),
      medicamentos: c.medicamentos.map(m => m.nombre + ' (' + m.dosis + ')').join(', ')
    })),
    esquema_vacunal: vacunas.map(v => ({
      vacuna: v.tipo_vacuna,
      fecha_aplicacion: v.fecha_aplicacion,
      dosis: v.dosis,
      proximo_refuerzo: v.proxima_dosis
    }))
  });
};
