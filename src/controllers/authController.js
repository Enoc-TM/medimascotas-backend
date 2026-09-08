const store = require('../data/store');

exports.register = (req, res) => {
  const { nombre, email, password, rol = 'propietario', telefono = '' } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({
      error: 'Campos obligatorios incompletos: nombre, email y password son requeridos'
    });
  }

  const existe = store.usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existe) {
    return res.status(400).json({
      error: 'Ya existe un usuario registrado con este correo electronico'
    });
  }

  const nuevoUsuario = {
    id: store.counters.usuarios++,
    nombre,
    email: email.toLowerCase(),
    password,
    rol: ['admin', 'veterinario', 'propietario'].includes(rol) ? rol : 'propietario',
    telefono,
    fecha_creacion: new Date().toISOString()
  };

  store.usuarios.push(nuevoUsuario);

  const { password: _, ...usuarioSinPass } = nuevoUsuario;
  return res.status(201).json({
    mensaje: 'Usuario registrado exitosamente',
    usuario: usuarioSinPass
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Debe ingresar email y password'
    });
  }

  const usuario = store.usuarios.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!usuario) {
    return res.status(401).json({
      error: 'Credenciales invalidas: correo o contrasena incorrectos'
    });
  }

  const { password: _, ...usuarioSinPass } = usuario;
  return res.status(200).json({
    mensaje: 'Inicio de sesion exitoso',
    token: 'mock-jwt-token-' + usuario.id + '-' + Date.now(),
    usuario: usuarioSinPass
  });
};

exports.getPerfil = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const usuario = store.usuarios.find(u => u.id === id);

  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const { password: _, ...usuarioSinPass } = usuario;
  return res.status(200).json(usuarioSinPass);
};

exports.updatePerfil = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const usuario = store.usuarios.find(u => u.id === id);

  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const { nombre, telefono } = req.body;
  if (nombre) usuario.nombre = nombre;
  if (telefono) usuario.telefono = telefono;

  const { password: _, ...usuarioSinPass } = usuario;
  return res.status(200).json({
    mensaje: 'Perfil actualizado correctamente',
    usuario: usuarioSinPass
  });
};

exports.getUsuarios = (req, res) => {
  const { rol } = req.query;
  let list = store.usuarios;
  if (rol) {
    list = list.filter(u => u.rol === rol);
  }
  const sanitizado = list.map(({ password, ...u }) => u);
  return res.status(200).json(sanitizado);
};
