<template>
  <div class="navBar">
    <NuxtLink to="/admin/dashboard" class="dashLink">Dashboard</NuxtLink>
    <NuxtLink to="/admin/content" class="dashLink">Content</NuxtLink>
    <NuxtLink to="/admin/orders" class="dashLink">Orders</NuxtLink>
    <NuxtLink to="/admin/artists" class="dashLink">Artists</NuxtLink>
    <NuxtLink to="/admin/settings" class="dashLink">Settings</NuxtLink>
  </div>
</template>

<style scoped>
.navBar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  height: 100vh;
  left: 0;
  padding-left: 1rem;
  background-color: var(--theme-off-white);
}

.dashLink {
  text-decoration: none;
  font-weight: bold;
  color: var(--text-color);
}
</style>
