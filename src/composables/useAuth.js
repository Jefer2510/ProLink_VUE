import { ref, computed } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Estado global compartido entre todos los componentes
const token = ref(localStorage.getItem('token') || null);
const user = ref(null);

// Cargar usuario desde localStorage si existe
const savedUser = localStorage.getItem('user');
if (savedUser) {
  try {
    user.value = JSON.parse(savedUser);
  } catch (e) {
    localStorage.removeItem('user');
  }
}

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value);

  /**
   * Configurar axios con el token de autenticación
   */
  const setAuthToken = (authToken) => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      localStorage.setItem('token', authToken);
      token.value = authToken;
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      token.value = null;
    }
  };

  /**
   * Inicializar token si existe al cargar la app
   */
  if (token.value) {
    setAuthToken(token.value);
  }

  /**
   * Login - Iniciar sesión
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<object>} - Datos del usuario
   */
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { token: authToken, user: userData } = response.data;

      // Guardar token y usuario
      setAuthToken(authToken);
      user.value = userData;
      localStorage.setItem('user', JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error('Error en login:', error);
      throw error.response?.data || { message: 'Error al iniciar sesión' };
    }
  };

  /**
   * Register - Registrar nuevo usuario
   * @param {object} userData - Datos del usuario (email, password, nombre, apellido)
   * @returns {Promise<object>} - Resultado del registro
   */
  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error.response?.data || { message: 'Error al registrar usuario' };
    }
  };

  /**
   * Logout - Cerrar sesión
   */
  const logout = () => {
    setAuthToken(null);
    user.value = null;
    localStorage.removeItem('user');
  };

  /**
   * Obtener perfil del usuario autenticado
   * @returns {Promise<object>} - Datos del perfil
   */
  const getProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`);
      user.value = response.data.user;
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      // Si el token expiró, hacer logout
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
      }
      throw error.response?.data || { message: 'Error al obtener perfil' };
    }
  };

  /**
   * Verificar si el token es válido
   * @returns {Promise<boolean>} - true si el token es válido
   */
  const checkAuth = async () => {
    if (!token.value) {
      return false;
    }

    try {
      await getProfile();
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  return {
    // Estado
    isAuthenticated,
    user,
    token,

    // Métodos
    login,
    register,
    logout,
    getProfile,
    checkAuth
  };
}
