<script setup>
import DashboardButton from './components/DashboardButton.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div>
    <router-view />
    <!-- Mostrar botón solo si NO estás en login/register -->
    <DashboardButton v-if="route.path !== '/login' && route.path !== '/register'" />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
