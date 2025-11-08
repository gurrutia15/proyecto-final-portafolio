<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Gestión de Proyectos</h2>
      <router-link to="/" class="btn btn-outline-secondary">← Volver</router-link>
    </div>

    <!-- Formulario para agregar/editar -->
    <div class="card mb-5" ref="formRef">
      <div class="card-header">
        <h3 class="mb-0">{{ editingId ? 'Editar Proyecto' : 'Agregar Nuevo Proyecto' }}</h3>
      </div>
      <div class="card-body">
        <!-- ✅ Alert aquí, dentro del card -->
        <AlertComponent
          v-if="message"
          :message="message"
          :variant="messageVariant"
          :auto-close="3000"
          @update:modelValue="message = ''"
        />

        <div class="mb-3">
          <label class="form-label">Nombre del proyecto</label>
          <input v-model="form.title" type="text" class="form-control input-required" required />
        </div>
        <div class="mb-3">
          <label class="form-label">URL de la imagen (pública)</label>
          <input v-model="form.imageUrl" type="url" class="form-control input-required" required />
          <div class="form-text">
            Usa una URL directa (ej: desde GitHub → botón "Raw", o ImgBB → "Image link")
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Descripción</label>
          <textarea v-model="form.description" class="form-control" rows="3"></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Enlace al repositorio</label>
          <input v-model="form.repoUrl" type="url" class="form-control input-required" required />
        </div>

        <!-- Vista previa en tiempo real -->
        <div class="mt-4">
          <h4>Vista previa</h4>
          <div class="d-flex justify-content-center">
            <CardComponent 
              :project="{
                title: form.title || 'Nombre del proyecto',
                description: form.description || 'Descripción del proyecto',
                repoUrl: form.repoUrl || '#',
                imageUrl: form.imageUrl || 'https://via.placeholder.com/400x200?text=Sin+imagen'
              }" 
            />
          </div>
        </div>

        <div class="d-flex gap-2 mt-3">
          <button @click="saveProject" class="btn btn-success">
            {{ editingId ? 'Actualizar' : 'Guardar Proyecto' }}
          </button>
          <button v-if="editingId" @click="cancelEdit" class="btn btn-outline-secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de proyectos existentes -->
    <div v-if="projects.length" class="row g-4">
      <div class="col-12" v-for="project in projects" :key="project.id">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h5>{{ project.title }}</h5>
                <p>{{ project.description }}</p>
                <a :href="project.repoUrl" target="_blank" class="text-decoration-none">
                  {{ project.repoUrl }}
                </a>
              </div>
              <div class="d-flex gap-2">
                <button @click="startEdit(project)" class="btn btn-sm btn-outline-primary">Editar</button>
                <button @click="deleteProject(project.id)" class="btn btn-sm btn-outline-danger">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import AlertComponent from '@/componentes/AlertComponent.vue'
import CardComponent from '@/componentes/CardComponent.vue'

const projects = ref([])
const form = ref({
  title: '',
  imageUrl: '',
  description: '',
  repoUrl: ''
})
const editingId = ref(null)
const message = ref('')
const messageVariant = ref('success')
const formRef = ref(null)

const loadProjects = async () => {
  const querySnapshot = await getDocs(collection(db, 'projects'))
  projects.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

const saveProject = async () => {
  const requiredFields = [
    { key: 'title', label: 'Nombre del proyecto' },
    { key: 'imageUrl', label: 'URL de la imagen' },
    { key: 'repoUrl', label: 'Enlace al repositorio' }
  ]
  const missing = requiredFields.find(f => !form.value[f.key]?.trim())
  
  if (missing) {
    message.value = `❌ Falta: ${missing.label}`
    messageVariant.value = 'danger'
    await nextTick()
    const selectorMap = {
      title: 'input[placeholder*="Nombre"], input[placeholder*="Proyecto"]',
      imageUrl: 'input[placeholder*="imagen"]',
      repoUrl: 'input[placeholder*="repositorio"]'
    }
    const input = formRef.value?.querySelector(selectorMap[missing.key]) ||
                  formRef.value?.querySelector('input[type="text"]')
    input?.focus()
    return
  }

  try {
    if (editingId.value) {
      await updateDoc(doc(db, 'projects', editingId.value), form.value)
      message.value = '✅ Proyecto actualizado'
    } else {
      await addDoc(collection(db, 'projects'), form.value)
      message.value = '✅ Proyecto guardado'
    }
    messageVariant.value = 'success'
    resetForm()
    await loadProjects()
  } catch (err) {
    console.error('Error al guardar:', err)
    message.value = `❌ Error: ${err.message?.split('] ')[1] || 'Desconocido'}`
    messageVariant.value = 'danger'
  }
}

const startEdit = async (project) => {
  editingId.value = project.id
  form.value = {
    title: project.title || '',
    imageUrl: project.imageUrl || '',
    description: project.description || '',
    repoUrl: project.repoUrl || ''
  }
  await nextTick()
  formRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const firstInput = formRef.value?.querySelector('input[type="text"]')
  firstInput?.focus()
}

const cancelEdit = () => {
  resetForm()
}

const deleteProject = async (id) => {
  if (!confirm('¿Eliminar este proyecto?')) return
  try {
    await deleteDoc(doc(db, 'projects', id))
    message.value = '✅ Proyecto eliminado'
    messageVariant.value = 'success'
    loadProjects()
  } catch (err) {
    console.error('Error al eliminar:', err)
    message.value = '❌ Error al eliminar'
    messageVariant.value = 'danger'
  }
}

const resetForm = () => {
  form.value = { title: '', imageUrl: '', description: '', repoUrl: '' }
  editingId.value = null
}

onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
.input-required:invalid {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}
</style>