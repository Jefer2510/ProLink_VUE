import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// Interceptor global para manejar tokens expirados
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - cerrar sesión
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirigir a login si no estamos ya ahí
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

createApp(App)
  .use(router)
  .mount('#app')
