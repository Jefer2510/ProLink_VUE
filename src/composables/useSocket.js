import { ref, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';

const socket = ref(null);
const isConnected = ref(false);
const usersOnline = ref([]);

export function useSocket() {
  /**
   * Conectar al servidor Socket.IO
   */
  const connect = (userId) => {
    if (!socket.value) {
      socket.value = io('http://localhost:3000', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      socket.value.on('connect', () => {
        console.log('✅ Conectado a Socket.IO');
        isConnected.value = true;
        
        // Registrar usuario
        if (userId) {
          socket.value.emit('register', userId);
        }
      });

      socket.value.on('disconnect', () => {
        console.log('❌ Desconectado de Socket.IO');
        isConnected.value = false;
      });

      socket.value.on('users_online', (users) => {
        usersOnline.value = users;
        console.log('Usuarios online:', users);
      });

      socket.value.on('connect_error', (error) => {
        console.error('Error de conexión Socket.IO:', error);
      });
    }
  };

  /**
   * Desconectar del servidor
   */
  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      isConnected.value = false;
    }
  };

  /**
   * Registrar usuario con su ID
   */
  const registerUser = (userId) => {
    if (socket.value && isConnected.value) {
      socket.value.emit('register', userId);
    }
  };

  /**
   * Enviar mensaje en tiempo real
   */
  const sendMessage = (receiverId, senderId, content) => {
    if (socket.value && isConnected.value) {
      socket.value.emit('send_message', {
        receiver_id: receiverId,
        sender_id: senderId,
        content
      });
    }
  };

  /**
   * Escuchar nuevos mensajes
   */
  const onNewMessage = (callback) => {
    if (socket.value) {
      socket.value.on('new_message', callback);
    }
  };

  /**
   * Remover listener de nuevos mensajes
   */
  const offNewMessage = () => {
    if (socket.value) {
      socket.value.off('new_message');
    }
  };

  /**
   * Escuchar confirmación de mensaje enviado
   */
  const onMessageSent = (callback) => {
    if (socket.value) {
      socket.value.on('message_sent', callback);
    }
  };

  /**
   * Remover listener de mensaje enviado
   */
  const offMessageSent = () => {
    if (socket.value) {
      socket.value.off('message_sent');
    }
  };

  /**
   * Notificar que el usuario está escribiendo
   */
  const emitTyping = (receiverId, senderId) => {
    if (socket.value && isConnected.value) {
      socket.value.emit('typing', {
        receiver_id: receiverId,
        sender_id: senderId
      });
    }
  };

  /**
   * Notificar que el usuario dejó de escribir
   */
  const emitStopTyping = (receiverId, senderId) => {
    if (socket.value && isConnected.value) {
      socket.value.emit('stop_typing', {
        receiver_id: receiverId,
        sender_id: senderId
      });
    }
  };

  /**
   * Escuchar cuando alguien está escribiendo
   */
  const onUserTyping = (callback) => {
    if (socket.value) {
      socket.value.on('user_typing', callback);
    }
  };

  /**
   * Remover listener de usuario escribiendo
   */
  const offUserTyping = () => {
    if (socket.value) {
      socket.value.off('user_typing');
    }
  };

  /**
   * Escuchar cuando alguien dejó de escribir
   */
  const onUserStopTyping = (callback) => {
    if (socket.value) {
      socket.value.on('user_stop_typing', callback);
    }
  };

  /**
   * Remover listener de usuario dejó de escribir
   */
  const offUserStopTyping = () => {
    if (socket.value) {
      socket.value.off('user_stop_typing');
    }
  };

  /**
   * Verificar si un usuario está online
   */
  const isUserOnline = (userId) => {
    return usersOnline.value.includes(userId.toString());
  };

  return {
    socket,
    isConnected,
    usersOnline,
    connect,
    disconnect,
    registerUser,
    sendMessage,
    onNewMessage,
    offNewMessage,
    onMessageSent,
    offMessageSent,
    emitTyping,
    emitStopTyping,
    onUserTyping,
    offUserTyping,
    onUserStopTyping,
    offUserStopTyping,
    isUserOnline
  };
}
