/**
 * 通用文件下载工具：把接口返回的 blob 触发浏览器下载。
 *
 * 用法：
 *   import { downloadBlob, downloadFromResponse } from '@/utils/download'
 *
 *   downloadBlob(blob, '用车数据.xlsx')
 *
 *   // 配合 axios（responseType: 'blob'）使用，自动从响应头解析文件名：
 *   downloadFromResponse(response, '用车数据.xlsx')
 */

/**
 * 触发浏览器下载一个 blob。
 * @param {Blob} blob     文件内容（axios responseType 'blob' 的响应 data）
 * @param {string} filename 下载保存的文件名（含扩展名）
 */
export function downloadBlob(blob, filename) {
  if (!blob) return
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || 'download'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // 释放 objectURL，避免内存泄漏
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * 从响应头 Content-Disposition 里解析文件名。
 * 兼容 filename=xxx 与 filename*=UTF-8''xxx（中文文件名）两种格式。
 * @param {Object} response axios 响应对象
 * @returns {string|null} 解析到的文件名，失败返回 null
 */
export function parseFilenameFromHeader(response) {
  try {
    const disposition = response && response.headers &&
      (response.headers['content-disposition'] || response.headers['Content-Disposition'])
    if (!disposition) return null

    // 优先 RFC 5987 编码格式：filename*=UTF-8''%E7%94%A8...
    const starMatch = disposition.match(/filename\*=(?:UTF-8'')?([^;]+)/i)
    if (starMatch) {
      try {
        return decodeURIComponent(starMatch[1].replace(/["']/g, ''))
      } catch (e) {
        /* 解码失败走普通格式 */
      }
    }
    const plainMatch = disposition.match(/filename="?([^";]+)"?/i)
    if (plainMatch) return plainMatch[1]
    return null
  } catch (e) {
    return null
  }
}

/**
 * 一步完成：从 axios 响应里取 blob 并触发下载。
 * 文件名优先取响应头 Content-Disposition，取不到用 fallback。
 *
 * @param {Object} response  axios 响应（须 responseType: 'blob'）
 * @param {string} fallbackFilename  响应头里没有文件名时使用的默认名
 */
export function downloadFromResponse(response, fallbackFilename) {
  const filename = parseFilenameFromHeader(response) || fallbackFilename
  downloadBlob(response && response.data, filename)
}
