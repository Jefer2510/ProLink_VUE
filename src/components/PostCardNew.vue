<template>
  <div class="bg-dark-900 rounded-lg shadow-lg p-6 mb-4 border border-dark-800">
    <!-- Post Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
          {{ post.nombre?.charAt(0) || 'U' }}{{ post.apellido?.charAt(0) || 'S' }}
        </div>
        <div>
          <h3 class="text-white font-semibold">{{ post.nombre }} {{ post.apellido }}</h3>
          <p class="text-sm text-gray-400">{{ post.headline || 'Profesional' }}</p>
          <p class="text-xs text-gray-500">{{ formatDate(post.created_at) }}</p>
        </div>
      </div>

      <button
        v-if="canDelete"
        @click="handleDelete"
        class="text-gray-400 hover:text-red-400 transition-colors"
        title="Eliminar publicación"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    </div>

    <!-- Post Content -->
    <div class="mb-4">
      <p class="text-gray-200 whitespace-pre-wrap">{{ post.content }}</p>
    </div>

    <!-- Post Image -->
    <div v-if="post.image_url" class="mb-4 rounded-lg overflow-hidden">
      <img :src="post.image_url" :alt="'Imagen de ' + post.nombre" class="w-full object-cover">
    </div>

    <!-- Like and Comment Counts -->
    <div v-if="likesCount > 0 || commentsCount > 0" class="flex items-center justify-between text-sm text-gray-400 mb-2 pb-2 border-b border-dark-800">
      <span v-if="likesCount > 0" class="hover:text-primary-400 cursor-pointer" @click="showComments = true">
        {{ likesCount }} me gusta
      </span>
      <span v-if="commentsCount > 0" class="hover:text-primary-400 cursor-pointer" @click="showComments = true">
        {{ commentsCount }} {{ commentsCount === 1 ? 'comentario' : 'comentarios' }}
      </span>
    </div>

    <!-- Post Actions -->
    <div class="flex items-center gap-6 pt-3 pb-3 border-b border-dark-800">
      <button 
        @click="toggleLike"
        :class="[
          'flex items-center gap-2 transition-colors',
          isLiked ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-primary-400'
        ]"
      >
        <svg class="w-5 h-5" :fill="isLiked ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
        <span class="text-sm font-medium">Me gusta</span>
      </button>

      <button 
        @click="showComments = !showComments"
        class="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        <span class="text-sm font-medium">Comentar</span>
      </button>

      <button 
        @click="showShareModal = true"
        class="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
        </svg>
        <span class="text-sm font-medium">Compartir</span>
      </button>
    </div>

    <!-- Share Modal -->
    <div
      v-if="showShareModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click.self="showShareModal = false"
    >
      <div class="bg-dark-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-white">Compartir publicación</h3>
          <button @click="showShareModal = false" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <p class="text-gray-300 mb-4">Selecciona una conexión para enviar este post:</p>
        
        <div v-if="loadingConnections" class="text-center py-8">
          <div class="spinner mx-auto mb-2"></div>
          <p class="text-gray-400">Cargando conexiones...</p>
        </div>
        
        <div v-else-if="connections.length === 0" class="text-center py-8 text-gray-400">
          No tienes conexiones aún
        </div>
        
        <div v-else class="space-y-2">
          <div 
            v-for="connection in connections" 
            :key="connection.contact_id"
            @click="sharePost(connection)"
            class="flex items-center gap-3 p-3 bg-dark-700 hover:bg-primary-900/20 rounded-lg cursor-pointer transition-colors"
          >
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {{ connection.nombre?.charAt(0) }}{{ connection.apellido?.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white font-semibold text-sm">{{ connection.nombre }} {{ connection.apellido }}</p>
              <p class="text-xs text-gray-400 truncate">{{ connection.headline || 'Profesional' }}</p>
            </div>
            <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Comments Section -->
    <div v-if="showComments" class="mt-4 space-y-4">
      <!-- Comment Input -->
      <div class="flex gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {{ user?.first_name?.charAt(0) || 'U' }}{{ user?.last_name?.charAt(0) || 'S' }}
        </div>
        <div class="flex-1">
          <textarea
            v-model="newComment"
            @keydown.ctrl.enter="handleComment"
            placeholder="Escribe un comentario..."
            class="w-full bg-dark-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows="2"
          ></textarea>
          <button
            v-if="newComment.trim()"
            @click="handleComment"
            class="mt-2 px-4 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Comentar
          </button>
        </div>
      </div>

      <!-- Comments List -->
      <div v-if="comments.length > 0" class="space-y-3">
        <div v-for="comment in comments" :key="comment.id" class="flex gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {{ comment.nombre?.charAt(0) }}{{ comment.apellido?.charAt(0) }}
          </div>
          <div class="flex-1 bg-dark-800 rounded-lg p-3">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-white font-semibold text-sm">{{ comment.nombre }} {{ comment.apellido }}</p>
                <p class="text-xs text-gray-400">{{ comment.headline || 'Profesional' }}</p>
              </div>
              <button
                v-if="user && user.id === comment.user_id"
                @click="handleDeleteComment(comment.id)"
                class="text-gray-400 hover:text-red-400 text-xs"
              >
                Eliminar
              </button>
            </div>
            <p class="text-gray-200 text-sm mt-2">{{ comment.content }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ formatDate(comment.created_at) }}</p>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-gray-400 text-sm py-4">
        No hay comentarios aún
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-dark-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-xl font-bold text-white mb-4">¿Eliminar publicación?</h3>
        <p class="text-gray-300 mb-6">Esta acción no se puede deshacer.</p>
        <div class="flex gap-3">
          <button
            @click="confirmDelete"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Eliminar
          </button>
          <button
            @click="showDeleteModal = false"
            class="flex-1 bg-dark-700 hover:bg-dark-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useInteractions } from '../composables/useInteractions';
import { useConnections } from '../composables/useConnections';
import { useMessages } from '../composables/useMessages';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['deleted', 'updated']);

