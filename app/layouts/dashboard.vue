<script setup lang="ts">
import NavBar from "~/components/nav-bar.vue";
</script>

<template>
  <div class="centerContent">
    <NavBar />
    <div class="page centerContent">
      <slot />
    </div>
  </div>
</template>
