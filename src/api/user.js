import axios from 'axios'

const instance = axios.create({
  baseURL: '/api', // 使用本地代理
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export function registerApi(username, password) {
  return instance.post('/register', { username, password })
    .then(res => res.data)
}

export function loginApi(username, password) {
  return instance.post('/login', { username, password })
    .then(res => res.data)
}
