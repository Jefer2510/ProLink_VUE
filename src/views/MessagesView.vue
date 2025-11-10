<template>
  <div class="messages-view">
    <div class="messages-container">
      <!-- Sidebar de conversaciones -->
      <div class="conversations-sidebar">
        <div class="sidebar-header">
          <h2>💬 Mensajes</h2>
          <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
        </div>

        <div v-if="loading && conversations.length === 0" class="loading">
          <div class="spinner"></div>
        </div>

        <div v-else class="conversations-list">
          <div 
            v-for="conv in conversations" 
            :key="conv.contact_id"
            @click="selectConversation(conv)"
            class="conversation-item"
            :class="{ 
              active: selectedContact?.contact_id === conv.contact_id,
              unread: conv.unread_count > 0
            }"
          >
            <div class="avatar">{{ getInitials(conv.nombre, conv.apellido) }}</div>
            <div class="conv-info">
              <div class="conv-header">
                <span class="contact-name">{{ conv.nombre }} {{ conv.apellido }}</span>
                <span class="message-time">{{ formatTime(conv.last_message_time) }}</span>
              </div>
              <div class="last-message">
                <span v-if="conv.unread_count > 0" class="unread-dot"></span>
                {{ conv.last_message }}
              </div>
            </div>
          </div>

          <div v-if="conversations.length === 0" class="empty-conversations">
            <p>No hay conversaciones aún</p>
            <p class="hint">Conéctate con otros usuarios para empezar a chatear</p>
          </div>
        </div>
      </div>

      <!-- Área de chat -->
      <div class="chat-area">
        <div v-if="!selectedContact" class="no-conversation">
          <div class="empty-icon">💬</div>
          <h3>Selecciona una conversación</h3>
          <p>Elige un contacto para ver tus mensajes</p>
        </div>

        <div v-else class="active-chat">
          <div class="chat-header">
            <div class="avatar-wrapper">
              <div class="avatar">{{ getInitials(selectedContact.nombre, selectedContact.apellido) }}</div>
              <div v-if="isUserOnline(selectedContact.contact_id)" class="online-indicator"></div>
            </div>
            <div class="contact-info">
              <div class="contact-name">{{ selectedContact.nombre }} {{ selectedContact.apellido }}</div>
              <div class="contact-status">
                <span v-if="isTyping" class="typing-indicator">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                  escribiendo...
                </span>
                <span v-else-if="isUserOnline(selectedContact.contact_id)" class="online">● En línea</span>
                <span v-else class="offline">Desconectado</span>
              </div>
            </div>
          </div>

          <div class="messages-container" ref="messagesContainer">
            <div v-if="loading" class="loading">
              <div class="spinner"></div>
            </div>

            <div v-else class="messages-list" @scroll="handleScroll">
              <!-- Separadores de fecha y mensajes agrupados -->
              <template v-for="(group, dateKey) in groupedMessages" :key="dateKey">
                <div class="date-separator">
                  <span>{{ formatDateSeparator(dateKey) }}</span>
                </div>
                
                <template v-for="(messageGroup, groupIndex) in group" :key="`group-${groupIndex}`">
                  <div 
                    class="message-group"
                    :class="{ own: messageGroup[0].sender_id === currentUserId }"
                  >
                    <!-- Avatar solo en el primer mensaje del grupo -->
                    <div v-if="messageGroup[0].sender_id !== currentUserId" class="group-avatar">
                      <div class="avatar-small">{{ getInitials(selectedContact.nombre, selectedContact.apellido) }}</div>
                    </div>
                    
                    <div class="messages-wrapper">
                      <div 
                        v-for="(message, msgIndex) in messageGroup" 
                        :key="message.id"
                        :data-message-id="message.id"
                        class="message"
                        :class="{ 
                          own: message.sender_id === currentUserId,
                          'first-in-group': msgIndex === 0,
                          'last-in-group': msgIndex === messageGroup.length - 1
                        }"
                        @mouseenter="hoveredMessageId = message.id"
                        @mouseleave="hoveredMessageId = null"
                      >
                        <!-- Reacciones rápidas al hacer hover -->
                        <div v-if="hoveredMessageId === message.id" class="quick-reactions">
                          <button @click="addReaction(message.id, '❤️')" class="reaction-btn">❤️</button>
                          <button @click="addReaction(message.id, '👍')" class="reaction-btn">👍</button>
                          <button @click="addReaction(message.id, '😂')" class="reaction-btn">😂</button>
                          <button @click="addReaction(message.id, '😮')" class="reaction-btn">😮</button>
                          <button @click="addReaction(message.id, '😢')" class="reaction-btn">😢</button>
                        </div>
                        
                        <div class="message-bubble" :title="formatFullDate(message.created_at)">
                          <span>{{ message.content }}</span>
                          <div class="message-footer">
                            <span class="message-time">{{ formatTime(message.created_at) }}</span>
                            <!-- Indicadores de estado -->
                            <span v-if="message.sender_id === currentUserId" class="message-status">
                              <span v-if="message.status === 'sent'" class="status-sent">✓</span>
                              <span v-else-if="message.status === 'delivered'" class="status-delivered">✓✓</span>
                              <span v-else-if="message.status === 'read'" class="status-read">✓✓</span>
                            </span>
                          </div>
                        </div>
                        
                        <!-- Mostrar reacciones si existen -->
                        <div v-if="message.reactions && message.reactions.length > 0" class="message-reactions">
                          <span 
                            v-for="(reaction, idx) in getGroupedReactions(message.reactions)" 
                            :key="idx"
                            class="reaction-bubble"
                          >
                            {{ reaction.emoji }} {{ reaction.count > 1 ? reaction.count : '' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
            </div>
            
            <!-- Botón para bajar cuando hay mensajes nuevos -->
            <transition name="fade">
              <button 
                v-if="showScrollDownButton" 
                @click="scrollToBottom"
                class="scroll-down-btn"
              >
                <span class="arrow">↓</span>
                <span v-if="newMessagesCount > 0" class="new-messages-badge">{{ newMessagesCount }}</span>
              </button>
            </transition>
          </div>

          <!-- Barra de búsqueda -->
          <div v-if="showSearch" class="search-bar">
            <input 
              v-model="searchQuery"
              @input="searchMessages"
              type="text"
              placeholder="Buscar en la conversación..."
              class="search-input"
            />
            <div class="search-navigation">
              <button @click="previousSearchResult" :disabled="searchResults.length === 0">↑</button>
              <span>{{ currentSearchIndex + 1 }} / {{ searchResults.length }}</span>
              <button @click="nextSearchResult" :disabled="searchResults.length === 0">↓</button>
            </div>
            <button @click="closeSearch" class="close-search">✕</button>
          </div>

          <div class="message-input">
            <!-- Botones de acción -->
            <button @click="toggleSearch" class="action-btn search-toggle" title="Buscar">
              🔍
            </button>
            <button @click="openEmojiPicker" class="action-btn" title="Emojis">
              😊
            </button>
            <button @click="openFilePicker" class="action-btn" title="Adjuntar archivo">
              📎
            </button>
            
            <!-- Input mejorado con soporte multilinea -->
            <textarea 
              ref="messageInput"
              v-model="newMessage"
              @keydown.enter.exact="sendNewMessage"
              @keydown.enter.shift.exact="addNewLine"
              @input="handleTyping"
              placeholder="Escribe un mensaje... (Shift+Enter para nueva línea)"
              class="input-field"
              rows="1"
            ></textarea>
            
            <button 
              @click="sendNewMessage"
              :disabled="!newMessage.trim()"
              class="send-btn"
            >
              ➤
            </button>
          </div>
          
          <!-- Emoji Picker (simple) -->
          <div v-if="showEmojiPicker" class="emoji-picker">
            <div class="emoji-grid">
              <button 
                v-for="emoji in commonEmojis" 
                :key="emoji"
                @click="insertEmoji(emoji)"
                class="emoji-item"
              >
                {{ emoji }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useMessages } from '../composables/useMessages';
import { useSocket } from '../composables/useSocket';

const { 
  conversations, 
  currentConversation, 
  unreadCount,
  loading, 
  error,
  getConversations,
  getConversation,
  sendMessage,
  markAsRead,
  getUnreadCount
} = useMessages();

const {
  connect,
  disconnect,
  sendMessage: sendMessageRealtime,
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
  isUserOnline,
  isConnected
} = useSocket();

const selectedContact = ref(null);
const newMessage = ref('');
const currentUserId = ref(null);
const messagesContainer = ref(null);
const isTyping = ref(false);
const typingTimeout = ref(null);

// Nuevas variables reactivas para las mejoras
const hoveredMessageId = ref(null);
const showScrollDownButton = ref(false);
const newMessagesCount = ref(0);
const showSearch = ref(false);
const searchQuery = ref('');
const searchResults = ref([]);
const currentSearchIndex = ref(0);
const showEmojiPicker = ref(false);
const messageInput = ref(null);

// Emojis comunes para el picker
const commonEmojis = ['😀', '😂', '😍', '😊', '😎', '😢', '😭', '😡', '😱', '🤔', 
                      '👍', '👎', '👏', '🙏', '💪', '❤️', '💔', '🔥', '✨', '⭐',
                      '🎉', '🎊', '🎈', '🎁', '🎵', '🎶', '☕', '🍕', '🍔', '🍺'];

// Computed property para agrupar mensajes por fecha y remitente consecutivo
const groupedMessages = computed(() => {
  if (!currentConversation.value || currentConversation.value.length === 0) {
    return {};
  }
  
  const groups = {};
  let lastSenderId = null;
  let currentGroup = [];
  
  currentConversation.value.forEach((message, index) => {
    const messageDate = new Date(message.created_at);
    const dateKey = messageDate.toDateString();
    
    // Inicializar el grupo de fecha si no existe
    if (!groups[dateKey]) {
      groups[dateKey] = [];
      lastSenderId = null;
    }
    
    // Si el remitente es diferente al anterior, crear un nuevo grupo
    if (message.sender_id !== lastSenderId) {
      if (currentGroup.length > 0) {
        groups[dateKey].push([...currentGroup]);
      }
      currentGroup = [message];
      lastSenderId = message.sender_id;
    } else {
      // Mismo remitente, añadir al grupo actual
      currentGroup.push(message);
    }
    
    // Si es el último mensaje, añadir el grupo
    if (index === currentConversation.value.length - 1 && currentGroup.length > 0) {
      groups[dateKey].push([...currentGroup]);
    }
  });
  
  return groups;
});

const getInitials = (nombre, apellido) => {
  return `${nombre[0]}${apellido[0]}`.toUpperCase();
};

const formatDateSeparator = (dateKey) => {
  const date = new Date(dateKey);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Resetear horas para comparar solo fechas
  const todayStr = today.toDateString();
  const yesterdayStr = yesterday.toDateString();
  
  if (dateKey === todayStr) {
    return 'Hoy';
  } else if (dateKey === yesterdayStr) {
    return 'Ayer';
  } else {
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
    });
  }
};

const formatFullDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const addReaction = (messageId, emoji) => {
  // Buscar el mensaje en currentConversation
  const message = currentConversation.value.find(m => m.id === messageId);
  if (!message) return;
  
  // Inicializar reactions si no existe
  if (!message.reactions) {
    message.reactions = [];
  }
  
  // Verificar si el usuario ya reaccionó con este emoji
  const existingReaction = message.reactions.find(
    r => r.user_id === currentUserId.value && r.emoji === emoji
  );
  
  if (existingReaction) {
    // Eliminar reacción si ya existe
    message.reactions = message.reactions.filter(r => r !== existingReaction);
  } else {
    // Añadir nueva reacción
    message.reactions.push({
      user_id: currentUserId.value,
      emoji: emoji,
      created_at: new Date().toISOString()
    });
  }
  
  // TODO: Emitir evento Socket.IO para sincronizar con otros usuarios
  // socket.emit('message:reaction', { messageId, emoji, userId: currentUserId.value });
  
  hoveredMessageId.value = null;
};

const getGroupedReactions = (reactions) => {
  if (!reactions || reactions.length === 0) return [];
  
  const grouped = {};
  
  reactions.forEach(reaction => {
    if (!grouped[reaction.emoji]) {
      grouped[reaction.emoji] = {
        emoji: reaction.emoji,
        count: 0,
        users: []
      };
    }
    grouped[reaction.emoji].count++;
    grouped[reaction.emoji].users.push(reaction.user_id);
  });
  
  return Object.values(grouped);
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Resetear horas para comparar solo fechas
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffTime = today - messageDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const timeString = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  
  if (diffDays === 0) {
    // Hoy - solo mostrar hora
    return timeString;
  }
  if (diffDays === 1) {
    // Ayer - mostrar "Ayer" + hora
    return `Ayer ${timeString}`;
  }
  if (diffDays < 7) {
    // Esta semana - mostrar día de la semana + hora
    const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
    return `${dayName} ${timeString}`;
  }
  // Más de una semana - mostrar fecha completa + hora
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) + ` ${timeString}`;
};

