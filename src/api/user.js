import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://1kmchat.xin', // 使用域名访问
  timeout: 10000,
  withCredentials: true // 添加这行
})

export function registerApi(username, password) {
  return instance.post('/api/register', { username, password })
    .then(res => res.data)
}

export function loginApi(username, password) {
  return instance.post('/api/login', { username, password })
    .then(res => res.data)
}
