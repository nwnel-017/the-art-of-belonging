<template>
  <div class="navBarMain">
    <NuxtLink to="/" class="dashLink">Home </NuxtLink>
    <NuxtLink to="/artists/artists" class="dashLink">Our Artists </NuxtLink>
    <NuxtLink to="/artworks/gallery" class="dashLink">Gallery</NuxtLink>
    <NuxtLink to="/artworks/upcoming" class="dashLink">Upcoming</NuxtLink>
    <NuxtLink to="/content/content" class="dashLink">Content</NuxtLink>
  </div>
</template>

<style>
.navBarMain {
  width: 100%;
  display: flex;
  justify-content: space-around;
  background-color: var(--theme-off-white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dashLink {
  text-decoration: none;
  font-weight: bold;
  color: var(--text-color);
}
</style>
