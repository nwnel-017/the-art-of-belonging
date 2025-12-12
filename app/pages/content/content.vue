<script lang="ts" setup>
definePageMeta({
  layout: "default",
});

const {
  data: articles,
  pending,
  error,
} = await useFetch("/api/articles/articles");
</script>

<template>
  <div class="verticalContent">
    <h1>Content</h1>
    <div>
      <div v-if="pending">Loading Content...</div>
      <div v-else-if="error">Failed to get content: {{ error }}</div>
      <div v-else>
        <div v-for="article in articles" :key="article.id" class="article">
          <h2>{{ article.title }}</h2>
          <div>{{ article.body }}</div>
          <div>{{ article.author }}</div>
          <div>{{ article.created_at }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article {
  margin-bottom: 2rem;
  background-color: var(--theme-off-white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 30vw;
  padding: 2.5rem auto;
  /* width: 60vw; */
}
</style>