const selectConversation = async (conv) => {
  selectedContact.value = conv;
  await getConversation(conv.contact_id);
  await markAsRead(conv.contact_id);
  
  // Update conversations list
  const convIndex = conversations.value.findIndex(c => c.contact_id === conv.contact_id);
  if (convIndex !== -1) {
    conversations.value[convIndex].unread_count = 0;
  }
  
  scrollToBottom();
};

const sendNewMessage = async () => {
  if (!newMessage.value.trim() || !selectedContact.value) return;
  
  const messageContent = newMessage.value;
  newMessage.value = '';
  
  try {
    // Enviar por HTTP (guardar en DB)
    await sendMessage(selectedContact.value.contact_id, messageContent);
    
    // Enviar en tiempo real via Socket.IO
    if (isConnected.value) {
      sendMessageRealtime(
        selectedContact.value.contact_id, 
        currentUserId.value, 
        messageContent
      );
    }
    
    // Actualizar conversación
    await getConversation(selectedContact.value.contact_id);
    scrollToBottom();
  } catch (err) {
    console.error('Error sending message:', err);
    newMessage.value = messageContent; // Restaurar mensaje si hay error
  }
};

const handleTyping = () => {
  if (!selectedContact.value || !isConnected.value) return;
  
  // Emitir typing
  emitTyping(selectedContact.value.contact_id, currentUserId.value);
  
  // Clear previous timeout
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
  }
  
  // Stop typing after 2 seconds
  typingTimeout.value = setTimeout(() => {
    emitStopTyping(selectedContact.value.contact_id, currentUserId.value);
  }, 2000);
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    const container = messagesContainer.value.querySelector('.messages-list');
    if (container) {
      container.scrollTop = container.scrollHeight;
      showScrollDownButton.value = false;
      newMessagesCount.value = 0;
    }
  }
};

