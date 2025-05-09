<template>
  <div style="height: 100%; overflow: auto; display: flex; flex-direction: column; padding: 1rem">
    <div class="card"
         style="display: flex; flex-direction: column; gap: 1rem; padding: 1rem; width: 100%; overflow-y: scroll;">
      <div class="title">数据统计</div>
      <div style="display: flex; flex-direction: row; gap: 1rem; padding: 1rem; width: 100%; height: auto;">
        <span style="flex: 0 0 auto;">时间范围</span>
        <el-date-picker
            v-model="dateRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="handleDateFilter"
            style="flex: 0 0 20%;"
        />
        <button style="flex: 0 0 10%; margin-left: auto; max-width: 150px; " @click="handleCreateReport()">生成报告
        </button>
      </div>
      <div class="card">
        <div ref="statisticsRef" style="width: 100%; height: 400px;"></div>
      </div>
      <div class="card">
        <div ref="proportionRef" style="width: 100%; height: 400px;"></div>
      </div>
      <div class="card">
        <div ref="singleStatisticsRef" style="width: 100%; height: 400px;"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue'
import * as echarts from 'echarts'
import {ElDatePicker} from 'element-plus'
import 'element-plus/es/components/date-picker/style/css'

const baseUrl = import.meta.env.VITE_API_URL
const statisticsRef = ref(null)
let statisticsInstance = null
const proportionRef = ref(null)
let proportionInstance = null
const singleStatisticsRef = ref(null)
let singleStatisticsInstance = null


const dateRange = ref([])

const statisticsData = ref({
  dates: [],
  total: [],
  defect: []
})

const proportionData = ref([])
const singleStatisticsData = ref({
  dates: []
})

function initStatisticsChart() {
  if (!statisticsRef.value) return
  statisticsInstance = echarts.init(statisticsRef.value)

  const option = {
    title: {
      text: '每日钢材检测数量统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'center',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      // boundaryGap: false,
      data: statisticsData.value.dates,
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '检测总数',
        type: 'bar',
        data: statisticsData.value.total
      },
      {
        name: '有缺陷数量',
        type: 'bar',
        data: statisticsData.value.defect
      }
    ]
  }
  statisticsInstance.setOption(option)
}

function initProportionChart() {
  if (!proportionRef.value) return;
  const validatedData = (Array.isArray(proportionData.value) ? proportionData.value : [])
      .map(item => ({
        name: item?.name || '未知',
        value: Number(item?.value) || 0,
      }))
      .filter(item => item.value > 0);
  proportionInstance = echarts.init(proportionRef.value);
  const option = {
    title: {
      text: '钢材缺陷类型占比',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'center',
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    series: [{
      name: '缺陷类型',
      type: 'pie',
      radius: '60%',
      center: ['50%', '60%'],
      data: validatedData,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    }],
  };
  proportionInstance.setOption(option);
}

function initSingleStatisticsChart() {
  if (!singleStatisticsRef.value)
    return
  singleStatisticsInstance = echarts.init(singleStatisticsRef.value)

  const option = {
    title: {
      text: '单项缺陷数量统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: singleStatisticsData.value.dates || []
    },
    yAxis: {
      type: 'value'
    },
    series: Object.keys(singleStatisticsData.value)
        .filter(key => key !== 'dates')
        .map(defectType => ({
          name: defectType,
          type: 'line',
          data: singleStatisticsData.value[defectType] || []
        }))
  };
  singleStatisticsInstance.setOption(option)
}

function resize() {
  if (statisticsInstance) {
    statisticsInstance.resize()
  }
  if (proportionInstance) {
    proportionInstance.resize()
  }
  if (singleStatisticsInstance) {
    singleStatisticsInstance.resize()
  }
}

const fetchStatistics = async () => {
  if (dateRange.value.length !== 2) return

  const [start, end] = dateRange.value
  const params = new URLSearchParams({
    start_time: start,
    end_time: end
  })

  const res = await fetch(`${baseUrl}/image/get-image-statistics?${params.toString()}`)
  const data = await res.json()
  data.proportionData = data.proportionData || []
  statisticsData.value = data.statisticsData
  proportionData.value = data.proportionData
  singleStatisticsData.value = data.singleStatisticsData
}

async function handleDateFilter() {
  if (dateRange.value.length !== 2) return
  const [start, end] = dateRange.value

  const params = new URLSearchParams({
    start_time: start,
    end_time: end
  })

  const res = await fetch(`${baseUrl}/image/get-image-statistics?${params.toString()}`)
  const data = await res.json()
  data.proportionData = data.proportionData || []
  statisticsData.value = data.statisticsData
  proportionData.value = data.proportionData
  singleStatisticsData.value = data.singleStatisticsData
  updateAllCharts()
}

function updateAllCharts() {
  if (statisticsInstance) {
    statisticsInstance.dispose();
  }
  if (proportionInstance) {
    proportionInstance.dispose();
  }
  if (singleStatisticsInstance) {
    singleStatisticsInstance.dispose();
  }
  initStatisticsChart()
  initProportionChart()
  initSingleStatisticsChart()
}

async function handleCreateReport() {
  fetch(`${baseUrl}/report/create-report?start_time=${dateRange.value[0]}&end_time=${dateRange.value[1]}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (!response.ok) {
      throw new Error('文件下载失败');
    }
    return response.blob();
  }).then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'defect_report.pdf'; // 文件名与后端一致
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }).catch(error => {
    console.error(error);
  });
}

onMounted(async function () {
  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 6)

  const formatDate = d => d.toISOString().split('T')[0]
  dateRange.value = [formatDate(sevenDaysAgo), formatDate(today)]

  await fetchStatistics()

  initStatisticsChart()
  initProportionChart()
  initSingleStatisticsChart()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(function () {
  if (statisticsInstance) {
    statisticsInstance.dispose()
  }
  if (proportionInstance) {
    proportionInstance.dispose()
  }
  if (singleStatisticsInstance) {
    singleStatisticsInstance.dispose()
  }
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
.title {
  display: flex;
  justify-content: center;
  font-size: 30px;
  font-weight: bold;
}

</style>
  