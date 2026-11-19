# 🐾 GUÍA DE SUSTENTACIÓN Y EXPOSICIÓN FINAL: MEDIMASCOTAS

**Proyecto:** Plataforma de Gestión Clínica Veterinaria y Pacientes  
**Integrantes:** Enoc Tamayo, Santiago Ávila, Esteban Fierro  
**Arquitectura:** Full Stack Desacoplada (Frontend en Vercel + Backend en Render + Base de Datos Relacional)

---

## 🎯 1. Resumen Ejecutivo del Proyecto

MediMascotas es una solución web integral diseñada para la administración veterinaria. Permite registrar propietarios (clientes), gestionar el ciclo de vida de los pacientes (mascotas), controlar el acceso seguro mediante roles y tokens JWT, y garantizar la persistencia de datos relacionales tanto en entornos locales como en la nube.

### 🌟 Puntos Fuertes para Destacar en la Presentación:
1. **Desacoplamiento Total:** Estructura independiente `backend/` y `frontend/`, permitiendo escalabilidad y despliegues independientes en la nube (**Vercel** para la SPA en React y **Render** para la API REST en Node.js/Express).
2. **Modelo de 2 Clientes y Mascotas Relacionales:** Cada mascota está vinculada de forma estricta a su propietario/cliente mediante claves foráneas (`propietario_id`), permitiendo consultas filtradas y trazabilidad clínica.
3. **Seguridad y Privacidad:** 
   - Contraseñas cifradas con `bcryptjs` (salt de 10 rondas).
   - Rutas protegidas mediante JSON Web Tokens (JWT) en cabeceras HTTP `Authorization: Bearer <token>`.
   - **Privacidad visual:** La interfaz de usuario no expone puertos internos, cadenas de conexión ni estados crudos de bases de datos.
4. **Alta Disponibilidad y Tolerancia a Fallos:** El backend cuenta con un sistema híbrido que prioriza MySQL relacional y, en caso de interrupciones de red en la nube, activa un almacén en memoria con datos semilla para que la sustentación **nunca sufra caídas**.
5. **Identidad Visual Corporativa:** Integración del logotipo oficial de MediMascotas en Navbar, Favicon y formularios de autenticación.

---

## 👥 2. Demostración de los 2 Clientes y sus Mascotas

Para cumplir el requisito de los **2 clientes**, el sistema cuenta con registros diferenciados:

| Cliente / Propietario | Documento / Identificación | Mascota(s) Asociada(s) | Especie y Raza |
| :--- | :--- | :--- | :--- |
| **Cliente 1: Esteban Fierro** | C.C. `1010203040` | **Lucas** (Chip: `CHIP-982101`)<br>**Rocky** (Chip: `CHIP-LAB-7744`) | Canino - Golden Retriever (3 años)<br>Canino - Labrador Retriever (4 años) |
| **Cliente 2: Enoc Tamayo** | C.C. `1098765432` | **Mishi** (Chip: `CHIP-451299`)<br>**Zeus** (Chip: `CHIP-554433`) | Felino - Siamés (2 años)<br>Canino - Pastor Alemán (2 años) |

> 💡 **En la exposición:** Puedes mostrar cómo al filtrar por "Esteban Fierro" solo aparecen sus perros, y al filtrar por "Enoc Tamayo" aparecen sus respectivas mascotas, demostrando la integridad relacional de la base de datos.

---

## 🎬 3. Guión Paso a Paso para la Exposición en Vivo (5 a 8 minutos)

