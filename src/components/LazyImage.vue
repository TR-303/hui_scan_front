<template>
  <div class="lazy-wrapper" :style="{minHeight: placeholderHeight+'px'}">
    <!-- 占位图 / loading 样式，你可以换成自己的gif -->
    <div v-if="!isVisible" class="lazy-placeholder">Loading…</div>
    <img
        v-if="isVisible"
        ref="imageRef"
        :src="src"
        :alt="alt"
        class="lazy-image"
        @error="onError"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  // 传入滚动容器的 CSS 选择器，默认为 nearest scroll parent
  containerSelector: { type: String, default: '' },
  // 占位高度（px），可选
  placeholderHeight: { type: Number, default: 120 }
});

const imageRef = ref(null);
const isVisible = ref(false);
let observer;

onMounted(() => {
  const el = imageRef.value;
  if (!el) return;

  // 找到 observer 的 root：优先用 prop 传的容器，否则自动找滚动父
  let root = null;
  if (props.containerSelector) {
    root = document.querySelector(props.containerSelector);
    if (!root) console.warn(`[LazyImage] 找不到容器 ${props.containerSelector}`);
  }
  if (!root) root = findScrollParent(el);

  observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isVisible.value = true;
          observer.disconnect();
        }
      },
      {
        root,
        threshold: 0.1
      }
  );
  observer.observe(el);
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});

function findScrollParent(el) {
  while (el && el !== document.body) {
    const style = getComputedStyle(el);
    if (/(auto|scroll)/.test(style.overflowY)) return el;
    el = el.parentElement;
  }
  return null;
}

function onError() {
}
</script>

<style scoped>
.lazy-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.lazy-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #888;
  font-size: 14px;
  height: 100%;
}
.lazy-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: opacity 0.3s ease-in;
  opacity: 1;
}
</style>
