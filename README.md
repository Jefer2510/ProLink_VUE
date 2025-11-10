# 🚀 ProLink - Red Social Profesional

> Una plataforma profesional completa inspirada en LinkedIn con funcionalidades innovadoras

[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)

---

## ✨ Funcionalidades Principales

### 🔐 Core Features
- ✅ **Autenticación** - Login, registro y sesiones JWT
- ✅ **Feed de Posts** - Crear, ver y eliminar publicaciones
- ✅ **Sistema de Conexiones** - Enviar/aceptar/rechazar solicitudes
- ✅ **Interacciones** - Likes y comentarios en posts

### 🚀 Funcionalidades Innovadoras

#### 💬 Sistema de Mensajería
- Chat privado 1-a-1 entre conexiones
- Inbox con lista de conversaciones
- Contador de mensajes no leídos
- Marcar como leído automático
- Historial completo de conversaciones

#### ⭐ Skills & Endorsements
- Agregar skills a tu perfil
- Endorsar skills de otros usuarios
- Ver quién te endorsó
- Skills trending de la plataforma
- Sistema anti-auto-endorsement

#### 📊 Analytics Dashboard
- Vistas de perfil (últimos 30 días)
- Quién vio tu perfil
- Estadísticas de posts (likes, comentarios)
- Mejor hora para publicar
- Crecimiento de red mensual
- Ranking en la plataforma

#### 🎮 Sistema de Gamificación
- Sistema de puntos automático
- Niveles progresivos (100 pts = 1 nivel)
- 10 logros desbloqueables
- Leaderboard global con filtros
- Medallas para top 3 usuarios
- Verificación automática de logros

---

## 🛠️ Stack Tecnológico

### Frontend
- **Vue 3** - Framework progresivo
- **Vue Router** - Navegación SPA
- **Tailwind CSS** - Estilos utility-first
- **Axios** - Cliente HTTP
- **Vite** - Build tool rápido

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación con tokens
- **bcrypt** - Hash de contraseñas

---

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ instalado
- MySQL 8+ instalado
- XAMPP/WAMP (opcional para phpMyAdmin)

### 1. Clonar el repositorio
```bash
git clone <url-repositorio>
cd ProLink_VUE
```

### 2. Instalar dependencias

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ..
npm install
```

### 3. Configurar base de datos

1. Crear la base de datos:
```sql
CREATE DATABASE prolink_db;
```

2. Ejecutar el schema inicial:
```bash
# En phpMyAdmin o MySQL CLI
USE prolink_db;
SOURCE backend/database/schema.sql;
```

3. **IMPORTANTE:** Ejecutar script de migración:
```bash
# Ejecuta esto para las nuevas funcionalidades
SOURCE backend/database/update_schema.sql;
```

### 4. Configurar variables de entorno

Crear archivo `backend/.env`:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=prolink_db
JWT_SECRET=tu_clave_secreta_super_segura
```

---

## 🚀 Ejecutar la Aplicación

### Backend
```bash
cd backend
node server.js
```

El servidor correrá en `http://localhost:3000`

### Frontend
```bash
npm run dev
```

La aplicación estará en `http://localhost:5173`

---

## 📖 Estructura del Proyecto

```
ProLink_VUE/
├── backend/
│   ├── config/          # Configuración de DB
│   ├── models/          # Modelos de datos (8 archivos)
│   ├── routes/          # Rutas API (8 grupos)
│   ├── middleware/      # Middlewares (auth)
│   ├── database/        # Schemas SQL
│   └── server.js        # Entry point
├── src/
│   ├── components/      # Componentes Vue (6 archivos)
│   ├── composables/     # Lógica reutilizable (7 archivos)
│   ├── views/           # Vistas principales (6 archivos)
│   ├── router/          # Configuración de rutas
│   ├── App.vue          # Componente raíz
│   └── main.js          # Entry point
├── public/              # Assets estáticos
└── package.json         # Dependencias
```

---

