<template>
  <el-row justify="center" style="margin-top: 100px;">
    <el-col :span="8">
      <el-card>
        <h2 style="text-align:center;">注册</h2>
        <el-form @submit.prevent="register">
          <el-form-item>
            <el-input v-model="username" placeholder="用户名" clearable />
          </el-form-item>
          <el-form-item>
            <el-input v-model="password" type="password" placeholder="密码" show-password clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="register" style="width:100%;">注册</el-button>
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <router-link to="/login">已有账号？去登录</router-link>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { registerApi } from '../api/user'

const username = ref('')
const password = ref('')
const router = useRouter()

const register = async () => {
  const res = await registerApi(username.value, password.value)
  if (res.code === 1) {  // 改成 code === 1
    ElMessage.success(res.msg || '注册成功，请登录')
    router.push('/login')
  } else {
    ElMessage.error(res.msg || '注册失败')
  }
}
</script>