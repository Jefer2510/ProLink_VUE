<template>
  <div class="leaderboard-view">
    <div class="header">
      <h1>🏆 Ranking Global</h1>
      <p class="subtitle">Los usuarios más activos de ProLink</p>
    </div>

    <div class="period-selector">
      <button 
        v-for="p in periods" 
        :key="p.value"
        @click="selectedPeriod = p.value; loadLeaderboard()"
        :class="{ active: selectedPeriod === p.value }"
        class="period-btn"
      >
        {{ p.label }}
      </button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando ranking...</p>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="leaderboard-list">
      <div 
        v-for="(user, index) in leaderboard" 
        :key="user.user_id"
        class="leaderboard-item"
        :class="{ 
          'top-1': index === 0, 
          'top-2': index === 1, 
          'top-3': index === 2,
          'current-user': user.user_id === currentUserId 
        }"
      >
        <div class="rank">
          <span v-if="index < 3" class="medal">{{ getMedal(index) }}</span>
          <span v-else class="rank-number">#{{ user.rank }}</span>
        </div>
        
        <div class="user-info">
          <div class="user-name">{{ user.nombre }} {{ user.apellido }}</div>
          <div class="user-stats">
            <span class="level-badge">Nivel {{ user.level }}</span>
            <span class="points">{{ user.points }} pts</span>
            <span class="achievements">{{ user.achievements_count }} logros</span>
          </div>
        </div>

        <div v-if="user.user_id === currentUserId" class="you-badge">Tú</div>
      </div>

      <div v-if="leaderboard.length === 0" class="empty-state">
        <p>No hay datos para este período</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useGamification } from '../composables/useGamification';

const { leaderboard, loading, error, getLeaderboard } = useGamification();

const selectedPeriod = ref('all');
const currentUserId = ref(null);

const periods = [
  { value: 'all', label: 'Todo el tiempo' },
  { value: 'month', label: 'Este mes' },
  { value: 'week', label: 'Esta semana' }
];

const getMedal = (index) => {
  const medals = ['🥇', '🥈', '🥉'];
  return medals[index];
};

const loadLeaderboard = async () => {
  try {
    await getLeaderboard(selectedPeriod.value);
  } catch (err) {
    console.error('Error loading leaderboard:', err);
  }
};

onMounted(async () => {
  // Get current user ID from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  currentUserId.value = user.id;
  
  await loadLeaderboard();
});
</script>

<style scoped>
.leaderboard-view {
  max-width: 800px;
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

.period-selector {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.period-btn {
  padding: 10px 24px;
  border: 2px solid rgba(168, 85, 247, 0.2);
  background: rgba(26, 22, 37, 0.9);
  border-radius: 24px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.period-btn:hover {
  border-color: #a855f7;
  color: #a855f7;
}

.period-btn.active {
  background: #a855f7;
  color: white;
  border-color: #a855f7;
}

.loading {
  text-align: center;
  padding: 60px 20px;
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

.error-message {
  background: #fee;
  color: #c33;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(26, 22, 37, 0.9);
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  position: relative;
}

.leaderboard-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.leaderboard-item.top-1 {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border: 2px solid #ffd700;
}

.leaderboard-item.top-2 {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  border: 2px solid #c0c0c0;
}

.leaderboard-item.top-3 {
  background: linear-gradient(135deg, #cd7f32, #e8a872);
  border: 2px solid #cd7f32;
}

.leaderboard-item.current-user {
  border: 3px solid #a855f7;
  box-shadow: 0 4px 12px rgba(10, 102, 194, 0.3);
}

.rank {
  min-width: 50px;
  text-align: center;
}

.medal {
  font-size: 36px;
}

.rank-number {
  font-size: 24px;
  font-weight: bold;
  color: #c4b5fd;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #e9d5ff;
  margin-bottom: 8px;
}

.user-stats {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 14px;
}

.level-badge {
  background: #a855f7;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
}

.points {
  color: #c4b5fd;
  font-weight: 500;
}

.achievements {
  color: #c4b5fd;
}

.you-badge {
  background: #a855f7;
  color: white;
  padding: 6px 16px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #a78bfa;
}
</style>
