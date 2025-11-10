import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export function useGamification() {
  const userLevel = ref(null);
  const achievements = ref([]);
  const leaderboard = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const getUserLevel = async () => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/gamification/level`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      userLevel.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar nivel';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getUserAchievements = async () => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/gamification/achievements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      achievements.value = response.data.achievements;
      return response.data.achievements;
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar logros';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getLeaderboard = async (period = 'all') => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/gamification/leaderboard?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      leaderboard.value = response.data.leaderboard;
      return response.data.leaderboard;
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar ranking';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const checkAchievements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/gamification/check`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      console.error('Error checking achievements:', err);
      throw err;
    }
  };

  return {
    userLevel,
    achievements,
    leaderboard,
    loading,
    error,
    getUserLevel,
    getUserAchievements,
    getLeaderboard,
    checkAchievements
  };
}