## 🎯 Rutas de la Aplicación

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/login` | AuthView | Inicio de sesión |
| `/register` | AuthView | Registro de usuario |
| `/feed` | FeedView | Feed principal |
| `/connections` | ConnectionsView | Gestión de conexiones |
| `/messages` | MessagesView | Chat y mensajería |
| `/analytics` | AnalyticsView | Dashboard de estadísticas |
| `/leaderboard` | LeaderboardView | Ranking global |

---

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil

### Posts
- `POST /api/posts` - Crear post
- `GET /api/posts` - Obtener feed
- `DELETE /api/posts/:id` - Eliminar post
- Y más...

### Mensajería 💬
- `POST /api/messages` - Enviar mensaje
- `GET /api/messages` - Lista de conversaciones
- `GET /api/messages/conversation/:id` - Chat específico
- `GET /api/messages/unread` - Contador de no leídos

### Skills ⭐
- `POST /api/skills` - Agregar skill
- `GET /api/skills/user/:userId` - Skills de usuario
- `POST /api/skills/:id/endorse` - Endorsar skill
- `GET /api/skills/trending` - Skills populares

### Analytics 📊
- `GET /api/analytics/stats` - Estadísticas generales
- `GET /api/analytics/viewers` - Quién vio tu perfil
- `GET /api/analytics/posts` - Analytics de posts
- `GET /api/analytics/best-time` - Mejor hora para postear

### Gamificación 🎮
- `GET /api/gamification/level` - Nivel y puntos
- `GET /api/gamification/achievements` - Mis logros
- `GET /api/gamification/leaderboard` - Ranking global
- `POST /api/gamification/check` - Verificar nuevos logros

**Total:** 44+ endpoints funcionales

---

## 🎮 Sistema de Gamificación

### Puntos Automáticos
- ✍️ Crear post: +10 pts
- ❤️ Dar like: +5 pts
- 💬 Comentar: +5 pts
- 🤝 Conectar: +10 pts
- ⭐ Endorsar: +5 pts

### Niveles
- 100 puntos = 1 nivel
- Progreso circular visible
- Sin límite de nivel

### Logros (10 disponibles)
- 📝 Primera Publicación
- 🤝 Primera Conexión
- ❤️ Primer Like
- 💬 Primer Comentario
- 🌟 Popular (100 likes)
- 🌐 Networker (50 conexiones)
- 👑 Influencer (1000 vistas)
- ✍️ Content Creator (50 posts)
- 💬 Engaging (100 comentarios)
- ⭐ Skilled (10 endorsements)

---

## 📊 Base de Datos

### Tablas Principales
- `users` - Usuarios (con points y level)
- `posts` - Publicaciones
- `connections` - Conexiones entre usuarios
- `likes` - Likes en posts
- `comments` - Comentarios

### Tablas Nuevas (Funcionalidades Innovadoras)
- `messages` - Mensajes entre usuarios
- `user_skills` - Skills de usuarios
- `endorsements` - Endorsements de skills
- `profile_views` - Vistas de perfil
- `user_achievements` - Logros desbloqueados
- `point_history` - Historial de puntos

**Total:** 11 tablas

---

## 🎨 Características del UI

- 🌙 Tema oscuro elegante
- 🎨 Gradientes y sombras modernas
- 📱 Diseño responsive
- ⚡ Animaciones suaves
- 🎯 UX intuitiva
- 🔔 Badges de notificaciones
- 📊 Visualización de datos

---

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación JWT
- ✅ Middleware de protección de rutas
- ✅ Validación de tokens
- ✅ CORS configurado
- ✅ Prevención de SQL injection (prepared statements)

---

## 📚 Documentación Adicional

- 📄 [NUEVAS_FUNCIONALIDADES.md](./NUEVAS_FUNCIONALIDADES.md) - Descripción técnica completa
- 📄 [INSTRUCCIONES_FRONTEND.md](./INSTRUCCIONES_FRONTEND.md) - Guía de uso detallada
- 📄 [RESUMEN_FINAL.md](./RESUMEN_FINAL.md) - Resumen ejecutivo
- 📄 [GUIA_INICIO.md](./GUIA_INICIO.md) - Guía rápida de inicio

---

## 🐛 Solución de Problemas

### No aparecen las nuevas funcionalidades
1. Verifica que ejecutaste `update_schema.sql`
2. Recarga la página (F5)
3. Verifica que el backend esté corriendo

### Error de base de datos
1. Verifica que MySQL esté corriendo
2. Verifica las credenciales en `.env`
3. Ejecuta el script `update_schema.sql`

### Error de CORS
1. Verifica que el backend esté en puerto 3000
2. Verifica que el frontend esté en puerto 5173

---

## 🚀 Próximas Mejoras

- [ ] WebSockets para mensajes en tiempo real
- [ ] Notificaciones push
- [ ] Perfil de usuario completo
- [ ] Búsqueda avanzada por skills
- [ ] Exportar analytics a PDF
- [ ] Modo oscuro/claro toggle
- [ ] Subir imágenes en mensajes
- [ ] Chat grupal
- [ ] Videollamadas
- [ ] Stories

---

## 👥 Créditos

**Desarrollado con:**
- 💙 Vue 3
- ⚡ Vite
- 🎨 Tailwind CSS
- 🚀 Node.js + Express
- 🗄️ MySQL

**Creado por:** GitHub Copilot  
**Fecha:** Noviembre 2025

---

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 🎉 ¡Disfruta de ProLink!

Una red social profesional completa con funcionalidades innovadoras que rivalizan con LinkedIn.

**¡Conéctate, colabora y crece profesionalmente! 🚀**
