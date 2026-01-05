<script lang="ts" setup>
import type { Database } from "#types/supabase/database";
import type { StringFormatParams } from "zod/v4/core";

definePageMeta({
  layout: "default",
  middleware: "admin",
});

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

type EditedArticle = {
  id: string;
  title: string;
  body: string;
  author: string;
};

const route = useRoute();

const articleId = computed(() => route.params.id as string);

const isEditing = ref(false);

const {
  data: article,
  pending,
  error,
} = useFetch<ArticleRow>(`/api/articles/${articleId.value}`);

const editedArticle = ref<EditedArticle>({
  id: "",
  title: "",
  body: "",
  author: "",
});

function startEdit() {
  isEditing.value = true;
  editedArticle.value = {
    id: articleId.value,
    title: article.value?.title ?? "",
    body: article.value?.body ?? "",
    author: article.value?.author ?? "",
  };
}

function stopEdit() {
  isEditing.value = false;
  editedArticle.value = {
    id: "",
    title: "",
    body: "",
    author: "",
  };
}

async function save() {
  console.log(editedArticle.value);
  isEditing.value = false;

  const newTitle = editedArticle.value.title;
  const newBody = editedArticle.value.body;
  const newAuthor = editedArticle.value.author;

  if (!newTitle || !newBody || !newAuthor) {
    alert("Missing title, body, or author");
    return;
  }

  if (
    newTitle === article.value?.title &&
    newBody === article.value?.body &&
    newAuthor === article.value?.author
  ) {
    alert("No changes made to artist.");
    return;
  }

  const formData = new FormData();
  formData.append("id", articleId.value);
  formData.append("title", newTitle);
  formData.append("body", newBody);
  formData.append("author", newAuthor);

  try {
    await $fetch(`/api/articles/${articleId.value}`, {
      method: "PATCH",
      body: formData,
    });
    alert("Article updated successfully.");
    await navigateTo("/admin/content");
  } catch (error) {
    alert("Error updating article.");
  }

  stopEdit();
}

function deleteArticle() {
  console.log("delete article");
}
</script>

<template>
  <div class="verticalContent">
    <h1>Article</h1>
    <div v-if="!isEditing">
      <div v-if="pending">Loading article...</div>
      <div v-if="error">There was an error getting the article information</div>
      <div v-else-if="article">
        <h1>{{ article?.title }}</h1>
        <div>{{ article?.body }}</div>
        <div>{{ article?.author }}</div>
        <div>{{ article?.created_at }}</div>
      </div>
      <Button variant="primary" size="lg" @click="startEdit"
        >Click to Edit Artist</Button
      >
    </div>
    <div v-if="isEditing">
      <textarea v-model="editedArticle.title" type="text"></textarea>
      <textarea v-model="editedArticle.body" type="text"></textarea>
      <textarea v-model="editedArticle.author" type="text"></textarea>
      <Button variant="primary" size="lg" @click="save">Save Changes</Button>
      <Button variant="secondary" size="lg" @click="stopEdit">Cancel</Button>
      <Button variant="danger" size="lg" @click="deleteArticle"
        >Delete Article</Button
      >
    </div>
  </div>
</template>
