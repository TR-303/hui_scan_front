<script setup>
import {useRoute} from 'vue-router'
import {ref, onMounted} from 'vue'
import {ElMessage} from 'element-plus'
import ImageViewer from "@/components/ImageViewer.vue";

const route = useRoute()

const baseUrl = import.meta.env.VITE_API_URL
const resourceUrl = import.meta.env.VITE_RESOURCE_URL
const batchId = route.params.batchId
const currentBatch = ref({
  'batchId': undefined,
  'importTime': undefined,
  'status': undefined,
  'size': undefined,
  'images': [{
    imageId: undefined,
    status: undefined,
    thumbnail: undefined,
  }]
})

const imageId = ref('')

function get_current_batch() {
  fetch(`${baseUrl}/batch/get-batch-detail?batchId=${batchId}`, {
    method: 'GET'
  }).then(async res => {
    const result = await res.json()
    if (res.status === 200) {
      currentBatch.value = result
    } else if (res.status === 400 || res.status === 404) {
      ElMessage.error(result.error)
    } else {
      ElMessage.error("未知错误，请联系管理员")
    }
  }).catch(err => {
    console.error(err)
    ElMessage.error(`服务器错误: ${err.message} ${err.code ?? ''}`)
  })
}

function handleViewImage(id) {
  imageId.value = id.toString()
}

async function handleDetectAll() {
  try {
    const response = await fetch(`${baseUrl}/detect/batch-detect?batchId=${batchId}`, {
      method: 'POST'
    })

    if (!response.ok) {
      const errorResult = await response.json()
      ElMessage.error(errorResult.error || '未知错误')
      return;
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let done = false

    while (!done) {
      const {value, done: readerDone} = await reader.read()
      done = readerDone

      if (value) {
        const chunk = decoder.decode(value, {stream: true})
        console.log(chunk)
        try {
          const objects = JSON.parse(`[${chunk.replace(/}\s*{/g, '},{')}]`)
          objects.forEach(obj => {
            if (obj["undetectedImageIds"]) {
              obj["undetectedImageIds"].forEach(imageId => {
                const image = currentBatch.value.images.find(img => img.imageId === imageId)
                if (image) {
                  image.status = 'pending'
                }
              })
            } else if (obj["hasDefect"] !== undefined && obj['imageId'] !== undefined) {
              const image = currentBatch.value.images.find(img => obj['imageId'] === img.imageId)
              if (image) {
                image.status = obj["hasDefect"] ? 'faulty' : 'flawless'
              }
            }
          })
        } catch (err) {
          console.error('解析chunk失败:', err)
          ElMessage.error('解析结果失败')
        }
      }
    }

    ElMessage.success('检测全部完成')
  } catch (err) {
    console.error('Fetch error:', err)
    ElMessage.error(`服务器错误: ${err.message} ${err.code ?? ''}`)
  }
}

onMounted(get_current_batch)
</script>

<template>
  <div style="display: flex; flex-direction: column; height: 100%; padding: 1rem; gap: 1rem;">
    <div class="card" style="flex: none; min-height: min-content;">
      <h2>批号： {{ currentBatch.batchId }}</h2>
      <p>导入时间： {{ currentBatch.importTime }}</p>
      <p>容量： {{ currentBatch.size }}</p>
      <p>状态： {{ currentBatch.status }}</p>
      <button style="width: 6rem;" @click="handleDetectAll">检测全部</button>
    </div>
    <div style="flex: 1; min-height: 0; display: flex; gap: 1rem;">
      <div class="card" style="display: flex; flex-direction: column; min-width: 150px; min-height: 0;">
        <div class="image-list">
          <div v-for="(img, idx) in currentBatch.images" :key="idx" class="preview-image"
               @click="handleViewImage(img.imageId)">
            <img :src='resourceUrl+img.thumbnail' alt="略缩图"/>
            <div class="status-icon" :class="'icon-'+img.status"/>
          </div>
        </div>
      </div>
      <div class="card" style="flex: 1; min-width: 0; min-height: 0;">
        <ImageViewer v-if="imageId!==''" :image-id="imageId"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-list {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: min-content;
  gap: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.preview-image {
  width: 150px;
  height: 150px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.preview-image:hover {
  transform: scale(1.05);
}

.status-icon {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  background-size: cover;
  background-repeat: no-repeat;
}

/* noinspection CssUnusedSymbol */
.icon-untouched{
  background-image: url("@/assets/untouched.png");
}

/* noinspection CssUnusedSymbol */
.icon-pending{
  background-image: url("@/assets/pending.png");
}

/* noinspection CssUnusedSymbol */
.icon-faulty{
  background-image: url("@/assets/faulty.png");
}

/* noinspection CssUnusedSymbol */
.icon-flawless{
  background-image: url("@/assets/flawless.png");
}

</style>
