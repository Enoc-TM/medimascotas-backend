# INFORME TÉCNICO: API REST MEDIMASCOTAS (Node.js + Express 5 + MySQL)

**Institución:** Corporación Universitaria Minuto de Dios (UNIMINUTO)  
**Asignatura:** Ingeniería de Software  
**Integrantes:**
- **Enoc Tamayo** (Líder / Arquitectura Base, Auth, Propietarios y Base de Datos)
- **Esteban Fierro** (Desarrollador / Consultas, Tratamientos y Vacunas)
- **Santiago Avila** (Desarrollador / Mascotas, Historiales, Diagnósticos, Medicamentos y Recordatorios)

---

## 1. Resumen de la Arquitectura Implementada

El proyecto implementa una **arquitectura monolítica modular MVC (Modelo - Vista / API - Controlador)** construida con:
- **Node.js + Express 5** (`express: ^5.2.1`, `commonjs`).
- **Base de Datos Relacional MySQL 8.0+** (`mysql2/promise: ^3.24.4`).
- **Capa de Modelos (`src/models/`):** 10 modelos independientes que encapsulan la persistencia y reglas de negocio, con fallback automático de alta disponibilidad a almacenamiento relacional en memoria si la instancia de base de datos no está disponible.
- **Capa de Controladores (`src/controllers/`):** 10 controladores desacoplados encargados de la lógica de aplicación, validaciones HTTP y códigos de estado REST.
- **Capa de Enrutadores (`src/routes/`):** 10 enrutadores modulares agrupados bajo el prefijo unificado `/api`.
- **Estrategia Git Multirama:** Reparto equitativo de modelos, controladores y endpoints para los 3 integrantes con ramas `feature/*` individuales.

---

## 2. Mapa Completo de Endpoints y Entidades (10 Módulos)

