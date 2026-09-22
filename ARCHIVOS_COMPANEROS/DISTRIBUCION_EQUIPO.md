# DISTRIBUCIÓN OFICIAL DEL PROYECTO MEDIMASCOTAS PARA GIT

**Integrantes del Equipo (3 miembros):**
1. **Enoc Tamayo** (Líder / Arquitectura Core, Autenticación y Propietarios)
2. **Esteban Fierro** (Desarrollador / Consultas, Tratamientos y Vacunas)
3. **Santiago Avila** (Desarrollador / Mascotas, Historiales, Diagnósticos, Medicamentos y Recordatorios)

---

## 1. Reparto de Responsabilidades y Componentes

| Integrante | Módulos Asignados | Modelos (`src/models/`) | Controladores (`src/controllers/`) | Rutas (`src/routes/`) | Rama Git Asignada |
|---|---|---|---|---|---|
| **Enoc Tamayo** | Usuarios, Auth, Propietarios, Base de Datos MySQL | `Usuario.js`<br>`Propietario.js` | `authController.js`<br>`propietariosController.js` | `authRoutes.js`<br>`propietariosRoutes.js` | `feature/enoc-auth-propietarios` |
| **Esteban Fierro** | Consultas, Tratamientos, Vacunas | `Consulta.js`<br>`Tratamiento.js`<br>`Vacuna.js` | `consultasController.js`<br>`tratamientosController.js`<br>`vacunasController.js` | `consultasRoutes.js`<br>`tratamientosRoutes.js`<br>`vacunasRoutes.js` | `feature/esteban-consultas-vacunas-tratamientos` |
| **Santiago Avila**| Mascotas, Historiales, Diagnósticos, Medicamentos, Recordatorios | `Mascota.js`<br>`HistorialMedico.js`<br>`Diagnostico.js`<br>`Medicamento.js`<br>`Recordatorio.js` | `mascotasController.js`<br>`historialesController.js`<br>`diagnosticosController.js`<br>`medicamentosController.js`<br>`recordatoriosController.js` | `mascotasRoutes.js`<br>`historialesRoutes.js`<br>`diagnosticosRoutes.js`<br>`medicamentosRoutes.js`<br>`recordatoriosRoutes.js` | `feature/santiago-mascotas-historial-diagnosticos` |

---

## 2. Mapa de Endpoints Asignados

### A. Enoc Tamayo
- `POST /api/auth/register` (Registro de usuarios)
- `POST /api/auth/login` (Inicio de sesión)
- `GET /api/auth/perfil/:id` (Perfil de usuario)
- `PUT /api/auth/perfil/:id` (Actualizar perfil)
- `GET /api/auth/usuarios` (Listado con filtro por rol)
- `POST /api/propietarios` (Registrar propietario - RN-02)
- `GET /api/propietarios` (Listado con búsqueda - RF-12)
- `GET /api/propietarios/:id` (Detalle propietario)
- `PUT /api/propietarios/:id` (Actualizar datos de contacto)
- `DELETE /api/propietarios/:id` (Inactivación lógica - RF-14)
- `GET /api/propietarios/:id/mascotas` (Mascotas asociadas)

### B. Esteban Fierro
- `POST /api/consultas` (Registro de consulta - RF-06, RN-05, RN-06, RN-07)
- `GET /api/consultas` (Listar todas las consultas)
- `GET /api/consultas/:id` (Detalle de consulta)
- `GET /api/consultas/mascota/:mascotaId` (Consultas de una mascota)
- `PUT /api/consultas/:id` (Actualizar estado u observaciones)
- `POST /api/tratamientos` (Registrar tratamiento vinculado a diagnóstico - RN-08)
- `GET /api/tratamientos` (Listar tratamientos)
- `GET /api/tratamientos/:id` (Detalle de tratamiento)
- `GET /api/tratamientos/diagnostico/:diagnosticoId` (Tratamientos por diagnóstico)
- `PUT /api/tratamientos/:id` (Actualizar tratamiento)
- `DELETE /api/tratamientos/:id` (Eliminar tratamiento)
- `POST /api/vacunas` (Registrar vacuna en carnet - RF-10, RN-10, RN-15)
- `GET /api/vacunas` (Listado general de vacunas)
- `GET /api/vacunas/:id` (Detalle vacuna)
- `GET /api/vacunas/mascota/:mascotaId` (Carnet vacunal de mascota)

