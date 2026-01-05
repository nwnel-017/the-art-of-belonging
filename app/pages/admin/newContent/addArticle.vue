<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

import { ref, reactive } from "vue";

const { addArticle } = useArticles();

const article = reactive({
  title: "",
  body: "",
  author: "",
});

const error = ref("");

const validate = () => {
  return article.author.trim() && article.body.trim() && article.title.trim();
};

const submitArticle = async () => {
  if (!validate()) {
    alert("Please fill out all the fields!");
    return;
  }

  const response = await addArticle(article);

  if (!response.success) {
    alert(response.message);
    return;
  }

  alert(response.message);
  // Reset form
  article.title = "";
  article.body = "";
  article.author = "";
  await navigateTo("/admin/content");
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
