<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

const {
  data: artworks,
  error,
  pending,
} = await useFetch("/api/artworks/artworks");
</script>

<template>
  <h1>Artworks</h1>
</template>
