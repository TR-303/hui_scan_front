<template>
    <div class="card">
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
          <el-select v-model="filters.status" placeholder="请选择">
            <el-option label="全部" value="" />
            <el-option label="已检测" value="已检测" />
            <el-option label="未检测" value="未检测" />
          </el-select>
        </el-form-item>
  
        <el-form-item label="缺陷类型">
          <el-select v-model="filters.defectTypes" multiple placeholder="选择缺陷类型">
            <el-option label="缺陷A" value="缺陷A" />
            <el-option label="缺陷B" value="缺陷B" />
            <el-option label="缺陷C" value="缺陷C" />
            <el-option label="缺陷D" value="缺陷D" />
          </el-select>
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" @click="filterData">筛选</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
  
      <el-table :data="filteredList" style="width: 100%">
        <el-table-column prop="id" label="图片ID" width="120" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="status" label="检测状态" />
        <el-table-column prop="detectTime" label="检测时间" />
        <el-table-column prop="defects" label="缺陷类型">
          <template #default="scope">
            <el-tag
                v-for="(defect, index) in scope.row.defects || []"
                :key="index"
                type="danger"
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
  </template>
  
<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElDatePicker } from 'element-plus'
  import 'element-plus/es/components/date-picker/style/css'
  
  const router = useRouter()
  
  const filters = ref({
    dateRange: [],
    status: '',
    defectTypes: []
  })
  
  const dataList = ref([
    {
      id: 'IMG001',
      createTime: '2025-04-10',
      status: '已检测',
      detectTime: '2025-04-11',
      defects: ['缺陷A']
    },
    {
      id: 'IMG002',
      createTime: '2025-04-12',
      status: '未检测',
      detectTime: '',
      defects: []
    },
    {
      id: 'IMG003',
      createTime: '2025-04-13',
      status: '已检测',
      detectTime: '2025-04-14',
      defects: ['缺陷B', '缺陷C']
    }
  ])
  
  const filteredList = ref([...dataList.value])
  
  function filterData() {
    filteredList.value = dataList.value.filter(item => {
      const [start, end] = filters.value.dateRange || []
      const inDateRange = !start || (item.createTime >= start && item.createTime <= end)
      const matchStatus = !filters.value.status || item.status === filters.value.status
      const matchDefects =
        filters.value.defectTypes.length === 0 ||
        filters.value.defectTypes.some(type => item.defects.includes(type))
      return inDateRange && matchStatus && matchDefects
    })
  }
  
  function resetFilters() {
    filters.value = {
      dateRange: [],
      status: '',
      defectTypes: []
    }
    filteredList.value = [...dataList.value]
  }
  
  function goToDetail(id) {
    router.push(`/example/path/${id}`)
  }
  </script>
  
<style scoped>
  .mr-1 {
    margin-right: 4px;
  }
  .card {
    margin-left: auto;
    margin-right: auto;
    padding: 1rem;
    width: 90%;
  }
</style>
  