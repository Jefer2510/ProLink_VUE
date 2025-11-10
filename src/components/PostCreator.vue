<template>
  <div class="bg-dark-900 rounded-lg shadow-xl border border-dark-700 p-6 mb-6">
    <div class="flex space-x-4">
      <div class="flex-shrink-0">
        <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg shadow-primary-900/50">
          <span class="text-lg font-semibold text-white">
            {{ userInitials }}
          </span>
        </div>
      </div>
      
      <div class="flex-1">
        <textarea
          v-model="content"
          @focus="expanded = true"
          :rows="expanded ? 4 : 1"
          class="w-full px-4 py-2 bg-dark-800 border border-dark-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all placeholder-gray-500"
          :placeholder="expanded ? '¿Qué quieres compartir?' : 'Crear una publicación...'"
        ></textarea>

        <!-- Mensaje de error -->
        <div v-if="error" class="mt-2 text-sm text-red-400">
          {{ error }}
        </div>

        <!-- Mensaje de éxito -->
        <div v-if="success" class="mt-2 text-sm text-primary-400">
          ¡Publicación creada exitosamente!
        </div>

        <div v-if="expanded" class="mt-4 flex items-center justify-between">
          <div class="flex space-x-2">
            <button
              type="button"
              class="p-2 text-gray-400 hover:text-primary-400 hover:bg-dark-800 rounded-lg transition"
              title="Agregar imagen"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>

          <div class="flex space-x-2">
            <button
              @click="handleCancel"
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-400 hover:bg-dark-800 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              @click="handleSubmit"
              :disabled="loading || !content.trim()"
              type="button"
              class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-primary-900/50"
            >
              <span v-if="loading">Publicando...</span>
              <span v-else>Publicar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useAuth } from '../composables/useAuth';

const emit = defineEmits(['post-created']);

const { user } = useAuth();

const content = ref('');
const expanded = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref(false);

const userInitials = computed(() => {
  if (!user.value) return '?';
  const nombre = user.value.nombre || '';
  const apellido = user.value.apellido || '';
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase() || 'U';
});

const handleSubmit = async () => {
  if (!content.value.trim()) {
    error.value = 'El contenido no puede estar vacío';
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = false;

  try {
    const response = await axios.post('http://localhost:3000/api/posts', {
      content: content.value.trim(),
      image_url: null
    });

    success.value = true;
    
    // Emitir evento con la nueva publicación
    const newPost = {
      id: response.data.post.id,
      content: response.data.post.content,
      image_url: response.data.post.image_url,
      created_at: new Date().toISOString(),
      user_id: user.value.id,
      nombre: user.value.nombre,
      apellido: user.value.apellido,
      email: user.value.email,
      headline: user.value.headline
    };
    
    emit('post-created', newPost);

    // Reset form
    setTimeout(() => {
      content.value = '';
      expanded.value = false;
      success.value = false;
    }, 1500);

  } catch (err) {
    console.error('Error al crear publicación:', err);
    error.value = err.response?.data?.message || 'Error al crear la publicación';
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  content.value = '';
  expanded.value = false;
  error.value = '';
  success.value = false;
};
</script>
