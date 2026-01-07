<script lang="ts" setup>
definePageMeta({
  layout: "default",
});

const { data: artworks, pending, error } = useFetch("/api/artworks/upcoming");
</script>

<template>
  <div class="verticalContent">
    <h1>Artworks</h1>
    <div>
      <div v-if="pending">Loading Artworks</div>
      <div v-else-if="error">Unable to fetch artworks</div>
      <div v-else class="artworksGrid">
        <div v-for="artwork in artworks" :key="artwork.id">
          <img :src="artwork?.image_path" alt="" class="artwork" />
          <div>{{ artwork?.title }}</div>
          <div>{{ artwork?.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.artworksGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.artwork {
  max-width: 10vw;
  max-height: 10vw;
  border-radius: 8px;
}
</style>
