<script setup>
import { onMounted, ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

const projects = ref([])

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, 'projects'))
  projects.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
})
</script>

<template>
  <div>
    <h2>Proyectos desde Firestore:</h2>
    <ul>
      <li v-for="p in projects" :key="p.id">
        {{ p.title }} - {{ p.description }}
      </li>
    </ul>
  </div>
</template>