import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://101.201.52.163:443', // 阿里云后端地址
  timeout: 10000
})

export function registerApi(username, password) {
  return instance.post('/api/register', { username, password })
    .then(res => res.data)
}

export function loginApi(username, password) {
  return instance.post('/api/login', { username, password })
    .then(res => res.data)
}
