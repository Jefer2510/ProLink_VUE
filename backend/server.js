require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { router: authRouter } = require('./routes/auth.router');
const postRouter = require('./routes/post.router');
const connectionRouter = require('./routes/connection.router');
const interactionRouter = require('./routes/interaction.router');
const messageRouter = require('./routes/message.router');
const skillRouter = require('./routes/skill.router');
const analyticsRouter = require('./routes/analytics.router');
const gamificationRouter = require('./routes/gamification.router');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO - Chat en tiempo real
const userSockets = new Map(); // Map de userId -> socketId

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Usuario se registra con su ID
  socket.on('register', (userId) => {
    userSockets.set(userId.toString(), socket.id);
    console.log(`Usuario ${userId} registrado con socket ${socket.id}`);
    
    // Emitir lista de usuarios online
    io.emit('users_online', Array.from(userSockets.keys()));
  });

  // Enviar mensaje
  socket.on('send_message', (data) => {
    const { receiver_id, sender_id, content } = data;
    const receiverSocketId = userSockets.get(receiver_id.toString());
    
    if (receiverSocketId) {
      // Enviar al receptor
      io.to(receiverSocketId).emit('new_message', {
        sender_id,
        receiver_id,
        content,
        created_at: new Date()
      });
    }
    
    // Confirmar al emisor
    socket.emit('message_sent', {
      sender_id,
      receiver_id,
      content,
      created_at: new Date()
    });
  });

  // Usuario escribiendo
  socket.on('typing', (data) => {
    const { receiver_id, sender_id } = data;
    const receiverSocketId = userSockets.get(receiver_id.toString());
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_typing', { sender_id });
    }
  });

  // Usuario dejó de escribir
  socket.on('stop_typing', (data) => {
    const { receiver_id, sender_id } = data;
    const receiverSocketId = userSockets.get(receiver_id.toString());
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_stop_typing', { sender_id });
    }
  });

  // Desconexión
  socket.on('disconnect', () => {
    // Remover usuario del mapa
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`Usuario ${userId} desconectado`);
        break;
      }
    }
    
    // Emitir lista actualizada de usuarios online
    io.emit('users_online', Array.from(userSockets.keys()));
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ProLink API - Now with 🚀 Innovation & Real-time Chat!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    features: ['realtime-chat', 'socket.io']
  });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/connections', connectionRouter);
app.use('/api/interactions', interactionRouter);
app.use('/api/messages', messageRouter);
app.use('/api/skills', skillRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/gamification', gamificationRouter);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Socket.IO enabled for real-time chat ✅`);
});
