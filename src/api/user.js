import axios from 'axios'

// 根据环境选择API基础URL
const getBaseURL = () => {
  if (import.meta.env.PROD) {
    // 生产环境使用相对路径，通过Nginx代理到后端
    return ''
  } else {
    // 开发环境使用代理，代理会转发到后端的/api路径
    return ''
  }
}

const instance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false // 禁用凭据避免CORS问题
})

export function registerApi(username, email, verificationCode, password) {
  return instance.post('/api/register', { username, email, verificationCode, password })
    .then(res => res.data)
}

export function sendVerificationCodeApi(email) {
  return instance.post('/api/send-verification-code', { email })
    .then(res => res.data)
}

export function loginApi(username, password) {
  return instance.post('/api/login', { username, password })
    .then(res => res.data)
}

export function checkUsernameApi(username) {
  return instance.post('/api/check-username', { username })
    .then(res => res.data)
}

export function resetPasswordApi(username, email, verificationCode, password) {
  return instance.post('/api/reset-password', { username, email, verificationCode, password })
    .then(res => res.data)
}

export function logoutApi() {
  const token = localStorage.getItem('token')
  return instance.post('/api/logout', {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.data)
}
