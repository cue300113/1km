<template>
  <div class="chat-container">
    <div class="chat-card">
      <div class="chat-header">
        <h1 class="chat-title">1km聊天室</h1>
      </div>
      
      <div class="messages-container">
        <div class="messages">
          <p>roomId: {{ roomId || '未设置' }}</p>
          <p>token: {{ token ? '已设置' : '未设置' }}</p>
          
          <!-- 测试消息列表 -->
          <div v-for="msg in testMessages" :key="msg.id" class="message-item">
            <div class="message-avatar">
              <span>{{ getAvatarText(msg.userId) }}</span>
            </div>
            <div class="message-content">
              <div class="message-header">
                <span class="message-username">匿名{{ generateAnonymousName() }}</span>
                <span class="message-time">{{ formatTime(msg.createTime) }}</span>
              </div>
              <div class="message-text">{{ msg.content || '' }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="input-container">
        <el-button type="primary" @click="addTestMessage">添加测试消息</el-button>
        <el-button @click="fetchRealMessages">获取真实消息</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMessagesApi } from '../api/chat'

const roomId = ref(null)
const token = ref(null)
const testMessages = ref([])

// 生成随机6位数字匿名名称
const generateAnonymousName = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 获取头像文字
const getAvatarText = (userId) => {
  return userId ? userId.toString().slice(-1) : '?'
}

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  return new Date(timeStr).toLocaleString()
}

onMounted(() => {
  roomId.value = localStorage.getItem('roomId')
  token.value = localStorage.getItem('token')
  
  // 添加一些测试消息
  testMessages.value = [
    { id: 1, userId: '12345', content: '测试消息1', createTime: new Date().toISOString() },
    { id: 2, userId: '67890', content: '测试消息2', createTime: new Date().toISOString() }
  ]
})

const fetchRealMessages = async () => {
  try {
    if (!roomId.value) {
      ElMessage.warning('请先设置房间ID')
      return
    }
    
    const res = await getMessagesApi(roomId.value)
    if (res.code === 1) {
      testMessages.value = res.data || []
      ElMessage.success('获取消息成功')
    } else {
      ElMessage.error('获取消息失败: ' + res.msg)
    }
  } catch (error) {
    console.error('获取消息出错:', error)
    ElMessage.error('获取消息出错，请检查网络连接')
  }
}

const addTestMessage = () => {
  const newMsg = {
    id: testMessages.value.length + 1,
    userId: Math.floor(Math.random() * 100000).toString(),
    content: `新消息 ${testMessages.value.length + 1}`,
    createTime: new Date().toISOString()
  }
  testMessages.value.push(newMsg)
  ElMessage.success('消息已添加')
}
</script>

<style scoped>
.chat-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #0c0c0c;
}

.chat-card {
  width: 100%;
  max-width: 800px;
  height: 80vh;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(24, 144, 255, 0.05);
}

.chat-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.messages-container {
  flex: 1;
  padding: 16px 24px;
  background: rgba(248, 249, 250, 0.8);
  overflow-y: auto;
}

.message-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.message-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.message-username {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

.message-time {
  color: #999;
  font-size: 12px;
}

.message-text {
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  line-height: 1.5;
  color: #333;
}

.input-container {
  padding: 20px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
}
</style>
