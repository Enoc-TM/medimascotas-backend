// src/data/store.js
// Almacenamiento en memoria para simular y respaldar la persistencia relacional MySQL
// con soporte para integridad referencial y las 15 Reglas de Negocio (RN-01 a RN-15).
// Autores del equipo: Enoc Tamayo, Esteban Fierro, Santiago Avila

class DataStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.counters = {
      usuarios: 1,
      propietarios: 1,
      mascotas: 1,
      historiales: 1,
      consultas: 1,
      diagnosticos: 1,
      tratamientos: 1,
      medicamentos: 1,
      vacunas: 1,
      recordatorios: 1
    };

    this.usuarios = [
      {
        id: this.counters.usuarios++,
        nombre: 'Dr. Santiago Avila Ramirez',
        email: 'santiago.avila@medimascotas.com',
        password: 'Password123!',
        rol: 'veterinario',
        telefono: '3101234567',
        fecha_creacion: new Date('2026-01-10T08:00:00Z').toISOString()
      },
      {
        id: this.counters.usuarios++,
        nombre: 'Enoc Tamayo',
        email: 'enoc.tamayo@medimascotas.com',
        password: 'AdminPassword123!',
        rol: 'admin',
        telefono: '3129876543',
        fecha_creacion: new Date('2026-01-01T08:00:00Z').toISOString()
      },
      {
        id: this.counters.usuarios++,
        nombre: 'Esteban Fierro',
        email: 'esteban.fierro@medimascotas.com',
        password: 'UserPass123!',
        rol: 'propietario',
        telefono: '3157778899',
        fecha_creacion: new Date('2026-02-01T10:00:00Z').toISOString()
      }
    ];

    this.propietarios = [
      {
        id: this.counters.propietarios++,
        identificacion: '1010203040',
        nombre: 'Esteban Fierro',
        telefono: '3157778899',
        direccion: 'Calle 45 # 12-34, Bogota',
        email: 'esteban.fierro@gmail.com',
        activo: true
      },
      {
        id: this.counters.propietarios++,
        identificacion: '1098765432',
        nombre: 'Enoc Tamayo',
        telefono: '3164445566',
        direccion: 'Carrera 15 # 80-20, Bogota',
        email: 'enoc.tamayo@gmail.com',
        activo: true
      }
    ];

    this.mascotas = [
      {
        id: this.counters.mascotas++,
        codigo_chip: 'CHIP-982101',
        nombre: 'Lucas',
        especie: 'Canino',
        raza: 'Golden Retriever',
        edad: 3,
        sexo: 'Macho',
        peso_kg: 28.5,
        propietario_id: 1,
        activo: true,
        fecha_registro: new Date('2026-02-05T09:00:00Z').toISOString()
      },
      {
        id: this.counters.mascotas++,
        codigo_chip: 'CHIP-451299',
        nombre: 'Mishi',
        especie: 'Felino',
        raza: 'Siames',
        edad: 2,
        sexo: 'Hembra',
        peso_kg: 4.2,
        propietario_id: 2,
        activo: true,
        fecha_registro: new Date('2026-02-10T14:30:00Z').toISOString()
      }
    ];

    this.historiales = [
      {
        id: this.counters.historiales++,
        mascota_id: 1,
        antecedentes: 'Sin cirugias previas. Desparasitacion al dia.',
        alergias: ['Polen'],
        fecha_creacion: new Date('2026-02-05T09:05:00Z').toISOString(),
        observaciones_generales: 'Paciente canino en condicion corporal optima.'
      },
      {
        id: this.counters.historiales++,
        mascota_id: 2,
        antecedentes: 'Esterilizada.',
        alergias: [],
        fecha_creacion: new Date('2026-02-10T14:35:00Z').toISOString(),
        observaciones_generales: 'Paciente felina sana y activa.'
      }
    ];

    this.diagnosticos = [
      {
        id: this.counters.diagnosticos++,
        consulta_id: 1,
        descripcion: 'Paciente sano en optimas condiciones generales',
        gravedad: 'leve',
        fecha: '2026-02-15'
      }
    ];

    this.tratamientos = [
      {
        id: this.counters.tratamientos++,
        diagnostico_id: 1,
        descripcion: 'Mantener dieta balanceada y ejercicio moderado',
        duracion: 'Permanente',
        fecha_inicio: '2026-02-15',
        fecha_fin: null
      }
    ];

    this.medicamentos = [
      {
        id: this.counters.medicamentos++,
        consulta_id: 1,
        nombre: 'Suplemento de Omega 3',
        dosis: '1 capsula diaria',
        frecuencia: 'Cada 24 horas',
        duracion: '30 dias',
        indicaciones: 'Administrar junto con el alimento de la manana'
      }
    ];

    this.consultas = [
      {
        id: this.counters.consultas++,
        historial_id: 1,
        mascota_id: 1,
        veterinario_id: 1,
        veterinario_nombre: 'Dr. Santiago Avila Ramirez',
        fecha: '2026-02-15',
        hora: '10:30',
        motivo: 'Revision general y control de peso',
        observaciones: 'El paciente se encuentra animado, pelaje brillante, mucosas normocoloreadas.',
        diagnosticos: [this.diagnosticos[0]],
        tratamientos: [this.tratamientos[0]],
        medicamentos: [this.medicamentos[0]],
        estado: 'completada'
      }
    ];

    this.vacunas = [
      {
        id: this.counters.vacunas++,
        mascota_id: 1,
        tipo_vacuna: 'Rabia',
        fecha_aplicacion: '2026-02-15',
        dosis: 'Refuerzo anual',
        proxima_dosis: '2027-02-15',
        veterinario_id: 1,
        observaciones: 'Vacunacion sin reacciones adversas inmediatas.'
      },
      {
        id: this.counters.vacunas++,
        mascota_id: 1,
        tipo_vacuna: 'Multiple Canina (DHPP)',
        fecha_aplicacion: '2026-02-15',
        dosis: 'Refuerzo anual',
        proxima_dosis: '2027-02-15',
        veterinario_id: 1,
        observaciones: 'Tolerancia adecuada.'
      }
    ];

    this.recordatorios = [
      {
        id: this.counters.recordatorios++,
        mascota_id: 1,
        tipo: 'vacuna',
        titulo: 'Proxima dosis de Vacuna Rabia',
        descripcion: 'Refuerzo anual obligatorio',
        fecha_recordatorio: '2027-02-15',
        estado: 'pendiente'
      },
      {
        id: this.counters.recordatorios++,
        mascota_id: 2,
        tipo: 'consulta',
        titulo: 'Chequeo semestral felino',
        descripcion: 'Revision dental y renal preventiva',
        fecha_recordatorio: '2026-08-10',
        estado: 'pendiente'
      }
    ];
  }
}

const store = new DataStore();
module.exports = store;
