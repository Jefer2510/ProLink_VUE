# 🚀 GUÍA RÁPIDA DE INICIO - PROLINK

## ⚠️ IMPORTANTE: LEE ESTO PRIMERO

**Antes de usar las nuevas funcionalidades, DEBES ejecutar el script de base de datos.**

---

## 📋 CHECKLIST DE INICIO

### ✅ PASO 1: BASE DE DATOS (OBLIGATORIO)

#### **¿Ya ejecutaste el script SQL?**
- [ ] NO → **HAZLO AHORA** (sigue las instrucciones abajo)
- [ ] SÍ → Continúa al Paso 2

#### **Cómo ejecutar el script:**

**OPCIÓN A: phpMyAdmin (MÁS FÁCIL)**

1. Abre tu navegador
2. Ve a: `http://localhost/phpmyadmin/`
3. En el panel izquierdo, haz clic en `prolink_db`
4. Haz clic en la pestaña **"SQL"** (arriba)
5. Abre el archivo: `backend/database/update_schema.sql` con Notepad
6. Copia TODO el contenido (Ctrl+A, Ctrl+C)
7. Pega en el cuadro de texto de phpMyAdmin (Ctrl+V)
8. Haz clic en **"Continuar"** o **"Go"** (abajo a la derecha)
9. Deberías ver: ✅ "7 queries ejecutadas exitosamente"

**OPCIÓN B: MySQL Workbench**

1. Abre MySQL Workbench
2. Conecta a tu servidor local
3. File → Open SQL Script
4. Selecciona: `backend/database/update_schema.sql`
5. Haz clic en el ⚡ (ejecutar)
6. Verifica que se ejecutó sin errores

**OPCIÓN C: Línea de comandos**

```bash
cd c:\Users\velas\OneDrive\Desktop\ProLink_VUE\backend\database
mysql -u root -p prolink_db < update_schema.sql
```

---

### ✅ PASO 2: BACKEND

El backend ya está corriendo en puerto 3000 ✅

**Si necesitas reiniciarlo:**

```bash
# Abrir terminal en VS Code (Ctrl + `)
cd c:\Users\velas\OneDrive\Desktop\ProLink_VUE\backend
node server.js
```

**Deberías ver:**
```
Server is running on port 3000
Database connected successfully
```

**Si ves errores de base de datos:** Ejecuta el script SQL del Paso 1

---

### ✅ PASO 3: FRONTEND

```bash
# Abrir NUEVA terminal (Ctrl + Shift + `)
cd c:\Users\velas\OneDrive\Desktop\ProLink_VUE
npm run dev
```

**Deberías ver:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

### ✅ PASO 4: ABRIR LA APLICACIÓN

1. Abre tu navegador
2. Ve a: `http://localhost:5173/`
3. Inicia sesión o crea una cuenta

---

## 🎯 PROBAR LAS NUEVAS FUNCIONALIDADES

### 1️⃣ **Gamificación** (Lo primero que verás)

1. Inicia sesión
2. En el Feed, mira el **sidebar derecho**
3. Verás tu **badge de nivel** con puntos y progreso
4. Haz clic en **"Ver Ranking"** para ver el leaderboard

**Para ganar puntos:**
- Crea una publicación (+10 pts + logro FIRST_POST)
- Da un like (+5 pts + logro FIRST_LIKE)
- Haz un comentario (+5 pts + logro FIRST_COMMENT)
- Conéctate con alguien (+10 pts + logro FIRST_CONNECTION)

---

### 2️⃣ **Analytics Dashboard**

1. Haz clic en el icono **📊** en el navbar
2. O ve a: `http://localhost:5173/analytics`

**Verás:**
- 👁️ Vistas de tu perfil
- 🤝 Total de conexiones
- 📝 Tus publicaciones
- 🏆 Tu ranking en la plataforma
- ⏰ Mejor hora para publicar
- 👥 Quién vio tu perfil
- 📈 Rendimiento de posts
- 📊 Crecimiento de red

---

### 3️⃣ **Leaderboard / Ranking**

1. Haz clic en el icono **🏆** en el navbar
2. O ve a: `http://localhost:5173/leaderboard`

**Verás:**
- Top 3 con medallas 🥇🥈🥉
- Tu posición destacada
- Nivel, puntos y logros de cada usuario

**Filtros disponibles:**
- Todo el tiempo
- Este mes
- Esta semana

---

### 4️⃣ **Mensajería**

**IMPORTANTE:** Necesitas 2 usuarios conectados para probar esto.

#### **Preparación:**
1. Abre una ventana de incógnito (Ctrl+Shift+N)
2. Ve a `http://localhost:5173/`
3. Crea/inicia sesión con un **segundo usuario**
4. Haz una solicitud de conexión al primer usuario
5. En la ventana normal, acepta la conexión

#### **Enviar Mensajes:**
1. Haz clic en el icono **💬** en el navbar
2. O ve a: `http://localhost:5173/messages`
3. Verás la lista de conversaciones (izquierda)
4. Haz clic en un contacto
5. Escribe un mensaje y presiona Enter

**Verás:**
- Badge de mensajes no leídos en navbar
- Conversaciones con último mensaje
- Chat en tiempo real
- Timestamps (Hoy, Ayer, hace X días)

---

### 5️⃣ **Skills & Endorsements**

**Nota:** Esta funcionalidad se puede agregar a cualquier vista de perfil.

#### **Agregar Skills:**
1. Usa el componente `<SkillsSection>` en tu perfil
2. Haz clic en **"+ Agregar"**
3. Escribe una skill (ej: "React.js", "Python", "Marketing")
4. Haz clic en **"Guardar"**

#### **Endorsar Skills:**
1. Ve al perfil de un usuario conectado
2. Verás sus skills
3. Haz clic en **"👍 Endorse"**
4. Verás el contador aumentar

