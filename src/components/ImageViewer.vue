<script setup>
import {ref, defineProps, computed, watch} from 'vue';
import {useRoute} from 'vue-router';
import {ElMessage} from "element-plus";

const baseUrl = import.meta.env.VITE_API_URL;
const resourceUrl = import.meta.env.VITE_RESOURCE_URL;

const route = useRoute();
const props = defineProps({
  imageId: {
    type: String,
    required: false
  }
});

const imageId = computed(() => props.imageId || route.params.imageId);

const currentImage = ref({
  imageId: undefined,
  original: undefined,
  processed: undefined,
  createTime: undefined,
  detectTime: undefined,
  width: undefined,
  height: undefined,
  defects: [{
    defectId: undefined,
    defectType: undefined,
    bbox: undefined,
    confidence: undefined,
  }]
});

function fetchImageDetails() {
  fetch(`${baseUrl}/image/get-image-detail?imageId=${imageId.value}`, {
    method: 'GET'
  }).then(async res => {
    const result = await res.json();
    if (res.status === 200) {
      currentImage.value = result;
    } else if (res.status === 400 || res.status === 404) {
      ElMessage.error(result.error);
    } else {
      ElMessage.error("未知错误，请联系管理员");
    }
  }).catch(err => {
    console.error(err);
    ElMessage.error(`服务器错误: ${err.message} ${err.code ?? ''}`);
  });
}

watch(imageId, fetchImageDetails, {immediate: true});

</script>

<template>
  <div style="height: 100%; overflow: auto; display: flex; flex-direction: column; gap: 1rem; padding: 1rem">
    <div :class=" route.params.imageId ? 'card' : 'part-container'">
      <h2>图片信息</h2>
      <p>创建时间： {{ currentImage.createTime }}</p>
      <p>检测时间： {{ currentImage.detectTime ?? "未检测" }}</p>
      <p>图像尺寸： {{ currentImage.width }} px &#215; {{ currentImage.height }} px</p>
    </div>
    <div :class=" route.params.imageId ? 'card' : 'part-container'">
      <h2>原图</h2>
      <img
          v-if="currentImage.original"
          :src="resourceUrl+currentImage.original"
          alt="Original image"
      />
    </div>
    <div :class=" route.params.imageId ? 'card' : 'part-container'">
      <h2>检测结果</h2>
      <div v-if="currentImage.processed">
        <img :src="resourceUrl+currentImage.processed" alt="Processed image"/>
        <h3>缺陷列表</h3>
        <ul>
          <li v-for="defect in currentImage.defects" :key="defect.defectId">
            缺陷ID: {{ defect.defectId }} ({{ defect.defectType }}),
            置信度: {{ defect.confidence }},
            框: {{ defect.bbox }}
          </li>
        </ul>
      </div>
      <div v-else>
        <p>未检测</p>
        <button style="width: 6rem">立即检测</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
img {
  width: 100%;
  max-height: 60vh;
  object-fit: contain;
}

.part-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

</style>

