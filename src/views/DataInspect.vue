<template>
    <div class="card">
        <div class="title">数据统计</div>
        <div>按时间筛选</div>
        <el-date-picker
        v-model="dateRange"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        @change="handleDateFilter"
        style="margin-bottom: 20px; margin-top: 10px;"
        />

        <div class="chart">
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
    import { ref, onMounted, onBeforeUnmount} from 'vue'
    import * as echarts from 'echarts'
    import { ElDatePicker } from 'element-plus'
    import 'element-plus/es/components/date-picker/style/css'

    const statisticsRef = ref(null)
    let statisticsInstance = null
    const proportionRef = ref(null)
    let proportionInstance = null
    const singleStatisticsRef = ref(null)
    let singleStatisticsInstance = null

    const statisticsData = ref({
        dates: ['2025-04-01', '2025-04-02', '2025-04-03', '2025-04-04', '2025-04-05'],
        total: [2, 6, 4, 8, 6],
        defect: [1, 3, 2, 4, 3]
    })

    const proportionData = [
        { name: '裂纹', value: 45 },
        { name: '锈蚀', value: 30 },
        { name: '划痕', value: 20 },
        { name: '凹坑', value: 25 },
        { name: '无缺陷', value: 80 }
    ]

    const singleStatisticsData = ref({
        dates: ['2025-04-01', '2025-04-02', '2025-04-03', '2025-04-04', '2025-04-05'],
        defect_A: [1, 2, 3, 4, 5],
        defect_B: [2, 4, 6, 8, 10],
        defect_C: [1, 3, 2, 4, 6],
        defect_D: [4, 2, 3, 8, 4],
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
        if (!proportionRef.value) return
        proportionInstance = echarts.init(proportionRef.value)

        const option = {
            title: {
                text: '钢材缺陷类型占比',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                right: 0,
                top: 'center'
            },
            toolbox: {
                feature: {
                saveAsImage: {}
                }
            },
            series: [
            {
                name: '缺陷类型',
                type: 'pie',
                radius: '60%',
                center: ['50%', '60%'],
                data: proportionData,
                emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
                }
            }
            ]  
        }
        proportionInstance.setOption(option)
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
                data: singleStatisticsData.value.dates,
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                name: 'A类缺陷',
                type: 'line',
                data: singleStatisticsData.value.defect_A
                },
                {
                name: 'B类缺陷',
                type: 'line',
                data: singleStatisticsData.value.defect_B
                },
                {
                name: 'C类缺陷',
                type: 'line',
                data: singleStatisticsData.value.defect_C
                },
                {
                name: 'D类缺陷',
                type: 'line',
                data: singleStatisticsData.value.defect_D
                },
            ]
        }
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

    onMounted(function () {
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

    const dateRange = ref([])

    const originalStatisticsData = JSON.parse(JSON.stringify(statisticsData.value))
    const originalProportionData = JSON.parse(JSON.stringify(proportionData))
    const originalSingleStatisticsData = JSON.parse(JSON.stringify(singleStatisticsData.value))

    function handleDateFilter() {
    if (dateRange.value.length !== 2) return

    const [start, end] = dateRange.value

    const filteredDates = []
    const filteredTotal = []
    const filteredDefect = []

    for (let i = 0; i < originalStatisticsData.dates.length; i++) {
        const date = originalStatisticsData.dates[i]
        if (date >= start && date <= end) {
        filteredDates.push(date)
        filteredTotal.push(originalStatisticsData.total[i])
        filteredDefect.push(originalStatisticsData.defect[i])
        }
    }

    statisticsData.value = {
        dates: filteredDates,
        total: filteredTotal,
        defect: filteredDefect
    }

    const totalBefore = originalStatisticsData.total.reduce((a, b) => a + b, 0)
    const totalAfter = filteredTotal.reduce((a, b) => a + b, 0)
    const scale = totalBefore === 0 ? 0 : totalAfter / totalBefore

    proportionData.splice(0, proportionData.length, ...originalProportionData.map(item => ({
        name: item.name,
        value: Math.round(item.value * scale)
    })))

    const filteredDefect_A = []
    const filteredDefect_B = []
    const filteredDefect_C = []
    const filteredDefect_D = []

    for (let i = 0; i < originalSingleStatisticsData.dates.length; i++) {
        const date = originalSingleStatisticsData.dates[i]
        if (date >= start && date <= end) {
        filteredDefect_A.push(originalSingleStatisticsData.defect_A[i])
        filteredDefect_B.push(originalSingleStatisticsData.defect_B[i])
        filteredDefect_C.push(originalSingleStatisticsData.defect_C[i])
        filteredDefect_D.push(originalSingleStatisticsData.defect_D[i])
        }
    }

    singleStatisticsData.value = {
        dates: filteredDates,
        defect_A: filteredDefect_A,
        defect_B: filteredDefect_B,
        defect_C: filteredDefect_C,
        defect_D: filteredDefect_D,
    }

    updateAllCharts()
    }

    function updateAllCharts() {
    initStatisticsChart()
    initProportionChart()
    initSingleStatisticsChart()
    }
</script>

<style scoped>
.title{
    display: flex;
    justify-content: center;
    font-size: 30px;
    font-weight: bold;
}
.card {
    margin-left: auto;
    margin-right: auto;
    padding: 1rem;
    width: 100%;
}
.chart{
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
}
</style>
  