const { user } = useAuth();
const { likePost, unlikePost, createComment, getPostComments, deleteComment } = useInteractions();
const { getConnections } = useConnections();
const { sendMessage } = useMessages();

const showDeleteModal = ref(false);
const showComments = ref(false);
const showShareModal = ref(false);
const newComment = ref('');
const comments = ref([]);
const connections = ref([]);
const loadingConnections = ref(false);
const isLiked = ref(false);
const likesCount = ref(props.post.likes_count || 0);
const commentsCount = ref(props.post.comments_count || 0);

const canDelete = computed(() => {
  return user.value && user.value.id === props.post.user_id;
});

const handleDelete = () => {
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  emit('deleted', props.post.id);
  showDeleteModal.value = false;
};

const toggleLike = async () => {
  try {
    if (isLiked.value) {
      await unlikePost(props.post.id);
      likesCount.value--;
    } else {
      await likePost(props.post.id);
      likesCount.value++;
    }
    isLiked.value = !isLiked.value;
    emit('updated');
  } catch (error) {
    console.error('Error al dar like:', error);
  }
};

const handleComment = async () => {
  if (!newComment.value.trim()) return;

  try {
    await createComment(props.post.id, newComment.value);
    newComment.value = '';
    await loadComments();
    commentsCount.value++;
    emit('updated');
  } catch (error) {
    console.error('Error al comentar:', error);
  }
};

const handleDeleteComment = async (commentId) => {
  try {
    await deleteComment(commentId);
    await loadComments();
    commentsCount.value--;
    emit('updated');
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
  }
};

const loadComments = async () => {
  try {
    const response = await getPostComments(props.post.id);
    comments.value = response.comments;
  } catch (error) {
    console.error('Error al cargar comentarios:', error);
  }
};

const loadConnections = async () => {
  loadingConnections.value = true;
  try {
    const result = await getConnections();
    // Filtrar solo conexiones aceptadas
    connections.value = result.filter(c => c.status === 'ACCEPTED');
  } catch (error) {
    console.error('Error al cargar conexiones:', error);
  } finally {
    loadingConnections.value = false;
  }
};

const sharePost = async (connection) => {
  try {
    const postUrl = `${window.location.origin}/feed#post-${props.post.id}`;
    const message = `📢 ${props.post.nombre} compartió:\n\n${props.post.content.substring(0, 100)}${props.post.content.length > 100 ? '...' : ''}\n\nVer post completo: ${postUrl}`;
    
    await sendMessage(connection.contact_id, message);
    
    showShareModal.value = false;
    
    // Mostrar notificación de éxito
    alert(`✅ Publicación compartida con ${connection.nombre} ${connection.apellido}`);
  } catch (error) {
    console.error('Error al compartir publicación:', error);
    alert('❌ Error al compartir la publicación');
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'Ahora';
  if (minutes < 60) return `Hace ${minutes}m`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7) return `Hace ${days}d`;
  
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short' 
  });
};

// Watch para cargar conexiones cuando se abre el modal
watch(showShareModal, (newValue) => {
  if (newValue) {
    loadConnections();
  }
});

// Watch showComments to load comments when toggled
watch(showComments, async (newVal) => {
  if (newVal) {
    await loadComments();
  }
});
</script>
