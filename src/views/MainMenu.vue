<template>
  <div class="page-wrapper">
    <div class="header-bar">
      <img src="@/assets/logo.png" class="logo-img" />
      <div class="title-box">
        <h1 class="main-title">慧识</h1>
        <p class="sub-title">AI智能车辆零部件缺陷检测系统</p>
      </div>
    </div>

    <el-container>
      <el-main style="padding: 40px;">
        <h2 class="section-title">功能介绍</h2>
        <el-row gutter="20" class="mb-4" align="middle">
          <el-col :span="10">
            <el-card shadow="never" class="intro-card no-bg">
              <h3>人工检测图片</h3>
              <img src="@/assets/detect_human.png" class="detect-image" />
              <p style="color: red;">❌ 效率低、误差高、成本高</p>
              <p style="color: red;">❌ 无法满足复杂质量检测需求</p>
            </el-card>
          </el-col>
          <el-col :span="4" style="text-align: center; font-size: 28px; font-weight: bold;">➡️ 改进 ➡️</el-col>
          <el-col :span="10">
            <el-card shadow="never" class="intro-card no-bg">
              <h3>计算机识别图片</h3>
              <img src="@/assets/detect_computer.png" class="detect-image" />
              <p style="color: green;">✅ 效率高，成本低</p>
              <p style="color: green;">✅ 实时检测，自动分类</p>
              <p style="color: green;">✅ 多类型缺陷精准识别</p>
            </el-card>
          </el-col>
        </el-row>

        <!-- 系统功能 -->
        <h2 class="section-title">系统功能</h2>
        <el-row gutter="20" class="mb-4">
          <el-col :span="6" v-for="(feature, index) in features" :key="index">
            <el-card shadow="never" class="simple-card no-bg">
              <el-icon :size="60" class="icon-style">
                <component :is="feature.icon" />
              </el-icon>
              <div class="feature-text">{{ feature.name }}</div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 数据统计 -->
        <h2 class="section-title">数据统计</h2>
        <el-row gutter="20">
          <el-col :span="8" v-for="(chart, index) in charts" :key="index">
            <el-card shadow="never" class="simple-card no-bg">
              <el-icon :size="64" class="icon-style">
                <component :is="chart.icon" />
              </el-icon>
              <div class="chart-text">{{ chart.name }}</div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import {
  UploadFilled,
  View,
  DataAnalysis,
  Document,
  DataLine,
  PieChart,
  Histogram
} from '@element-plus/icons-vue'

const features = [
  { name: '图片上传', icon: UploadFilled },
  { name: '缺陷识别', icon: View },
  { name: '数据统计分析', icon: DataAnalysis },
  { name: '报告生成', icon: Document },
]

const charts = [
  { name: '每日检测数', icon: DataLine },
  { name: '缺陷占比', icon: PieChart },
  { name: '缺陷数量统计', icon: Histogram },
]
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: linear-gradient(to bottom, #e0f2ff 0%, #ffffff 100%);
}

.header-bar {
  width: 100%;
  background-color: #e0eaff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 30px;
  gap: 80px;
  flex-wrap: wrap;
  text-align: center;
}

.logo-img {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.title-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-title {
  font-size: 48px;
  font-weight: bold;
  margin: 0;
}

.sub-title {
  font-size: 24px;
  color: #444;
  margin-top: 10px;
}

.section-title {
  font-size: 32px;
  font-weight: bold;
  margin: 60px 0 30px 0;
  text-align: center;
}

.intro-card {
  text-align: center;
  padding: 20px;
}

.detect-image {
  max-width: 100%;
  height: auto;
  margin: 20px 0;
  border-radius: 8px;
}

.simple-card {
  text-align: center;
  padding: 24px 10px;
}

.icon-style {
  margin-bottom: 12px;
  color: #409EFF;
}

.feature-text,
.chart-text {
  font-size: 18px;
  font-weight: 500;
}

.no-bg {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
