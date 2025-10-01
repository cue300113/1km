import { createRouter, createWebHistory } from 'vue-router'
import About from '../views/About.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import ResetPassword from '../views/ResetPassword.vue'
import EnterRoom from '../views/EnterRoom.vue'
import ChatRoom from '../views/ChatRoom.vue'
import MinimalTest from '../views/MinimalTest.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/about', component: About },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/reset-password', component: ResetPassword },
  { path: '/enter-room', component: EnterRoom },
  { path: '/chat-room', component: ChatRoom },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router