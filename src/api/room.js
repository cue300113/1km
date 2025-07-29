import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://101.201.52.163:8081', // 阿里云后端地址
  timeout: 10000
})

export function enterRoomApi(token, latitude, longitude) {
  return instance.post('/api/enterRoom', { latitude, longitude }, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.data)
}
