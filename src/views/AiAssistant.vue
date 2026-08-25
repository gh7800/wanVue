<template>
  <div class="ai-page">
    <div class="ai-card">
      <div class="ai-header">
        <i class="el-icon-chat-dot-round"></i>
        <span class="ai-title">AI 助理</span>
        <span class="ai-sub">基于企业业务数据的智能问答</span>
      </div>

      <div ref="messages" class="ai-messages">
        <div v-if="messages.length === 0" class="ai-empty">
          你好，我是企业 AI 助理。你可以问我公司、部门、公文、用车、通知等相关问题，
          也可以让我导出用车数据（如"导出待审批的用车"）。
        </div>
        <div v-for="(m, i) in messages" :key="i" class="ai-row" :class="m.role">
          <div class="ai-bubble">
            <span v-if="m.content">{{ m.content }}</span>
            <span v-else-if="!m.chart && !m.action" class="ai-typing">正在思考…</span>
            <div v-if="m.chart" :ref="'chart' + i" class="ai-chart"></div>
            <div v-if="m.action" class="ai-action">
              <div class="ai-action-info">
                <i class="el-icon-document"></i>
                <span class="ai-action-label">{{ m.action.label }}</span>
                <span class="ai-action-tip">点击下方按钮下载文件</span>
              </div>
              <el-button
                size="small"
                type="primary"
                icon="el-icon-download"
                :loading="m.action.loading"
                :disabled="m.action.done"
                @click="handleAction(m)"
              >{{ m.action.done ? '已下载' : '下载文件' }}</el-button>
            </div>
          </div>
        </div>
      </div>

      <div class="ai-input">
        <el-input
          v-model="input"
          type="textarea"
          :rows="3"
          resize="none"
          placeholder="请输入你的问题，回车发送（Shift + 回车换行）"
          @keydown.enter.native="handleEnter"
        />
        <el-button
          type="primary"
          :loading="loading"
          :disabled="loading || !input.trim()"
          @click="send"
        >{{ loading ? '回答中…' : '发送' }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { streamChat } from '@/api/ai'
import { exportCarApply, exportCarApproveTodo, exportCarApproveDone } from '@/api/car'
import { downloadBlob } from '@/utils/download'

/**
 * 快捷动作注册表：后端 SSE 推送的 action.key 在这里映射到实际 API。
 * 后端只发 key 不发 URL，执行权收敛在前端注册表，杜绝注入风险。
 * 新增动作：这里加一行 + 后端 detectExportAction 加识别规则。
 */
const ACTION_REGISTRY = {
  exportCarApply: {
    api: exportCarApply,
    filename: '用车申请列表.xlsx'
  },
  exportCarApproveTodo: {
    api: exportCarApproveTodo,
    filename: '待审批用车列表.xlsx'
  },
  exportCarApproveDone: {
    api: exportCarApproveDone,
    filename: '已审批用车列表.xlsx'
  }
}

export default {
  name: 'AiAssistant',
  data() {
    return {
      input: '',
      loading: false,
      messages: [],
      chartInstances: []
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    this.chartInstances.forEach(c => c.dispose())
    this.chartInstances = []
  },
  methods: {
    handleEnter(e) {
      if (e.shiftKey) return
      e.preventDefault()
      this.send()
    },
    handleResize() {
      this.chartInstances.forEach(c => c.resize())
    },
    renderChart(idx, option) {
      this.$nextTick(() => {
        let el = this.$refs['chart' + idx]
        el = Array.isArray(el) ? el[0] : el
        if (!el) return
        // 等浏览器布局完再初始化（v-if 刚创建的容器 clientWidth 可能为 0）
        requestAnimationFrame(() => {
          if (!el._chart) {
            el._chart = echarts.init(el)
            this.chartInstances.push(el._chart)
          }
          el._chart.setOption(option)
          el._chart.resize()  // 强制按当前容器真实尺寸重排
        })
      })
    },
    send() {
      const text = this.input.trim()
      if (!text || this.loading) return

      this.messages.push({ role: 'user', content: text })
      this.messages.push({ role: 'assistant', content: '' })
      this.input = ''
      this.loading = true
      this.scrollBottom()

      const aiIndex = this.messages.length - 1

      streamChat(
        text,
        (full) => {
          // 只更新 content 字段，保留 chart / action（避免被整个对象替换时丢掉）
          this.$set(this.messages[aiIndex], 'content', full)
          this.scrollBottom()
        },
        (chart) => {
          // 只追加 chart 字段，保留 content（如果文字先到也不会丢）
          this.$set(this.messages[aiIndex], 'chart', chart)
          this.renderChart(aiIndex, chart)
          this.scrollBottom()
        },
        (action) => {
          // 快捷动作卡片：后端识别导出意图后推送 {key,label}
          this.$set(this.messages[aiIndex], 'action', { ...action, loading: false, done: false })
          this.scrollBottom()
        },
        () => {
          this.loading = false
        },
        (err) => {
          this.$set(this.messages, aiIndex, { role: 'assistant', content: '出错了：' + err })
          this.loading = false
          this.$message.error(err)
        }
      )
    },
    scrollBottom() {
      this.$nextTick(() => {
        const el = this.$refs.messages
        if (el) el.scrollTop = el.scrollHeight
      })
    },
    /**
     * 执行动作卡片：查注册表拿 API，下载 blob。
     * 后端返回的 blob 可能实际是 JSON 错误（HTTP 200 + success=false），
     * 用 blob.type 兜底识别，避免把错误 JSON 存成 xlsx。
     */
    handleAction(m) {
      if (!m.action || m.action.loading || m.action.done) return
      const conf = ACTION_REGISTRY[m.action.key]
      if (!conf) {
        this.$message.warning('未知动作：' + m.action.label)
        return
      }
      this.$set(m.action, 'loading', true)
      conf.api().then(blob => {
        if (blob && blob.type && blob.type.indexOf('json') !== -1) {
          // 后端返回的是 JSON（通常是错误信息），读出来提示
          return blob.text().then(text => {
            let msg = '导出失败'
            try {
              const json = JSON.parse(text)
              if (json.message) msg = json.message
            } catch (e) { /* 保持默认提示 */ }
            this.$message.error(msg)
          })
        }
        downloadBlob(blob, conf.filename)
        this.$message.success('文件已开始下载')
        this.$set(m.action, 'done', true)
      }).catch(() => {
        // 拦截器已弹过错误提示，这里只复位按钮
      }).finally(() => {
        this.$set(m.action, 'loading', false)
      })
    }
  }
}
</script>

<style scoped>
.ai-page {
  /* 减去 Home.vue 顶部导航栏的 75px，避免输入框被顶出屏幕底部 */
  height: calc(100% - 75px);
  padding: 16px;
  box-sizing: border-box;
}
.ai-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
}
.ai-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  border-bottom: 1px solid #ebeef5;
  font-weight: 600;
}
.ai-header .el-icon-chat-dot-round {
  color: #5482EE;
  font-size: 18px;
}
.ai-title {
  font-size: 15px;
}
.ai-sub {
  font-size: 12px;
  color: #999;
  font-weight: normal;
}
.ai-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}
.ai-empty {
  color: #999;
  text-align: center;
  margin-top: 40px;
  line-height: 1.8;
}
.ai-row {
  display: flex;
  margin-bottom: 14px;
}
.ai-row.user {
  justify-content: flex-end;
}
.ai-row.assistant {
  justify-content: flex-start;
}
.ai-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 10px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}
.ai-row.user .ai-bubble {
  background: #5482EE;
  color: #fff;
}
.ai-row.assistant .ai-bubble {
  background: #f2f3f5;
  color: #333;
}
.ai-typing {
  color: #999;
}
.ai-chart {
  width: 100%;
  height: 300px;
  margin-top: 10px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}
.ai-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  padding: 10px 14px;
  background: #fff;
  border: 1px solid #d9e2f3;
  border-radius: 8px;
}
.ai-action-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.ai-action-info .el-icon-document {
  color: #5482EE;
  font-size: 18px;
}
.ai-action-label {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
}
.ai-action-tip {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
}
.ai-action .el-button {
  flex-shrink: 0;
}
.ai-input {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  border-top: 1px solid #ebeef5;
}
.ai-input .el-button {
  flex-shrink: 0;
  align-self: flex-end;
}
</style>
