# Walkthrough: API REST MediMascotas (Node.js + Express 5)

Este documento resume la implementación completa, la definición de endpoints, la estrategia de ramas en Git y la verificación de pruebas del proyecto **MediMascotas** para la Corporación Universitaria Minuto de Dios (UNIMINUTO).

---

## 1. Resumen de lo Realizado

1. **Estructura Base Idéntica a la Clase:**
   - Proyecto Node.js en modo CommonJS (`"type": "commonjs"`).
   - Dependencias de producción: `express: ^5.2.1`, `dotenv: ^17.4.2`.
   - Dependencias de desarrollo: `nodemon: ^3.1.14`.
   - Archivo `.env` configurado con `PORT=3000`.
   - Archivo `index.js` en la raíz orquestando la escucha en el puerto 3000.
   - Servidor `src/app.js` configurado con middlewares `express.json()` y `express.urlencoded()`.

2. **Estrategia Git y Commits Implementados:**
   - **Commit 1 en `main`:** Base limpia del proyecto **sin ningún router y sin ningún controlador**, tal como fue solicitado para la entrega inicial del líder del equipo:
     ```
     [main (root-commit) 0f5b685] feat: estructura base inicial sin routers ni controladores
     ```
   - **Rama de Enoc:** Creación y activación de la rama de trabajo del líder:
     ```bash
     git checkout -b feature/enoc-endpoints-medimascotas
     ```
   - **Commit 2 en `feature/enoc-endpoints-medimascotas`:** Desarrollo completo de la arquitectura modular (controladores, enrutadores, persistencia relacional en memoria y suite de pruebas):
     ```
     [feature/enoc-endpoints-medimascotas e926526] feat(enoc): implementacion de controladores, rutas y reglas de negocio RN-01 a RN-15 con tests
     ```

3. **Arquitectura Modular Implementada:**
   - `src/data/store.js`: Persistencia estructurada en memoria con integridad referencial, autoincrementables y datos semilla (veterinario Dr. Santiago Avila, propietarios Brayan Forero y Deivi Rodriguez, pacientes Lucas y Mishi).
   - `src/controllers/`: 6 controladores independientes (`authController`, `propietariosController`, `mascotasController`, `historialesController`, `consultasController`, `vacunasController`).
   - `src/routes/`: 6 enrutadores modulares agrupados bajo `/api` en `src/routes/index.js`.
   - Cumplimiento de las 15 Reglas de Negocio (RN-01 a RN-15) extraídas del documento de especificación.

---

## 2. Definición de Endpoints y Entidades

| Módulo / Entidad | Método | URL | RF / RN | Descripción |
|---|---|---|---|---|
| **Root / Salud** | `GET` | `/` | RNF-05 | Estado del servidor y ruta de documentación |
| | `GET` | `/api` | - | Diccionario de endpoints disponibles |
| **Auth / Usuarios** | `POST` | `/api/auth/register` | RF-01, CU-01 | Registro de veterinarios, administradores o propietarios |
| | `POST` | `/api/auth/login` | RF-01, CU-01 | Autenticación y retorno de token |
| | `GET` | `/api/auth/perfil/:id`| RF-02 | Consulta de perfil de usuario |
| | `PUT` | `/api/auth/perfil/:id`| RF-02, RF-13 | Actualización de perfil |
| | `GET` | `/api/auth/usuarios` | - | Listado de usuarios (con filtro `?rol=`) |
| **Propietarios** | `POST` | `/api/propietarios` | RF-03, CU-02, RN-02 | Registro con documento de identificación único |
| | `GET` | `/api/propietarios` | RF-03, RF-12 | Listado con búsqueda (`?search=`) |
| | `GET` | `/api/propietarios/:id` | RF-03 | Detalle de un propietario |
| | `PUT` | `/api/propietarios/:id` | RF-13 | Edición de contacto y dirección |
| | `DELETE` | `/api/propietarios/:id` | RF-14 | Inactivación lógica del propietario |
| | `GET` | `/api/propietarios/:id/mascotas` | RF-03 | Mascotas asociadas al propietario |
| **Mascotas** | `POST` | `/api/mascotas` | RF-04, CU-03, RN-01, RN-03, RN-04 | Creación de mascota + **autocreación de historial clínico** |
| | `GET` | `/api/mascotas` | RF-04, RF-12 | Búsqueda por nombre o cédula del dueño (`?search=`) |
| | `GET` | `/api/mascotas/:id` | RF-04 | Detalle con datos del dueño e historial |
| | `PUT` | `/api/mascotas/:id` | RF-13 | Actualización de peso, edad, raza |
| | `DELETE` | `/api/mascotas/:id` | RF-14, RN-11 | **Eliminación lógica** (`activo: false`) si tiene historial |
| **Historial Clínico**| `GET` | `/api/historiales/:mascotaId` | RF-05, RF-11, CU-05 | Expediente consolidado (consultas, diagnósticos, vacunas) |
| | `PUT` | `/api/historiales/:mascotaId/antecedentes` | RF-05, RF-13 | Actualizar antecedentes patológicos y alergias |
| | `GET` | `/api/historiales/:mascotaId/reporte` | RF-15 | Reporte oficial para impresión o aseguradoras |
| **Consultas** | `POST` | `/api/consultas` | RF-06..09, CU-04, RN-05..09, RN-12 | Registro de consulta con diagnóstico obligatorio |
| | `GET` | `/api/consultas` | RF-06 | Listado de todas las consultas |
| | `GET` | `/api/consultas/mascota/:mascotaId` | RF-06, RF-11 | Consultas de una mascota |
| | `GET` | `/api/consultas/:id` | RF-06 | Detalle de consulta |
| | `PUT` | `/api/consultas/:id` | RF-13, RN-13 | Modificación de observaciones o estado |
| **Vacunas** | `POST` | `/api/vacunas` | RF-10, CU-06, RN-10, RN-15 | Registro de vacuna aplicada |
| | `GET` | `/api/vacunas/mascota/:mascotaId` | RF-10, RF-11 | Carnet de vacunación de la mascota |
| | `GET` | `/api/vacunas` | RF-10 | Listado general de vacunas aplicadas |

