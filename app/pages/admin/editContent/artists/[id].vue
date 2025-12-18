<script lang="ts" setup>
import type { Database } from "#types/supabase/database";

definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

type ArtistRow = Database["public"]["Tables"]["artists"]["Row"]; // look for cleaner way later
type EditedArtist = {
  id: string;
  name: string;
  bio: string;
  image: File | null;
};

const route = useRoute();

const artistId = computed(() => route.params.id as string); // cached and reactive

const isEditing = ref(false);

const editedArtist = ref<EditedArtist>({
  id: "",
  name: "",
  bio: "",
  image: null,
});

function startEdit() {
  isEditing.value = true;
  editedArtist.value = {
    id: artistId.value,
    name: artist.value?.name ?? "",
    bio: artist.value?.bio ?? "",
    image: null,
  };
}

function stopEdit() {
  isEditing.value = false;
  editedArtist.value = {
    id: "",
    name: "",
    bio: "",
    image: null,
  };
}

function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null;
  editedArtist.value.image = file || null;
}

async function save() {
  isEditing.value = false;
  const newName = editedArtist.value.name;
  const newBio = editedArtist.value.bio;
  const newImage = editedArtist.value.image;

  if (!newName || !newBio || !newImage) {
    alert("Missing artist name, bio, or image.");
    return;
  }

  if (
    newName === artist.value?.name &&
    newBio === artist.value?.bio &&
    !newImage
  ) {
    alert("No changes made to artist.");
    return;
  }

  // To Do: api logic here
  const formData = new FormData();
  formData.append("id", artistId.value);
  formData.append("name", newName);
  formData.append("bio", newBio);
  formData.append("image", newImage);

  try {
    await $fetch(`/api/artists/${artistId.value}`, {
      method: "PATCH",
      body: formData,
    });
    alert("Artist updated successfully.");
  } catch (error) {
    alert("Error updating artist.");
  }
}

async function deleteArtist() {
  isEditing.value = false;
  const newName = editedArtist.value.name;
  const newBio = editedArtist.value.bio;
  const newImage = editedArtist.value.image;

  try {
    await $fetch(`/api/artists/${artistId.value}`, {
      method: "DELETE",
    });
    alert("Artist deleted successfully!");
    navigateTo("/admin/artists");
  } catch (error) {
    console.log("error deleting artist: " + error);
    alert("Something went wrong. Please try again later!");
  }
}

const {
  data: artist,
  pending,
  error,
} = useFetch<ArtistRow>(`/api/artists/${artistId.value}`);
</script>

<template>
  <div class="verticalContent">
    <div v-if="!isEditing">
      <div v-if="pending">Loading details...</div>
      <div v-if="error">There was an error getting artist details</div>
      <div v-else-if="artist">
        <img :src="artist?.image_path ?? undefined" alt="" class="headShot" />
        <h1>Name: {{ artist?.name }}</h1>
        <h2>{{ artist?.bio }}</h2>
      </div>
      <Button variant="primary" size="lg" @click="startEdit"
        >Click to Edit Artist</Button
      >
    </div>
    <div v-if="isEditing">
      <textarea v-model="editedArtist.name" type="text"></textarea>
      <textarea v-model="editedArtist.bio" type="text"></textarea>
      <input type="file" @change="handleImageChange" />
      <Button variant="primary" size="lg" @click="save">Save Changes</Button>
      <Button variant="secondary" size="lg" @click="stopEdit">Cancel</Button>
    </div>
    <Button variant="danger" size="lg" @click="deleteArtist"
      >Click to Delete Artist</Button
    >
  </div>
</template>
