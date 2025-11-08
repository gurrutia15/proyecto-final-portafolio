<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import AlertComponent from '@/componentes/AlertComponent.vue'

const { register } = useAuth()
const router = useRouter()

// Estado del formulario
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

// Estado del alerta
const showAlert = ref(false)
const alertMessage = ref('')
const alertVariant = ref('danger')

// Referencia para focus en errores
const emailInput = ref(null)

const handleSubmit = async () => {
    showAlert.value = false

    // Validación básica del lado del cliente
    if (password.value.length < 6) {
        alertMessage.value = 'La contraseña debe tener al menos 6 caracteres.'
        alertVariant.value = 'danger'
        showAlert.value = true
        return
    }

    if (password.value !== confirmPassword.value) {
        alertMessage.value = 'Las contraseñas no coinciden.'
        alertVariant.value = 'danger'
        showAlert.value = true
        return
    }

    try {
        await register(email.value.trim(), password.value)

        // ✅ Registro exitoso → redirigir al login con mensaje
        router.push({
            name: 'login',
            query: { register_success: '1' }
        })
    } catch (err) {
        console.error('Error en registro:', err)

        // Mensajes amigables según el error de Firebase
        if (err.code === 'auth/email-already-in-use') {
            alertMessage.value = 'Este correo ya está registrado.'
        } else if (err.code === 'auth/invalid-email') {
            alertMessage.value = 'Formato de correo inválido.'
        } else if (err.code === 'auth/weak-password') {
            alertMessage.value = 'La contraseña es demasiado débil (mínimo 6 caracteres).'
        } else {
            alertMessage.value = 'Error al crear la cuenta. Inténtalo más tarde.'
        }

        alertVariant.value = 'danger'
        showAlert.value = true

        // Enfocar el campo de email tras error
        await nextTick()
        if (emailInput.value) emailInput.value.focus()
    }
}
</script>

<template>
    <div class="register-fullscreen">
        <div class="register-container">
            <main class="form-signin">
                <h3 class="text-center my-4">Crea tu cuenta</h3>

                <!-- Alerta de error o éxito -->
                <AlertComponent v-model="showAlert" :message="alertMessage" :variant="alertVariant"
                    :auto-close="3000" />

                <!-- Formulario de registro -->
                <form @submit.prevent="handleSubmit">
                    <div class="mb-3">
                        <label for="email" class="form-label">Correo electrónico</label>
                        <input id="email" ref="emailInput" v-model="email" type="email" class="form-control" required />
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Contraseña</label>
                        <input id="password" v-model="password" type="password" class="form-control" required />
                    </div>
                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Repite la contraseña</label>
                        <input id="confirmPassword" v-model="confirmPassword" type="password" class="form-control"
                            required />
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Registrarse</button>
                </form>

                <!-- Enlace a login -->
                <p class="mt-3 text-center">
                    ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link>
                </p>
            </main>
        </div>
    </div>
</template>

<style scoped>
.register-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #f8f9fa;
    /* bg-body-tertiary */
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
}

.register-container {
    width: 100%;
    max-width: 330px;
}

.form-signin {
    padding: 15px;
}
</style>