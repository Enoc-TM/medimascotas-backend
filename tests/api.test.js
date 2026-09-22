const http = require('http');
const assert = require('assert');
const app = require('../src/app');

let server;
let BASE_URL;

async function request(path, options = {}) {
  const url = BASE_URL + path;
  const defaultHeaders = { 'Content-Type': 'application/json' };

  const res = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const status = res.status;
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }
  return { status, data };
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 INICIANDO SUITE DE PRUEBAS AUTOMATIZADAS MEDIMASCOTAS');
  console.log('   Equipo: Enoc Tamayo, Esteban Fierro, Santiago Avila');
  console.log('======================================================\n');

  server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  BASE_URL = 'http://localhost:' + port;
  console.log('Servidor de pruebas escuchando en ' + BASE_URL + '\n');

  let totalTests = 0;
  let passedTests = 0;

  async function test(nombre, fn) {
    totalTests++;
    try {
      await fn();
      passedTests++;
      console.log('  ✓ [PASS] ' + nombre);
    } catch (err) {
      console.error('  ✗ [FAIL] ' + nombre);
      console.error('    -> ' + err.message);
    }
  }

  // --- TESTS EXISTENTES ---

  await test('1. GET / - Servidor responde 200 con estado OK', async () => {
    const res = await request('/');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.estado, 'ok');
  });

  await test('2. GET /api - Servidor retorna mapa completo con 10 endpoints REST', async () => {
    const res = await request('/api');
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.endpoints_disponibles);
    assert.ok(res.data.endpoints_disponibles.diagnosticos);
    assert.ok(res.data.endpoints_disponibles.tratamientos);
    assert.ok(res.data.endpoints_disponibles.medicamentos);
    assert.ok(res.data.endpoints_disponibles.recordatorios);
  });

  await test('3. POST /api/auth/register - Registro de nuevo usuario (RF-01, CU-01)', async () => {
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: {
        nombre: 'Dra. Camila Gomez',
        email: 'camila.gomez@medimascotas.com',
        password: 'ClaveSegura2026!',
        rol: 'veterinario',
        telefono: '3209991122'
      }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.usuario.email, 'camila.gomez@medimascotas.com');
    assert.strictEqual(res.data.usuario.password, undefined);
  });

  await test('4. POST /api/auth/login - Inicio de sesion correcto (RF-01, CU-01)', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'camila.gomez@medimascotas.com',
        password: 'ClaveSegura2026!'
      }
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.token);
  });

  await test('5. POST /api/propietarios - Registrar nuevo propietario (RF-03, CU-02)', async () => {
    const res = await request('/api/propietarios', {
      method: 'POST',
      body: {
        identificacion: '52998811',
        nombre: 'Laura Marcela Ortiz',
        telefono: '3118889900',
        direccion: 'Av Boyaca # 170-40',
        email: 'laura.ortiz@gmail.com'
      }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.propietario.identificacion, '52998811');
  });

  await test('6. RN-02: Validar rechazo de propietario con documento duplicado', async () => {
    const res = await request('/api/propietarios', {
      method: 'POST',
      body: {
        identificacion: '52998811',
        nombre: 'Persona Duplicada',
        telefono: '3001112233'
      }
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.error.includes('RN-02'));
  });

  await test('7. POST /api/mascotas - Registrar mascota y autogenerar historial (RF-04, CU-03, RN-04)', async () => {
    const res = await request('/api/mascotas', {
      method: 'POST',
      body: {
        nombre: 'Rocky',
        especie: 'Canino',
        raza: 'Labrador Retriever',
        edad: 4,
        sexo: 'Macho',
        peso_kg: 32.0,
        propietario_id: 1,
        codigo_chip: 'CHIP-LAB-7744'
      }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.mascota.nombre, 'Rocky');
    assert.ok(res.data.historial_clinico);
    assert.strictEqual(res.data.historial_clinico.mascota_id, res.data.mascota.id);
  });

  await test('8. RN-01: Rechazo de registro de mascota sin propietario valido', async () => {
    const res = await request('/api/mascotas', {
      method: 'POST',
      body: {
        nombre: 'Fantasma',
        especie: 'Felino',
        propietario_id: 9999
      }
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.error.includes('RN-01'));
  });

  await test('9. GET /api/mascotas?search=... - Busqueda por nombre o documento tutor (RF-12)', async () => {
    const res = await request('/api/mascotas?search=Lucas');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data));
    assert.ok(res.data.some(m => m.nombre === 'Lucas'));
  });

  await test('10. POST /api/consultas - Registrar consulta valida con diagnostico (RF-06, RF-07, CU-04, RN-07)', async () => {
    const res = await request('/api/consultas', {
      method: 'POST',
      body: {
        mascota_id: 1,
        veterinario_id: 1,
        fecha: '2026-03-01',
        hora: '11:00',
        motivo: 'Tos ocasional y estornudos',
        observaciones: 'Auscultacion toracica con leves sibilancias.',
        diagnosticos: [
          { descripcion: 'Traqueobronquitis infecciosa canina leve', gravedad: 'leve' }
        ],
        tratamientos: [
          { descripcion: 'Nebulizaciones y reposo relativo', duracion: '5 dias' }
        ],
        medicamentos: [
          { nombre: 'Antitusigeno Jarabe', dosis: '5ml', frecuencia: 'Cada 8 horas', duracion: '5 dias' }
        ]
      }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.consulta.diagnosticos.length, 1);
    assert.strictEqual(res.data.consulta.medicamentos.length, 1);
  });

  await test('11. RN-07: Rechazo de consulta sin diagnosticos obligatorios', async () => {
    const res = await request('/api/consultas', {
      method: 'POST',
      body: {
        mascota_id: 1,
        veterinario_id: 1,
        fecha: '2026-03-02',
        motivo: 'Chequeo rapido',
        diagnosticos: []
      }
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.error.includes('RN-07'));
  });

  await test('12. RN-05: Rechazo de consulta para mascota inexistente', async () => {
    const res = await request('/api/consultas', {
      method: 'POST',
      body: {
        mascota_id: 8888,
        veterinario_id: 1,
        fecha: '2026-03-02',
        motivo: 'Revision',
        diagnosticos: [{ descripcion: 'Gripe' }]
      }
    });
    assert.strictEqual(res.status, 404);
    assert.ok(res.data.error.includes('RN-05'));
  });

  await test('13. POST /api/vacunas - Registrar vacuna en carnet (RF-10, CU-06, RN-10)', async () => {
    const res = await request('/api/vacunas', {
      method: 'POST',
      body: {
        mascota_id: 1,
        tipo_vacuna: 'Tos de las Perras (Bordetella)',
        fecha_aplicacion: '2026-03-01',
        dosis: '1 dosis intranasal',
        proxima_dosis: '2027-03-01',
        veterinario_id: 1
      }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.vacuna.tipo_vacuna, 'Tos de las Perras (Bordetella)');
  });

  await test('14. RN-10: Rechazo de vacuna para mascota no registrada', async () => {
    const res = await request('/api/vacunas', {
      method: 'POST',
      body: {
        mascota_id: 7777,
        tipo_vacuna: 'Parvovirus',
        fecha_aplicacion: '2026-03-01'
      }
    });
    assert.strictEqual(res.status, 404);
    assert.ok(res.data.error.includes('RN-10'));
  });

  // --- NUEVOS TESTS DE CONTROLADORES Y MODELOS SOLICITADOS ---

  await test('15. POST /api/diagnosticos - Registrar diagnostico individual (RF-07, RN-07)', async () => {
    const res = await request('/api/diagnosticos', {
      method: 'POST',
      body: {
        consulta_id: 1,
        descripcion: 'Dermatitis atopica estacional',
        gravedad: 'moderada'
      }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.diagnostico.descripcion, 'Dermatitis atopica estacional');
  });

  await test('16. POST /api/tratamientos - RN-08: Registrar tratamiento vinculado a diagnostico (RF-08)', async () => {
    const res = await request('/api/tratamientos', {
      method: 'POST',
      body: {
        diagnostico_id: 1,
        descripcion: 'Banos medicados con champu de clorhexidina 3%',
        duracion: '15 dias'
      }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.tratamiento.diagnostico_id, 1);
  });

  await test('17. RN-08: Rechazo de tratamiento para diagnostico inexistente', async () => {
    const res = await request('/api/tratamientos', {
      method: 'POST',
      body: {
        diagnostico_id: 99999,
        descripcion: 'Tratamiento sin diagnostico'
      }
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.error.includes('RN-08'));
  });

  await test('18. POST /api/medicamentos - RN-09: Formular medicamento dentro de consulta (RF-09)', async () => {
    const res = await request('/api/medicamentos', {
      method: 'POST',
      body: {
        consulta_id: 1,
        nombre: 'Cefalexina 500mg',
        dosis: '1 tableta',
        frecuencia: 'Cada 12 horas',
        duracion: '10 dias',
        indicaciones: 'Administrar con comida para evitar molestias gastricas'
      }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.medicamento.nombre, 'Cefalexina 500mg');
  });

  await test('19. RN-09: Rechazo de medicamento fuera de consulta valida', async () => {
    const res = await request('/api/medicamentos', {
      method: 'POST',
      body: {
        consulta_id: 99999,
        nombre: 'Medicamento Fantasma'
      }
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.error.includes('RN-09'));
  });

  await test('20. POST /api/recordatorios - Programar recordatorio para mascota', async () => {
    const res = await request('/api/recordatorios', {
      method: 'POST',
      body: {
        mascota_id: 1,
        tipo: 'vacuna',
        titulo: 'Refuerzo Quintuple Canina',
        descripcion: 'Acudir a la clinica en ayunas leves',
        fecha_recordatorio: '2027-01-15'
      }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.recordatorio.titulo, 'Refuerzo Quintuple Canina');
    assert.strictEqual(res.data.recordatorio.estado, 'pendiente');
  });

  await test('21. GET /api/recordatorios/mascota/:mascotaId - Consultar recordatorios de mascota', async () => {
    const res = await request('/api/recordatorios/mascota/1');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data));
    assert.ok(res.data.length >= 1);
  });

  await test('22. PUT /api/recordatorios/:id - Marcar recordatorio como completado', async () => {
    const res = await request('/api/recordatorios/1', {
      method: 'PUT',
      body: { estado: 'completado' }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.recordatorio.estado, 'completado');
  });

  await test('23. GET /api/historiales/:mascotaId - Ficha clinica consolidada (RF-11, CU-05)', async () => {
    const res = await request('/api/historiales/1');
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.mascota);
    assert.ok(res.data.propietario);
    assert.ok(res.data.consultas.length >= 2);
    assert.ok(res.data.vacunas.length >= 3);
  });

  await test('24. GET /api/historiales/:mascotaId/reporte - Reporte clinico oficial (RF-15)', async () => {
    const res = await request('/api/historiales/1/reporte');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.tipo_reporte, 'HISTORIAL CLINICO VETERINARIO OFICIAL');
    assert.ok(res.data.historial_consultas);
    assert.ok(res.data.esquema_vacunal);
  });

  await test('25. DELETE /api/mascotas/:id - RN-11: Borrado logico de mascota con historial', async () => {
    const res = await request('/api/mascotas/1', {
      method: 'DELETE'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.eliminacion_logica, true);
    assert.strictEqual(res.data.activo, false);
  });

  await test('26. GET /ruta-inexistente - Manejador 404 estructurado', async () => {
    const res = await request('/ruta-inexistente');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.error, 'Ruta no encontrada');
  });

  await new Promise(resolve => server.close(resolve));

  console.log('\n------------------------------------------------------');
  console.log('📊 RESULTADOS FINALES: ' + passedTests + ' de ' + totalTests + ' pruebas aprobadas exitosamente.');
  console.log('------------------------------------------------------\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Error fatal al ejecutar suite de pruebas:', err);
  if (server) server.close();
  process.exit(1);
});
