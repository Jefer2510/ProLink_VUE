<template>
  <div class="achievement-card" :class="{ unlocked }">
    <div class="achievement-icon">{{ icon }}</div>
    <div class="achievement-info">
      <div class="achievement-name">{{ name }}</div>
      <div class="achievement-points">+{{ points }} puntos</div>
      <div v-if="unlocked && unlockedAt" class="unlocked-date">
        Desbloqueado {{ formatDate(unlockedAt) }}
      </div>
    </div>
    <div v-if="unlocked" class="unlocked-badge">✓</div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  unlocked: {
    type: Boolean,
    default: false
  },
  unlockedAt: {
    type: String,
    default: null
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};
</script>

<style scoped>
.achievement-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(26, 22, 37, 0.9);
  border: 2px solid rgba(168, 85, 247, 0.2);
  border-radius: 8px;
  position: relative;
  transition: all 0.3s ease;
}

.achievement-card:not(.unlocked) {
  opacity: 0.5;
  filter: grayscale(1);
}

.achievement-card.unlocked {
  border-color: #a855f7;
  box-shadow: 0 2px 8px rgba(10, 102, 194, 0.2);
}

.achievement-icon {
  font-size: 36px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f6f8;
  border-radius: 50%;
}

.achievement-card.unlocked .achievement-icon {
  background: linear-gradient(135deg, #a855f7, #7e22ce);
}

.achievement-info {
  flex: 1;
}

.achievement-name {
  font-weight: 600;
  font-size: 16px;
  color: #e9d5ff;
}

.achievement-points {
  font-size: 14px;
  color: #a855f7;
  font-weight: 500;
  margin-top: 2px;
}

.unlocked-date {
  font-size: 12px;
  color: #c4b5fd;
  margin-top: 4px;
}

.unlocked-badge {
  width: 28px;
  height: 28px;
  background: #a855f7;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
}
</style>
