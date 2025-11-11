<template>
  <div class="profile-viewers-card">
    <div class="card-header">
      <div class="flex items-center gap-3">
        <div class="icon-container">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
        </div>
        <h3 class="section-title">Quién vio tu perfil</h3>
      </div>
      <span class="view-count">{{ viewers.length }} visitas</span>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando...</p>
    </div>

    <div v-else-if="viewers.length === 0" class="empty-state">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
      </svg>
      <p>Nadie ha visto tu perfil todavía</p>
    </div>

    <div v-else class="viewers-list">
      <div 
        v-for="viewer in viewers" 
        :key="viewer.id"
        class="viewer-item"
      >
        <div class="viewer-avatar">
          <img 
            v-if="viewer.profile_picture_url" 
            :src="viewer.profile_picture_url" 
            :alt="`${viewer.nombre} ${viewer.apellido}`"
          />
          <div v-else class="avatar-placeholder">
            {{ getInitials(viewer.nombre, viewer.apellido) }}
          </div>
        </div>
        
        <div class="viewer-info">
          <p class="viewer-name">{{ viewer.nombre }} {{ viewer.apellido }}</p>
          <p class="viewer-headline">{{ viewer.headline || 'Sin headline' }}</p>
          <p class="viewer-time">{{ formatTime(viewer.viewed_at) }}</p>
        </div>

        <div class="view-badge">
          <span v-if="viewer.view_count > 1">{{ viewer.view_count }}x</span>
        </div>
      </div>
    </div>

    <button 
      v-if="viewers.length > 0" 
      @click="$emit('viewAll')"
      class="view-all-btn"
    >
      Ver todos
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAnalytics } from '../composables/useAnalytics';

const { getProfileViewers, loading } = useAnalytics();
const viewers = ref([]);

const props = defineProps({
  limit: {
    type: Number,
    default: 5
  }
});

defineEmits(['viewAll']);

const getInitials = (nombre, apellido) => {
  return `${nombre[0]}${apellido[0]}`.toUpperCase();
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Justo ahora';
  if (diffMins < 60) return `Hace ${diffMins}m`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

onMounted(async () => {
  const result = await getProfileViewers(props.limit);
  if (result) {
    viewers.value = result;
  }
});
</script>

<style scoped>
.profile-viewers-card {
  background: rgba(26, 22, 37, 0.6);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.icon-container {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #e9d5ff;
}

.view-count {
  font-size: 14px;
  color: #a78bfa;
  background: rgba(168, 85, 247, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  color: #a78bfa;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(168, 85, 247, 0.2);
  border-top: 3px solid #a855f7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  color: #a78bfa;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.viewers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.viewer-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(15, 10, 26, 0.4);
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.viewer-item:hover {
  background: rgba(168, 85, 247, 0.1);
  transform: translateX(4px);
}

.viewer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.viewer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
}

.viewer-info {
  flex: 1;
  min-width: 0;
}

.viewer-name {
  font-weight: 600;
  color: #e9d5ff;
  font-size: 15px;
  margin-bottom: 2px;
}

.viewer-headline {
  font-size: 13px;
  color: #a78bfa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.viewer-time {
  font-size: 12px;
  color: #7e22ce;
}

.view-badge {
  background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 12px;
  min-width: 32px;
  text-align: center;
}

.view-all-btn {
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 12px;
  color: #c084fc;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.view-all-btn:hover {
  background: rgba(168, 85, 247, 0.2);
  transform: translateY(-2px);
}
</style>
