import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export function useAnalytics() {
  const stats = ref(null);
  const viewers = ref([]);
  const postAnalytics = ref([]);
  const bestPostingTime = ref(null);
  const networkGrowth = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const recordProfileView = async (profileId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/analytics/view/${profileId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Error recording profile view:', err);
    }
  };

  const getStats = async () => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/analytics/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      stats.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar estadísticas';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getProfileViewers = async (limit = 10) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/analytics/viewers?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      viewers.value = response.data.viewers;
      return response.data.viewers;
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar visitantes';
      console.error('Error al cargar visitantes:', err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const getPostAnalytics = async (days = 30) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/analytics/posts?days=${days}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      postAnalytics.value = response.data.analytics;
      return response.data.analytics;
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar analytics de posts';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getBestPostingTime = async () => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/analytics/best-time`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      bestPostingTime.value = response.data.bestTime;
      return response.data.bestTime;
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar mejor hora';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getNetworkGrowth = async (months = 6) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/analytics/network-growth?months=${months}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      networkGrowth.value = response.data.growth;
      return response.data.growth;
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar crecimiento';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    stats,
    viewers,
    postAnalytics,
    bestPostingTime,
    networkGrowth,
    loading,
    error,
    recordProfileView,
    getStats,
    getProfileViewers,
    getPostAnalytics,
    getBestPostingTime,
    getNetworkGrowth
  };
}
