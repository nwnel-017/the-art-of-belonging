<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

import { ref } from "vue";

const title = ref("");
const body = ref("");
const author = ref("");

function submitArticle() {
  // Placeholder: Implement submit logic (API call, etc.)
  alert(
    `Submitted: Title=${title.value}, Body=${body.value}, Author=${author.value}`
  );
}
</script>

<template>
  <div class="verticalContent">
    <h1>Add Article Here!</h1>
    <form class="articleForm" @submit.prevent="submitArticle">
      <div>
        <label for="title">Title:</label>
        <input id="title" v-model="title" type="text" required />
      </div>
      <div>
        <label for="body">Body:</label>
        <textarea id="body" v-model="body" required></textarea>
      </div>
      <div>
        <label for="author">Author:</label>
        <input id="author" v-model="author" type="text" required />
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style scoped>
.articleForm {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  max-width: 500px;
}
.articleForm label {
  font-weight: bold;
}
.articleForm input,
.articleForm textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
