import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export function useMessages() {
  const conversations = ref([]);
  const currentConversation = ref([]);
  const unreadCount = ref(0);
  const loading = ref(false);
  const error = ref(null);

  const sendMessage = async (receiverId, content) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/messages`, 
        { receiverId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al enviar mensaje';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getConversations = async () => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      conversations.value = response.data.conversations;
      return response.data.conversations;
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar conversaciones';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getConversation = async (contactId) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/messages/conversation/${contactId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      currentConversation.value = response.data.messages;
      return response.data.messages;
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar conversación';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/messages/unread`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      unreadCount.value = response.data.unreadCount;
      return response.data.unreadCount;
    } catch (err) {
      console.error('Error getting unread count:', err);
      throw err;
    }
  };

  const markAsRead = async (contactId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/messages/${contactId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await getUnreadCount();
    } catch (err) {
      console.error('Error marking as read:', err);
      throw err;
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Error deleting message:', err);
      throw err;
    }
  };

  return {
    conversations,
    currentConversation,
    unreadCount,
    loading,
    error,
    sendMessage,
    getConversations,
    getConversation,
    getUnreadCount,
    markAsRead,
    deleteMessage
  };
}