### C. Santiago Avila
- `POST /api/mascotas` (Registrar mascota + auto-historial - RN-01, RN-03, RN-04)
- `GET /api/mascotas` (Listar con búsqueda por nombre o cédula - RF-12)
- `GET /api/mascotas/:id` (Detalle con tutor e historial)
- `PUT /api/mascotas/:id` (Actualizar edad, peso, raza)
- `DELETE /api/mascotas/:id` (Borrado lógico si tiene historial - RN-11)
- `GET /api/historiales/:mascotaId` (Expediente consolidado - RF-11)
- `PUT /api/historiales/:mascotaId/antecedentes` (Actualizar antecedentes y alergias)
- `GET /api/historiales/:mascotaId/reporte` (Reporte clínico oficial imprimible - RF-15)
- `POST /api/diagnosticos` (Registrar diagnóstico en consulta - RF-07, RN-07)
- `GET /api/diagnosticos` (Listar diagnósticos)
- `GET /api/diagnosticos/:id` (Detalle diagnóstico)
- `GET /api/diagnosticos/consulta/:consultaId` (Diagnósticos por consulta)
- `PUT /api/diagnosticos/:id` (Actualizar diagnóstico)
- `DELETE /api/diagnosticos/:id` (Eliminar diagnóstico)
- `POST /api/medicamentos` (Formular medicamento dentro de consulta - RN-09)
- `GET /api/medicamentos` (Listar medicamentos)
- `GET /api/medicamentos/:id` (Detalle medicamento)
- `GET /api/medicamentos/consulta/:consultaId` (Medicamentos de una consulta)
- `PUT /api/medicamentos/:id` (Actualizar medicamento)
- `DELETE /api/medicamentos/:id` (Eliminar formulación)
- `POST /api/recordatorios` (Programar recordatorio de vacuna/cita/tratamiento)
- `GET /api/recordatorios` (Listar recordatorios con filtro `?estado=`)
- `GET /api/recordatorios/:id` (Detalle recordatorio)
- `GET /api/recordatorios/mascota/:mascotaId` (Recordatorios de mascota)
- `PUT /api/recordatorios/:id` (Actualizar / marcar completado)
- `DELETE /api/recordatorios/:id` (Eliminar recordatorio)

---

## 3. Instrucciones Paso a Paso para Git y GitHub

### Paso 1: Enoc (Líder del Proyecto)
Sube los cambios de la arquitectura y sus módulos a su rama:
```bash
git checkout -b feature/enoc-auth-propietarios
git add .
git commit -m "feat(enoc): arquitectura MVC, conexion MySQL, modelos Usuario/Propietario y endpoints auth"
git push -u origin feature/enoc-auth-propietarios
```

### Paso 2: Esteban Fierro
1. Clona el repositorio:
   ```bash
   git clone https://github.com/Enoc-TM/medimascotas-backend.git
   cd medimascotas-backend
   npm install
   ```
2. Crea su rama de trabajo:
   ```bash
   git checkout -b feature/esteban-consultas-vacunas-tratamientos
   ```
3. Copia los archivos de `ARCHIVOS_COMPANEROS/PARA_ESTEBAN/src/` a la carpeta `src/` del repositorio.
4. Hace commit y push:
   ```bash
   git add .
   git commit -m "feat(esteban): implementacion de modelos, controladores y rutas para Consultas, Tratamientos y Vacunas"
   git push -u origin feature/esteban-consultas-vacunas-tratamientos
   ```
5. En GitHub abre el Pull Request hacia `main`.

### Paso 3: Santiago Avila
1. Clona el repositorio:
   ```bash
   git clone https://github.com/Enoc-TM/medimascotas-backend.git
   cd medimascotas-backend
   npm install
   ```
2. Crea su rama de trabajo:
   ```bash
   git checkout -b feature/santiago-mascotas-historial-diagnosticos
   ```
3. Copia los archivos de `ARCHIVOS_COMPANEROS/PARA_SANTIAGO/src/` a la carpeta `src/` del repositorio.
4. Hace commit y push:
   ```bash
   git add .
   git commit -m "feat(santiago): implementacion de modelos, controladores y rutas para Mascotas, Historiales, Diagnosticos, Medicamentos y Recordatorios"
   git push -u origin feature/santiago-mascotas-historial-diagnosticos
   ```
5. En GitHub abre el Pull Request hacia `main`.
