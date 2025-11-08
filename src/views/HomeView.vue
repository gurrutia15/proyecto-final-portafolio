<!-- src/views/HomeView.vue -->
<script setup>
import { ref, watch } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import CardComponent from '@/componentes/CardComponent.vue'
import AlertComponent from '@/componentes/AlertComponent.vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const projects = ref([])
const showSuccess = ref(false)
const successMessage = ref('')
const showLogoutAlert = ref(false)
const loading = ref(true) // ✅ Estado de carga

// Cargar proyectos una sola vez
const loadProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'projects'))
    projects.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } finally {
    loading.value = false // ✅ Se oculta incluso si falla
  }
}

// Cargar proyectos al inicio
loadProjects()

// Reaccionar a cambios en la query (login_success, logged_out)
watch(
  () => route.query,
  (newQuery) => {
    // Alert de login
    if (newQuery.login_success) {
      showSuccess.value = true
      successMessage.value = 'Inicio de sesión exitoso!'
      const cleanQuery = { ...newQuery }
      delete cleanQuery.login_success
      router.replace({ query: cleanQuery })
    }

    // Alert de logout
    if (newQuery.logged_out) {
      showLogoutAlert.value = true
      const cleanQuery = { ...newQuery }
      delete cleanQuery.logged_out
      router.replace({ query: cleanQuery })
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="container py-5">
    <!-- Alert de login -->
    <div class="col-12 col-md-8 col-lg-6 mx-auto mb-4">
      <AlertComponent
        v-model="showSuccess"
        :message="successMessage"
        variant="success"
        :auto-close="2000"
      />
    </div>

    <!-- Alert de logout -->
    <div v-if="showLogoutAlert" class="col-12 col-md-8 col-lg-6 mx-auto mb-4">
      <AlertComponent
        v-model="showLogoutAlert"
        message="Sesión cerrada correctamente"
        variant="info"
        :auto-close="2500"
      />
    </div>

    <h1 class="text-center mb-5">Mis Proyectos</h1>

    <!-- ✅ Spinner de carga -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- ✅ Cards solo cuando están listas -->
    <div v-else class="row justify-content-center g-4">
      <div class="col-12 col-md-6 col-lg-4" v-for="project in projects" :key="project.id">
        <CardComponent :project="project" />
      </div>
    </div>

    <!-- ✅ Mensaje si no hay proyectos -->
    <div v-if="!loading && projects.length === 0" class="text-center">
      <p class="text-muted">No hay proyectos disponibles.</p>
    </div>
  </div>
</template>