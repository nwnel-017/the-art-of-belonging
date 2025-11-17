<template>
  <div class="navBar">
    <NuxtLink to="dashboard" class="dashLink">Dashboard</NuxtLink>
    <NuxtLink to="content" class="dashLink">Content</NuxtLink>
    <NuxtLink to="orders" class="dashLink">Orders</NuxtLink>
    <NuxtLink to="settings" class="dashLink">Settings</NuxtLink>
  </div>
</template>

<style scoped>
.navBar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  height: 100vh;
  /* width: 20%; */
  /* border: 1px solid black; */
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
