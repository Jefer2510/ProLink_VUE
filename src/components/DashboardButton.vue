<template>
  <button 
    @click="goToDashboard"
    class="fixed bottom-6 right-6 z-50 group hover:scale-110 transition-all duration-300"
    title="Volver al Dashboard"
  >
    <div class="relative">
      <!-- Botón principal -->
      <div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full shadow-lg flex items-center justify-center hover:shadow-primary-500/50 hover:shadow-2xl transition-all duration-300">
        <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      </div>
      
      <!-- Pulso animado -->
      <div class="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-20"></div>
      
      <!-- Tooltip -->
      <div class="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div class="bg-dark-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl border border-primary-500/30">
          Volver al Dashboard
          <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-dark-800 border-r border-b border-primary-500/30"></div>
        </div>
      </div>
    </div>
  </button>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const goToDashboard = () => {
  // Si ya estás en el feed, scroll al top
  if (route.path === '/feed') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    router.push('/feed');
  }
};
</script>

<style scoped>
@keyframes ping {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
