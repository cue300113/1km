import axios from 'axios'

const instance = axios.create({
  baseURL: '/api', // 使用本地代理
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export function getMessagesApi(roomId) {
  const token = localStorage.getItem('token')
  return instance.get(`/messages?roomId=${roomId}`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(res => res.data)
}

export function sendMessageApi(roomId, content, token) {
  return instance.post('/sendMessage', { roomId, content }, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(res => res.data)
}
