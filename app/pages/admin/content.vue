<script lang="ts" setup>
// To Do:
// 1.) fetch content from backend
// 2.) display content on dash
// 3.) buttons to edit / delete content
// 4.) edit - navigate to edit page
// 5.) add content - navigate to create page
definePageMeta({
  layout: "dashboard",
  middleware: "admin",
});

type Article = {
  id: "";
  title: "";
  body: "";
  author: "";
};

function addContent() {
  navigateTo("newContent/addArticle");
}

const isEditing = ref(false);

// const editedArticle = ref<Article>(
//   id: "",
//   title: "",

// )

async function editArticle(id: string) {
  console.log(id);
  isEditing.value = true;
  await navigateTo(`editContent/articles/${id}`);
}

function deleteArticle(id: string) {
  console.log("deleting article");
}

function stopEdit() {
  isEditing.value = false;
}

function save() {
  isEditing.value = false;
}

const { data: articles, pending, error } = useFetch("/api/articles/articles");
console.log(articles);
</script>

<template>
  <div class="verticalContent">
    <div class="horizontalContent">
      <h1>Content</h1>
      <Button @click="addContent">Add Content</Button>
    </div>
    <div v-if="pending">Loading articles...</div>
    <div v-else-if="error">No articles to show</div>
    <div
      v-else
      v-for="article in articles"
      :key="article?.id"
      class="contentCard"
    >
      <div class="closeHorContent">
        <div>{{ article?.title }}</div>
        <div>{{ article?.body }}</div>
        <div>{{ article?.author }}</div>
        <div>{{ article?.created_at }}</div>
      </div>
      <Button size="sm" variant="secondary" @click="editArticle(article?.id)"
        >Edit</Button
      >
    </div>
  </div>
</template>
