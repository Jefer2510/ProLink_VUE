<template>
  <div class="analytics-view">
    <div class="header">
      <h1>📊 Mi Dashboard</h1>
      <p class="subtitle">Estadísticas de tu perfil y actividad</p>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando estadísticas...</p>
    </div>

    <div v-else class="analytics-grid">
      <!-- Stats Cards -->
      <div class="stats-row">
        <div class="stat-card primary">
          <div class="stat-icon">👁️</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats?.profileViews?.total_views || 0 }}</div>
            <div class="stat-label">Vistas de Perfil</div>
            <div class="stat-detail">{{ stats?.profileViews?.unique_viewers || 0 }} visitantes únicos</div>
          </div>
        </div>

        <div class="stat-card success">
          <div class="stat-icon">🤝</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats?.connections || 0 }}</div>
            <div class="stat-label">Conexiones</div>
            <div class="stat-detail">Tu red profesional</div>
          </div>
        </div>

        <div class="stat-card warning">
          <div class="stat-icon">📝</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats?.postEngagement?.total_posts || 0 }}</div>
            <div class="stat-label">Publicaciones</div>
            <div class="stat-detail">{{ stats?.postEngagement?.total_likes || 0 }} likes totales</div>
          </div>
        </div>

        <div class="stat-card info">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <div class="stat-value">#{{ stats?.ranking || '-' }}</div>
            <div class="stat-label">Ranking</div>
            <div class="stat-detail">En la plataforma</div>
          </div>
        </div>
      </div>

      <!-- Best Posting Time -->
      <div class="card">
        <h3>⏰ Mejor Hora para Publicar</h3>
        <div v-if="bestPostingTime" class="best-time">
          <div class="time-display">
            {{ bestPostingTime.best_hour }}:00
          </div>
          <p class="time-detail">
            Promedio de {{ Math.round(bestPostingTime.avg_engagement) }} interacciones a esta hora
          </p>
        </div>
        <div v-else class="empty-state">
          <p>Necesitas más publicaciones para calcular el mejor horario</p>
        </div>
      </div>

      <!-- Profile Viewers -->
      <ProfileViewers :limit="5" @viewAll="viewAllViewers" />

      <!-- Post Analytics -->
      <div class="card posts-card">
        <h3>📈 Rendimiento de Posts (últimos 30 días)</h3>
        <div v-if="postAnalytics.length > 0" class="posts-analytics">
          <div class="analytics-summary">
            <div class="summary-item">
              <span class="label">Total Likes:</span>
              <span class="value">{{ getTotalLikes() }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Total Comentarios:</span>
              <span class="value">{{ getTotalComments() }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Engagement Promedio:</span>
              <span class="value">{{ getAvgEngagement() }}</span>
            </div>
          </div>

          <div class="timeline">
            <div v-for="day in postAnalytics.slice(0, 10)" :key="day.post_date" class="timeline-item">
              <div class="timeline-date">{{ formatDate(day.post_date) }}</div>
              <div class="timeline-bar">
                <div 
                  class="bar likes" 
                  :style="{ width: getBarWidth(day.likes, 'likes') + '%' }"
                  :title="`${day.likes} likes`"
                ></div>
                <div 
                  class="bar comments" 
                  :style="{ width: getBarWidth(day.comments, 'comments') + '%' }"
                  :title="`${day.comments} comentarios`"
                ></div>
              </div>
              <div class="timeline-stats">
                <span class="likes-count">❤️ {{ day.likes }}</span>
                <span class="comments-count">💬 {{ day.comments }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>No hay datos de posts en los últimos 30 días</p>
        </div>
      </div>

      <!-- Network Growth -->
      <div class="card growth-card">
        <h3>📊 Crecimiento de Red (últimos 6 meses)</h3>
        <div v-if="networkGrowth.length > 0" class="growth-chart">
          <div v-for="month in networkGrowth" :key="month.month" class="growth-item">
            <div class="month-label">{{ formatMonth(month.month) }}</div>
            <div class="growth-bar-container">
              <div 
                class="growth-bar" 
                :style="{ height: getGrowthHeight(month.new_connections) + 'px' }"
              ></div>
            </div>
            <div class="growth-value">{{ month.new_connections }}</div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>No hay datos de crecimiento aún</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAnalytics } from '../composables/useAnalytics';
import ProfileViewers from '../components/ProfileViewers.vue';

const { 
  stats, 
  viewers, 
  postAnalytics, 
  bestPostingTime, 
  networkGrowth,
  loading,
  getStats,
  getViewers,
  getPostAnalytics,
  getBestPostingTime,
  getNetworkGrowth
} = useAnalytics();

const getInitials = (nombre, apellido) => {
  return `${nombre[0]}${apellido[0]}`.toUpperCase();
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

const formatMonth = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
};

const getTotalLikes = () => {
  return postAnalytics.value.reduce((sum, day) => sum + day.likes, 0);
};

const getTotalComments = () => {
  return postAnalytics.value.reduce((sum, day) => sum + day.comments, 0);
};

const getAvgEngagement = () => {
  if (postAnalytics.value.length === 0) return 0;
  const total = getTotalLikes() + getTotalComments();
  return Math.round(total / postAnalytics.value.length);
};

const getBarWidth = (value, type) => {
  const maxValue = Math.max(...postAnalytics.value.map(d => type === 'likes' ? d.likes : d.comments));
  return maxValue > 0 ? (value / maxValue) * 100 : 0;
};

const getGrowthHeight = (value) => {
  const maxValue = Math.max(...networkGrowth.value.map(m => m.new_connections));
  return maxValue > 0 ? (value / maxValue) * 100 + 20 : 20;
};

const viewAllViewers = () => {
  // Aquí puedes implementar un modal o navegar a una página con todos los viewers
  alert('Funcionalidad de ver todos los visitantes - próximamente');
};

onMounted(async () => {
  try {
    await Promise.all([
      getStats(),
      getPostAnalytics(30),
      getBestPostingTime(),
      getNetworkGrowth(6)
    ]);
  } catch (err) {
    console.error('Error loading analytics:', err);
  }
});
</script>

<style scoped>
.analytics-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 32px;
  font-weight: bold;
  color: #e9d5ff;
  margin-bottom: 8px;
}

.subtitle {
  color: #c4b5fd;
  font-size: 16px;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #c4b5fd;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(168, 85, 247, 0.15);
  border-top: 4px solid #a855f7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.analytics-grid {
  display: grid;
  gap: 20px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.stat-card {
  background: rgba(26, 22, 37, 0.9);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  gap: 16px;
  align-items: center;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card.primary { border-left: 4px solid #a855f7; }
.stat-card.success { border-left: 4px solid #a855f7; }
.stat-card.warning { border-left: 4px solid #f39c12; }
.stat-card.info { border-left: 4px solid #9b59b6; }

.stat-icon {
  font-size: 36px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #e9d5ff;
}

.stat-label {
  font-size: 14px;
  color: #c4b5fd;
  margin-top: 4px;
}

.stat-detail {
  font-size: 12px;
  color: #a78bfa;
  margin-top: 4px;
}

.card {
  background: rgba(26, 22, 37, 0.9);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #e9d5ff;
  margin: 0 0 20px 0;
}

.best-time {
  text-align: center;
  padding: 20px;
}

.time-display {
  font-size: 48px;
  font-weight: bold;
  color: #a855f7;
  margin-bottom: 12px;
}

.time-detail {
  color: #c4b5fd;
  font-size: 14px;
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
  background: #f8f9fa;
  border-radius: 8px;
}

.viewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7, #7e22ce);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.viewer-info {
  flex: 1;
}

.viewer-name {
  font-weight: 600;
  color: #e9d5ff;
  font-size: 14px;
}

.viewer-time {
  font-size: 12px;
  color: #a78bfa;
  margin-top: 2px;
}

.posts-analytics {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.analytics-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-item .label {
  font-size: 14px;
  color: #c4b5fd;
}

.summary-item .value {
  font-size: 20px;
  font-weight: bold;
  color: #a855f7;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.timeline-item {
  display: grid;
  grid-template-columns: 80px 1fr 120px;
  gap: 12px;
  align-items: center;
}

.timeline-date {
  font-size: 12px;
  color: #c4b5fd;
}

.timeline-bar {
  height: 24px;
  background: #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  gap: 2px;
}

.bar {
  height: 100%;
  transition: width 0.3s ease;
}

.bar.likes {
  background: linear-gradient(90deg, #e74c3c, #c0392b);
}

.bar.comments {
  background: linear-gradient(90deg, #3498db, #2980b9);
}

.timeline-stats {
  display: flex;
  gap: 12px;
  font-size: 13px;
}

.likes-count {
  color: #e74c3c;
}

.comments-count {
  color: #3498db;
}

.growth-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
  padding: 20px 0;
}

.growth-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.growth-bar-container {
  height: 120px;
  display: flex;
  align-items: flex-end;
}

.growth-bar {
  width: 40px;
  background: linear-gradient(180deg, #a855f7, #7e22ce);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}

.month-label {
  font-size: 12px;
  color: #c4b5fd;
  font-weight: 500;
}

.growth-value {
  font-size: 14px;
  font-weight: bold;
  color: #a855f7;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #a78bfa;
}
</style>
