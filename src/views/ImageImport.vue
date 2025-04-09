<script setup>
import {ref} from 'vue';

const images = ref([]);
const fileInput = ref(null);

function handleDrop(e) {
  const droppedFiles = e.dataTransfer.files;
  Array.from(droppedFiles).forEach(file => {
    images.value.push(URL.createObjectURL(file));
  });
}

function handleFileChange(e) {
  const selectedFiles = e.target.files;
  Array.from(selectedFiles).forEach(file => {
    images.value.push(URL.createObjectURL(file));
  });
}

function handleOpenDialog() {
  fileInput.value.click();
}
</script>

<template>
  <div style="display: flex; flex-direction: row;">
    <div class="card" style="display: flex; flex-direction: column; padding :1rem; width :70%;">
      <div style="padding: 1rem;">
        <h2>上传的图片</h2>

      </div>
      <div class="image-list">
        <div v-for="(img, idx) in images" :key="idx" class="preview-image">
          <img alt="无法显示图片" :src="img" class="preview-image"/>
        </div>
      </div>
    </div>
    <div class="card" style="display: flex; flex-direction: column; padding :1rem; width :30%; align-items: center;">
      <div
          class="drop-zone"
          @drop="handleDrop"
          @dragover.prevent
      >
        拖拽图片到这里
      </div>
      <button style="width: 8rem" @click="handleOpenDialog">
        导入图片
      </button>
      <input
          ref="fileInput"
          type="file"
          multiple
          style="display:none;"
          @change="handleFileChange"
      />
    </div>
  </div>
</template>

<style scoped>
.image-list {
  flex: 1;
}

.preview-image {
  max-width: 100%;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.drop-zone {
  width: 100%;
  height: auto;
  aspect-ratio: 10 / 7;
  border: 1px dashed #aaa;
  margin: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.drop-zone:hover {
  background-color: #e6f7ff;
}
</style>
