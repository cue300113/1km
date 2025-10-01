<template>
  <div class="about-container">
    <div class="about-card">
      <div class="about-header">
        <h1 class="about-title">关于1km聊天室</h1>
        <p class="about-subtitle">打破社交的界限</p>
      </div>
      
      <div class="about-content">
        <div class="feature-section">
          <div class="feature-item">
            <div class="feature-icon">🌍</div>
            <div class="feature-text">
              <h3>地理位置匹配</h3>
              <p>基于您的地理位置，为您匹配1公里范围内的其他用户，让您发现身边的精彩</p>
            </div>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">💬</div>
            <div class="feature-text">
              <h3>实时聊天</h3>
              <p>支持文字、表情等多种聊天方式，让您与附近的人进行即时交流</p>
            </div>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">🔒</div>
            <div class="feature-text">
              <h3>隐私保护</h3>
              <p>严格的隐私保护机制，确保您的个人信息安全，您可以选择完全匿名</p>
            </div>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">🎯</div>
            <div class="feature-text">
              <h3>精准匹配</h3>
              <p>智能算法为您推荐最合适的聊天对象，提高社交效率</p>
            </div>
          </div>
        </div>
        
        <div class="description-section">
          <h2>产品理念</h2>
          <p class="description-text">
            1km聊天室致力于打破传统社交的界限，让您能够与身边的人建立真实的连接。
            我们相信，最好的社交体验往往来自于与身边人的互动，而不是远距离的虚拟交流。
          </p>
          <p class="description-text">
            通过地理位置技术，我们为您创造了一个安全、有趣的本地社交平台，
            让您发现身边的美好，结识志同道合的朋友。
          </p>
        </div>
        
        <div class="stats-section">
          <div class="stat-item">
            <div class="stat-number">1km</div>
            <div class="stat-label">匹配范围</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">24/7</div>
            <div class="stat-label">在线服务</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">100%</div>
            <div class="stat-label">隐私保护</div>
          </div>
        </div>
      </div>
      
      <div class="action-buttons">
        <el-button 
          type="primary" 
          size="large" 
          class="action-btn"
          @click="goToRegister"
        >
          立即注册
        </el-button>
        <el-button 
          size="large" 
          class="action-btn secondary"
          @click="goToLogin"
        >
          已有账号？登录
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToRegister = () => {
  router.push('/register')
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
/* 主容器 */
.about-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background:
    radial-gradient(ellipse at top, rgba(24, 144, 255, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at bottom, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
    #0c0c0c;
  position: relative;
  overflow: hidden;
}

/* 星空背景 */
.about-container::before {
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

/* 关于卡片 */
.about-card {
  width: 100%;
  max-width: 600px;
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
.about-header {
  text-align: center;
  margin-bottom: 40px;
}

.about-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.about-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* 内容区域 */
.about-content {
  margin-bottom: 40px;
}

/* 功能特性 */
.feature-section {
  margin-bottom: 40px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 12px;
  background: rgba(24, 144, 255, 0.05);
  transition: all 0.3s;
}

.feature-item:hover {
  background: rgba(24, 144, 255, 0.1);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 32px;
  margin-right: 16px;
  flex-shrink: 0;
}

.feature-text h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.feature-text p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* 产品理念 */
.description-section {
  margin-bottom: 40px;
}

.description-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  text-align: center;
}

.description-text {
  font-size: 15px;
  color: #666;
  line-height: 1.8;
  margin: 0 0 16px 0;
  text-align: center;
}

/* 统计数据 */
.stats-section {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
  padding: 24px;
  background: rgba(24, 144, 255, 0.05);
  border-radius: 12px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.action-btn {
  height: 52px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  min-width: 140px;
}

.action-btn.secondary {
  background: transparent;
  color: #1890ff;
  border: 2px solid #1890ff;
}

.action-btn.secondary:hover {
  background: #1890ff;
  color: white;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .about-container {
    padding: 8px;
    align-items: flex-start;
    padding-top: 10px;
    min-height: 100vh;
  }
  
  .about-card {
    max-width: 100%;
    padding: 24px 20px;
    border-radius: 12px;
    margin: 0;
    min-height: calc(100vh - 20px);
  }
  
  .about-header {
    margin-bottom: 32px;
  }
  
  .about-title {
    font-size: 28px;
    margin-bottom: 8px;
  }
  
  .about-subtitle {
    font-size: 14px;
  }
  
  .feature-item {
    flex-direction: column;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .feature-icon {
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .stats-section {
    flex-direction: column;
    gap: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 12px;
  }
  
  .action-btn {
    width: 100%;
    min-width: auto;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .about-container {
    padding: 4px;
    padding-top: 5px;
  }
  
  .about-card {
    padding: 20px 16px;
    border-radius: 8px;
    min-height: calc(100vh - 10px);
  }
  
  .about-title {
    font-size: 24px;
  }
  
  .about-subtitle {
    font-size: 13px;
  }
  
  .feature-item {
    padding: 12px;
  }
  
  .feature-icon {
    font-size: 28px;
  }
  
  .feature-text h3 {
    font-size: 16px;
  }
  
  .feature-text p {
    font-size: 13px;
  }
  
  .description-section h2 {
    font-size: 20px;
  }
  
  .description-text {
    font-size: 14px;
  }
  
  .stat-number {
    font-size: 24px;
  }
  
  .stat-label {
    font-size: 12px;
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
</style>
