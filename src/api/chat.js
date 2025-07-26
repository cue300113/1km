import axios from 'axios'

export function getMessagesApi(roomId) {
  const token = localStorage.getItem('token')
  return axios.get(`/api/messages?roomId=${roomId}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.data)
}

export function sendMessageApi(roomId, content, token) {
  return axios.post('/api/sendMessage', { roomId, content }, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.data)
}
