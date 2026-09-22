const store = require('../data/store');

exports.create = (req, res) => {
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

  if (!nombre || !especie || propietario_id === undefined) {
    return res.status(400).json({
      error: 'RN-14: Los campos nombre, especie y propietario_id son obligatorios'
    });
  }

  const propietario = store.propietarios.find(p => p.id === parseInt(propietario_id, 10));
  if (!propietario || propietario.activo === false) {
    return res.status(400).json({
      error: 'RN-01: Toda mascota registrada debe estar obligatoriamente asociada a un propietario valido'
    });
  }

  const chipFinal = codigo_chip || ('CHIP-' + Date.now().toString().slice(-6));
  const chipExiste = store.mascotas.find(m => m.codigo_chip === chipFinal);
  if (chipExiste) {
    return res.status(400).json({
      error: 'RN-03: Ya existe una mascota con este identificador unico (codigo_chip)'
    });
  }

  const nuevaMascota = {
    id: store.counters.mascotas++,
    codigo_chip: chipFinal,
    nombre,
    especie,
    raza,
    edad: Number(edad) || 0,
    sexo,
    peso_kg: Number(peso_kg) || 0,
    propietario_id: propietario.id,
    activo: true,
    fecha_registro: new Date().toISOString()
  };

  store.mascotas.push(nuevaMascota);

  const nuevoHistorial = {
    id: store.counters.historiales++,
    mascota_id: nuevaMascota.id,
    antecedentes: req.body.antecedentes || 'Sin antecedentes registrados al momento del alta.',
    alergias: req.body.alergias || [],
    fecha_creacion: new Date().toISOString(),
    observaciones_generales: req.body.observaciones_iniciales || 'Historial clinico inicializado automaticamente.'
  };

  store.historiales.push(nuevoHistorial);

  return res.status(201).json({
    mensaje: 'Mascota registrada exitosamente e historial clinico creado automaticamente',
    mascota: nuevaMascota,
    historial_clinico: nuevoHistorial
  });
};

exports.getAll = (req, res) => {
  const { search, especie } = req.query;
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

  const resultado = list.map(m => {
    const prop = store.propietarios.find(p => p.id === m.propietario_id);
    return {
      ...m,
      propietario_nombre: prop ? prop.nombre : 'Desconocido',
      propietario_identificacion: prop ? prop.identificacion : 'N/A'
    };
  });

  return res.status(200).json(resultado);
};

exports.getById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const mascota = store.mascotas.find(m => m.id === id);

  if (!mascota) {
    return res.status(404).json({ error: 'Mascota no encontrada' });
  }

  const propietario = store.propietarios.find(p => p.id === mascota.propietario_id);
  const historial = store.historiales.find(h => h.mascota_id === mascota.id);

  return res.status(200).json({
    ...mascota,
    propietario: propietario || null,
    historial_id: historial ? historial.id : null
  });
};

exports.update = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const mascota = store.mascotas.find(m => m.id === id);

  if (!mascota) {
    return res.status(404).json({ error: 'Mascota no encontrada' });
  }

  const { nombre, edad, peso_kg, raza, sexo } = req.body;
  if (nombre) mascota.nombre = nombre;
  if (edad !== undefined) mascota.edad = Number(edad);
  if (peso_kg !== undefined) mascota.peso_kg = Number(peso_kg);
  if (raza) mascota.raza = raza;
  if (sexo) mascota.sexo = sexo;

  return res.status(200).json({
    mensaje: 'Datos de la mascota actualizados exitosamente',
    mascota
  });
};

exports.delete = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const mascota = store.mascotas.find(m => m.id === id);

  if (!mascota) {
    return res.status(404).json({ error: 'Mascota no encontrada' });
  }

  const tieneHistorial = store.historiales.some(h => h.mascota_id === id);
  if (tieneHistorial) {
    mascota.activo = false;
    return res.status(200).json({
      mensaje: 'RN-11: La mascota posee historial clinico registrado. Se aplico eliminacion logica (inactiva) para preservar la integridad de los datos.',
      eliminacion_logica: true,
      mascota_id: id,
      activo: false
    });
  }

  const index = store.mascotas.findIndex(m => m.id === id);
  store.mascotas.splice(index, 1);
  return res.status(200).json({
    mensaje: 'Mascota eliminada del sistema',
    mascota_id: id
  });
};
