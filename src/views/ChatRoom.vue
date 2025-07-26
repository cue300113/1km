
<template>
  <el-row justify="center" style="margin-top: 40px;">
    <el-col :span="12">
      <el-card>
        <h2 style="text-align:center;">聊天室</h2>
        <div class="messages" style="height:300px;overflow-y:auto;margin-bottom:20px;background:#f5f7fa;padding:10px;border-radius:6px;">
          <div v-for="msg in messages" :key="msg.id || msg.createTime + msg.userId" style="margin-bottom:8px;">
            <el-tag type="info" size="small">匿名{{ msg.userId }}</el-tag>
            <span style="margin-left:8px;">{{ msg.content }}</span>
            <span style="float:right;color:#bbb;font-size:12px;">{{ msg.createTime }}</span>
          </div>
        </div>
        <el-form @submit.prevent="sendMessage" :inline="true">
          <el-form-item style="width:80%;">
            <el-input v-model="content" placeholder="输入消息" clearable @keyup.enter="sendMessage" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="sendMessage">发送</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { getMessagesApi } from '../api/chat'

const messages = ref([])
const content = ref('')
let ws = null
let reconnectTimer = null
const roomId = localStorage.getItem('roomId')
const token = localStorage.getItem('token')

function connectWebSocket() {
  if (!roomId || !token) {
    ElMessage.error('房间或身份信息缺失')
    return
  }
  ws = new window.WebSocket(`ws://localhost:8080/chat?token=${token}&roomId=${roomId}`) // 路径改为/chat，带上roomId

  ws.onopen = () => {
    // 可选：进入房间后可请求历史消息，或由后端推送
  }

  ws.onmessage = (event) => {
    try {
      console.log('收到消息:', event.data)
      const msg = JSON.parse(event.data)
      // 只显示当前房间消息
      if (msg.roomId == roomId || !msg.roomId) {
        messages.value.push(msg)
      }
    } catch (e) {
      // 非json消息忽略
    }
  }

  ws.onclose = () => {
    reconnectTimer = setTimeout(connectWebSocket, 2000)
  }

  ws.onerror = () => {
    ws.close()
  }
}

const fetchMessages = async () => {
  const roomId = localStorage.getItem('roomId')
  const res = await getMessagesApi(roomId)
  if (res.code === 1) {  // 改成 code === 1
    messages.value = res.data
  }
}

onMounted(() => {
  connectWebSocket()
  fetchMessages()
})

onBeforeUnmount(() => {
  if (ws) ws.close()
  if (reconnectTimer) clearTimeout(reconnectTimer)
})

const sendMessage = async () => {
  if (!content.value.trim() || !ws || ws.readyState !== 1) return
  ws.send(JSON.stringify({
    roomId,
    content: content.value
  }))
  content.value = ''
}
</script>