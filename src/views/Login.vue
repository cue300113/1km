<template>
  <el-row justify="center" style="margin-top: 100px;">
    <el-col :span="8">
      <el-card>
        <h2 style="text-align:center;">登录</h2>
        <el-form @submit.prevent="login">
          <el-form-item>
            <el-input v-model="username" placeholder="用户名" clearable />
          </el-form-item>
          <el-form-item>
            <el-input v-model="password" type="password" placeholder="密码" show-password clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login" style="width:100%;">登录</el-button>
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <router-link to="/register">没有账号？去注册</router-link>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loginApi } from '../api/user'

const username = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  const res = await loginApi(username.value, password.value)
  if (res.code === 1 && res.data && res.data.token) {
    localStorage.setItem('token', res.data.token)
    ElMessage.success(res.msg || '登录成功')
    router.push('/enter-room')
  } else {
    ElMessage.error(res.msg || '登录失败')
  }
}
</script>