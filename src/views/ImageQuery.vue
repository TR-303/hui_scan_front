<template>
  <div style="height: 100%; overflow: auto; display: flex; flex-direction: column; gap: 1rem; padding: 1rem">
    <div class="card"
         style="height: 100%; padding: 1rem; display: flex; flex-direction: column; gap: 1rem; width: 100%; overflow-y: scroll;">
      <div class="title">数据查询</div>
      <el-form :inline="true" :model="filters" class="mb-4">
        <el-form-item label="时间范围">
          <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="检测状态">
          <el-select v-model="filters.status" placeholder="请选择" style="width: 120px;">
            <el-option label="全部" value=""/>
            <el-option label="已检测" value="已检测"/>
            <el-option label="未检测" value="未检测"/>
          </el-select>
        </el-form-item>

        <el-form-item label="缺陷类型">
          <el-select v-model="filters.defectTypes" multiple placeholder="选择缺陷类型" style="width: 400px;">
            <el-option label="夹杂物" value="夹杂物"/>
            <el-option label="补丁" value="补丁"/>
            <el-option label="划痕" value="划痕"/>
            <el-option label="其他缺陷" value="其他缺陷"/>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="filterData">筛选</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredList" style="width: 100%">
        <el-table-column prop="id" label="图片ID" width="120"/>
        <el-table-column prop="createTime" label="创建时间"/>
        <el-table-column prop="status" label="检测状态"/>
        <el-table-column prop="detectTime" label="检测时间"/>
        <el-table-column prop="defects" label="缺陷类型">
          <template #default="scope">
            <el-tag
                v-for="(defect, index) in scope.row.defects || []"
                :key="index"
                :type="defect === '无缺陷'?'success':'danger'"
                class="mr-1"
            >
              {{ defect }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" link @click="() => goToDetail(scope.row.id)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElDatePicker} from 'element-plus'
import 'element-plus/es/components/date-picker/style/css'

const router = useRouter()
const baseUrl = import.meta.env.VITE_API_URL

const filters = ref({
  dateRange: [],
  status: '',
  defectTypes: []
})

const filteredList = ref([])

async function filterData() {
  const [start, end] = filters.value.dateRange || []

  let detected = ''
  if (filters.value.status === '已检测') detected = 'true'
  else if (filters.value.status === '未检测') detected = 'false'

  const defectType = filters.value.defectTypes[0] || ''

  const params = new URLSearchParams({
    ...(start && end && {start_time: start, end_time: end}),
    ...(detected && {detected}),
    ...(defectType && {defect_type: defectType}),
  })

  try {
    const res = await fetch(`${baseUrl}/image/get-image-list?${params.toString()}`)
    const data = await res.json()

    filteredList.value = data.map(item => ({
      id: item.image_id,
      createTime: item.create_time,
      status: item.detected ? '已检测' : '未检测',
      detectTime: item.detect_time || '',
      defects: item.defect_types || []
    }))
  } catch (err) {
    console.error('数据查询失败', err)
  }
}

function resetFilters() {
  filters.value = {
    dateRange: [],
    status: '',
    defectTypes: []
  }
  filteredList.value = []
}

function goToDetail(id) {
  router.push(`/data-query/image/${id}`)
}
</script>

<style scoped>
.mr-1 {
  margin-right: 4px;
}

.title {
  display: flex;
  justify-content: center;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
  