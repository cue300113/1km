import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://101.201.52.163:8081', // 使用域名访问
  timeout: 10000
})  

export function enterRoomApi(token, latitude, longitude) {
  return instance.post('/api/enterRoom', { latitude, longitude }, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.data)
}
