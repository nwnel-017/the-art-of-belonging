<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

const {
  data: artists,
  error,
  pending,
} = await useFetch("/api/artists/artists");

const addArtist = () => {
  navigateTo("/admin/newContent/addArtist");
};

const editArtist = (artistId: string) => {
  navigateTo(`/admin/editContent/artists/${artistId}`);
  // console.log("Edit artist with ID: " + artistId);
};
</script>

<template>
  <div class="verticalContent fullWidth">
    <div class="horizontalContent fullWidth banner">
      <h1>Artists</h1>
      <Button @click="addArtist">Add Artist</Button>
    </div>
    <div class="horizontalContent fullWidth padded">
      <div v-if="pending">Loading Artists...</div>
      <div v-else-if="error">Failed to get artists</div>
      <div v-else class="fullWidth">
        <div v-for="artist in artists" :key="artist?.id" class="contentCard">
          <div class="closeHorContent">
            <img
              :src="artist?.image_path ?? undefined"
              alt=""
              class="headShotSm"
            />
            <div>{{ artist?.name }}</div>
            <div class="cutoffText">{{ artist?.bio }}</div>
          </div>
          <Button size="sm" variant="secondary" @click="editArtist(artist?.id)"
            >Edit</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.headShotSm {
  max-width: 5vw;
  max-height: 5vw;
  border-radius: 8px;
}
</style>
