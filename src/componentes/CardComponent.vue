<!-- src/componentes/CardComponent.vue -->
<template>
  <div class="card">
    <h2>{{ project.title }}</h2>
    <img :src="project.imageUrl" :alt="project.title" class="img-fluid" />
    <p>{{ project.description }}</p>
    <p>
      <a :href="project.repoUrl" target="_blank" rel="noopener">Ver repositorio</a>
    </p>
  </div>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.card {
  margin: auto;
  max-width: 400px;
  text-align: center;
  border: solid 1px bisque;
  background-color: beige;
  box-shadow: 2px 4px lightgray;
  border-radius: 5px;
  padding: 15px;
}

img {
  width: 85%;
  max-width: 400px;
  height: auto;
  padding-bottom: 10px;
}

h2 {
  padding-top: 10px;
  margin-bottom: 15px;
  font-size: 1.4rem;
}

p {
  font-size: 1rem;
  margin: 8px 0;
}

a {
  text-decoration: none;
  color: black;
}

a:hover {
  color: blue;
}
</style>