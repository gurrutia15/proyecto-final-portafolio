<script setup>
import { ref, nextTick } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useRoute, useRouter } from 'vue-router';
import AlertComponent from '@/componentes/AlertComponent.vue';

const { login } = useAuth();
const route = useRoute();
const router = useRouter();

const email = ref('');
const password = ref('');
const showAlert = ref(false)
const alertMessage = ref('')
const alertVariant = ref('danger')
const emailInput = ref(null)


const handleLogin = async () => {
  //limpieza previo
  showAlert.value = false
  try {
    await login(email.value, password.value);
  
const redirectTo = route.query.redirect 
  ? { path: route.query.redirect } 
  : { name: 'home' };

router.push({
  ...redirectTo,
  query: { 
    ...(redirectTo.query || {}), 
    login_success: '1' 
  }
});

  } catch (err) {
    console.error('Login failed:', err);
    // ✅ Mostrar mensaje amigable según el código de Firebase
    alertVariant.value = 'danger'
    if (err.code === 'auth/too-many-requests') {
      alertMessage.value = 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.';
    } else if (err.code === 'auth/invalid-credential') {
      alertMessage.value = 'Correo o contraseña inválidos.';
    } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
      alertMessage.value = 'Credenciales inválidas.';
    } else {
      alertMessage.value = 'Error al iniciar sesión. Inténtalo más tarde.';
    }
    showAlert.value = true

    await nextTick()
    if (emailInput.value) {
      emailInput.value.focus()
    }
  }
};

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const auth = getAuth()

const createTestUser = async () => {
  try {
    await createUserWithEmailAndPassword(auth, 'admin@admin.com', 'admin123')
    alert('✅ Usuario creado correctamente. Ahora puedes iniciar sesión con:\nEmail: admin@admin.com\nContraseña: admin123')
  } catch (error) {
    console.error('Error al crear usuario:', error)
    alert('❌ ' + error.message)
  }
}
</script>

<template>
  <div class="login-fullscreen">
    <div class="login-container">
      <main class="form-signin">
        <AlertComponent v-model="showAlert" :message="alertMessage" :variant="alertVariant" />
        <h3 class="text-center my-4">Ingresa a tu cuenta:</h3>
        
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label">Correo electrónico:</label>
            <input id="email" ref="emailInput" v-model="email" type="email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Contraseña:</label>
            <input id="password" v-model="password" type="password" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">Ingresar</button>
        </form>
        <!-- <p class="mt-3 text-center">
          ¿No tienes cuenta? <router-link to="/register">Regístrate aquí</router-link>
        </p> -->
      </main>
    </div>
  </div>
</template>

<style scoped>
.login-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #f8f9fa;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
}

.login-container {
  width: 100%;
  max-width: 330px;
}

.form-signin {
  padding: 15px;
}
</style>