const handleScroll = (event) => {
  const container = event.target;
  const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
  
  showScrollDownButton.value = !isAtBottom;
  
  if (isAtBottom) {
    newMessagesCount.value = 0;
  }
};

// Métodos de búsqueda
const searchMessages = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    currentSearchIndex.value = 0;
    return;
  }
  
  const query = searchQuery.value.toLowerCase();
  searchResults.value = currentConversation.value
    .map((msg, index) => ({ ...msg, originalIndex: index }))
    .filter(msg => msg.content.toLowerCase().includes(query));
  
  currentSearchIndex.value = 0;
  
  if (searchResults.value.length > 0) {
    scrollToSearchResult(0);
  }
};

const scrollToSearchResult = (index) => {
  if (searchResults.value.length === 0) return;
  
  const messageId = searchResults.value[index].id;
  const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
  
  if (messageElement) {
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    messageElement.classList.add('highlight-search');
    
    setTimeout(() => {
      messageElement.classList.remove('highlight-search');
    }, 2000);
  }
};

const nextSearchResult = () => {
  if (searchResults.value.length === 0) return;
  
  currentSearchIndex.value = (currentSearchIndex.value + 1) % searchResults.value.length;
  scrollToSearchResult(currentSearchIndex.value);
};

const previousSearchResult = () => {
  if (searchResults.value.length === 0) return;
  
  currentSearchIndex.value = currentSearchIndex.value === 0 
    ? searchResults.value.length - 1 
    : currentSearchIndex.value - 1;
  scrollToSearchResult(currentSearchIndex.value);
};

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
  if (!showSearch.value) {
    searchQuery.value = '';
    searchResults.value = [];
    currentSearchIndex.value = 0;
  }
};

