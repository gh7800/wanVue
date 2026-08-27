import { getToken } from '@/utils/auth'
import request from '@/utils/request'

/**
 * 获取“我的对话”列表（分页，供左侧历史列表 + 加载更多）。
 * @param {Object} params { page, per_page }
 */
export function getConversationList(params) {
  return request({
    url: '/api/ai/conversations',
    method: 'get',
    params
  })
}

/**
 * 新建对话（首轮问答结束后调用），返回 { id, ... }
 * @param {Object} data { title?, messages:[{role,content,chart?,action?}] }
 */
export function createConversation(data) {
  return request({
    url: '/api/ai/conversations',
    method: 'post',
    data
  })
}

/**
 * 更新对话（后续每轮结束后调用，全量覆盖 messages）
 * @param {number|string} id
 * @param {Object} data { title?, messages:[...] }
 */
export function updateConversation(id, data) {
  return request({
    url: `/api/ai/conversations/${id}`,
    method: 'put',
    data
  })
}

/**
 * 获取对话详情（点击历史项时回载整段对话，含图表配置）
 * @param {number|string} id
 */
export function getConversation(id) {
  return request({
    url: `/api/ai/conversations/${id}`,
    method: 'get'
  })
}

/**
 * 调用后端 AI 助理流式接口（SSE），读取返回并逐段回调。
 * 不走普通 axios 拦截器（它要求 {success,data} JSON），这里用 fetch 读流。
 * 支持三种事件：token（文字流）、chart（ECharts 配置，一次性）、
 * action（快捷动作卡片配置 {key,label}，一次性，前端查注册表渲染按钮）。
 *
 * @param {string} message      用户问题
 * @param {function} onToken    每收到一段文本时回调，参数为当前完整回复
 * @param {function} [onChart]  收到图表配置时回调，参数为 ECharts option
 * @param {function} [onAction] 收到动作配置时回调，参数为 {key,label}
 * @param {function} [onDone]   流结束（[DONE]）时回调，参数为完整回复
 * @param {function} [onError]  出错时回调，参数为错误信息
 * @param {number|string} [conversationId] 会话 id；传入则后端从已存对话拼回历史上下文，实现多轮记忆
 */
export function streamChat(message, onToken, onChart, onAction, onDone, onError, conversationId) {
  const token = getToken()
  // 去掉结尾斜杠，避免 "/" + "/api" 拼成 "//api"（协议相对 URL 错误）
  const base = (process.env.VUE_APP_BASE_API || '').replace(/\/+$/, '')

  fetch(base + '/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify({ message, conversation_id: conversationId || '' })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('请求失败（HTTP ' + res.status + '）')
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let full = ''

      const pump = () => reader.read().then(({ value, done }) => {
        if (done) {
          if (onDone) onDone(full)
          return
        }
        buffer += decoder.decode(value, { stream: true })
        let idx
        while ((idx = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, idx).trim()
          buffer = buffer.slice(idx + 1)
          if (!line.startsWith('data:')) continue
          const data = line.slice(5).trim()
          if (data === '[DONE]') {
            if (onDone) onDone(full)
            return
          }
          try {
            const json = JSON.parse(data)
            if (json.token) {
              full += json.token
              if (onToken) onToken(full)
            } else if (json.chart) {
              if (onChart) onChart(json.chart)
            } else if (json.action) {
              if (onAction) onAction(json.action)
            } else if (json.error) {
              if (onError) onError(json.error)
            }
          } catch (e) {
            // 忽略未完整的 JSON 行
          }
        }
        return pump()
      })
      return pump()
    })
    .catch(err => {
      if (onError) onError(err.message || '网络错误')
    })
}
