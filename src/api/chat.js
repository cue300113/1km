import axios from 'axios'

// 根据环境选择API基础URL
const getBaseURL = () => {
  if (import.meta.env.PROD) {
    // 生产环境使用相对路径，通过Nginx代理到后端
    return ''
  } else {
    // 开发环境使用代理，代理会转发到后端的/api路径
    return ''
  }
}

const instance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export function getMessagesApi(roomId) {
  const token = localStorage.getItem('token')
  return instance.get(`/api/messages?roomId=${roomId}`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(res => res.data)
}
export function sendMessageApi(messageData, token) {
  return instance.post('/api/sendMessage', messageData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(res => res.data)
}

