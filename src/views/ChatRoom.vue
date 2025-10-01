
<template>
  <div class="chat-container">
    <div class="chat-card">
      <div class="chat-header">
        <h1 class="chat-title">1km聊天室</h1>
        <div class="header-controls">
          <div class="online-indicator">
            <div class="online-dot"></div>
            <span>在线</span>
          </div>
          <el-button 
            type="danger" 
            size="small" 
            @click="handleLogout"
            class="logout-btn"
          >
            退出
          </el-button>
        </div>
      </div>
      
      <div class="messages-container" ref="messagesContainer">
        <div class="messages" ref="messagesList">
          <div 
            v-for="msg in messages" 
            :key="msg.id || (msg.createTime || '') + (msg.userId || '')" 
            class="message-item"
            @click="logMessageDetails(msg)"
          >
             <div class="message-avatar">
               <span>{{ getAvatarText(generateAnonymousName(msg.userId)) }}</span>
             </div>
             <div class="message-content">
               <div class="message-header">
                 <span class="message-username">匿名{{ generateAnonymousName(msg.userId) }}</span>
                <span class="message-time">{{ formatTime(msg.createTime) }}</span>
              </div>
              
              
              
              <!-- 文本消息 -->
              <div v-if="!msg.type || msg.type === 'text'" class="message-text">
                {{ msg.content || '空内容' }}
              </div>
              
              <!-- 图片消息 -->
              <div v-else-if="msg.type === 'image'" class="message-media">
                <img 
                  :src="msg.fileUrl" 
                  :alt="msg.fileName || '图片'"
                  class="message-image"
                  @click="previewImage(msg.fileUrl)"
                />
                <div v-if="msg.content" class="message-text">{{ msg.content || '' }}</div>
              </div>
              
              <!-- 视频消息 -->
              <div v-else-if="msg.type === 'video'" class="message-media">
                <video 
                  :src="msg.fileUrl" 
                  controls
                  class="message-video"
                  preload="metadata"
                />
                <div v-if="msg.content" class="message-text">{{ msg.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="input-container">
        <el-form @submit.prevent="sendMessage" class="message-form">
          <div class="input-wrapper">
            <div class="media-buttons">
              <el-button 
                circle 
                @click="triggerImageUpload"
                class="media-btn"
                title="发送图片"
              >
                📷
              </el-button>
              <el-button 
                circle 
                @click="triggerVideoUpload"
                class="media-btn"
                title="发送视频"
              >
                🎥
              </el-button>
            </div>
            <el-input 
              v-model="content" 
              placeholder="输入消息..." 
              clearable 
              @keyup.enter="sendMessage"
              size="large"
              class="message-input"
            />
            <el-button 
              type="primary" 
              @click="sendMessage"
              size="large"
              class="send-button"
              :disabled="isSendDisabled"
            >
              发送
            </el-button>
          </div>
          
          <!-- 文件预览区域 -->
          <div v-if="selectedFile" class="file-preview">
            <div class="preview-item">
              <div class="preview-content">
                <img 
                  v-if="isImage(selectedFile)" 
                  :src="filePreviewUrl" 
                  alt="预览"
                  class="preview-image"
                />
                <video 
                  v-else-if="isVideo(selectedFile)" 
                  :src="filePreviewUrl" 
                  controls
                  class="preview-video"
                />
                <div class="file-info">
                  <span class="file-name">{{ selectedFile.name }}</span>
                  <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
                </div>
                
                <!-- 上传进度条 -->
                <div v-if="isUploading" class="upload-progress">
                  <el-progress 
                    :percentage="uploadProgress" 
                    :status="uploadProgress === 100 ? 'success' : 'primary'"
                    :stroke-width="4"
                  />
                  <span class="progress-text">
                    {{ uploadProgress === 100 ? '处理中...' : `上传中 ${uploadProgress}%` }}
                  </span>
                </div>
              </div>
              <el-button 
                v-if="!isUploading"
                circle 
                size="small" 
                @click="removeFile"
                class="remove-btn"
              >
                ❌
              </el-button>
            </div>
          </div>
        </el-form>
        
        <!-- 隐藏的文件输入 -->
        <input 
          ref="imageInput" 
          type="file" 
          accept="image/*" 
          @change="handleFileSelect"
          style="display: none"
        />
        <input 
          ref="videoInput" 
          type="file" 
          accept="video/*" 
          @change="handleFileSelect"
          style="display: none"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMessagesApi, sendMessageApi } from '../api/chat'
import { uploadFileApi, formatFileSize, getFileType } from '../api/upload'
import { logoutApi } from '../api/user'

const messages = ref([])
const content = ref('')
const messagesContainer = ref(null)
const messagesList = ref(null)
const imageInput = ref(null)
const videoInput = ref(null)
const selectedFile = ref(null)
const filePreviewUrl = ref('')
const isUploading = ref(false)
const uploadProgress = ref(0)
let ws = null
let reconnectTimer = null
let roomId = null
let token = null

// 路由实例
const router = useRouter()

// 退出函数
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出聊天室吗？',
      '退出确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    // 关闭WebSocket连接
    if (ws) {
      ws.close()
      ws = null
    }
    
    // 清除定时器
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    
    // 调用退出API
    try {
      await logoutApi()
    } catch (error) {
      console.warn('退出API调用失败:', error)
      // 即使API调用失败也继续退出流程
    }
    
    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('roomId')
    
    ElMessage.success('已退出聊天室')
    
    // 跳转到登录页
    router.push('/login')
    
  } catch (error) {
    if (error === 'cancel') {
      // 用户取消退出
      return
    }
    console.error('退出失败:', error)
    ElMessage.error('退出失败，请重试')
  }
}

