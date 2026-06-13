import { ref } from 'vue'
import { userStore } from '../stores/user'

type MessageHandler = (data: any) => void

let ws: WebSocket | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let heartbeatTimer: ReturnType<typeof setInterval> | null = null
const handlers = new Set<MessageHandler>()

export const wsConnected = ref(false)

export function connectWebSocket() {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    return
  }

  const token = userStore.state.token
  if (!token) return

  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
  ws = new WebSocket(`${protocol}//${location.host}/ws/message?token=${token}`)

  ws.onopen = () => {
    wsConnected.value = true
    startHeartbeat()
  }

  ws.onmessage = (event) => {
    if (event.data === 'pong') return
    try {
      const data = JSON.parse(event.data)
      handlers.forEach(handler => handler(data))
    } catch {
      // 忽略非 JSON 消息
    }
  }

  ws.onclose = () => {
    wsConnected.value = false
    stopHeartbeat()
    scheduleReconnect()
  }

  ws.onerror = () => {
    ws?.close()
  }
}

export function disconnectWebSocket() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  stopHeartbeat()
  if (ws) {
    ws.close()
    ws = null
  }
  wsConnected.value = false
}

export function onWsMessage(handler: MessageHandler) {
  handlers.add(handler)
  return () => handlers.delete(handler)
}

function startHeartbeat() {
  stopHeartbeat()
  heartbeatTimer = setInterval(() => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send('ping')
    }
  }, 30000)
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer)
    heartbeatTimer = null
  }
}

function scheduleReconnect() {
  if (reconnectTimer) return
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    connectWebSocket()
  }, 3000)
}
