import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import EnterRoom from '../views/EnterRoom.vue'
import ChatRoom from '../views/ChatRoom.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/enter-room', component: EnterRoom },
  { path: '/chat-room', component: ChatRoom }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router