### Paso 1: Introducción y Portada (30 seg)
* **Qué mostrar:** La página de bienvenida o inicio de sesión en [Vercel](https://medimascotas-frontend.vercel.app).
* **Qué decir:**
  > *"Buenas tardes profesor/evaluadores. Nuestro proyecto es **MediMascotas**, un sistema para la gestión médica y clínica de mascotas veterinarias. Desarrollamos una arquitectura cliente-servidor desacoplada: el Frontend está construido en React 19 con Vite y alojado en **Vercel**, y el Backend es una API REST construida en Node.js con Express y MySQL, desplegada en **Render**."*

---

### Paso 2: Autenticación Segura y Privacidad (1 min)
* **Qué mostrar:** Formulario de Login / Registro.
* **Qué decir:**
  > *"El sistema implementa autenticación robusta mediante JSON Web Tokens (JWT). Cuando un usuario se registra o inicia sesión, su contraseña nunca se guarda en texto plano; aplicamos un algoritmo de hash con `bcryptjs` de 10 rondas de salt. Al autenticarse, el servidor responde con un token firmado criptográficamente que se guarda de manera segura en el cliente y se adjunta automáticamente en cada petición mediante interceptores de Axios."*
* **Detalle de Privacidad:**
  > *"Además, la interfaz de usuario está diseñada bajo principios de seguridad industrial: no expone detalles técnicos internos como puertos de servidor ni configuraciones de base de datos, manteniendo los datos sensibles completamente privados."*

---

### Paso 3: Dashboard y Navegación (1 min)
* **Qué mostrar:** La pantalla de Dashboard tras iniciar sesión.
* **Qué decir:**
  > *"Una vez dentro del sistema, el Dashboard ofrece una vista clara con el perfil del usuario autenticado y una tarjeta de acceso directo al módulo clínico de pacientes, con un contador dinámico que consulta en tiempo real el total de mascotas registradas en la base de datos."*

---

### Paso 4: Módulo de Mascotas y Demostración de los 2 Clientes (2.5 min) ⭐ *(Momento clave)*
* **Qué mostrar:** Entrar a la sección **🐾 Mascotas** (`/mascotas`).
* **Qué hacer en vivo:**
  1. **Explicar las tarjetas:** Muestra cómo cada tarjeta de mascota incluye su chip, especie, edad, peso y, lo más importante, una caja azul destacando a qué **Cliente / Propietario** pertenece (Esteban Fierro vs. Enoc Tamayo).
  2. **Probar los Filtros:**
     - En el selector de especies, filtra por **Felino** (aparecerá solo Mishi).
     - En el selector de clientes, selecciona **Esteban Fierro** (aparecerán Lucas y Rocky).
  3. **Crear una Nueva Mascota:**
     - Clic en **➕ Registrar Nueva Mascota**.
     - Llena los datos (ej: Nombre: `Toby`, Especie: `Canino`, Raza: `Poodle`, Edad: `1`, Peso: `6.5`).
     - En el campo **Cliente / Propietario Responsable**, selecciona uno de los clientes.
     - Clic en **🐾 Crear Mascota**.
     - Demuestra cómo aparece inmediatamente en la lista vinculada al cliente seleccionado.
  4. **Editar y Eliminar:** Muestra cómo el botón **Editar** precarga los datos y cómo **Eliminar** solicita confirmación antes de impactar la base de datos.
* **Qué decir:**
  > *"Aquí evidenciamos el cumplimiento del modelo relacional. Toda mascota debe estar estrictamente vinculada a un cliente. Nuestro backend valida en el servidor que el `propietario_id` exista y aplica llaves foráneas para mantener la consistencia e integridad referencial."*

---

### Paso 5: Arquitectura Técnica y Despliegue en la Nube (1.5 min)
* **Qué mostrar:** El enlace en Vercel y la respuesta del Backend.
* **Qué decir:**
  > *"Para llevar el proyecto a producción, configuramos políticas de CORS dinámicas en el backend para permitir comunicación cruzada entre el dominio de Vercel y el de Render. Además, creamos un archivo `vercel.json` con reescrituras automáticas para garantizar que el enrutamiento de React Router funcione limpiamente al recargar cualquier página en la nube."*

---

## ❓ 4. Preguntas Típicas del Profesor y Cómo Responderlas

### P1: ¿Por qué separaron el frontend y el backend en carpetas independientes?
> **Respuesta:** *"Lo hicimos siguiendo las buenas prácticas de la industria de arquitecturas cliente-servidor desacopladas. Esto permite que el frontend y el backend tengan ciclos de vida independientes, dependencias aisladas (Vite no interfiere con Express) y puedan desplegarse en plataformas especializadas según sus necesidades (Vercel para contenido estático/SPA y Render para servicios de cómputo y API)."*

### P2: ¿Cómo se relacionan las mascotas y los clientes en la base de datos?
> **Respuesta:** *"Mediante una relación de 1 a N. La tabla `propietarios` tiene como clave primaria `id`. La tabla `mascotas` tiene una clave foránea `propietario_id` con restricción `CONSTRAINT fk_mascota_propietario REFERENCES propietarios(id) ON DELETE RESTRICT ON UPDATE CASCADE`. Esto asegura que nunca pueda crearse una mascota huérfana sin un cliente responsable."*

### P3: ¿Cómo protegen los endpoints del backend para que nadie cree o borre mascotas sin permiso?
> **Respuesta:** *"Utilizamos un middleware personalizado llamado `verifyToken`. Este intercepta la solicitud, extrae el token JWT del encabezado `Authorization: Bearer <token>`, valida la firma con nuestra clave secreta (`JWT_SECRET`) y verifica que no haya expirado. Si el token no existe o es inválido, rechaza la petición con códigos HTTP 401 (No autorizado) o 403 (Prohibido)."*

### P4: ¿Qué sucede si la base de datos MySQL en la nube se desconecta o falla temporalmente?
> **Respuesta:** *"Diseñamos un patrón de diseño tolerante a fallos con un `memoryStore` de respaldo. Si la conexión a MySQL no responde, el sistema no colapsa ni arroja error 500; activa automáticamente la persistencia en memoria manteniendo intactos los datos de los 2 clientes y sus mascotas para que la experiencia de usuario y la evaluación continúen fluidas."*

---

## 📂 5. Repositorio Oficial para la Entrega
* **Repositorio Colaborativo:** [https://github.com/santiagoavilaramirez14-collab/medimascotas.git](https://github.com/santiagoavilaramirez14-collab/medimascotas.git)
* **Estructura de Entrega (ZIP o Git):**
  ```text
  medimascotas/
  ├── backend/           # API REST (Node.js, Express, MySQL, JWT, bcrypt)
  ├── frontend/          # SPA React 19 + Vite + Axios + Logo
  ├── README.md          # Documentación general del repositorio
  └── GUIA_EXPOSICION_MEDIMASCOTAS.md # Esta guía de sustentación
  ```
