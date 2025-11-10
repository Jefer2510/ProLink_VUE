<template>
  <div class="min-h-screen bg-dark-950">
    <!-- Navbar -->
    <nav class="bg-dark-900 border-b border-dark-800 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-8">
            <router-link to="/feed" class="text-2xl font-bold text-primary-400">
              ProLink
            </router-link>
            
            <!-- Search Bar -->
            <div class="relative w-64">
              <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                placeholder="Buscar personas..."
                class="w-full bg-dark-800 text-white rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <div class="flex items-center gap-6">
            <router-link to="/feed" class="text-gray-300 hover:text-primary-400 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            </router-link>

            <router-link to="/connections" class="text-gray-300 hover:text-primary-400 transition-colors relative">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span v-if="pendingRequests.length > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ pendingRequests.length }}
              </span>
            </router-link>

            <button @click="logout" class="text-gray-300 hover:text-red-400 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Search Results Dropdown -->
      <div v-if="searchResults.length > 0" class="absolute top-16 left-1/2 transform -translate-x-1/2 w-96 bg-dark-800 border border-dark-700 rounded-lg shadow-xl mt-2 max-h-96 overflow-y-auto">
        <div v-for="user in searchResults" :key="user.id" class="p-4 hover:bg-dark-700 cursor-pointer border-b border-dark-700 last:border-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
                {{ user.nombre.charAt(0) }}{{ user.apellido.charAt(0) }}
              </div>
              <div>
                <p class="text-white font-semibold">{{ user.nombre }} {{ user.apellido }}</p>
                <p class="text-sm text-gray-400">{{ user.headline || 'Profesional' }}</p>
              </div>
            </div>
            <button
              v-if="!user.connection_status"
              @click="sendRequest(user.id)"
              class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Conectar
            </button>
            <span v-else-if="user.connection_status === 'PENDING'" class="text-xs text-gray-400">
              Pendiente
            </span>
            <span v-else-if="user.connection_status === 'ACCEPTED'" class="text-xs text-green-400">
              ✓ Conectado
            </span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Connections Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-dark-900 rounded-lg shadow-lg p-6 sticky top-24">
            <h2 class="text-xl font-bold text-white mb-4">
              Mis Conexiones
              <span class="text-primary-400 text-sm ml-2">({{ connections.length }})</span>
            </h2>
            
            <div v-if="connections.length === 0" class="text-gray-400 text-sm text-center py-8">
              No tienes conexiones aún
            </div>

            <div v-else class="space-y-3 max-h-96 overflow-y-auto">
              <div
                v-for="connection in connections"
                :key="connection.connection_id"
                class="flex items-center gap-3 p-3 hover:bg-dark-800 rounded-lg transition-colors group"
              >
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
                  {{ connection.nombre.charAt(0) }}{{ connection.apellido.charAt(0) }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-white font-medium text-sm truncate">
                    {{ connection.nombre }} {{ connection.apellido }}
                  </p>
                  <p class="text-xs text-gray-400 truncate">
                    {{ connection.headline || 'Profesional' }}
                  </p>
                </div>
                <button
                  @click="goToMessages(connection)"
                  class="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  title="Enviar mensaje"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  Mensaje
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pending Requests -->
        <div class="lg:col-span-2">
          <div v-if="pendingRequests.length > 0" class="bg-dark-900 rounded-lg shadow-lg p-6 mb-6">
            <h2 class="text-xl font-bold text-white mb-4">
              Solicitudes Pendientes
              <span class="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                {{ pendingRequests.length }}
              </span>
            </h2>

            <div class="space-y-4">
              <div
                v-for="request in pendingRequests"
                :key="request.connection_id"
                class="flex items-center justify-between p-4 bg-dark-800 rounded-lg"
              >
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
                    {{ request.nombre.charAt(0) }}{{ request.apellido.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-white font-semibold">
                      {{ request.nombre }} {{ request.apellido }}
                    </p>
                    <p class="text-sm text-gray-400">
                      {{ request.headline || 'Profesional' }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ formatDate(request.created_at) }}
                    </p>
                  </div>
                </div>

                <div class="flex gap-2">
                  <button
                    @click="acceptRequest(request.connection_id)"
                    class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Aceptar
                  </button>
                  <button
                    @click="rejectRequest(request.connection_id)"
                    class="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- No content message -->
          <div v-if="pendingRequests.length === 0 && connections.length === 0" class="bg-dark-900 rounded-lg shadow-lg p-12 text-center">
            <svg class="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h3 class="text-2xl font-bold text-white mb-2">Comienza a conectar</h3>
            <p class="text-gray-400">Usa el buscador para encontrar personas y enviar solicitudes de conexión</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useConnections } from '../composables/useConnections';

const router = useRouter();
const { logout: authLogout } = useAuth();
const {
  connections,
  pendingRequests,
  searchResults,
  searchUsers,
  sendConnectionRequest,
  acceptConnection,
  rejectConnection,
  loadPendingRequests,
  loadConnections
} = useConnections();

const searchQuery = ref('');
let searchTimeout = null;

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  
  if (searchQuery.value.trim().length < 2) {
    searchResults.value = [];
    return;
  }

  searchTimeout = setTimeout(async () => {
    try {
      await searchUsers(searchQuery.value);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    }
  }, 300);
};

const sendRequest = async (userId) => {
  try {
    await sendConnectionRequest(userId);
    // Actualizar resultados de búsqueda
    await searchUsers(searchQuery.value);
  } catch (error) {
    console.error('Error al enviar solicitud:', error);
  }
};

const acceptRequest = async (connectionId) => {
  try {
    await acceptConnection(connectionId);
  } catch (error) {
    console.error('Error al aceptar:', error);
  }
};

const rejectRequest = async (connectionId) => {
  try {
    await rejectConnection(connectionId);
  } catch (error) {
    console.error('Error al rechazar:', error);
  }
};

const logout = () => {
  authLogout();
};

const goToMessages = (connection) => {
  // Guardar el contacto seleccionado en localStorage para que MessagesView lo cargue
  localStorage.setItem('selectedContact', JSON.stringify({
    contact_id: connection.user_id,
    nombre: connection.nombre,
    apellido: connection.apellido,
    headline: connection.headline
  }));
  
  // Navegar a la vista de mensajes
  router.push('/messages');
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  if (days < 7) return `Hace ${days} días`;
  return date.toLocaleDateString('es-ES');
};

onMounted(async () => {
  try {
    await Promise.all([loadPendingRequests(), loadConnections()]);
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
});
</script>
