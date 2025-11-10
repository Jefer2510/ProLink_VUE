# 🚀 Guía de Configuración para Colaboradores - ProLink

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- ✅ **Node.js** v18 o superior ([Descargar](https://nodejs.org/))
- ✅ **XAMPP** (para MySQL) ([Descargar](https://www.apachefriends.org/))
- ✅ **Git** ([Descargar](https://git-scm.com/))

---

## 📥 Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/Jefer2510/ProLink_VUE.git
cd ProLink_VUE
```

---

## 📦 Paso 2: Instalar Dependencias

### Frontend
```bash
npm install
```

### Backend
```bash
cd backend
npm install
cd ..
```

---

## 🗄️ Paso 3: Configurar la Base de Datos

### 3.1 Iniciar XAMPP
1. Abre **XAMPP Control Panel**
2. Inicia **Apache** y **MySQL**

### 3.2 Crear la Base de Datos
1. Abre phpMyAdmin: `http://localhost/phpmyadmin`
2. Crea una nueva base de datos llamada: `prolink_db`

### 3.3 Importar el Schema
Hay dos opciones:

**Opción A - Desde phpMyAdmin:**
1. Selecciona la base de datos `prolink_db`
2. Ve a la pestaña "Importar"
3. Selecciona el archivo `backend/database/schema.sql`
4. Haz clic en "Continuar"
5. Repite el proceso con `backend/database/update_schema.sql`

**Opción B - Desde MySQL CLI:**
```bash
mysql -u root -p prolink_db < backend/database/schema.sql
mysql -u root -p prolink_db < backend/database/update_schema.sql
```

---

## ⚙️ Paso 4: Configurar Variables de Entorno

### 4.1 Crear archivo .env en Backend
Crea un archivo llamado `.env` dentro de la carpeta `backend/`:

```bash
cd backend
# En Windows PowerShell:
New-Item .env

# En Mac/Linux:
touch .env
```

### 4.2 Configurar el archivo .env
Abre `backend/.env` y agrega:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=prolink_db
JWT_SECRET=prolink_secret_key_2024_super_segura
```

**Nota:** Si tu MySQL tiene contraseña, agrégala en `DB_PASSWORD`

---

## 🚀 Paso 5: Ejecutar la Aplicación

### Terminal 1 - Backend
```bash
cd backend
node server.js
```

Deberías ver:
```
✅ Server is running on port 3000
✅ Database connected successfully
✅ Socket.IO enabled for real-time chat
```

### Terminal 2 - Frontend
```bash
# Desde la raíz del proyecto
npm run dev
```

Deberías ver:
```
  VITE v7.1.14  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

---

## 🔍 Verificar que Todo Funciona

1. Abre tu navegador en: `http://localhost:5173`
2. Regístrate con un usuario de prueba
3. Deberías ver el feed principal

---

## 📚 Estructura del Proyecto

```
ProLink_VUE/
├── backend/                 # Servidor Node.js + Express
│   ├── config/             # Configuración DB
│   ├── database/           # Schemas SQL
│   ├── models/             # Modelos de datos (8 archivos)
│   ├── routes/             # Rutas API (8 grupos)
│   ├── server.js           # Entry point
│   └── .env                # Variables de entorno (CREAR)
│
├── src/                    # Frontend Vue 3
│   ├── components/         # Componentes reutilizables
│   ├── composables/        # Lógica reutilizable (7 archivos)
│   ├── views/              # Vistas principales (6 vistas)
│   ├── router/             # Configuración de rutas
│   └── App.vue             # Componente raíz
│
├── public/                 # Assets estáticos
└── README.md              # Documentación principal
```

---

## 🎨 Características Implementadas

### ✅ Sistema de Mensajería Avanzado
- Chat en tiempo real con Socket.IO
- Agrupación de mensajes por fecha y remitente
- Reacciones rápidas con emojis (❤️👍😂😮😢)
- Indicadores de estado (enviado, entregado, leído)
- Búsqueda en conversaciones
- Emoji picker con 30 emojis
- Botón de scroll inteligente con contador
- Enter para enviar, Shift+Enter para nueva línea

### ✅ Sistema de Gamificación
- Puntos automáticos por acciones
- Sistema de niveles progresivos
- 10 logros desbloqueables
- Leaderboard global con filtros

### ✅ Analytics Dashboard
- Vistas de perfil (últimos 30 días)
- Estadísticas de posts
- Crecimiento de red mensual
- Ranking en la plataforma

### ✅ Skills & Endorsements
- Sistema de habilidades profesionales
- Endorsements entre usuarios
- Skills trending

---

## 🐛 Solución de Problemas Comunes

### ❌ Error: "EADDRINUSE: address already in use"
**Solución:**
```bash
# Windows PowerShell:
netstat -ano | findstr :3000
taskkill /PID [PID_DEL_PROCESO] /F

# Reinicia el backend
cd backend
node server.js
```

### ❌ Error: "Database connection failed"
**Verificar:**
1. ¿XAMPP MySQL está corriendo?
2. ¿La base de datos `prolink_db` existe?
3. ¿Las credenciales en `.env` son correctas?

### ❌ Frontend no carga
**Solución:**
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 🔐 Usuarios de Prueba

Después de importar el schema, puedes ejecutar:
```bash
mysql -u root -p prolink_db < backend/database/crear_usuarios_prueba.sql
```

Esto creará usuarios de prueba para desarrollo.

---

## 📞 Contacto

Si tienes problemas durante la configuración:
- Repositorio: https://github.com/Jefer2510/ProLink_VUE
- Revisar issues en GitHub
- Contactar al equipo

---

## 🎯 Próximos Pasos

Una vez que tengas todo configurado:

1. **Familiarízate con el código:**
   - Revisa `README.md` para documentación completa
   - Explora la estructura de carpetas
   - Revisa los composables en `src/composables/`

2. **Prueba las funcionalidades:**
   - Crea un post
   - Envía una solicitud de conexión
   - Prueba el chat en tiempo real
   - Revisa el leaderboard y analytics

3. **Empieza a desarrollar:**
   - Crea una nueva rama: `git checkout -b feature/nombre-feature`
   - Realiza tus cambios
   - Commit: `git commit -m "feat: descripción"`
   - Push: `git push origin feature/nombre-feature`
   - Crea un Pull Request en GitHub

---

## ✨ Paleta de Colores del Proyecto

**Tema Oscuro con Púrpura:**
- Primary: `#a855f7` (púrpura brillante)
- Secondary: `#7e22ce` (púrpura oscuro)
- Background: `#0a0612` (negro profundo)
- Background Alt: `#1a1625` (gris oscuro)
- Accent: `#2d1b4e` (púrpura muy oscuro)

---

¡Bienvenido al equipo de ProLink! 🚀
