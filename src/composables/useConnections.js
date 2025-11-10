import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Estado global de conexiones
const connections = ref([]);
const pendingRequests = ref([]);
const searchResults = ref([]);

export const useConnections = () => {
  /**
   * Buscar usuarios
   */
  const searchUsers = async (query) => {
    try {
      const response = await axios.get(`${API_URL}/connections/search`, {
        params: { q: query }
      });
      searchResults.value = response.data.users;
      return searchResults.value;
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      throw error;
    }
  };

  /**
   * Enviar solicitud de conexión
   */
  const sendConnectionRequest = async (userId) => {
    try {
      const response = await axios.post(`${API_URL}/connections`, {
        receiverId: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      throw error;
    }
  };

  /**
   * Aceptar solicitud de conexión
   */
  const acceptConnection = async (connectionId) => {
    try {
      await axios.put(`${API_URL}/connections/${connectionId}/accept`);
      await loadPendingRequests();
      await loadConnections();
    } catch (error) {
      console.error('Error al aceptar conexión:', error);
      throw error;
    }
  };

  /**
   * Rechazar/eliminar conexión
   */
  const rejectConnection = async (connectionId) => {
    try {
      await axios.delete(`${API_URL}/connections/${connectionId}`);
      await loadPendingRequests();
      await loadConnections();
    } catch (error) {
      console.error('Error al rechazar conexión:', error);
      throw error;
    }
  };

  /**
   * Cargar solicitudes pendientes
   */
  const loadPendingRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/connections/pending`);
      pendingRequests.value = response.data.requests;
      return pendingRequests.value;
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      throw error;
    }
  };

  /**
   * Cargar conexiones
   */
  const loadConnections = async () => {
    try {
      const response = await axios.get(`${API_URL}/connections`);
      connections.value = response.data.connections;
      return connections.value;
    } catch (error) {
      console.error('Error al cargar conexiones:', error);
      throw error;
    }
  };

  return {
    connections,
    pendingRequests,
    searchResults,
    searchUsers,
    sendConnectionRequest,
    acceptConnection,
    rejectConnection,
    loadPendingRequests,
    loadConnections
  };
};