const closeSearch = () => {
  showSearch.value = false;
  searchQuery.value = '';
  searchResults.value = [];
  currentSearchIndex.value = 0;
};

// Métodos de emoji picker
const openEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

const insertEmoji = (emoji) => {
  newMessage.value += emoji;
  showEmojiPicker.value = false;
  
  // Enfocar el input después de insertar emoji
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.focus();
    }
  });
};

const openFilePicker = () => {
  // TODO: Implementar selector de archivos
  alert('Funcionalidad de archivos en desarrollo');
};

const addNewLine = () => {
  newMessage.value += '\n';
};

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  currentUserId.value = user.id;
  
  // Conectar Socket.IO
  connect(currentUserId.value);
  
  // Cargar conversaciones
  await getConversations();
  await getUnreadCount();
  
  // Verificar si hay un contacto pre-seleccionado desde ConnectionsView
  const preSelectedContact = localStorage.getItem('selectedContact');
  if (preSelectedContact) {
    try {
      const contact = JSON.parse(preSelectedContact);
      await selectConversation(contact);
      localStorage.removeItem('selectedContact'); // Limpiar después de usar
    } catch (error) {
      console.error('Error al cargar contacto pre-seleccionado:', error);
    }
  }
  
  // Configurar listener de scroll
  await nextTick();
  const container = messagesContainer.value?.querySelector('.messages-list');
  if (container) {
    container.addEventListener('scroll', handleScroll);
  }
  
  // Escuchar nuevos mensajes en tiempo real
  onNewMessage(async (message) => {
    console.log('📩 Nuevo mensaje recibido:', message);
    
    // Si es de la conversación activa, actualizar
    if (selectedContact.value && 
        (message.sender_id === selectedContact.value.contact_id || 
         message.receiver_id === selectedContact.value.contact_id)) {
      
      const wasAtBottom = messagesContainer.value?.querySelector('.messages-list')?.scrollHeight - 
                          messagesContainer.value?.querySelector('.messages-list')?.scrollTop <= 
                          messagesContainer.value?.querySelector('.messages-list')?.clientHeight + 100;
      
      await getConversation(selectedContact.value.contact_id);
      
      if (wasAtBottom) {
        scrollToBottom();
      } else {
        // Mostrar botón con contador si no está al final
        newMessagesCount.value++;
        showScrollDownButton.value = true;
      }
    }
    
    // Actualizar lista de conversaciones
    await getConversations();
    await getUnreadCount();
  });
  
  // Escuchar confirmación de mensaje enviado
  onMessageSent((message) => {
    console.log('✅ Mensaje enviado confirmado:', message);
  });
  
  // Escuchar cuando alguien está escribiendo
  onUserTyping((data) => {
    if (selectedContact.value && data.sender_id === selectedContact.value.contact_id) {
      isTyping.value = true;
    }
  });
  
  // Escuchar cuando alguien dejó de escribir
  onUserStopTyping((data) => {
    if (selectedContact.value && data.sender_id === selectedContact.value.contact_id) {
      isTyping.value = false;
    }
  });
});

onUnmounted(() => {
  // Limpiar listeners
  offNewMessage();
  offMessageSent();
  offUserTyping();
  offUserStopTyping();
  
  // Desconectar Socket.IO
  disconnect();
});

watch(currentConversation, () => {
  scrollToBottom();
});

watch(newMessage, () => {
  if (newMessage.value) {
    handleTyping();
  }
});
</script>

<style scoped>
.messages-view {
  height: calc(100vh - 70px);
  background: linear-gradient(135deg, #0a0612 0%, #1a1625 50%, #2d1b4e 100%);
  background-attachment: fixed;
}

.messages-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  height: 100%;
  width: 100%;
  margin: 0;
  gap: 0;
}

@media (max-width: 768px) {
  .messages-container {
    grid-template-columns: 1fr;
  }
  
  .conversations-sidebar {
    display: none;
  }
}

