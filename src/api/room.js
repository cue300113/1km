import axios from 'axios'

const instance = axios.create({
  baseURL: '/api', // 使用本地代理
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})  

export function enterRoomApi(token, latitude, longitude) {
  return instance.post('/enterRoom', { latitude, longitude }, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(res => res.data)
}
