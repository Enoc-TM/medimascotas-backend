// src/controllers/propietariosController.js
const store = require('../data/store');

exports.create = (req, res) => {
  const { identificacion, nombre, telefono, direccion = '', email = '' } = req.body;

  if (!identificacion || !nombre || !telefono) {
    return res.status(400).json({
      error: 'Los campos identificacion, nombre y telefono son obligatorios'
    });
  }

  const existe = store.propietarios.find(p => p.identificacion === identificacion);
  if (existe) {
    return res.status(400).json({
      error: 'RN-02: No se permite registrar dos propietarios con el mismo numero de identificacion'
    });
  }

  const nuevoPropietario = {
    id: store.counters.propietarios++,
    identificacion,
    nombre,
    telefono,
    direccion,
    email,
    activo: true
  };

  store.propietarios.push(nuevoPropietario);

  return res.status(201).json({
    mensaje: 'Propietario registrado exitosamente',
    propietario: nuevoPropietario
  });
};

exports.getAll = (req, res) => {
  const { search } = req.query;
  let list = store.propietarios.filter(p => p.activo !== false);

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p =>
      p.nombre.toLowerCase().includes(q) || p.identificacion.includes(q)
    );
  }

  return res.status(200).json(list);
};

exports.getById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const propietario = store.propietarios.find(p => p.id === id);

  if (!propietario) {
    return res.status(404).json({ error: 'Propietario no encontrado' });
  }

  return res.status(200).json(propietario);
};

exports.update = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const propietario = store.propietarios.find(p => p.id === id);

  if (!propietario) {
    return res.status(404).json({ error: 'Propietario no encontrado' });
  }

  const { nombre, telefono, direccion, email } = req.body;
  if (nombre) propietario.nombre = nombre;
  if (telefono) propietario.telefono = telefono;
  if (direccion !== undefined) propietario.direccion = direccion;
  if (email !== undefined) propietario.email = email;

  return res.status(200).json({
    mensaje: 'Propietario actualizado exitosamente',
    propietario
  });
};

exports.delete = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const propietario = store.propietarios.find(p => p.id === id);

  if (!propietario) {
    return res.status(404).json({ error: 'Propietario no encontrado' });
  }

  propietario.activo = false;
  return res.status(200).json({
    mensaje: 'Propietario inactivado correctamente (eliminacion logica)',
    id
  });
};

exports.getMascotas = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const mascotas = store.mascotas.filter(m => m.propietario_id === id && m.activo !== false);
  return res.status(200).json(mascotas);
};
