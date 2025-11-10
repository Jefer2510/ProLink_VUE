<template>
  <div class="min-h-screen bg-dark-950">
    <!-- Navbar -->
    <nav class="bg-dark-900 shadow-lg border-b border-dark-700 sticky top-0 z-10 backdrop-blur-sm bg-dark-900/95">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span class="text-xl font-bold text-white">P</span>
              </div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">ProLink</h1>
            </div>
            
            <!-- Navigation Links -->
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
                <span v-if="pendingConnectionsCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {{ pendingConnectionsCount }}
                </span>
              </router-link>

              <router-link to="/messages" class="text-gray-300 hover:text-primary-400 transition-colors relative">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
                <span v-if="unreadMessages > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {{ unreadMessages }}
                </span>
              </router-link>

              <router-link to="/analytics" class="text-gray-300 hover:text-primary-400 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </router-link>

              <router-link to="/leaderboard" class="text-gray-300 hover:text-primary-400 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
              </router-link>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-300">{{ user?.nombre }} {{ user?.apellido }}</span>
            <button
              @click="handleLogout"
              class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg hover:from-primary-700 hover:to-primary-800 transition shadow-lg shadow-primary-900/50"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Layout principal - 3 columnas -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Columna izquierda - Perfil rápido -->
        <aside class="lg:col-span-3">
          <div class="bg-dark-900 rounded-lg shadow-xl border border-dark-700 p-6 sticky top-24">
            <div class="text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-900/50">
                <span class="text-2xl font-bold text-white">
                  {{ userInitials }}
                </span>
              </div>
              <h3 class="font-semibold text-white">{{ user?.nombre }} {{ user?.apellido }}</h3>
              <p class="text-sm text-primary-400 mt-1">{{ user?.headline || 'Profesional' }}</p>
              <p class="text-xs text-gray-500 mt-2">{{ user?.email }}</p>
            </div>
            <div class="mt-6 pt-6 border-t border-dark-700">
              <div class="text-sm text-gray-400">
                <div class="flex justify-between py-2">
                  <span>Publicaciones</span>
                  <span class="font-semibold text-primary-400">{{ postsCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Columna central - Feed -->
        <main class="lg:col-span-6">
          <!-- Creador de publicaciones -->
          <PostCreator @post-created="handlePostCreated" />

          <!-- Mensajes de estado -->
          <div v-if="loading" class="bg-dark-900 rounded-lg shadow-xl border border-dark-700 p-8 text-center">
            <svg class="animate-spin h-8 w-8 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-4 text-gray-400">Cargando publicaciones...</p>
          </div>

          <div v-else-if="error" class="bg-red-900/20 rounded-lg shadow-xl border border-red-500/50 p-6 backdrop-blur-sm">
            <p class="text-red-300">{{ error }}</p>
            <button @click="loadFeed" class="mt-4 text-sm text-red-400 hover:text-red-300 font-medium">
              Intentar nuevamente
            </button>
          </div>

          <div v-else-if="posts.length === 0" class="bg-dark-900 rounded-lg shadow-xl border border-dark-700 p-8 text-center">
            <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <p class="text-gray-300">No hay publicaciones todavía</p>
            <p class="text-sm text-gray-500 mt-2">¡Sé el primero en compartir algo!</p>
          </div>

          <!-- Lista de publicaciones -->
          <div v-else class="space-y-4">
            <PostCard 
              v-for="post in posts" 
              :key="post.id" 
              :post="post"
              @deleted="handlePostDeleted"
              @updated="loadFeed"
            />
          </div>
        </main>

        <!-- Columna derecha - Widgets -->
        <aside class="lg:col-span-3">
          <!-- Gamification Badge -->
          <div class="bg-dark-900 rounded-lg shadow-xl border border-dark-700 p-6 mb-6 sticky top-24">
            <LevelBadge 
              v-if="userLevel"
              :level="userLevel.level"
              :points="userLevel.points"
              :progress="userLevel.progress"
            />
            <div v-if="userLevel" class="mt-4 pt-4 border-t border-dark-700">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400">Logros</span>
                <span class="text-primary-400 font-semibold">{{ userLevel.totalAchievements }}</span>
              </div>
              <router-link to="/leaderboard" class="block mt-3 text-center text-sm text-primary-400 hover:text-primary-300 font-medium">
                Ver Ranking →
              </router-link>
            </div>
          </div>

          <div class="bg-dark-900 rounded-lg shadow-xl border border-dark-700 p-6 sticky top-80">
            <h4 class="font-semibold text-white mb-4 text-sm">🔥 Quick Links</h4>
            <div class="space-y-2">
              <router-link to="/analytics" class="block text-sm p-3 rounded-lg hover:bg-dark-800 cursor-pointer transition text-gray-300 hover:text-primary-400">
                📊 Mi Dashboard
              </router-link>
              <router-link to="/messages" class="block text-sm p-3 rounded-lg hover:bg-dark-800 cursor-pointer transition text-gray-300 hover:text-primary-400 relative">
                💬 Mensajes
                <span v-if="unreadMessages > 0" class="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {{ unreadMessages }}
                </span>
              </router-link>
              <router-link to="/leaderboard" class="block text-sm p-3 rounded-lg hover:bg-dark-800 cursor-pointer transition text-gray-300 hover:text-primary-400">
                🏆 Ranking
              </router-link>
            </div>
          </div>
        </aside>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuth } from '../composables/useAuth';
import { useConnections } from '../composables/useConnections';
import { useGamification } from '../composables/useGamification';
import { useMessages } from '../composables/useMessages';
import PostCreator from '../components/PostCreator.vue';
import PostCard from '../components/PostCardNew.vue';
import LevelBadge from '../components/LevelBadge.vue';

const router = useRouter();
const { user, logout, isAuthenticated } = useAuth();
const { pendingRequests, loadPendingRequests } = useConnections();
const { userLevel, getUserLevel, checkAchievements } = useGamification();
const { unreadCount, getUnreadCount } = useMessages();

const posts = ref([]);
const loading = ref(false);
const error = ref('');

const pendingConnectionsCount = computed(() => pendingRequests.value.length);
const unreadMessages = computed(() => unreadCount.value);

const postsCount = computed(() => posts.value.length);

const userInitials = computed(() => {
  if (!user.value) return '?';
  const nombre = user.value.nombre || '';
  const apellido = user.value.apellido || '';
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase() || 'U';
});

// Cargar feed de publicaciones
const loadFeed = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await axios.get('http://localhost:3000/api/posts/feed');
    posts.value = response.data.posts || [];
  } catch (err) {
    console.error('Error al cargar feed:', err);
    
    // Si es error de autenticación, cerrar sesión y redirigir
    if (err.response?.status === 401 || err.response?.status === 403) {
      error.value = 'Sesión expirada. Redirigiendo al login...';
      setTimeout(() => {
        logout();
        router.push('/login');
      }, 2000);
    } else if (err.code === 'ERR_NETWORK') {
      error.value = 'Error de conexión. Verifica que el servidor esté ejecutándose en http://localhost:3000';
    } else {
      error.value = err.response?.data?.message || 'Error al cargar las publicaciones';
    }
  } finally {
    loading.value = false;
  }
};

// Manejar nueva publicación creada
const handlePostCreated = async (newPost) => {
  posts.value.unshift(newPost);
  // Check for new achievements after posting
  await checkAchievements();
  await getUserLevel();
};

// Manejar publicación eliminada
const handlePostDeleted = (postId) => {
  posts.value = posts.value.filter(post => post.id !== postId);
};

// Cerrar sesión
const handleLogout = () => {
  logout();
  router.push('/login');
};

// Verificar autenticación y cargar feed al montar
onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push('/login');
    return;
  }
  
  await Promise.all([
    loadFeed(), 
    loadPendingRequests(),
    getUserLevel(),
    getUnreadCount()
  ]);
});
</script>
