
<template>
  <div class="main-layout">
    <Sidebar />

    <main class="main-content">
      <Header />

      <section class="page-content">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7f6;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.page-content {
  width: 100%;
}
</style>
