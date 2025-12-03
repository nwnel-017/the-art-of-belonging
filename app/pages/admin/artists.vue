<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

const addArtist = () => {
  navigateTo("/admin/newContent/addArtist");
};
</script>

<template>
  <h1>Artists</h1>
  <Button @click="addArtist">Add Artist</Button>
</template>
