<template>
  <div class="reset-password-container">
    <div class="reset-password-card">
      <div class="reset-password-header">
        <h1 class="reset-password-title">重置密码</h1>
        <p class="reset-password-subtitle">设置您的新密码</p>
      </div>
      
      <el-form @submit.prevent="resetPassword" class="reset-password-form">
        <el-form-item class="form-item">
          <el-input 
            v-model="username" 
            placeholder="用户名" 
            clearable 
            size="large"
            @blur="checkUsername"
            :class="{ 'is-error': !usernameValid }"
          />
          <div v-if="!usernameValid && usernameError" class="error-message">
            {{ usernameError }}
          </div>
          <div v-if="isCheckingUsername" class="checking-message">
            正在检查用户名...
          </div>
        </el-form-item>
        
        <el-form-item class="form-item">
          <el-input 
            v-model="email" 
            placeholder="请输入注册时使用的邮箱地址" 
            clearable 
            size="large"
            type="email"
          />
          <div class="email-tip">
            <span class="tip-text">💡 请确保邮箱地址真实有效，验证码将发送到此邮箱</span>
          </div>
        </el-form-item>
        
        <el-form-item class="form-item">
          <div class="verification-code-group">
            <el-input 
              v-model="verificationCode" 
              placeholder="邮箱验证码" 
              clearable 
              size="large"
              class="verification-input"
            />
            <el-button 
              @click="handleSendCode" 
              size="large"
              class="send-code-btn"
              :disabled="!email || isCodeSending || countdown > 0"
              :loading="isCodeSending"
            >
              {{ getCodeButtonText }}
            </el-button>
          </div>
        </el-form-item>
        
        <el-form-item class="form-item">
          <el-input 
            v-model="newPassword" 
            type="password" 
            placeholder="新密码" 
            show-password 
            clearable 
            size="large"
          />
        </el-form-item>
        
        <el-form-item class="form-item">
          <el-input 
            v-model="confirmPassword" 
            type="password" 
            placeholder="确认新密码" 
            show-password 
            clearable 
            size="large"
          />
        </el-form-item>
        
        <el-form-item class="form-item">
          <el-button 
            type="primary" 
            @click="resetPassword" 
            size="large"
            class="reset-password-btn"
            :loading="isLoading"
          >
            {{ isLoading ? '重置中...' : '重置密码' }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="back-to-login">
        <router-link to="/login">返回登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { resetPasswordApi, checkUsernameApi } from '../api/user'
import { useVerificationCode } from '../composables/useVerificationCode'

const username = ref('')
const email = ref('')
const verificationCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const router = useRouter()

// 用户名验证状态
const usernameValid = ref(true)
const usernameError = ref('')
const isCheckingUsername = ref(false)

// 使用公共验证码逻辑
const { countdown, isCodeSending, getCodeButtonText, sendVerificationCode } = useVerificationCode()

// 检查用户名是否存在
const checkUsername = async () => {
  if (!username.value.trim()) {
    usernameValid.value = true
    usernameError.value = ''
    return
  }
  
  isCheckingUsername.value = true
  usernameValid.value = true
  usernameError.value = ''
  
  try {
    const res = await checkUsernameApi(username.value)
    if (res.code === 0) {
      // code为0说明用户存在，可以修改密码
      usernameValid.value = true
      usernameError.value = ''
    } else {
      // code不为0说明用户不存在
      usernameValid.value = false
      usernameError.value = '用户不存在'
    }
  } catch (error) {
    console.error('检查用户名错误:', error)
    usernameValid.value = false
    usernameError.value = '检查用户名失败，请稍后重试'
  } finally {
    isCheckingUsername.value = false
  }
}

// 处理发送验证码
const handleSendCode = async () => {
  // 先检查用户名是否有效
  if (!usernameValid.value) {
    ElMessage.error('请先输入有效的用户名')
    return
  }
  
  await sendVerificationCode(email.value, 'general') // 使用通用邮箱格式验证
}

const resetPassword = async () => {
  // 表单验证
  if (!username.value || !email.value || !verificationCode.value || !newPassword.value || !confirmPassword.value) {
    ElMessage.error('请填写所有字段')
    return
  }
  
  if (!usernameValid.value) {
    ElMessage.error('请先输入有效的用户名')
    return
  }
  
  if (newPassword.value !== confirmPassword.value) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  


  isLoading.value = true
  try {
    const res = await resetPasswordApi(username.value, email.value, verificationCode.value, newPassword.value)
    if (res.code === 1) {
      ElMessage.success(res.msg || '密码重置成功')
      router.push('/login')
    } else {
      ElMessage.error(res.msg || '密码重置失败')
    }
  } catch (error) {
    console.error('密码重置错误:', error)
    ElMessage.error('密码重置失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 主容器 */
.reset-password-container {
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
.reset-password-container {
  background:
    radial-gradient(ellipse at top, rgba(24, 144, 255, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at bottom, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
    #0c0c0c;
}

/* 星空背景 */
.reset-password-container::before {
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

/* 重置密码卡片 */
.reset-password-card {
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
.reset-password-header {
  text-align: center;
  margin-bottom: 40px;
}

.reset-password-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.reset-password-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* 表单 */
.reset-password-form {
  width: 100%;
}

.form-item {
  margin-bottom: 24px;
}

/* 重置密码按钮 */
.reset-password-btn {
  width: 100%;
  height: 52px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
  margin-top: 12px;
}

/* 验证码输入组 */
.verification-code-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.verification-input {
  flex: 1;
}

.send-code-btn {
  flex-shrink: 0;
  width: 120px;
  font-size: 14px;
}

/* 用户名验证状态 */
.error-message {
  color: #ff4757;
  font-size: 12px;
  margin-top: 5px;
  line-height: 1.4;
}

.checking-message {
  color: #1890ff;
  font-size: 12px;
  margin-top: 5px;
  line-height: 1.4;
}

/* 错误状态的输入框 */
:deep(.el-input.is-error .el-input__wrapper) {
  border-color: #ff4757 !important;
  box-shadow: 0 0 0 1px rgba(255, 71, 87, 0.2) !important;
}

/* 邮箱提示 */
.email-tip {
  margin-top: 5px;
}

.tip-text {
  color: #666;
  font-size: 12px;
  line-height: 1.4;
}

/* 返回登录链接 */
.back-to-login {
  text-align: center;
  margin-top: 24px;
}

.back-to-login a {
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.back-to-login a:hover {
  color: #40a9ff;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .reset-password-container {
    padding: 8px;
    align-items: flex-start;
    padding-top: 10px;
    min-height: 100vh;
  }
  
  .reset-password-card {
    max-width: 100%;
    padding: 24px 20px;
    border-radius: 12px;
    margin: 0;
    min-height: calc(100vh - 20px);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .reset-password-header {
    margin-bottom: 32px;
  }
  
  .reset-password-title {
    font-size: 28px;
    margin-bottom: 8px;
  }
  
  .reset-password-subtitle {
    font-size: 14px;
  }
  
  .form-item {
    margin-bottom: 20px;
  }
  
  .reset-password-btn {
    height: 52px;
    font-size: 18px;
    margin-top: 16px;
  }
  
  .back-to-login {
    margin-top: 24px;
  }
  
  /* 移动端验证码组 */
  .verification-code-group {
    gap: 8px;
  }
  
  .send-code-btn {
    width: 100px;
    font-size: 13px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .reset-password-container {
    padding: 4px;
    padding-top: 5px;
  }
  
  .reset-password-card {
    padding: 20px 16px;
    border-radius: 8px;
    min-height: calc(100vh - 10px);
  }
  
  .reset-password-header {
    margin-bottom: 28px;
  }
  
  .reset-password-title {
    font-size: 24px;
    margin-bottom: 6px;
  }
  
  .reset-password-subtitle {
    font-size: 13px;
  }
  
  .form-item {
    margin-bottom: 18px;
  }
  
  .reset-password-btn {
    height: 50px;
    font-size: 17px;
    margin-top: 14px;
  }
  
  .back-to-login {
    margin-top: 20px;
  }
  
  .back-to-login a {
    font-size: 14px;
  }
}

/* 手机横屏优化 */
@media (max-width: 768px) and (orientation: landscape) {
  .reset-password-container {
    padding: 8px;
    padding-top: 10px;
  }
  
  .reset-password-card {
    padding: 16px 20px;
    max-width: 500px;
  }
  
  .reset-password-header {
    margin-bottom: 16px;
  }
  
  .reset-password-title {
    font-size: 20px;
  }
  
  .form-item {
    margin-bottom: 12px;
  }
  
  .reset-password-btn {
    height: 40px;
    margin-top: 8px;
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
  :deep(.el-input__wrapper) {
    min-height: 52px;
    font-size: 16px; /* 防止iOS缩放 */
  }
  
  :deep(.el-input__inner) {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
  }
  
  :deep(.el-button) {
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