// 计算发送按钮是否应该禁用
const isSendDisabled = computed(() => {
  return (!content.value.trim() && !selectedFile.value) || isUploading.value
})

// 用户匿名名称缓存
const userAnonymousNames = new Map()

// 生成随机6位数字匿名名称
const generateAnonymousName = (userId) => {
  try {
    // 如果已经为该用户生成过名称，直接返回
    if (userAnonymousNames.has(userId)) {
      return userAnonymousNames.get(userId)
    }
    
    // 生成新的匿名名称
    const anonymousName = Math.floor(100000 + Math.random() * 900000).toString()
    userAnonymousNames.set(userId, anonymousName)
    return anonymousName
  } catch (error) {
    console.error('generateAnonymousName error:', error)
    return '123456'
  }
}

// 获取头像文字（基于匿名用户名的最后一位）
const getAvatarText = (anonymousName) => {
  return anonymousName ? anonymousName.toString().slice(-1) : '?'
}

// 格式化时间
const formatTime = (timeStr) => {
  try {
    if (!timeStr) return ''
    const time = new Date(timeStr)
    if (isNaN(time.getTime())) return ''
    
    const now = new Date()
    const diff = now - time
    
    if (diff < 60000) { // 1分钟内
      return '刚刚'
    } else if (diff < 3600000) { // 1小时内
      return `${Math.floor(diff / 60000)}分钟前`
    } else if (diff < 86400000) { // 24小时内
      return time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    } else {
      return time.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
    }
  } catch (error) {
    console.error('formatTime error:', error)
    return ''
  }
}

// // 打印消息详情到控制台
// const logMessageDetails = (msg) => {
//   console.log('=== 消息详情 ===')
//   console.log('ID:', msg.id)
//   console.log('Content:', msg.content)
//   console.log('Type:', msg.type)
//   console.log('UserId:', msg.userId)
//   console.log('FileUrl:', msg.fileUrl)
//   console.log('FileName:', msg.fileName)
//   console.log('FileSize:', msg.fileSize)
//   console.log('CreateTime:', msg.createTime)
//   console.log('RoomId:', msg.roomId)
//   console.log('完整消息对象:', JSON.stringify(msg, null, 2))
//   console.log('================')
// }

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 触发图片上传
const triggerImageUpload = () => {
  imageInput.value?.click()
}

// 触发视频上传
const triggerVideoUpload = () => {
  videoInput.value?.click()
}

// 检查是否为图片
const isImage = (file) => {
  return file && file.type.startsWith('image/')
}

// 检查是否为视频
const isVideo = (file) => {
  return file && file.type.startsWith('video/')
}

