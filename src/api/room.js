import axios from 'axios'

export function enterRoomApi(token, latitude, longitude) {
  return axios.post('/api/enterRoom', { latitude, longitude }, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.data)
}
