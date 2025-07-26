import axios from 'axios'

export function registerApi(username, password) {
  return axios.post('/api/register', { username, password })
    .then(res => res.data)
}

export function loginApi(username, password) {
  return axios.post('/api/login', { username, password })
    .then(res => res.data)
}
