<script lang="ts" setup>
import DropDown from "~/components/drop-down.vue";

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

const artwork = reactive<{
  title: string;
  description: string;
  image: File | null;
}>({
  title: "",
  description: "",
  image: null,
});

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selected = target.files?.[0] || null;
  artwork.image = selected;
};

const selectArtist = (artist: string) => {
  console.log("Selected artist: " + artist);
};

const submit = async () => {
  if (!artwork.title || !artwork.description || !artwork.image) {
    alert("Please enter all fields!");
    return;
  }

  // To Do: move to srvice layer
  const formData = new FormData();
  formData.append("title", artwork.title);
  formData.append("description", artwork.description);
  formData.append("image", artwork.image);

  const result = await fetch("/api/artworks/artwork", {
    method: "POST",
    body: formData,
  });

  const response = await result.json();

  if (response.ok) {
    alert("submitted artwork successfully!");
    artwork.title = "";
    artwork.description = "";
    artwork.image = null;
  } else {
    alert(response?.message || "Failed to submit artwork!");
  }
};
</script>

<template>
  <div class="verticalContent">
    <h1>Add Artwork here!</h1>
    <form @submit.prevent="submit" class="submissionForm">
      <label for="title">Title</label>
      <input type="text" v-model="artwork.title" />
      <label for="description">Artwork description</label>
      <input type="text" v-model="artwork.description" />
      <label for="image">Artwork Image</label>
      <input @change="onFileChange" name="image" accept="image" type="file" />
      <DropDown
        label="Artist"
        @select="selectArtist"
        :items="['Artist 1', 'Artist 2', 'Artist 3']"
      />
      <button variant="primary" type="submit" size="sm">Submit</button>
    </form>
  </div>
</template>
