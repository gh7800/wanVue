<template>
  <div class="dashboard">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-left">
        <h1 class="welcome-title">上午好,{{ userName }},欢迎回来</h1>
        <p class="welcome-subtitle">{{ userName }}</p>
      </div>
      <div class="role-tags">
        <el-tag v-for="tag in roleTags" :key="tag" type="info" effect="plain">{{ tag }}</el-tag>
      </div>
    </div>

    <!-- 功能模块区域 -->
    <div class="module-grid">
      <div 
        v-for="module in modules" 
        :key="module.name" 
        class="module-item"
        :style="{ backgroundColor: module.bgColor }"
      >
        <div class="module-icon" :style="{ color: module.iconColor }">
          <i :class="module.icon"></i>
        </div>
        <span class="module-name">{{ module.name }}</span>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 左侧：待办事件 -->
      <div class="todo-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="el-icon-document"></i>
            待办事件
          </h2>
          <div class="todo-tabs">
            <el-tag 
              v-for="tab in todoTabs" 
              :key="tab" 
              :class="{ active: activeTab === tab }"
              @click="activeTab = tab"
            >{{ tab }}</el-tag>
          </div>
        </div>
        <div class="todo-content">
          <div class="empty-state">
            <div class="empty-icon">📦</div>
            <p class="empty-text">暂无待办事件</p>
          </div>
        </div>
      </div>

      <!-- 右侧：快捷链接 -->
      <div class="quick-links-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="el-icon-link"></i>
            快捷链接
          </h2>
        </div>
        <div class="quick-links-grid">
          <el-button 
            v-for="link in quickLinks" 
            :key="link" 
            type="info" 
            plain
            class="quick-link-btn"
          >{{ link }}</el-button>
        </div>
      </div>
    </div>

    <!-- 图表统计区域 -->
    <div class="chart-section">
      <!-- 柱状图 -->
      <div class="chart-card">
        <div class="section-header">
          <h2 class="section-title">公文流转数量(31)</h2>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-color" style="background: linear-gradient(180deg, #7ba3f5 0%, #5482EE 100%);"></span> 今年流转数量</span>
            <span class="legend-item"><span class="legend-color" style="background: #ffb74d;"></span> 去年流转数量</span>
          </div>
        </div>
        <div class="bar-chart">
          <div class="chart-y-axis">
            <span>10</span>
            <span>8</span>
            <span>6</span>
            <span>4</span>
            <span>2</span>
            <span>0</span>
          </div>
          <div class="chart-bars">
            <div v-for="(item, index) in barData" :key="index" class="bar-group">
              <div class="bars-container">
                <div 
                  class="bar current-year" 
                  :style="{ height: item.current + '0%' }"
                  :title="item.current"
                ></div>
                <div 
                  class="bar last-year" 
                  :style="{ height: item.last + '0%' }"
                  :title="item.last"
                ></div>
              </div>
              <span class="bar-label">{{ item.month }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 环形图 -->
      <div class="chart-card">
        <div class="section-header">
          <h2 class="section-title">请示数量342</h2>
        </div>
        <div class="donut-chart-container">
          <div class="donut-chart">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e8eaf6" stroke-width="8"/>
              <circle 
                cx="50" cy="50" r="40" 
                fill="none" 
                stroke="#5482EE" 
                stroke-width="8"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="circumference * (1 - 0.985)"
                stroke-linecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div class="donut-center">
              <span class="donut-value">338</span>
              <span class="donut-label">总公司</span>
            </div>
          </div>
          <div class="donut-legend">
            <div v-for="item in donutData" :key="item.name" class="legend-row">
              <span class="legend-dot" :style="{ backgroundColor: item.color }"></span>
              <span class="legend-name">{{ item.name }}</span>
              <span class="legend-value">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '../utils/auth'

export default {
  name: 'Dashboard',
  computed: {
    userName() {
      const info = getUserInfo()
      return info.real_name || info.username || '系统管理员'
    }
  },
  data() {
    return {
      circumference: 2 * Math.PI * 40,
      roleTags: ['采购', '安全', '人事', '资产', '工会资产'],
      activeTab: '请示上报',
      todoTabs: ['请示上报', '申请会议', '申请用章', '增加督办', '内部公文', '外部公文'],
      modules: [
        { name: '请示', icon: 'el-icon-document', bgColor: '#fff', iconColor: '#5482EE' },
        { name: '总办会', icon: 'el-icon-date', bgColor: '#fff', iconColor: '#5b8cff' },
        { name: '党委会', icon: 'el-icon-folder-opened', bgColor: '#fff', iconColor: '#4a7de4' },
        { name: '董事会', icon: 'el-icon-files', bgColor: '#fff', iconColor: '#6b9bf5' },
        { name: '公文', icon: 'el-icon-edit', bgColor: '#fff', iconColor: '#5482EE' },
        { name: '督办', icon: 'el-icon-menu', bgColor: '#fff', iconColor: '#5b8cff' },
        { name: '公章', icon: 'el-icon-box', bgColor: '#fff', iconColor: '#4a7de4' },
        { name: '用车', icon: 'el-icon-truck', bgColor: '#fff', iconColor: '#6b9bf5' },
        { name: '会议', icon: 'el-icon-chat-dot-round', bgColor: '#fff', iconColor: '#5482EE' },
        { name: '通知', icon: 'el-icon-bell', bgColor: '#fff', iconColor: '#5b8cff' },
        { name: '授权', icon: 'el-icon-lock', bgColor: '#fff', iconColor: '#4a7de4' },
        { name: '值班', icon: 'el-icon-user', bgColor: '#fff', iconColor: '#6b9bf5' },
      ],
      quickLinks: [
        '请示报告收文', '请示报告管理', '请示报告流转', '内部公文-阅读',
        '内部公文-管理', '内部公文-管理', '外部公文-管理', '我的发布-外部公文',
        '外部公文-管理', '我的发布-外部公文', '外部公文-流转', '处理督办',
        '用章借用', '用章管理'
      ],
      barData: [
        { month: '1月', current: 4, last: 0 },
        { month: '2月', current: 2, last: 0 },
        { month: '3月', current: 0, last: 0 },
        { month: '4月', current: 9, last: 0 },
        { month: '5月', current: 0, last: 1 },
        { month: '6月', current: 0, last: 0 },
        { month: '7月', current: 0, last: 0 },
        { month: '8月', current: 1, last: 1 },
        { month: '9月', current: 0, last: 0 },
        { month: '10月', current: 0, last: 0 },
        { month: '11月', current: 0, last: 3 },
        { month: '12月', current: 0, last: 1 },
      ],
      donutData: [
        { name: '一分', value: '1个', color: '#5482EE' },
        { name: '二分', value: '0个', color: '#7ba3f5' },
        { name: '三分', value: '3个', color: '#5b8cff' },
        { name: '四分', value: '3个', color: '#4a7de4' },
        { name: '五分', value: '0个', color: '#6b9bf5' },
        { name: '六分', value: '0个', color: '#8fb8ff' },
        { name: '七分', value: '0个', color: '#3d6fd1' },
        { name: '八分', value: '0个', color: '#a8c8ff' },
      ]
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 75px);
}

/* 欢迎区域 */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.welcome-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.welcome-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.role-tags {
  display: flex;
  gap: 12px;
  align-items: center;
}

.role-tags .el-tag {
  border-radius: 16px;
  padding: 8px 20px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  line-height: 1;
  border: 1px solid #d9e2f7;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  color: #5482EE;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(84, 130, 238, 0.08);
  transition: all 0.3s ease;
}

.role-tags .el-tag:hover {
  background: linear-gradient(135deg, #5482EE 0%, #4a75e0 100%);
  color: #fff;
  border-color: #5482EE;
  box-shadow: 0 4px 12px rgba(84, 130, 238, 0.35);
  transform: translateY(-1px);
}

/* 功能模块区域 */
.module-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.module-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid transparent;
}

.module-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(84, 130, 238, 0.15);
  border-color: #d9e2f7;
}

.module-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.module-name {
  font-size: 13px;
  color: #666;
}

/* 主内容区域 */
.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title i {
  color: #5482EE;
}

/* 待办事件区域 */
.todo-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(84, 130, 238, 0.06);
  border: 1px solid #e8eaf6;
}

.todo-tabs {
  display: flex;
  gap: 8px;
  align-items: center;
}

.todo-tabs .el-tag {
  padding: 6px 14px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 12px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  line-height: 1;
  border: 1px solid #d9e2f7;
  background-color: #f8faff;
  color: #666;
}

.todo-tabs .el-tag:hover {
  border-color: #5482EE;
  color: #5482EE;
  background-color: #eef2ff;
}

.todo-tabs .el-tag.active {
  background: linear-gradient(135deg, #5482EE 0%, #4a75e0 100%);
  color: #fff;
  border-color: #5482EE;
  box-shadow: 0 2px 8px rgba(84, 130, 238, 0.3);
}

.todo-content {
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
}

/* 快捷链接区域 */
.quick-links-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(84, 130, 238, 0.06);
  border: 1px solid #e8eaf6;
}

.quick-links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.quick-link-btn {
  display: flex !important;
  justify-content: center;
  align-items: center;
  padding: 10px 8px;
  border-radius: 4px;
  font-size: 12px;
  border-color: #d9e2f7;
  color: #5482EE;
  background-color: #f8faff;
  transition: all 0.2s;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 !important;
}

.quick-link-btn:hover {
  background: linear-gradient(135deg, #5482EE 0%, #4a75e0 100%);
  color: #fff;
  border-color: #5482EE;
  box-shadow: 0 2px 8px rgba(84, 130, 238, 0.25);
}

/* 图表统计区域 */
.chart-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(84, 130, 238, 0.06);
  border: 1px solid #e8eaf6;
}

.chart-legend {
  display: flex;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 4px;
}

/* 柱状图 */
.bar-chart {
  display: flex;
  height: 200px;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 10px;
  font-size: 10px;
  color: #999;
  text-align: right;
}

.chart-bars {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  border-left: 1px solid #e8eaf6;
  border-bottom: 1px solid #e8eaf6;
  padding-left: 10px;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 30px;
}

.bars-container {
  display: flex;
  gap: 4px;
  height: 160px;
  align-items: flex-end;
}

.bar {
  width: 12px;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s;
}

.bar.current-year {
  background: linear-gradient(180deg, #7ba3f5 0%, #5482EE 100%);
}

.bar.last-year {
  background: #ffb74d;
}

.bar-label {
  font-size: 10px;
  color: #999;
}

/* 环形图 */
.donut-chart-container {
  display: flex;
  align-items: center;
  gap: 30px;
}

.donut-chart {
  position: relative;
  width: 140px;
  height: 140px;
}

.donut-chart svg {
  width: 100%;
  height: 100%;
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.donut-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #5482EE;
}

.donut-label {
  font-size: 12px;
  color: #999;
}

.donut-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-name {
  flex: 1;
  color: #666;
}

.legend-value {
  color: #999;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .module-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 900px) {
  .module-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .main-content,
  .chart-section {
    grid-template-columns: 1fr;
  }
}
</style>