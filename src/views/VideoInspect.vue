<template>
  <div style="height: 100%; overflow: auto; display: flex; flex-direction: column; gap: 1rem; padding: 1rem">
    <div class="card"
        style="height: 100%; padding: 1rem; display: flex; flex-direction: column; gap: 1rem; width: 100%; overflow-y: scroll;">
      <div class="title">视频识别</div>

      <div class="video-container">
        <div class="left-panel">

          <div class="card-section blue-card">
            <div class="section-title">提示</div>
            <p>请点击“开始识别”按钮启动摄像头和识别流程,点击“结束识别”按钮关闭摄像头。</p>
          </div>

          <div class="card-section">
            <div class="section-title">操作</div>
            <div class="detect-button-container">
              <button @click="startRecognition" :disabled="isRecognizing" class="detect-button">开始识别</button>
              <button @click="stopRecognition" :disabled="!isRecognizing" class="detect-button">结束识别</button>
            </div>
          </div>

          <div class="card-section notification-card">
            <div class="section-title">缺陷信息</div>
            <div v-if="notifications.length > 0">
              <div v-for="item in notifications" :key="item.id"
                  :class="['notification-item', item.severity]">
                <span>⚠️ 检测到缺陷类型：{{ item.type }}</span>
              </div>
            </div>
            <div v-else>
              未检测到缺陷
            </div>
          </div>
        </div>

        <div class="video">
          <video ref="video" autoplay muted playsinline width="800" height="600" style="background: black;"></video>
          <canvas ref="overlay" width="800" height="600"
                  style="position: absolute; top: 0; left: 0;"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'

const video = ref(null)
const overlay = ref(null)
const ws = ref(null)
const stream = ref(null)
let intervalId = null
const isRecognizing = ref(false)
const notifications = ref([
  // { id: 1, type: '裂纹', severity: 'danger' },
  // { id: 2, type: '锈蚀', severity: 'danger' }
])

onBeforeUnmount(() => {
  stopRecognition()
})

async function startRecognition() {
  if (isRecognizing.value) return

  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ video: true })
    video.value.srcObject = stream.value
    ws.value = new WebSocket("ws://localhost:8765") 
    ws.value.onopen = () => {
      console.log("WebSocket connected")
      isRecognizing.value = true
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      intervalId = setInterval(() => {
        if (ws.value.readyState !== WebSocket.OPEN) return

        canvas.width = video.value.videoWidth
        canvas.height = video.value.videoHeight
        ctx.drawImage(video.value, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(blob => {
          blob.arrayBuffer().then(buffer => ws.value.send(buffer))
        }, 'image/jpeg', 0.8)
      }, 100)
    }

    ws.value.onmessage = (event) => {
      const data = JSON.parse(event.data)
      drawOverlay(data.defects)
    }

    ws.value.onclose = () => {
      console.log("WebSocket closed")
      isRecognizing.value = false
      clearOverlay()
    }

    ws.value.onerror = (err) => {
      console.error("WebSocket error", err)
      stopRecognition()
    }
  } catch (err) {
    console.error("Error starting recognition", err)
    stopRecognition()
  }
}

function stopRecognition() {
  if (!isRecognizing.value && !stream.value) return
  clearInterval(intervalId)
  intervalId = null
  if (ws.value) {
    ws.value.close()
    ws.value = null
  }
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  video.value.srcObject = null
  clearOverlay()
  isRecognizing.value = false
}

function drawOverlay(defects) {
  const ctx = overlay.value.getContext('2d')
  ctx.clearRect(0, 0, overlay.value.width, overlay.value.height)
  ctx.strokeStyle = 'red'
  ctx.lineWidth = 2
  ctx.font = '16px Arial'
  ctx.fillStyle = 'red'

  for (const defect of defects) {
    ctx.strokeRect(defect.x, defect.y, defect.w, defect.h)
    ctx.fillText(defect.label, defect.x, defect.y - 5)
  }
}

function clearOverlay() {
  const ctx = overlay.value.getContext('2d')
  ctx.clearRect(0, 0, overlay.value.width, overlay.value.height)
}
</script>

<style>
.title {
  display: flex;
  justify-content: center;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
}

.video-container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: flex-start;
  /* gap: 5rem; */
}

.card-section {
  background: #f9f9f9;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.blue-card {
  background-color: #e0f0ff;
  border-color: #7ec8f7;
}

.notification-card {
  /* flex-grow: 1; */
  overflow-y: auto;
  max-height: 400px;
  background: #f9f9f9;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
  flex: 1;
}


.section-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 0.5rem;
  text-align: center;
}

.notification-item {
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: white;
}

.notification-item.danger {
  background-color: #ff4d4f;
}

.video {
  position: relative;
  width: 800px;
  height: 600px;
  border: 2px solid #333;
  border-radius: 8px;
  overflow: hidden;
}

.detect-button {
  padding: 0.5rem 1rem;
  font-size: 16px;
  cursor: pointer;
}

.detect-button-container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.left-panel{
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 300px;
  gap: 1rem;
}
</style>