// 注意：formatFileSize 现在从 api/upload.js 导入

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    // 使用导入的文件类型检查函数
    const fileType = getFileType(file)
    if (fileType === 'unknown') {
      ElMessage.error('不支持的文件格式，请选择图片或视频文件')
      return
    }
    
    // 文件大小限制（图片10MB，视频50MB）
    const maxImageSize = 10 * 1024 * 1024 // 10MB
    const maxVideoSize = 50 * 1024 * 1024 // 50MB
    
    if (fileType === 'image' && file.size > maxImageSize) {
      ElMessage.error('图片大小不能超过10MB')
      return
    }
    
    if (fileType === 'video' && file.size > maxVideoSize) {
      ElMessage.error('视频大小不能超过50MB')
      return
    }
    
    selectedFile.value = file
    
    // 创建预览URL
    if (filePreviewUrl.value) {
      URL.revokeObjectURL(filePreviewUrl.value)
    }
    filePreviewUrl.value = URL.createObjectURL(file)
    
    // 清空输入框
    event.target.value = ''
  } catch (error) {
    ElMessage.error('文件选择失败：' + error.message)
  }
}

// 移除文件
const removeFile = () => {
  if (filePreviewUrl.value) {
    URL.revokeObjectURL(filePreviewUrl.value)
  }
  selectedFile.value = null
  filePreviewUrl.value = ''
}

// 上传文件到Java后端（后端再上传到阿里云OSS）
const uploadFile = async (file) => {
  try {
    // 使用新的上传API，包含进度回调
    const result = await uploadFileApi(file, roomId, (progress) => {
      uploadProgress.value = progress
    })
    
    if (result.success) {
      return result.data.url // 返回阿里云OSS的文件URL
    } else {
      throw new Error(result.message || '上传失败')
    }
  } catch (error) {
    console.error('文件上传失败:', error)
    ElMessage.error('文件上传失败：' + error.message)
    throw error
  }
}

function connectWebSocket() {
  if (!roomId || !token) {
    ElMessage.error('房间或身份信息缺失')
    return
  }
  
  // 根据环境选择WebSocket地址
  let wsUrl
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // 开发环境：使用代理
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    wsUrl = `${protocol}//${host}/chat-websocket?token=${token}&roomId=${roomId}`
  } else {
    // 生产环境：直接连接到1kmchat.xin的/chat端点
    wsUrl = `wss://1kmchat.xin/chat?token=${token}&roomId=${roomId}`
  }
  
  console.log('连接WebSocket:', wsUrl)
  ws = new window.WebSocket(wsUrl)

  ws.onopen = () => {
    console.log('✅ WebSocket连接成功!')
    ElMessage.success('连接成功')
  }

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data)
      
      // 检查消息是否缺少文件信息
      if (msg.content === "" && !msg.type && !msg.fileUrl) {
        return // 忽略空内容消息
      }
      
      // 只显示当前房间消息
      if (msg.roomId == roomId || !msg.roomId) {
        messages.value.push(msg)
        scrollToBottom()
      }
    } catch (e) {
      console.error('解析消息失败:', e)
    }
  }

  ws.onclose = (event) => {
    console.log('❌ WebSocket连接关闭:', event.code, event.reason)
    ElMessage.error(`连接已断开 (${event.code})`)
    reconnectTimer = setTimeout(connectWebSocket, 2000)
  }

  ws.onerror = (error) => {
    console.error('❌ WebSocket连接错误:', error)
    ElMessage.error('WebSocket连接失败')
  }
}

