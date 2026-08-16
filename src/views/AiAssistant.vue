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
          你好，我是企业 AI 助理。你可以问我公司、部门、公文、用车、通知等相关问题。
        </div>
        <div v-for="(m, i) in messages" :key="i" class="ai-row" :class="m.role">
          <div class="ai-bubble">
            <span v-if="m.content">{{ m.content }}</span>
            <span v-else class="ai-typing">正在思考…</span>
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
import { streamChat } from '@/api/ai'

export default {
  name: 'AiAssistant',
  data() {
    return {
      input: '',
      loading: false,
      messages: []
    }
  },
  methods: {
    handleEnter(e) {
      if (e.shiftKey) return
      e.preventDefault()
      this.send()
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
          this.$set(this.messages, aiIndex, { role: 'assistant', content: full })
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
    }
  }
}
</script>

<style scoped>
.ai-page {
  height: 100%;
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
