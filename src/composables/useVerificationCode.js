import { ref, computed, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { sendVerificationCodeApi } from '../api/user'

export function useVerificationCode() {
  const countdown = ref(0)
  const isCodeSending = ref(false)
  
  let countdownTimer = null

  // 发送验证码按钮文字
  const getCodeButtonText = computed(() => {
    if (isCodeSending.value) {
      return '发送中...'
    }
    if (countdown.value > 0) {
      return `${countdown.value}s后重试`
    }
    return '发送验证码'
  })

  // 开始倒计时
  const startCountdown = () => {
    countdown.value = 60
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }, 1000)
  }

  // 发送验证码
  const sendVerificationCode = async (email, emailValidation = 'qq') => {
    if (!email) {
      ElMessage.error('请先填写邮箱地址')
      return false
    }
    
    // 邮箱格式验证
    let emailRegex
    if (emailValidation === 'qq') {
      // QQ邮箱格式
      emailRegex = /^[1-9]\d{4,10}@qq\.com$/
      if (!emailRegex.test(email)) {
        ElMessage.error('请输入正确的QQ邮箱格式')
        return false
      }
    } else {
      // 通用邮箱格式
      emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        ElMessage.error('请输入正确的邮箱格式')
        return false
      }
    }
    
    isCodeSending.value = true
    try {
      const res = await sendVerificationCodeApi(email)
      if (res.code === 1) {
        ElMessage.success(res.msg || '验证码已发送到您的邮箱')
        startCountdown()
        return true
      } else {
        ElMessage.error(res.msg || '验证码发送失败')
        return false
      }
    } catch (error) {
      console.error('发送验证码错误:', error)
      ElMessage.error('验证码发送失败，请稍后重试')
      return false
    } finally {
      isCodeSending.value = false
    }
  }

  // 清理倒计时
  const clearCountdown = () => {
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
      countdown.value = 0
    }
  }

  // 组件卸载时清理
  onUnmounted(() => {
    clearCountdown()
  })

  return {
    countdown,
    isCodeSending,
    getCodeButtonText,
    sendVerificationCode,
    clearCountdown
  }
}