.conversations-sidebar {
  background: rgba(15, 10, 26, 0.98);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(168, 85, 247, 0.2);
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 20px rgba(168, 85, 247, 0.15);
  min-width: 280px;
  max-width: 280px;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid rgba(168, 85, 247, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #7e22ce 0%, #a855f7 100%);
}

.sidebar-header h2 {
  font-size: 22px;
  font-weight: 700;
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.unread-badge {
  background: linear-gradient(135deg, #a855f7 0%, #c084fc 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  margin-bottom: 4px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.conversation-item:hover {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(126, 34, 206, 0.1) 100%);
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(168, 85, 247, 0.2);
}

.conversation-item.active {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(126, 34, 206, 0.15) 100%);
  border-left: 4px solid #a855f7;
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
}

.conversation-item.unread {
  background: rgba(168, 85, 247, 0.08);
  border-left: 3px solid #a855f7;
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
  border: 3px solid rgba(168, 85, 247, 0.2);
}

.conv-info {
  flex: 1;
  min-width: 0;
}

.conv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.contact-name {
  font-weight: 600;
  color: #e9d5ff;
  font-size: 15px;
}

.message-time {
  font-size: 12px;
  color: #a78bfa;
}

.last-message {
  font-size: 14px;
  color: #c4b5fd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 6px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: #a855f7;
  border-radius: 50%;
  flex-shrink: 0;
}

.empty-conversations {
  padding: 60px 20px;
  text-align: center;
  color: #a78bfa;
}

.hint {
  font-size: 14px;
  margin-top: 8px;
}

.chat-area {
  display: flex;
  flex-direction: column;
  background: rgba(15, 10, 26, 0.98);
  backdrop-filter: blur(10px);
}

.no-conversation {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(126, 34, 206, 0.05) 100%);
}

.no-conversation h3 {
  color: #c084fc;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.no-conversation p {
  color: #a78bfa;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
  filter: drop-shadow(0 4px 12px rgba(168, 85, 247, 0.4));
}

.active-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(168, 85, 247, 0.2);
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(15, 10, 26, 0.95);
  box-shadow: 0 2px 8px rgba(168, 85, 247, 0.15);
}

.contact-info {
  flex: 1;
}

.contact-status {
  font-size: 13px;
  color: #c084fc;
}

.avatar-wrapper {
  position: relative;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #a855f7;
  border: 2px solid rgba(15, 10, 26, 0.95);
  border-radius: 50%;
}

.typing-indicator {
  color: #c084fc;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-indicator .dot {
  width: 4px;
  height: 4px;
  background: #c084fc;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-6px);
  }
}

.online {
  color: #a855f7;
  font-weight: 500;
}

.offline {
  color: #6b21a8;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  background: linear-gradient(180deg, #0a0612 0%, #1a1625 100%);
  width: 100%;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

.message {
  display: flex;
  animation: slideIn 0.3s ease;
  width: 100%;
  clear: both;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.own {
  justify-content: flex-end;
  align-items: flex-end;
}

.message:not(.own) {
  justify-content: flex-start;
  align-items: flex-start;
}

.message-bubble {
  max-width: 50%;
  min-width: 100px;
  padding: 12px 16px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(168, 85, 247, 0.15);
  background: rgba(26, 22, 37, 0.9);
  border: 1px solid rgba(168, 85, 247, 0.25);
  transition: all 0.3s ease;
  color: #e9d5ff;
  word-wrap: break-word;
  width: fit-content;
}

.message.own .message-bubble {
  background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
  border: none;
  border-radius: 18px 18px 4px 18px;
}

.message:not(.own) .message-bubble {
  border-radius: 18px 18px 18px 4px;
}

.message-bubble:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(168, 85, 247, 0.3);
}

.message-bubble span {
  line-height: 1.5;
  font-size: 15px;
}

.message-bubble .message-time {
  font-size: 11px;
  opacity: 0.7;
  font-weight: 500;
  display: block;
  margin-top: 6px;
}

.message-input {
  padding: 20px 24px;
  border-top: 1px solid rgba(168, 85, 247, 0.2);
  display: flex;
  gap: 12px;
  background: rgba(15, 10, 26, 0.95);
  box-shadow: 0 -2px 12px rgba(168, 85, 247, 0.1);
}

.input-field {
  flex: 1;
  padding: 14px 20px;
  border: 2px solid rgba(168, 85, 247, 0.3);
  border-radius: 28px;
  font-size: 15px;
  outline: none;
  transition: all 0.3s ease;
  background: rgba(26, 22, 37, 0.6);
  color: #e9d5ff;
}

.input-field:focus {
  border-color: #a855f7;
  background: rgba(26, 22, 37, 0.9);
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
}

.send-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
  color: white;
  border: none;
  font-size: 22px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
}