#### **Ver Endorsers:**
1. Si una skill tiene endorsements
2. Haz clic en **"Ver endorsers"**
3. Verás quién endorsó esa skill

---

## 🎮 CÓMO FUNCIONA LA GAMIFICACIÓN

### **Sistema de Puntos:**

Ganas puntos automáticamente al:
- ✍️ Crear publicación: +10 puntos
- ❤️ Dar like: +5 puntos
- 💬 Comentar: +5 puntos
- 🤝 Conectarte: +10 puntos
- ⭐ Endorsar skill: +5 puntos

### **Sistema de Niveles:**

- **100 puntos = 1 nivel**
- Nivel 1: 0-99 pts (Novato)
- Nivel 2: 100-199 pts
- Nivel 3: 200-299 pts
- Y así sucesivamente...

### **Logros Disponibles:**

| Logro | Cómo Desbloquear |
|-------|------------------|
| 📝 Primera Publicación | Crea tu primer post |
| 🤝 Primera Conexión | Conéctate con alguien |
| ❤️ Primer Like | Da tu primer like |
| 💬 Primer Comentario | Comenta por primera vez |
| 🌟 Popular | Recibe 100 likes en total |
| 🌐 Networker | Alcanza 50 conexiones |
| 👑 Influencer | Recibe 1000 vistas de perfil |
| ✍️ Creador de Contenido | Publica 50 posts |
| 💬 Comunicador | Haz 100 comentarios |
| ⭐ Experto | Recibe 10 endorsements en skills |

---

## 🔍 VERIFICAR QUE TODO FUNCIONA

### **Checklist de Funcionalidades:**

- [ ] ✅ Puedo ver mi badge de nivel en el feed
- [ ] ✅ Puedo ver mi ranking en `/leaderboard`
- [ ] ✅ Puedo ver mis estadísticas en `/analytics`
- [ ] ✅ Puedo enviar mensajes en `/messages`
- [ ] ✅ Veo el badge de mensajes no leídos
- [ ] ✅ Puedo agregar skills
- [ ] ✅ Puedo endorsar skills de otros
- [ ] ✅ Gano puntos al interactuar
- [ ] ✅ Mi nivel sube automáticamente
- [ ] ✅ Puedo ver quién vio mi perfil

---

## ⚠️ SOLUCIÓN DE PROBLEMAS

### **"No veo el badge de nivel"**
- ✅ Verifica que ejecutaste el script SQL
- ✅ Recarga la página (F5)
- ✅ Haz alguna actividad (crear post, dar like)

### **"No puedo enviar mensajes"**
- ✅ Verifica que tienes al menos 1 conexión
- ✅ Solo puedes enviar mensajes a usuarios conectados
- ✅ Verifica que el backend esté corriendo

### **"No aparecen datos en Analytics"**
- ✅ Necesitas actividad primero (posts, likes, vistas)
- ✅ Verifica que ejecutaste el script SQL
- ✅ Espera unos segundos y recarga

### **"Error de base de datos"**
- ✅ Ejecuta el script SQL del Paso 1
- ✅ Verifica que MySQL esté corriendo
- ✅ Verifica las credenciales en `backend/config/db.js`

### **"Error CORS / No conecta con API"**
- ✅ Verifica que el backend esté en puerto 3000
- ✅ Verifica que el frontend esté en puerto 5173
- ✅ Abre la consola del navegador (F12) para ver errores

---

## 💡 TIPS Y CONSEJOS

### **Para probar todo rápidamente:**

1. **Crea 2 usuarios** (usa ventana de incógnito)
2. **Conéctalos** entre sí
3. **Haz actividad:**
   - Crea 2-3 posts
   - Da likes entre usuarios
   - Comenta posts
   - Agrega skills
   - Endorsa skills del otro usuario
   - Envía mensajes
4. **Verifica:**
   - Badge de nivel subiendo
   - Estadísticas en Analytics
   - Ranking en Leaderboard
   - Mensajes en inbox

### **Para subir rápido en el ranking:**

- Crea muchos posts (+10 pts cada uno)
- Comenta posts (+5 pts cada comentario)
- Haz conexiones (+10 pts cada una)
- Endorsa skills (+5 pts cada endorsement)

---

## 📱 NAVEGACIÓN RÁPIDA

### **Atajos del teclado:**

- `Ctrl + Click` en un link = Abrir en nueva pestaña
- `F5` = Recargar página
- `F12` = Abrir consola (para ver errores)
- `Ctrl + Shift + N` = Ventana de incógnito

### **URLs directas:**

- 🏠 Feed: `http://localhost:5173/feed`
- 🤝 Conexiones: `http://localhost:5173/connections`
- 💬 Mensajes: `http://localhost:5173/messages`
- 📊 Analytics: `http://localhost:5173/analytics`
- 🏆 Ranking: `http://localhost:5173/leaderboard`

---

## 🎉 ¡LISTO!

Si seguiste todos los pasos, deberías tener:

✅ Backend corriendo en puerto 3000  
✅ Frontend corriendo en puerto 5173  
✅ Base de datos actualizada con 7 tablas nuevas  
✅ Todas las funcionalidades funcionando  

**¡Disfruta de ProLink! 🚀**

---

## 📞 AYUDA

Si tienes problemas:

1. Verifica que ejecutaste el script SQL
2. Verifica que ambos servidores estén corriendo
3. Revisa la consola del navegador (F12)
4. Revisa la terminal del backend
5. Lee los documentos:
   - `NUEVAS_FUNCIONALIDADES.md`
   - `INSTRUCCIONES_FRONTEND.md`
   - `RESUMEN_FINAL.md`

---

**Última actualización:** 7 de Noviembre, 2025
