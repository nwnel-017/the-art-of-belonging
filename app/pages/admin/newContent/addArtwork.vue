<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

const title = ref("");
const description = ref("");
const artist = ref("");
const file = ref<File | null>(null);
const isUploading = ref(false);

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  file.value = target.files?.[0] || null;
};

const submit = () => {};
</script>

<template>
  <div class="verticalContent">
    <h1>Add Artwork here!</h1>
    <form @submit.prevent="submit">
      <label>Title</label>
      <input type="text" v-model="title" />
    </form>
  </div>
</template>
