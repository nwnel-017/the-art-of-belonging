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

const addContent = (item: string) => {
  if (!item) {
    throw new Error("Item not selected!");
  }
  navigateTo(`newContent/add${item}`);
};

const articles = useFetch("/api/articles/articles");
console.log(articles.data);
</script>

<template>
  <div class="verticalContent">
    <div class="horizontalContent">
      <h1>Content</h1>
      <DropDown
        @select="addContent"
        label="Add Content"
        :items="['Artwork', 'Article', 'Video']"
      />
    </div>
  </div>
</template>
