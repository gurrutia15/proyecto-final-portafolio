<!-- src/componentes/NavbarComponent.vue -->
<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary px-4 px-md-5">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Portafolio Digital</router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Secciones
            </a>
            <ul class="dropdown-menu">
              <li><router-link class="dropdown-item" to="/profile">Perfil</router-link></li>
              <li><router-link class="dropdown-item" to="/project">Proyectos</router-link></li>
              <li><hr class="dropdown-divider" /></li>
              <li><router-link class="dropdown-item" to="/hability">Habilidades</router-link></li>
            </ul>
          </li>
        </ul>

        <!-- Login / Menú de usuario -->
        <ul class="navbar-nav ms-2 mb-2 mb-lg-0">
          <li class="nav-item" v-if="!user">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li class="nav-item dropdown" v-else>
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ user.email }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <router-link class="dropdown-item" to="/admin">Admin</router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button class="dropdown-item text-danger" @click="handleLogout">Logout</button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { user, logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push({ name: 'home', query: {logged_out: '1'} })
}
</script>
<!-- 
<script setup>
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { user, logout: authLogout } = useAuth() // 👈 destructuring reactivo
const router = useRouter()

const handleLogout = async () => {
  await authLogout()
  // router.push({ name: 'home' })
}
</script> -->

<style scoped>
/* Opcional: asegurar que el navbar ocupe todo el ancho */
nav.navbar {
  width: 100%;
}
</style>