.send-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #c084fc 0%, #a855f7 100%);
  transform: scale(1.1) rotate(15deg);
  box-shadow: 0 6px 20px rgba(168, 85, 247, 0.6);
}

.send-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #4c1d95;
  box-shadow: none;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(168, 85, 247, 0.2);
  border-top: 3px solid #a855f7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .messages-view {
    height: calc(100vh - 60px);
  }

  .sidebar-header {
    padding: 16px;
  }

  .sidebar-header h2 {
    font-size: 18px;
  }

  .conversation-item {
    padding: 12px;
  }

  .avatar {
    width: 44px;
    height: 44px;
    font-size: 16px;
  }

  .chat-header {
    padding: 16px;
  }

  .contact-info h3 {
    font-size: 16px;
  }

  .messages-container {
    padding: 12px 16px;
  }

  .message-bubble {
    max-width: 85%;
    padding: 9px 12px;
  }

  .message-bubble span {
    font-size: 14px;
  }

  .message-input {
    padding: 12px 16px;
    gap: 8px;
  }

  .input-field {
    padding: 12px 16px;
    font-size: 14px;
  }

  .send-btn {
    width: 44px;
    height: 44px;
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .message-bubble {
    max-width: 85%;
  }

  .sidebar-header h2 {
    font-size: 16px;
  }

  .input-field {
    padding: 10px 14px;
  }

  .send-btn {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
}

/* Nuevos estilos para mejoras de mensajería */

/* Date Separator */
.date-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0 16px;
  position: relative;
}

.date-separator::before,
.date-separator::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(168, 85, 247, 0.3), transparent);
}

.date-separator span {
  padding: 6px 16px;
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  margin: 0 16px;
  border: 1px solid rgba(168, 85, 247, 0.2);
  box-shadow: 0 2px 8px rgba(168, 85, 247, 0.1);
}

/* Message Group */
.message-group {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: flex-end;
}

.message-group.own {
  justify-content: flex-end;
}

.messages-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 70%;
}

.message-group.own .messages-wrapper {
  align-items: flex-end;
}

.message-group:not(.own) .messages-wrapper {
  align-items: flex-start;
}

.message-group-item {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  position: relative;
}

.message-group-item.own {
  justify-content: flex-end;
}

.group-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);
  border: 2px solid rgba(168, 85, 247, 0.2);
}

.message-group-item.own .group-avatar {
  order: 2;
}

.avatar-placeholder {
  width: 36px;
  flex-shrink: 0;
}

/* Quick Reactions */
.message-wrapper {
  position: relative;
  display: inline-block;
}

.quick-reactions {
  position: absolute;
  top: -36px;
  background: rgba(15, 10, 26, 0.98);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 28px;
  padding: 6px 8px;
  display: flex;
  gap: 4px;
  box-shadow: 0 4px 16px rgba(168, 85, 247, 0.3);
  z-index: 10;
  backdrop-filter: blur(10px);
  animation: fadeInScale 0.2s ease;
}

.message-group-item.own .quick-reactions {
  right: 0;
}