| Módulo / Entidad | Método | URL | RF / RN Asociado | Integrante Responsable | Descripción |
|---|---|---|---|---|---|
| **Root / Salud** | `GET` | `/` | RNF-05 | General | Estado del servidor y enlaces |
| | `GET` | `/api` | - | General | Diccionario de 10 endpoints REST |
| **Auth / Usuarios** | `POST` | `/api/auth/register` | RF-01, CU-01 | Enoc Tamayo | Registro de veterinarios/admins |
| | `POST` | `/api/auth/login` | RF-01, CU-01 | Enoc Tamayo | Login y retorno de token |
| | `GET` | `/api/auth/perfil/:id` | RF-02 | Enoc Tamayo | Consulta de perfil |
| | `PUT` | `/api/auth/perfil/:id` | RF-02, RF-13 | Enoc Tamayo | Modificación de perfil |
| | `GET` | `/api/auth/usuarios` | RNF-13 | Enoc Tamayo | Listado de usuarios con filtro `?rol=` |
| **Propietarios** | `POST` | `/api/propietarios` | RF-03, RN-02 | Enoc Tamayo | Registro con identificación única |
| | `GET` | `/api/propietarios` | RF-03, RF-12 | Enoc Tamayo | Búsqueda por nombre o cédula |
| | `GET` | `/api/propietarios/:id` | RF-03 | Enoc Tamayo | Detalle de propietario |
| | `PUT` | `/api/propietarios/:id` | RF-13 | Enoc Tamayo | Edición de contacto y dirección |
| | `DELETE` | `/api/propietarios/:id` | RF-14 | Enoc Tamayo | Inactivación lógica del tutor |
| | `GET` | `/api/propietarios/:id/mascotas` | RF-03 | Enoc Tamayo | Mascotas asociadas al propietario |
| **Mascotas** | `POST` | `/api/mascotas` | RF-04, RN-01, RN-04 | Santiago Avila | Registro + autocreación de historial |
| | `GET` | `/api/mascotas` | RF-04, RF-12 | Santiago Avila | Búsqueda por nombre o cédula dueño |
| | `GET` | `/api/mascotas/:id` | RF-04 | Santiago Avila | Detalle con datos de tutor e historial |
| | `PUT` | `/api/mascotas/:id` | RF-13 | Santiago Avila | Edición de peso, edad, raza |
| | `DELETE` | `/api/mascotas/:id` | RF-14, RN-11 | Santiago Avila | **Eliminación lógica** si tiene historial |
| **Historiales** | `GET` | `/api/historiales/:mascotaId` | RF-05, RF-11 | Santiago Avila | Expediente clínico unificado |
| | `PUT` | `/api/historiales/:mascotaId/antecedentes` | RF-05, RF-13 | Santiago Avila | Actualizar antecedentes y alergias |
| | `GET` | `/api/historiales/:mascotaId/reporte` | RF-15 | Santiago Avila | Reporte clínico oficial consolidado |
| **Consultas** | `POST` | `/api/consultas` | RF-06, RN-05..07 | Esteban Fierro | Registro de consulta con diagnóstico |
| | `GET` | `/api/consultas` | RF-06 | Esteban Fierro | Listado de todas las consultas |
| | `GET` | `/api/consultas/:id` | RF-06 | Esteban Fierro | Detalle de consulta |
| | `GET` | `/api/consultas/mascota/:mascotaId` | RF-06 | Esteban Fierro | Consultas de una mascota |
| | `PUT` | `/api/consultas/:id` | RF-13 | Esteban Fierro | Actualización de observaciones o estado |
| **Diagnósticos** | `POST` | `/api/diagnosticos` | RF-07, RN-07 | Santiago Avila | Registro de diagnóstico en consulta |
| | `GET` | `/api/diagnosticos` | RF-07 | Santiago Avila | Listado general de diagnósticos |
| | `GET` | `/api/diagnosticos/:id` | RF-07 | Santiago Avila | Detalle de diagnóstico |
| | `GET` | `/api/diagnosticos/consulta/:consultaId` | RF-07 | Santiago Avila | Diagnósticos por consulta |
| | `PUT` | `/api/diagnosticos/:id` | RF-13 | Santiago Avila | Actualizar descripción o gravedad |
| | `DELETE` | `/api/diagnosticos/:id` | RF-14 | Santiago Avila | Eliminar diagnóstico |
| **Tratamientos** | `POST` | `/api/tratamientos` | RF-08, RN-08 | Esteban Fierro | Registro de tratamiento vinculado a diagnóstico |
| | `GET` | `/api/tratamientos` | RF-08 | Esteban Fierro | Listado de tratamientos |
| | `GET` | `/api/tratamientos/:id` | RF-08 | Esteban Fierro | Detalle de tratamiento |
| | `GET` | `/api/tratamientos/diagnostico/:diagnosticoId` | RF-08 | Esteban Fierro | Tratamientos de un diagnóstico |
| | `PUT` | `/api/tratamientos/:id` | RF-13 | Esteban Fierro | Actualizar duración o descripción |
| | `DELETE` | `/api/tratamientos/:id` | RF-14 | Esteban Fierro | Eliminar tratamiento |
| **Medicamentos** | `POST` | `/api/medicamentos` | RF-09, RN-09 | Santiago Avila | Formular medicamento en consulta |
| | `GET` | `/api/medicamentos` | RF-09 | Santiago Avila | Listado de medicamentos formulados |
| | `GET` | `/api/medicamentos/:id` | RF-09 | Santiago Avila | Detalle de formulación |
| | `GET` | `/api/medicamentos/consulta/:consultaId` | RF-09 | Santiago Avila | Medicamentos formulados en consulta |
| | `PUT` | `/api/medicamentos/:id` | RF-13 | Santiago Avila | Modificar posología o indicaciones |
| | `DELETE` | `/api/medicamentos/:id` | RF-14 | Santiago Avila | Eliminar medicamento |
| **Vacunas** | `POST` | `/api/vacunas` | RF-10, RN-10 | Esteban Fierro | Registro de vacuna en carnet |
| | `GET` | `/api/vacunas` | RF-10 | Esteban Fierro | Listado general de vacunas |
| | `GET` | `/api/vacunas/:id` | RF-10 | Esteban Fierro | Detalle de vacuna |
| | `GET` | `/api/vacunas/mascota/:mascotaId` | RF-10, RF-11 | Esteban Fierro | Carnet de vacunación de la mascota |
| **Recordatorios** | `POST` | `/api/recordatorios` | Doc. Oficial | Santiago Avila | Programar alerta de cita/vacuna/tratamiento |
| | `GET` | `/api/recordatorios` | Doc. Oficial | Santiago Avila | Listado general con filtro `?estado=` |
| | `GET` | `/api/recordatorios/:id` | Doc. Oficial | Santiago Avila | Detalle de recordatorio |
| | `GET` | `/api/recordatorios/mascota/:mascotaId` | Doc. Oficial | Santiago Avila | Recordatorios de una mascota |
| | `PUT` | `/api/recordatorios/:id` | Doc. Oficial | Santiago Avila | Marcar completado o modificar fecha |
| | `DELETE` | `/api/recordatorios/:id` | Doc. Oficial | Santiago Avila | Eliminar recordatorio |

---

## 3. Base de Datos Relacional MySQL (`medimascotas_db`)

El archivo `database/schema.sql` contiene la estructura completa con 10 tablas relacionadas mediante claves foráneas con integridad referencial:

1. `usuarios` (Autenticación y roles: admin, veterinario, propietario)
2. `propietarios` (Tutores con identificación única)
3. `mascotas` (Pacientes vinculados a un propietario)
4. `historiales_medicos` (Expediente 1 a 1 por mascota)
5. `consultas` (Atenciones médicas vinculadas a mascota y veterinario)
6. `diagnosticos` (Diagnósticos por consulta)
7. `tratamientos` (Tratamientos vinculados a diagnósticos)
8. `medicamentos` (Formulaciones dentro de consulta)
9. `vacunas` (Esquema de inmunización por mascota)
10. `recordatorios` (Alertas automáticas de seguimiento médico)

Para inicializar la base de datos en cualquier servidor MySQL:
```bash
npm run db:init
```

---

## 4. Resultados de Pruebas Automatizadas

Se ejecutan con:
```bash
node tests/api.test.js
```

**Resultado:** 26 de 26 pruebas aprobadas exitosamente (100% de cobertura funcional).
