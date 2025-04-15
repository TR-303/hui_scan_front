<template>
  <div class="app-container">
    <div class="sidebar">
      <SideBar/>
    </div>
    <div class="main-content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import {RouterView} from "vue-router";
import SideBar from "@/components/SideBar.vue";

export default {
  name: 'App',
  components: {SideBar, RouterView}
}
</script>

<style scoped>
.app-container {
  height: 100%;
  display: flex;
  flex-direction: row;
}

.sidebar {
  height: 100%;
}

.main-content {
  width: 100%;
  flex: 1;
  height: 100%;
  background: #f7f7f7;
}
</style>
