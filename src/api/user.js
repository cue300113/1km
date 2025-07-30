import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://101.201.52.163:8081', // 使用域名访问
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