const fetchMessages = async () => {
  try {
    // console.log('开始获取消息，roomId:', roomId)
    const res = await getMessagesApi(roomId)
    // console.log('API响应:', res)
    
    if (res.code === 1) {
      messages.value = res.data || []
      // console.log('获取到消息数量:', messages.value.length)
      // console.log('消息数据结构:', JSON.stringify(messages.value.slice(0, 2), null, 2)) // 打印前2条消息的结构
      
      // 打印每条消息的详细信息
      // messages.value.forEach((msg, index) => {
      //   console.log(`=== 消息 ${index + 1} ===`)
      //   console.log('ID:', msg.id)
      //   console.log('Content:', msg.content)
      //   console.log('Type:', msg.type)
      //   console.log('UserId:', msg.userId)
      //   console.log('FileUrl:', msg.fileUrl)
      //   console.log('FileName:', msg.fileName)
      //   console.log('FileSize:', msg.fileSize)
      //   console.log('CreateTime:', msg.createTime)
      //   console.log('RoomId:', msg.roomId)
      //   console.log('==================')
      // })
      
      scrollToBottom()
      ElMessage.success(`成功获取 ${messages.value.length} 条消息`)
    } else {
      console.error('获取消息失败:', res.msg)
      ElMessage.error('获取消息失败: ' + (res.msg || '未知错误'))
    }
  } catch (error) {
    console.error('获取消息出错:', error)
    ElMessage.error('获取消息出错: ' + error.message)
  }
}

onMounted(() => {
  // 在组件挂载后初始化
  roomId = localStorage.getItem('roomId')
  token = localStorage.getItem('token')
  
  // console.log('ChatRoom初始化:', { roomId, token: token ? '已设置' : '未设置' })
  
  // 检查必要的参数
  if (!roomId || !token) {
    ElMessage.error('缺少房间ID或认证信息，请重新登录')
    console.error('缺少必要参数:', { roomId, token })
    return
  }
  
  // console.log('开始连接WebSocket和获取消息...')
  connectWebSocket()
  fetchMessages()
})

// 图片预览
const previewImage = (imageUrl) => {
  // 创建全屏预览
  const overlay = document.createElement('div')
  overlay.className = 'image-preview-overlay'
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    cursor: pointer;
  `
  
  const img = document.createElement('img')
  img.src = imageUrl
  img.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
  `
  
  overlay.appendChild(img)
  document.body.appendChild(overlay)
  
  // 点击关闭预览
  overlay.addEventListener('click', () => {
    document.body.removeChild(overlay)
  })
}

onBeforeUnmount(() => {
  if (ws) ws.close()
  if (reconnectTimer) clearTimeout(reconnectTimer)
  
  // 清理文件预览URL
  if (filePreviewUrl.value) {
    URL.revokeObjectURL(filePreviewUrl.value)
  }
})

const sendMessage = async () => {
  // 检查消息内容
  if (!content.value.trim() && !selectedFile.value) {
    ElMessage.warning('请输入消息内容或选择文件')
    return
  }
  
  // 检查是否正在上传文件
  if (isUploading.value) {
    ElMessage.warning('文件正在上传中，请稍候...')
    return
  }
  
  // 检查WebSocket连接
  if (!ws || ws.readyState !== 1) {
    ElMessage.error('连接已断开，请刷新页面重试')
    return
  }
  
  console.log('发送消息条件检查:', {
    hasContent: !!content.value.trim(),
    hasFile: !!selectedFile.value,
    wsExists: !!ws,
    wsReady: ws?.readyState === 1
  })
  
  let messageData = {
    roomId,
    content: content.value || '',
    type: 'text' // 默认文本消息
  }
  
  // 如果有选中的文件，先上传
  if (selectedFile.value) {
    isUploading.value = true
    uploadProgress.value = 0
    ElMessage.info('正在上传文件...')
    
    try {
      const result = await uploadFile(selectedFile.value)
      
      if (result) {
        messageData = {
          roomId,
          content: content.value || '',
          type: isImage(selectedFile.value) ? 'image' : 'video',
          fileUrl: result,
          fileName: selectedFile.value.name,
          fileSize: selectedFile.value.size
        }
        
        // 清除文件选择
        removeFile()
        ElMessage.success('文件上传成功')
      } else {
        isUploading.value = false
        uploadProgress.value = 0
        return // 上传失败，不发送消息
      }
    } catch (error) {
      isUploading.value = false
      uploadProgress.value = 0
      ElMessage.error('文件上传失败：' + error.message)
      return
    }
    
    isUploading.value = false
    uploadProgress.value = 0
  }
  
  // 检查WebSocket连接状态
  if (!ws || ws.readyState !== 1) {
    ElMessage.error('连接已断开，请刷新页面重试')
    return
  }
  
  // 发送消息
  try {
    // 1. 通过WebSocket实时发送消息
    ws.send(JSON.stringify(messageData))
    
    // 2. 同时通过HTTP API保存消息到数据库
    const token = localStorage.getItem('token')
    if (token) {
      try {
        await sendMessageApi(messageData, token)
        // console.log('消息已保存到数据库')
      } catch (dbError) {
        console.warn('保存消息到数据库失败:', dbError)
        // 数据库保存失败不影响实时通信，只记录警告
      }
    }
    
    content.value = ''
    scrollToBottom()
  } catch (error) {
    ElMessage.error('发送消息失败，请重试')
  }
}
</script>

