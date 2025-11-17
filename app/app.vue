<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.page {
  width: 100vw;
  height: 100vh;
}

.centerContent {
  display: flex;
  justify-content: center;
  align-items: center;
}

.centerContainer {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 50vw;
  /* border: 1px solid var(--text-color); */
  border-radius: 0.5rem;
}

.verticalContent {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.submissionForm {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