.message-group-item:not(.own) .quick-reactions {
  left: 48px;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.quick-reactions button {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.quick-reactions button:hover {
  background: rgba(168, 85, 247, 0.2);
  transform: scale(1.3);
}

/* Message Status Indicators */
.message-status {
  font-size: 14px;
  margin-left: 4px;
  display: inline-flex;
  gap: 1px;
}

.message-status.sent {
  color: rgba(255, 255, 255, 0.5);
}

.message-status.delivered {
  color: rgba(255, 255, 255, 0.7);
}

.message-status.read {
  color: #c084fc;
}

/* Message Reactions Display */
.message-reactions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.reaction-bubble {
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 12px;
  padding: 2px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reaction-bubble:hover {
  background: rgba(168, 85, 247, 0.25);
  transform: scale(1.1);
}

.reaction-bubble .emoji {
  font-size: 14px;
}

.reaction-bubble .count {
  font-size: 12px;
  color: #c084fc;
  font-weight: 600;
}

/* Scroll Down Button */
.scroll-down-btn {
  position: absolute;
  bottom: 90px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
  border: none;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(168, 85, 247, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;
}

.scroll-down-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(168, 85, 247, 0.7);
}

.scroll-down-btn .arrow {
  font-size: 24px;
  font-weight: bold;
}

.new-messages-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 700;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.5);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Search Bar */
.search-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(15, 10, 26, 0.98);
  border-bottom: 1px solid rgba(168, 85, 247, 0.3);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 20;
  box-shadow: 0 4px 16px rgba(168, 85, 247, 0.2);
  backdrop-filter: blur(10px);
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  background: rgba(26, 22, 37, 0.8);
  border: 2px solid rgba(168, 85, 247, 0.3);
  border-radius: 20px;
  color: #e9d5ff;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #a855f7;
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
}

.search-navigation {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #c084fc;
  font-size: 13px;
}

.search-navigation button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.search-navigation button:hover:not(:disabled) {
  background: rgba(168, 85, 247, 0.4);
  transform: scale(1.1);
}

.search-navigation button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.close-search {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: #c084fc;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.close-search:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: #fca5a5;
}

.highlight-search {
  animation: highlightPulse 1s ease;
}

@keyframes highlightPulse {
  0%, 100% {
    background: inherit;
  }
  50% {
    background: rgba(168, 85, 247, 0.3);
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
  }
}

/* Action Buttons (Search, Emoji, File) */
.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: rgba(168, 85, 247, 0.3);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
}

.action-btn.search-toggle {
  background: rgba(168, 85, 247, 0.2);
}

/* Enhanced Input Textarea */
.message-input textarea.input-field {
  resize: none;
  min-height: 50px;
  max-height: 150px;
  overflow-y: auto;
  line-height: 1.5;
  font-family: inherit;
}

/* Emoji Picker */
.emoji-picker {
  position: absolute;
  bottom: 80px;
  left: 24px;
  background: rgba(15, 10, 26, 0.98);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(168, 85, 247, 0.4);
  z-index: 30;
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.3s ease;
  max-width: 320px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.emoji-item {
  background: transparent;
  border: none;
  font-size: 28px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.emoji-item:hover {
  background: rgba(168, 85, 247, 0.2);
  transform: scale(1.3);
}

/* Scrollbar personalizado para emoji picker */
.emoji-grid::-webkit-scrollbar {
  width: 6px;
}

.emoji-grid::-webkit-scrollbar-track {
  background: rgba(168, 85, 247, 0.1);
  border-radius: 10px;
}

.emoji-grid::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.4);
  border-radius: 10px;
}

.emoji-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.6);
}

/* Scrollbar personalizado para mensajes */
.messages-list::-webkit-scrollbar {
  width: 8px;
}

.messages-list::-webkit-scrollbar-track {
  background: rgba(168, 85, 247, 0.05);
}

.messages-list::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.3);
  border-radius: 10px;
}

.messages-list::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.5);
}

/* Responsive para nuevas funcionalidades */
@media (max-width: 768px) {
  .scroll-down-btn {
    bottom: 70px;
    right: 16px;
    width: 44px;
    height: 44px;
  }

  .search-bar {
    padding: 10px 16px;
  }

  .emoji-picker {
    left: 16px;
    right: 16px;
    max-width: none;
    bottom: 70px;
  }

  .emoji-grid {
    grid-template-columns: repeat(5, 1fr);
  }

  .emoji-item {
    font-size: 24px;
  }

  .quick-reactions {
    top: -32px;
  }

  .quick-reactions button {
    font-size: 18px;
  }

  .action-btn {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
}
</style>
