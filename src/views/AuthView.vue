<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950 px-4 py-12">
    <div class="max-w-md w-full space-y-8 bg-dark-900 p-8 rounded-2xl shadow-2xl border border-dark-700">
      <!-- Logo y título -->
      <div class="text-center">
        <div class="flex items-center justify-center mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <span class="text-2xl font-bold text-white">P</span>
          </div>
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent mb-2">ProLink</h1>
        <h2 class="text-2xl font-semibold text-white">
          {{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}
        </h2>
        <p class="mt-2 text-sm text-gray-400">
          {{ isLogin ? '¡Bienvenido de nuevo!' : 'Únete a nuestra comunidad profesional' }}
        </p>
      </div>

      <!-- Mensajes de error -->
      <div v-if="errorMessage" class="bg-red-900/20 border border-red-500/50 p-4 rounded-lg backdrop-blur-sm">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-300">{{ errorMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Mensaje de éxito -->
      <div v-if="successMessage" class="bg-primary-900/20 border border-primary-500/50 p-4 rounded-lg backdrop-blur-sm">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-primary-300">{{ successMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div class="space-y-4">
          <!-- Campos de nombre (solo para registro) -->
          <div v-if="!isLogin" class="grid grid-cols-2 gap-4">
            <div>
              <label for="nombre" class="block text-sm font-medium text-gray-300 mb-1">
                Nombre
              </label>
              <input
                id="nombre"
                v-model="formData.nombre"
                type="text"
                class="appearance-none relative block w-full px-4 py-3 bg-dark-800 border border-dark-600 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="Juan"
              />
            </div>
            <div>
              <label for="apellido" class="block text-sm font-medium text-gray-300 mb-1">
                Apellido
              </label>
              <input
                id="apellido"
                v-model="formData.apellido"
                type="text"
                class="appearance-none relative block w-full px-4 py-3 bg-dark-800 border border-dark-600 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="Pérez"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="appearance-none relative block w-full px-4 py-3 bg-dark-800 border border-dark-600 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
              placeholder="tu@email.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              required
              class="appearance-none relative block w-full px-4 py-3 bg-dark-800 border border-dark-600 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
              placeholder="••••••••"
              :minlength="isLogin ? 1 : 6"
            />
          </div>

          <!-- Confirmar password (solo para registro) -->
          <div v-if="!isLogin">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-1">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              required
              class="appearance-none relative block w-full px-4 py-3 bg-dark-800 border border-dark-600 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
              placeholder="••••••••"
              minlength="6"
            />
          </div>
        </div>

        <!-- Botón submit -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-primary-900/50 hover:shadow-primary-900/80"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta') }}
          </button>
        </div>

        <!-- Toggle entre login/register -->
        <div class="text-center">
          <p class="text-sm text-gray-400">
            {{ isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
            <router-link
              :to="isLogin ? '/register' : '/login'"
              class="font-medium text-primary-400 hover:text-primary-300 transition"
            >
              {{ isLogin ? 'Regístrate aquí' : 'Inicia sesión' }}
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['login', 'register'].includes(value)
  }
});

const router = useRouter();
const { login, register, isAuthenticated } = useAuth();

const isLogin = computed(() => props.type === 'login');

const formData = ref({
  email: '',
  password: '',
  nombre: '',
  apellido: '',
  confirmPassword: ''
});

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Redirigir si ya está autenticado
onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/feed');
  }
});

const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  // Validaciones
  if (!formData.value.email || !formData.value.password) {
    errorMessage.value = 'Por favor completa todos los campos requeridos';
    return;
  }

  if (!isLogin.value) {
    if (formData.value.password.length < 6) {
      errorMessage.value = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (formData.value.password !== formData.value.confirmPassword) {
      errorMessage.value = 'Las contraseñas no coinciden';
      return;
    }
  }

  loading.value = true;

  try {
    if (isLogin.value) {
      // Login
      await login(formData.value.email, formData.value.password);
      successMessage.value = '¡Inicio de sesión exitoso! Redirigiendo...';
      setTimeout(() => {
        router.push('/feed');
      }, 1000);
    } else {
      // Register
      await register({
        email: formData.value.email,
        password: formData.value.password,
        nombre: formData.value.nombre,
        apellido: formData.value.apellido
      });
      successMessage.value = '¡Cuenta creada exitosamente! Por favor inicia sesión.';
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  } catch (error) {
    console.error('Error en autenticación:', error);
    
    // Mensajes de error específicos
    if (error.message) {
      errorMessage.value = error.message;
    } else if (error.response?.status === 409) {
      errorMessage.value = 'Este correo ya está registrado';
    } else if (error.response?.status === 401) {
      errorMessage.value = 'Credenciales inválidas. Verifica tu correo y contraseña';
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage.value = 'Error de conexión. Verifica que el servidor esté ejecutándose';
    } else {
      errorMessage.value = 'Ocurrió un error. Por favor intenta nuevamente';
    }
  } finally {
    loading.value = false;
  }
};
</script>
