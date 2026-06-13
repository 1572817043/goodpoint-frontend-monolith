import { ref } from 'vue'
import { getUnreadCount } from '../api/modules/message'
import { connectWebSocket, onWsMessage, disconnectWebSocket } from '../utils/websocket'

export const unreadCount = ref(0)

let timer: ReturnType<typeof setInterval> | null = null
let removeHandler: (() => void) | null = null

export async function refreshUnreadCount() {
  try {
    const res = await getUnreadCount()
    unreadCount.value = res.count
  } catch {
    // 静默失败
  }
}

export function startPollingUnread() {
  stopPollingUnread()
  refreshUnreadCount()
  // 连接 WebSocket 接收实时更新
  connectWebSocket()
  removeHandler = onWsMessage((data) => {
    if (data.type === 'unread_update') {
      unreadCount.value = data.count
    }
  })
  // 轮询作为兜底
  timer = setInterval(refreshUnreadCount, 10000)
}

export function stopPollingUnread() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  if (removeHandler) {
    removeHandler()
    removeHandler = null
  }
  disconnectWebSocket()
}
