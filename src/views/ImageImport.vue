<script setup>
import {ref} from 'vue';
import {useRouter} from "vue-router";
import {ElMessage} from 'element-plus';

const baseUrl = import.meta.env.VITE_API_URL
const router = useRouter();

const images = ref([]);
const fileInput = ref();

function getImageUrl(file) {
  return URL.createObjectURL(file);
}

function handleDrop(e) {
  e.preventDefault();
  const droppedFiles = e.dataTransfer.files;
  Array.from(droppedFiles).forEach(file => {
    images.value.push(file);
  });
  e.currentTarget.classList.remove('dragging');
}

function handleFileChange(e) {
  const selectedFiles = e.target.files;
  Array.from(selectedFiles).forEach(file => {
    images.value.push(file);
  });
}

function handleOpenDialog() {
  fileInput.value.click();
}

function handleUpload() {
  let formData = new window.FormData();
  images.value.forEach((img, _) => {
    formData.append('images', img);
  });
  fetch(`${baseUrl}/batch/create-batch`, {
    method: 'POST',
    body: formData
  }).then(async res => {
    const result = await res.json();
    console.log(result);
    if (res.status === 201) {
      ElMessage.success(result.message);
      await router.replace(`/defect-recognition/detect/${result.batchId}`);
    } else if (res.status === 206) {
      ElMessage.warning(result.message);
      await router.replace(`/defect-recognition/detect/${result.batchId}`);
    } else if (res.status === 400) {
      ElMessage.error(result.error);
    } else {
      console.error(result);
      ElMessage.error("未知错误，请联系管理员");
    }
  }).catch(err => {
    ElMessage.error(`服务器错误: ${err.message} ${err.code ?? ''}`)
    console.error(err);
  });
}

</script>

<template>
  <div style="display: flex; flex-direction: row; height: 100%; padding: 1rem; gap: 1rem;">
    <div class="card" style="display: flex; flex-direction: column; padding :1rem; width :70%; height :100%;">
      <div style="padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
        <h2>等待上传的图片：</h2>
        <button @click="handleUpload">上传到数据库</button>
      </div>
      <div class="image-list">
        <div v-for="(img, idx) in images" :key="idx" class="preview-image">
          <img alt="无法显示图片" :src="getImageUrl(img)" class="preview-image"/>
        </div>
      </div>
    </div>
    <div class="card"
         style="display: flex; flex-direction: column; padding: 1rem; width: 30%; align-items: center; height: min-content;">
      <div
          class="drop-zone"
          @drop.stop="handleDrop"
          @dragover.prevent
          @dragenter.stop="e => e.currentTarget.classList.add('dragging')"
          @dragleave.stop="e => e.currentTarget.classList.remove('dragging')"
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
  display: grid;
  height: auto;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.preview-image {
  width: 100%;
  height: 150px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

/* noinspection CssUnusedSymbol */
.drop-zone:hover, .drop-zone.dragging {
  background-color: #e6f7ff;
}
</style>
