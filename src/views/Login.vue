<template>
  <div class="login-container">
    <!-- 桌面端保持原有设计 -->
    <div class="login-card desktop-card">
      <div class="login-header">
        <img src="/3.webp" alt="1km聊天室" class="login-logo" />
      </div>
      
      <el-form @submit.prevent="login" class="login-form">
        <el-form-item class="form-item">
          <el-input 
            v-model="username" 
            placeholder="用户名" 
            clearable 
            size="large"
          />
        </el-form-item>
        
        <el-form-item class="form-item">
          <el-input 
            v-model="password" 
            type="password" 
            placeholder="密码" 
            show-password 
            clearable 
            size="large"
          />
        </el-form-item>
        
        <el-form-item class="form-item">
          <el-button 
            type="primary" 
            @click="login" 
            size="large"
            class="login-btn"
            :loading="isLoading"
          >
            {{ isLoading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="register-link">
        <router-link to="/register">没有账号？去注册</router-link>
        <span class="divider">|</span>
        <a href="#" @click.prevent="handleForgotPassword" class="forgot-password">忘记密码？</a>
        <div class="about-link">
          <router-link to="/about">更好的了解我们</router-link>
        </div>
      </div>
    </div>

    <!-- 移动端分离式设计 -->
    <div class="mobile-login-wrapper">
      <!-- 上半部分：标题卡片 -->
      <div class="mobile-header-card">
        <div class="login-header">
          <img src="/3.webp" alt="1km聊天室" class="login-logo mobile-logo" />
        </div>
      </div>
      
      <!-- 下半部分：表单卡片 -->
      <div class="mobile-form-card">
        <el-form @submit.prevent="login" class="login-form">
          <el-form-item class="form-item">
            <el-input 
              v-model="username" 
              placeholder="用户名" 
              clearable 
              size="large"
            />
          </el-form-item>
          
          <el-form-item class="form-item">
            <el-input 
              v-model="password" 
              type="password" 
              placeholder="密码" 
              show-password 
              clearable 
              size="large"
            />
          </el-form-item>
          
          <el-form-item class="form-item">
            <el-button 
              type="primary" 
              @click="login" 
              size="large"
              class="login-btn"
              :loading="isLoading"
            >
              {{ isLoading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="register-link">
          <router-link to="/register">没有账号？去注册</router-link>
          <span class="divider">|</span>
          <a href="#" @click.prevent="handleForgotPassword" class="forgot-password">忘记密码？</a>
          <div class="about-link">
            <router-link to="/about">更好的了解我们</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loginApi } from '../api/user'

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const router = useRouter()

const login = async () => {
  if (!username.value || !password.value) {
    ElMessage.error('请填写用户名和密码')
    return
  }
  
  isLoading.value = true
  try {
    const res = await loginApi(username.value, password.value)
    if (res.code === 1 && res.data && res.data.token) {
      localStorage.setItem('token', res.data.token)
      ElMessage.success(res.msg || '登录成功')
      router.push('/enter-room')
    } else {
      ElMessage.error(res.msg || '登录失败')
    }
  } catch (error) {
    console.error('登录错误:', error)
    ElMessage.error('登录失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = () => {
  router.push('/reset-password')
}
</script>

<style scoped>
/* 主容器 */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #0c0c0c;
  position: relative;
  overflow: hidden;
}

/* 主容器背景 */
.login-container {
  background:
    radial-gradient(ellipse at top, rgba(24, 144, 255, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at bottom, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
    #0c0c0c;
}

/* 星空背景 */
.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(1px 1px at 20px 30px, #fff, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.9), transparent),
    radial-gradient(1px 1px at 90px 40px, #eee, transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.7), transparent),
    radial-gradient(2px 2px at 160px 30px, #ddd, transparent),
    radial-gradient(1px 1px at 200px 50px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 250px 20px, #fff, transparent),
    radial-gradient(2px 2px at 300px 60px, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 350px 90px, #eee, transparent),
    radial-gradient(1px 1px at 400px 10px, rgba(255,255,255,0.9), transparent),
    radial-gradient(3px 3px at 50px 100px, rgba(24, 144, 255, 0.3), transparent),
    radial-gradient(2px 2px at 150px 150px, rgba(255, 255, 255, 0.4), transparent),
    radial-gradient(1px 1px at 250px 200px, rgba(24, 144, 255, 0.2), transparent);
  background-repeat: repeat;
  background-size: 400px 200px;
  animation: sparkle 30s linear infinite;
  z-index: 1;
}

/* 星空动画 */
@keyframes sparkle {
  0% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-50px) translateX(10px); }
  50% { transform: translateY(-100px) translateX(0px); }
  75% { transform: translateY(-150px) translateX(-10px); }
  100% { transform: translateY(-200px) translateX(0px); }
}

/* 流星效果已取消 */

/* 登录卡片 */
.login-card {
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 头部 */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

/* Logo图片样式 - 填满整个卡片 */
.login-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 16px;
}

.login-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.login-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* 表单 */
.login-form {
  width: 100%;
}

.form-item {
  margin-bottom: 24px;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 52px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
  margin-top: 12px;
}

/* 注册链接 */
.register-link {
  text-align: center;
  margin-top: 24px;
}

.register-link a,
.mobile-form-card .register-link a {
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.register-link a:hover,
.mobile-form-card .register-link a:hover {
  color: #40a9ff;
}

.divider,
.mobile-form-card .divider {
  margin: 0 8px;
  color: #ccc;
  font-size: 14px;
}

.forgot-password,
.mobile-form-card .forgot-password {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.forgot-password:hover,
.mobile-form-card .forgot-password:hover {
  color: #1890ff;
}

.about-link,
.mobile-form-card .about-link {
  margin-top: 12px;
}

.about-link a,
.mobile-form-card .about-link a {
  color: #666;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.3s;
}

.about-link a:hover,
.mobile-form-card .about-link a:hover {
  color: #1890ff;
}

/* 桌面端显示原版，隐藏移动端版本 */
.desktop-card {
  display: block;
}

.mobile-login-wrapper {
  display: none;
}

/* 移动端优化 - 分离式设计 */
@media (max-width: 768px) {
  .login-container {
    padding: 12px;
    align-items: stretch;
    padding-top: 20px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  /* 隐藏桌面端版本，显示移动端版本 */
  .desktop-card {
    display: none;
  }
  
  .mobile-login-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
    justify-content: center;
    max-width: 100%;
  }
  
  /* 上半部分：标题卡片 - 移除内边距让图片填满 */
  .mobile-header-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 0;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 2;
    overflow: hidden;
    flex: 2.00;
    min-height: 150px;
  }
  
  .mobile-header-card .login-header {
    text-align: center;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  
  /* 移动端Logo填满整个卡片 */
  .mobile-logo {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    object-fit: cover;
    object-position: center;
    border-radius: 16px;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
  }
  
  .mobile-header-card .login-title {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 8px 0;
  }
  
  .mobile-header-card .login-subtitle {
    font-size: 16px;
    color: #666;
    margin: 0;
  }
  
  /* 下半部分：表单卡片 */
  .mobile-form-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 32px 24px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 2;
    flex: 0.75;
  }
  
  .mobile-form-card .form-item {
    margin-bottom: 20px;
  }
  
  .mobile-form-card .login-btn {
    width: 100%;
    height: 52px;
    font-size: 18px;
    font-weight: 600;
    border-radius: 8px;
    margin-top: 16px;
  }
  
  .mobile-form-card .register-link {
    text-align: center;
    margin-top: 24px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .login-container {
    padding: 8px;
    padding-top: 16px;
  }
  
  .mobile-login-wrapper {
    gap: 12px;
  }
  
  .mobile-header-card {
    padding: 0;
    border-radius: 12px;
  }
  
  /* 超小屏幕Logo优化 */
  .mobile-logo {
    border-radius: 12px;
  }
  
  .mobile-header-card .login-title {
    font-size: 24px;
    margin-bottom: 6px;
  }
  
  .mobile-header-card .login-subtitle {
    font-size: 14px;
  }
  
  .mobile-form-card {
    padding: 24px 20px;
    border-radius: 12px;
  }
  
  .mobile-form-card .form-item {
    margin-bottom: 18px;
  }
  
  .mobile-form-card .login-btn {
    height: 50px;
    font-size: 17px;
    margin-top: 14px;
  }
  
  .mobile-form-card .register-link {
    margin-top: 20px;
  }
  
  .mobile-form-card .register-link a {
    font-size: 14px;
  }
}

/* 手机横屏优化 */
@media (max-width: 768px) and (orientation: landscape) {
  .login-container {
    padding: 8px;
    padding-top: 12px;
  }
  
  .mobile-login-wrapper {
    gap: 8px;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .mobile-header-card {
    padding: 0;
  }
  
  /* 横屏模式Logo优化 */
  .mobile-logo {
    border-radius: 20px;
  }
  
  .mobile-header-card .login-title {
    font-size: 20px;
    margin-bottom: 4px;
  }
  
  .mobile-header-card .login-subtitle {
    font-size: 14px;
  }
  
  .mobile-form-card {
    padding: 16px 20px;
  }
  
  .mobile-form-card .form-item {
    margin-bottom: 12px;
  }
  
  .mobile-form-card .login-btn {
    height: 40px;
    margin-top: 8px;
  }
  
  .mobile-form-card .register-link {
    margin-top: 16px;
  }
}

/* 输入框样式优化 */
:deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.3s;
  min-height: 48px;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

/* 移动端输入框优化 */
@media (max-width: 768px) {
  .mobile-form-card :deep(.el-input__wrapper) {
    min-height: 52px;
    font-size: 16px; /* 防止iOS缩放 */
  }
  
  .mobile-form-card :deep(.el-input__inner) {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
  }
  
  .mobile-form-card :deep(.el-button) {
    min-height: 48px;
    font-size: 16px;
  }
}

/* 按钮样式优化 */
:deep(.el-button--primary) {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  transition: all 0.3s;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #40a9ff 0%, #69c0ff 100%);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
  transform: translateY(-1px);
}

:deep(.el-button--primary:active) {
  transform: translateY(0);
}

/* 禁用状态 */
:deep(.el-button--primary.is-disabled) {
  background: #d9d9d9;
  box-shadow: none;
  transform: none;
}
</style>