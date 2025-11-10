<template>
  <div class="level-badge">
    <div class="badge-icon">
      <span class="level-number">{{ level }}</span>
      <div class="badge-ring" :style="{ background: `conic-gradient(#a855f7 ${progress}%, rgba(168, 85, 247, 0.2) ${progress}%)` }"></div>
    </div>
    <div class="badge-info">
      <div class="level-title">Nivel {{ level }}</div>
      <div class="points-text">{{ points }} puntos</div>
      <div class="progress-text">{{ progress }}% al nivel {{ level + 1 }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  level: {
    type: Number,
    default: 1
  },
  points: {
    type: Number,
    default: 0
  },
  progress: {
    type: Number,
    default: 0
  }
});
</script>

<style scoped>
.level-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(26, 22, 37, 0.9);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.badge-icon {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  padding: 3px;
}

.level-number {
  position: relative;
  z-index: 1;
  font-size: 24px;
  font-weight: bold;
  color: #a855f7;
  background: rgba(26, 22, 37, 0.9);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.badge-info {
  flex: 1;
}

.level-title {
  font-weight: 600;
  font-size: 16px;
  color: #e9d5ff;
}

.points-text {
  font-size: 14px;
  color: #c4b5fd;
  margin-top: 2px;
}

.progress-text {
  font-size: 12px;
  color: #a855f7;
  margin-top: 4px;
}
</style>
