<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

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
    console.log("name: " + artist.name);
    console.log("bio: " + artist.bio);
    console.log("image? " + artist.image); // culprit
    alert("Please enter all fields!");
    return;
  }

  // To Do: move to service layer
  const formData = new FormData();
  formData.append("name", artist.name);
  formData.append("bio", artist.bio);
  formData.append("image", artist.image);

  try {
    const response = await fetch("/api/artists/artist", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    if (!response.ok) {
      alert(result?.message || "Failed to submit artist!");
      return;
    }

    alert("submitted artist succcessfully!");
    artist.name = "";
    artist.bio = "";
    artist.image = null;
  } catch (err) {
    alert("An error occured! Please try again!");
    console.log(err);
  }
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
