import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import AuthView from '../views/AuthView.vue';
import FeedView from '../views/FeedView.vue';
import ConnectionsView from '../views/ConnectionsView.vue';
import MessagesView from '../views/MessagesView.vue';
import AnalyticsView from '../views/AnalyticsView.vue';
import LeaderboardView from '../views/LeaderboardView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: () => {
      const token = localStorage.getItem('token');
      return token ? '/feed' : '/login';
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: AuthView,
    props: { type: 'login' },
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: AuthView,
    props: { type: 'register' },
    meta: { requiresGuest: true }
  },
  {
    path: '/feed',
    name: 'Feed',
    component: FeedView,
    meta: { requiresAuth: true }
  },
  {
    path: '/connections',
    name: 'Connections',
    component: ConnectionsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: MessagesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: AnalyticsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: LeaderboardView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const isAuthenticated = !!(token && user);

  // Rutas que requieren autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Limpiar datos inválidos
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    next('/login');
  }
  // Rutas solo para usuarios no autenticados (login, register)
  else if (to.meta.requiresGuest && isAuthenticated) {
    next('/feed');
  }
  // Redirigir raíz según autenticación
  else if (to.path === '/' && !isAuthenticated) {
    next('/login');
  }
  else {
    next();
  }
});

export default router;