<style scoped>
/* 主容器 */
.chat-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #0c0c0c;
  position: relative;
  overflow: hidden;
}

/* 星空背景 */
.chat-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(1px 1px at 20px 30px, #fff, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.9), transparent),
    radial-gradient(1px 1px at 90px 40px, #eee, transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.7), transparent),
    radial-gradient(2px 2px at 160px 30px, #ddd, transparent),
    radial-gradient(1px 1px at 200px 50px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 250px 20px, #fff, transparent),
    radial-gradient(2px 2px at 300px 60px, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 350px 90px, #eee, transparent),
    radial-gradient(1px 1px at 400px 10px, rgba(255,255,255,0.9), transparent),
    radial-gradient(3px 3px at 50px 100px, rgba(24, 144, 255, 0.3), transparent),
    radial-gradient(2px 2px at 150px 150px, rgba(255, 255, 255, 0.4), transparent),
    radial-gradient(1px 1px at 250px 200px, rgba(24, 144, 255, 0.2), transparent);
  background-repeat: repeat;
  background-size: 400px 200px;
  animation: sparkle 30s linear infinite;
  z-index: 1;
}

/* 星空动画 */
@keyframes sparkle {
  0% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-50px) translateX(10px); }
  50% { transform: translateY(-100px) translateX(0px); }
  75% { transform: translateY(-150px) translateX(-10px); }
  100% { transform: translateY(-200px) translateX(0px); }
}

/* 额外的星空层 */
.chat-container {
  background: 
    radial-gradient(ellipse at top, rgba(24, 144, 255, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at bottom, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
    #0c0c0c;
}

/* 聊天卡片 */
.chat-card {
  width: 100%;
  max-width: 800px;
  height: 80vh;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 聊天头部 */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-image: url('/3(1).png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  min-height: 80px;
}

/* 为头部添加半透明覆盖层，提高文字可读性 */
.chat-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(1px);
  z-index: 1;
}

/* 确保头部内容在覆盖层之上 */
.chat-header > * {
  position: relative;
  z-index: 2;
}

.chat-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

/* 头部控制区域 */
.header-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.online-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

/* 退出按钮样式 */
.logout-btn {
  --el-button-size: 28px;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
}

.logout-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
}

.online-dot {
  width: 8px;
  height: 8px;
  background: #52c41a;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 消息容器 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  background-image: url('/4.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

/* 为消息容器添加半透明覆盖层，提高消息可读性 */
.messages-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1;
  pointer-events: none;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 2;
}

/* 消息项 */
.message-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
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
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
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
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  word-wrap: break-word;
  line-height: 1.5;
  color: #333;
}

/* 输入容器 */
.input-container {
  padding: 20px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
}

.media-buttons {
  display: flex;
  gap: 8px;
}

.media-btn {
  width: 40px;
  height: 40px;
  font-size: 18px;
  border: 1px solid #e0e0e0;
  background: white;
  color: #666;
  transition: all 0.3s;
}

.media-btn:hover {
  background: #f5f5f5;
  border-color: #1890ff;
  color: #1890ff;
}

.message-input {
  flex: 1;
}

.send-button {
  height: 48px;
  min-width: 80px;
  font-weight: 600;
}

/* 文件预览 */
.file-preview {
  margin-top: 12px;
  padding: 12px;
  background: rgba(248, 249, 250, 0.8);
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.preview-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.preview-content {
  flex: 1;
}

.preview-image {
  max-width: 200px;
  max-height: 150px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-video {
  max-width: 300px;
  max-height: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.file-info {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.file-size {
  font-size: 12px;
  color: #666;
}

.upload-progress {
  margin-top: 8px;
  width: 100%;
}

.progress-text {
  color: #666;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.remove-btn {
  width: 24px;
  height: 24px;
  font-size: 12px;
  background: #ff4757;
  border: none;
  color: white;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: #ff3742;
}

/* 消息中的媒体 */
.message-media {
  margin-top: 8px;
}

.message-image {
  max-width: 300px;
  max-height: 200px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-image:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.message-video {
  max-width: 400px;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 移动端优化 */
@media (max-width: 768px) {
  .chat-container {
    padding: 0;
    align-items: stretch;
  }
  
  .chat-card {
    max-width: 100%;
    height: 100vh;
    border-radius: 0;
    margin: 0;
  }
  
  .chat-header {
    padding: 16px 20px;
    min-height: 70px;
  }
  
  .chat-title {
    font-size: 20px;
  }
  
  .messages-container {
    padding: 12px 16px;
  }
  
  .message-item {
    gap: 8px;
  }
  
  .message-avatar {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
  
  .message-text {
    padding: 10px 14px;
    font-size: 15px;
  }
  
  .input-container {
    padding: 16px 20px;
  }
  
  .input-wrapper {
    gap: 8px;
  }
  
  .send-button {
    height: 44px;
    min-width: 70px;
    font-size: 14px;
  }
  
  .media-btn {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  
  .preview-image {
    max-width: 150px;
    max-height: 120px;
  }
  
  .preview-video {
    max-width: 200px;
    max-height: 150px;
  }
  
  .message-image {
    max-width: 250px;
    max-height: 180px;
  }
  
  .message-video {
    max-width: 280px;
    max-height: 200px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .chat-header {
    padding: 12px 16px;
    min-height: 60px;
  }
  
  .chat-title {
    font-size: 18px;
  }
  
  .header-controls {
    gap: 12px;
  }
  
  .online-indicator {
    font-size: 12px;
  }
  
  .logout-btn {
    font-size: 11px;
    padding: 3px 8px;
    --el-button-size: 24px;
  }
  
  .messages-container {
    padding: 8px 12px;
  }
  
  .message-item {
    gap: 6px;
  }
  
  .message-avatar {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
  
  .message-username {
    font-size: 13px;
  }
  
  .message-time {
    font-size: 11px;
  }
  
  .message-text {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .input-container {
    padding: 12px 16px;
  }
  
  .input-wrapper {
    flex-direction: column;
    gap: 8px;
  }
  
  .send-button {
    width: 100%;
    height: 44px;
  }
  
  .media-buttons {
    gap: 6px;
  }
  
  .media-btn {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
  
  .preview-image {
    max-width: 120px;
    max-height: 100px;
  }
  
  .preview-video {
    max-width: 150px;
    max-height: 120px;
  }
  
  .message-image {
    max-width: 200px;
    max-height: 150px;
  }
  
  .message-video {
    max-width: 220px;
    max-height: 160px;
  }
  
  .file-preview {
    padding: 8px;
  }
}

/* 按钮样式优化 */
:deep(.el-button--primary) {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  transition: all 0.3s;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #40a9ff 0%, #69c0ff 100%);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
  transform: translateY(-1px);
}

:deep(.el-button--primary:active) {
  transform: translateY(0);
}

:deep(.el-button--primary.is-disabled) {
  background: #d9d9d9;
  box-shadow: none;
  transform: none;
}

/* 输入框样式优化 */
:deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

/* 桌面端背景优化 */
@media (min-width: 769px) {
  .messages-container {
    background-attachment: local;
  }
  
  .messages-container::before {
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(1px);
  }
  
  .chat-header {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    min-height: 100px;
  }
  
  .chat-header::before {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(0.5px);
  }
  
  .chat-title {
    color: #1a1a1a;
    font-weight: 800;
    text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.9);
  }
  
  .online-indicator {
    color: #1a1a1a;
    font-weight: 600;
    text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.9);
  }
}

/* 滚动条样式 */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: rgba(24, 144, 255, 0.3);
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: rgba(24, 144, 255, 0.5);
}
</style>