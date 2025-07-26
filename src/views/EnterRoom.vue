<template>
  <el-row justify="center" style="margin-top: 150px;">
    <el-col :span="8">
      <el-card>
        <el-skeleton :rows="2" animated />
        <div style="text-align:center;margin-top:20px;">
          <el-icon><i class="el-icon-location"></i></el-icon>
          <span>定位中，请稍候...</span>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { enterRoomApi } from '../api/room'

const router = useRouter()

onMounted(() => {
  if (!navigator.geolocation) {
    ElMessage.error('浏览器不支持地理定位')
    return
  }
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords
    const token = localStorage.getItem('token')
    const res = await enterRoomApi(token, latitude, longitude)
    if (res.code === 1) {
      localStorage.setItem('roomId', res.data.roomId.toString())
      router.push('/chat-room')
    } else {
      ElMessage.error(res.msg || '进入聊天室失败')
    }
  }, () => {
    ElMessage.error('获取定位失败')
  })
})
</script>
