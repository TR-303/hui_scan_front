<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {ElDatePicker, ElSelect, ElOption, ElMessage} from 'element-plus'

const router = useRouter()

const baseUrl = import.meta.env.VITE_API_URL

let batches = ref([
  {
    'batchId': undefined,
    'importTime': undefined,
    'status': undefined,
    'size': undefined,
  }
])

function handleClickBatch(batch) {
  router.push(`/defect-recognition/detect/${batch.batchId}`);
}

let selectedDate = ref()
let finishedStatus = ref('all')
let sortValue = ref('time')
let rangeMode = ref('year')

function handleSearchBatch() {
  let params = {
    selectedDate: selectedDate.value,
    finishedStatus: finishedStatus.value,
    sortValue: sortValue.value,
    rangeMode: rangeMode.value
  }

  fetch(`${baseUrl}/batch/get-batch-list?
selectedDate=${params.selectedDate ? new Date(params.selectedDate).toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'}).replace(/\//g, '-') : undefined}&
rangeMode=${params.rangeMode}&
finishedStatus=${params.finishedStatus}&
sortValue=${params.sortValue}`, {
    method: 'GET'
  }).then(async res => {
    batches.value = await res.json()
    if (batches.value.length === 0) {
      ElMessage.warning("没有找到符合条件的批次")
    }
  }).catch(err => {
    console.error(err)
    ElMessage.error(`服务器错误: ${err.message} ${err.code ?? ''}`)
  })
}

onMounted(handleSearchBatch)

</script>

<template>
  <div style="display: flex; align-items: center; flex-direction: column; gap: 1rem; padding: 1rem; height: 100%;">
    <div class="card"
         style="width: 100%; height: auto; display: flex; flex-direction: column; gap: 1rem; padding: 1rem 1rem 1rem 4rem; align-items: flex-start;">
      <div style="display: flex; gap: 1rem; align-items: center; width: 100%;">
        <span>时间：</span>
        <el-select v-model="rangeMode" placeholder="选择范围" style="width: 100px;">
          <el-option label="按年" value="year"/>
          <el-option label="按月" value="month"/>
          <el-option label="按日" value="date"/>
        </el-select>
        <el-date-picker v-if="rangeMode === 'year'" v-model="selectedDate" type="year" placeholder="选择年份"/>
        <el-date-picker v-if="rangeMode === 'month'" v-model="selectedDate" type="month" placeholder="选择月份"/>
        <el-date-picker v-if="rangeMode === 'date'" v-model="selectedDate" type="date" placeholder="选择日期"/>
      </div>
      <div style="display: flex; gap: 1rem; align-items: center; width: 100%;">
        <span>状态：</span>
        <el-select v-model="finishedStatus" placeholder="选择状态" style="width: 100%; max-width: 10rem">
          <el-option label="全部" value="all"/>
          <el-option label="已完成" value="finished"/>
          <el-option label="未完成" value="unfinished"/>
        </el-select>
      </div>
      <div style="display: flex; gap: 1rem; align-items: center; width: 100%;">
        <span>排序：</span>
        <el-select v-model="sortValue" placeholder="排序方式" style="width: 100%; max-width: 10rem">
          <el-option label="按时间升序" value="time"/>
          <el-option label="按时间降序" value="-time"/>
        </el-select>
      </div>
      <div style="display: flex; gap: 1rem; width: 100%;">
        <button @click="handleSearchBatch" style="width: 100%; max-width: 8rem;">筛选</button>
      </div>
    </div>
    <div class="card" style="width: 100%; height: 80%;">
      <div class="batch-container">
        <div class="batch-item" v-for="(b, idx) in batches" :key="idx" @click="handleClickBatch(b)">
          <div class="batch-item-entry">
            <span>批号:</span>
            <span>{{ b.batchId }}</span>
          </div>
          <div class="batch-item-entry">
            <span>导入时间:</span>
            <span>{{ b.importTime }}</span>
          </div>
          <div class="batch-item-entry">
            <span>容量:</span>
            <span>{{ b.size }}</span>
          </div>
          <div class="batch-item-entry">
            <span>状态:</span>
            <span>{{ b.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.batch-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  padding: 1rem;
  gap: 1rem;
  overflow-y: auto;
  max-height: 100%;
  perspective: 50000px;
}

.batch-item {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  height: 200px;
  cursor: pointer;
  transform: translateZ(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.batch-item:hover {
  transform: scale(1.07) translateZ(15px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

el-date-picker {
  width: 100%;
  max-width: 12rem;
}

.batch-item-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

</style>