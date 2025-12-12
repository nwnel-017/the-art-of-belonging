<script lang="ts" setup>
definePageMeta({
  layout: "default",
});

const {
  data: artists,
  error,
  pending,
} = await useFetch("/api/artists/artists");
</script>

<template>
  <div class="verticalContent">
    <h1>Our Artists</h1>
    <div>
      <div v-if="pending">Loading Artists...</div>
      <div v-else-if="error">Failed to get artists</div>
      <div v-else class="artistsGrid">
        <div v-for="artist in artists" :key="artist?.id">
          <img :src="artist?.image_path ?? undefined" alt="" class="headShot" />
          <div>{{ artist?.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.artistsGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.headShot {
  max-width: 10vw;
  max-height: 10vw;
  border-radius: 8px;
}
</style>
