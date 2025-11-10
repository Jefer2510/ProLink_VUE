import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export function useSkills() {
  const userSkills = ref([]);
  const trendingSkills = ref([]);
  const skillEndorsers = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const addSkill = async (skillName) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/skills`,
        { skillName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al agregar skill';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const removeSkill = async (skillId) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/skills/${skillId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al eliminar skill';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getUserSkills = async (userId) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/skills/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      userSkills.value = response.data.skills;
      return response.data.skills;
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar skills';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const endorseSkill = async (skillId) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/skills/${skillId}/endorse`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al endorsar';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const removeEndorsement = async (skillId) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/skills/${skillId}/endorse`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al remover endorsement';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getSkillEndorsers = async (skillId) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/skills/${skillId}/endorsers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      skillEndorsers.value = response.data.endorsers;
      return response.data.endorsers;
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar endorsers';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getTrendingSkills = async (limit = 10) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/skills/trending?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      trendingSkills.value = response.data.skills;
      return response.data.skills;
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar trending skills';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    userSkills,
    trendingSkills,
    skillEndorsers,
    loading,
    error,
    addSkill,
    removeSkill,
    getUserSkills,
    endorseSkill,
    removeEndorsement,
    getSkillEndorsers,
    getTrendingSkills
  };
}