---

## 3. Evidencia de Pruebas Automatizadas

Se ejecutó la suite completa con el comando:
```bash
npm test
```

### Resultados de Ejecución

```text
> actividad_node@1.0.0 test
> node tests/api.test.js

======================================================
🧪 INICIANDO SUITE DE PRUEBAS AUTOMATIZADAS MEDIMASCOTAS
======================================================

Servidor de pruebas escuchando en http://localhost:49924

  ✓ [PASS] 1. GET / - Servidor responde 200 con estado OK
  ✓ [PASS] 2. GET /api - Servidor retorna mapa de endpoints REST
  ✓ [PASS] 3. POST /api/auth/register - Registro de nuevo usuario (RF-01, CU-01)
  ✓ [PASS] 4. POST /api/auth/login - Inicio de sesion correcto (RF-01, CU-01)
  ✓ [PASS] 5. POST /api/propietarios - Registrar nuevo propietario (RF-03, CU-02)
  ✓ [PASS] 6. RN-02: Validar rechazo de propietario con documento duplicado
  ✓ [PASS] 7. POST /api/mascotas - Registrar mascota y autogenerar historial (RF-04, CU-03, RN-04)
  ✓ [PASS] 8. RN-01: Rechazo de registro de mascota sin propietario valido
  ✓ [PASS] 9. GET /api/mascotas?search=... - Busqueda por nombre o documento tutor (RF-12)
  ✓ [PASS] 10. POST /api/consultas - Registrar consulta valida con diagnostico (RF-06, RF-07, CU-04, RN-07)
  ✓ [PASS] 11. RN-07: Rechazo de consulta sin diagnosticos obligatorios
  ✓ [PASS] 12. RN-05: Rechazo de consulta para mascota inexistente
  ✓ [PASS] 13. POST /api/vacunas - Registrar vacuna en carnet (RF-10, CU-06, RN-10)
  ✓ [PASS] 14. RN-10: Rechazo de vacuna para mascota no registrada
  ✓ [PASS] 15. GET /api/historiales/:mascotaId - Ficha clinica consolidada (RF-11, CU-05)
  ✓ [PASS] 16. GET /api/historiales/:mascotaId/reporte - Reporte clinico oficial (RF-15)
  ✓ [PASS] 17. DELETE /api/mascotas/:id - RN-11: Borrado logico de mascota con historial
  ✓ [PASS] 18. GET /ruta-inexistente - Manejador 404 estructurado

------------------------------------------------------
📊 RESULTADOS FINALES: 18 de 18 pruebas aprobadas exitosamente.
------------------------------------------------------
```

---

## 4. Guía de Conexión a GitHub para Enoc y su Equipo

### Paso 1: Enoc (Líder) sube el proyecto a GitHub
1. Ve a [GitHub](https://github.com/new) y crea un nuevo repositorio llamado `medimascotas-backend` (o `actividad_node`). Déjalo vacío (sin agregar README ni .gitignore porque ya los tenemos).
2. En la terminal dentro de `medimascotas-api`, vincula tu repositorio remoto reemplazando `TU_USUARIO`:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/medimascotas-backend.git
   ```
3. Sube la rama base `main` (que contiene la versión limpia solicitada por el profesor):
   ```bash
   git checkout main
   git push -u origin main
   ```
4. Sube tu rama de trabajo con todos los endpoints y controladores:
   ```bash
   git checkout feature/enoc-endpoints-medimascotas
   git push -u origin feature/enoc-endpoints-medimascotas
   ```

### Paso 2: Instrucciones para tus compañeros (Santiago, Brayan, Deivi)
Cuando tus compañeros vayan a trabajar:
1. **Clonar el proyecto:**
   ```bash
   git clone https://github.com/TU_USUARIO/medimascotas-backend.git
   cd medimascotas-backend
   npm install
   ```
2. **Crear sus ramas individuales:**
   - Santiago:
     ```bash
     git checkout -b feature/santiago-consultas
     ```
   - Brayan:
     ```bash
     git checkout -b feature/brayan-vacunas
     ```
   - Deivi:
     ```bash
     git checkout -b feature/deivi-propietarios
     ```
3. **Subir sus cambios a GitHub:**
   ```bash
   git add .
   git commit -m "feat(modulo): descripcion de la mejora realizada"
   git push -u origin feature/nombre-de-su-rama
   ```
4. **Pull Request:**
   En la interfaz de GitHub, abrir el Pull Request hacia `main` para que Enoc (el líder) revise y apruebe el merge.
