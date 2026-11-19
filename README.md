# 🐾 MediMascotas

Plataforma web integral para la gestión y seguimiento del historial clínico de mascotas veterinarias y control de clientes propietarios.

---

## 📁 Estructura del Proyecto

```text
medimascotas/
├── backend/          # API REST desarrollada en Node.js y Express (MySQL + JWT + bcrypt)
│   ├── database/     # Scripts SQL y automatización de tablas
│   ├── src/          # Controladores, Modelos (Mascota, Propietario, Usuario) y Rutas
│   └── index.js      # Punto de entrada del servidor
│
├── frontend/         # Interfaz web SPA desarrollada en React 19 + Vite + Axios
│   ├── public/       # Logo oficial y activos estáticos
│   ├── src/          # Páginas (Mascotas, FormMascota, Dashboard, Perfil, Auth)
│   └── vercel.json   # Configuración de reescrituras para enrutamiento SPA en Vercel
│
├── GUIA_EXPOSICION_MEDIMASCOTAS.md # Guión y guía paso a paso para la sustentación
└── README.md
```

---

## 👥 Modelo de Clientes y Mascotas Relacionales
El sistema soporta la administración de múltiples clientes y la vinculación de sus mascotas:
* **Cliente 1 (Esteban Fierro - C.C. 1010203040):** Lucas (Golden Retriever) y Rocky (Labrador).
* **Cliente 2 (Enoc Tamayo - C.C. 1098765432):** Mishi (Siamés) y Zeus (Pastor Alemán).

---

## 🚀 Puesta en Marcha Local

### 1. Backend (API REST)
```bash
cd backend
npm install
npm run dev
```
El servidor backend iniciará en `http://localhost:3000`.

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
La aplicación web abrirá en `http://localhost:5173`.

---

## 🌐 Arquitectura de Despliegue en Producción
* **Base de Datos:** MySQL Relacional (con almacén tolerante a fallos para alta disponibilidad)
* **Backend:** Render (`https://medimascotas-backend.onrender.com`)
* **Frontend:** Vercel (`https://medimascotas-frontend.vercel.app`)

---

## 👥 Integrantes
* Enoc Tamayo
* Santiago Ávila
* Esteban Fierro
