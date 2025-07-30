import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://1kmchat.xin', // 阿里云后端地址
  timeout: 10000,
  withCredentials: true // 添加这行
})

export function getMessagesApi(roomId) {
  const token = localStorage.getItem('token')
  return instance.get(`/api/messages?roomId=${roomId}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.data)
}

export function sendMessageApi(roomId, content, token) {
  return instance.post('/api/sendMessage', { roomId, content }, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.data)
}
