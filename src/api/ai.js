import { getToken } from '@/utils/auth'

/**
 * 调用后端 AI 助理流式接口（SSE），读取返回并逐段回调。
 * 不走普通 axios 拦截器（它要求 {success,data} JSON），这里用 fetch 读流。
 *
 * @param {string} message      用户问题
 * @param {function} onToken    每收到一段文本时回调，参数为当前完整回复
 * @param {function} [onDone]   流结束（[DONE]）时回调，参数为完整回复
 * @param {function} [onError]  出错时回调，参数为错误信息
 */
export function streamChat(message, onToken, onDone, onError) {
  const token = getToken()
  // 去掉结尾斜杠，避免 "/" + "/api" 拼成 "//api"（协议相对 URL 错误）
  const base = (process.env.VUE_APP_BASE_API || '').replace(/\/+$/, '')

  fetch(base + '/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify({ message })
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
