<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

import { ref, reactive } from "vue";

const article = reactive({
  title: "",
  body: "",
  author: "",
});

const errors = reactive({
  title: "",
  body: "",
  author: "",
});

const validate = () => {
  errors.title = !article.title.trim() ? "Title is required" : "";
  errors.body = !article.body.trim() ? "Body is required" : "";
  errors.author = !article.author.trim() ? "Author is required" : "";

  return !errors.title && !errors.body && !errors.author;
};

const submitArticle = async () => {
  if (!validate()) return;

  const { data, error } = await useFetch("/api/articles/article", {
    method: "POST",
    body: article,
  });

  if (error) {
    alert(error?.value?.message);
    return;
  }

  alert(
    `Submitted: Title=${article.title}, Body=${article.body}, Author=${article.author}`
  );
};
</script>

<template>
  <div class="verticalContent">
    <h1>Add Article Here!</h1>
    <form class="articleForm" @submit.prevent="submitArticle">
      <div>
        <label for="title">Title:</label>
        <input id="title" v-model="article.title" type="text" required />
      </div>
      <div>
        <label for="body">Body:</label>
        <textarea id="body" v-model="article.body" required></textarea>
      </div>
      <div>
        <label for="author">Author:</label>
        <input id="author" v-model="article.author" type="text" required />
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
