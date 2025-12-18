<script lang="ts" setup>
import type { Database } from "#types/supabase/database";

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

type Artist = Database["public"]["Tables"]["artists"]["Row"]; // look for cleaner way later

const route = useRoute();

const artistId = computed(() => route.params.id as string); // cached and reactive

const {
  data: artist,
  pending,
  error,
} = useFetch<Artist>(`/api/artists/${artistId.value}`);
</script>

<template>
  <div class="verticalContent">
    <h1>Edit Artist</h1>
    <div>
      <div v-if="pending">Loading details...</div>
      <div v-if="error">There was an error getting artist details</div>
      <div v-else-if="artist">
        <img :src="artist?.image_path ?? undefined" alt="" class="headShot" />
        <h1>Name: {{ artist?.name }}</h1>
        <h2>{{ artist?.bio }}</h2>
      </div>
    </div>
    <Button variant="primary" size="lg">Click to Edit Artist</Button>
    <Button variant="danger" size="lg">Click to Delete Artist</Button>
  </div>
</template>
