<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

const { addArtist } = useArtists();

const artist = reactive<{ name: string; bio: string; image: File | null }>({
  name: "",
  bio: "",
  image: null,
});

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target?.files?.[0] || null;
  artist.image = file;
}

const submitArtist = async () => {
  if (!artist.name || !artist.bio || !artist.image) {
    return;
  }

  const response = await addArtist(artist.name, artist.bio, artist.image);

  if (!response.success) {
    alert(response.message);
    return;
  }

  alert(response.message);
  artist.name = "";
  artist.bio = "";
  artist.image = null;
};
</script>

<template>
  <div class="verticalContent">
    <h1>Add Artist Here!</h1>
    <form @submit.prevent="submitArtist">
      <div class="submissionForm">
        <label for="name">Name:</label>
        <input id="name" v-model="artist.name" type="text" required />
        <label for="bio">Biography:</label>
        <input id="bio" v-model="artist.bio" type="text" required />
        <input @change="onFileChange" name="image" accept="image" type="file" />
      </div>
      <button variant="secondary" size="md" type="submit">Submit</button>
    </form>
  </div>
</template>
