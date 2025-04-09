<script setup>
</script>

<template>
  <div class="sidebar-menu">
    <div class="logo">
      <!-- 预留 Logo -->
      <span>慧识</span>
    </div>
    <nav class="item-container">
      <router-link class="item" to="/image-import">图片导入</router-link>
      <router-link class="item" to="/defect-recognition">缺陷识别</router-link>
      <router-link class="item" to="/data-query">数据查询</router-link>
      <router-link class="item" to="/data-inspect">数据统计</router-link>
    </nav>
  </div>
</template>

<style scoped>
.sidebar-menu {
  width: 12vw;
  height: 100%;
  padding: 1rem;
}

.logo {
  padding: 1rem;
  font-size: 1.5rem;
}

.item-container {
  display: flex;
  flex-direction: column;
  border: none;
  background: transparent;
}

.item {
  display: block;
  text-align: center;
  padding: 1rem;
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #333;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.item:hover {
  background-color: #e6f7ff;
}

/* noinspection CssUnusedSymbol */
.item.router-link-active {
  background-color: #bae7ff;
  font-weight: bold;
}
</style>
