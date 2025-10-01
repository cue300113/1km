import axios from 'axios'

// 创建axios实例
const request = axios.create({
  baseURL: '/api',
  timeout: 60000 // 60秒超时，文件上传可能需要较长时间
})

// 请求拦截器 - 添加token
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => response.data,
  error => {
    console.error('文件上传错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 上传文件到Java后端，后端再上传到阿里云OSS
 * @param {File} file - 要上传的文件
 * @param {string} roomId - 房间ID
 * @param {Function} onProgress - 上传进度回调函数
 * @returns {Promise} 返回上传结果
 */
export async function uploadFileApi(file, roomId, onProgress = null) {
  // 文件验证
  if (!file) {
    throw new Error('文件不能为空')
  }

  if (!roomId) {
    throw new Error('房间ID不能为空')
  }

  // 文件大小验证（前端预检查）
  const maxImageSize = 10 * 1024 * 1024 // 10MB
  const maxVideoSize = 50 * 1024 * 1024 // 50MB
  
  if (file.type.startsWith('image/') && file.size > maxImageSize) {
    throw new Error('图片大小不能超过10MB')
  }
  
  if (file.type.startsWith('video/') && file.size > maxVideoSize) {
    throw new Error('视频大小不能超过50MB')
  }

  // 文件类型验证
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  const allowedVideoTypes = [
    'video/mp4', 
    'video/avi', 
    'video/mov', 
    'video/quicktime',  // MOV文件的标准MIME类型
    'video/wmv', 
    'video/flv', 
    'video/webm'
  ]
  
  // 检查文件扩展名（作为备用验证）
  const fileName = file.name.toLowerCase()
  const allowedImageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  const allowedVideoExts = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']
  
  const isValidImageType = allowedImageTypes.includes(file.type)
  const isValidVideoType = allowedVideoTypes.includes(file.type)
  const isValidImageExt = allowedImageExts.some(ext => fileName.endsWith(ext))
  const isValidVideoExt = allowedVideoExts.some(ext => fileName.endsWith(ext))
  
  // 通过MIME类型或文件扩展名验证
  const isValidFile = (isValidImageType || isValidImageExt) || (isValidVideoType || isValidVideoExt)
  
  if (!isValidFile) {
    console.log('文件验证失败:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    })
    throw new Error('文件格式不支持，请上传图片(.jpg, .png, .gif, .webp)或视频(.mp4, .avi, .mov, .wmv, .flv, .webm)文件')
  }
  


  // 创建FormData
  const formData = new FormData()
  formData.append('file', file)
  formData.append('roomId', roomId)

  try {
    const response = await request.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      // 上传进度监听
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.lengthComputable) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress(percentCompleted)
        }
      }
    })

    // 检查响应结果
    if (response.code === 1) {
      return {
        success: true,
        data: response.data,
        message: response.msg || '上传成功'
      }
    } else {
      throw new Error(response.msg || '上传失败')
    }
  } catch (error) {
    // 处理不同类型的错误
    if (error.response) {
      // 服务器响应错误
      const status = error.response.status
      const data = error.response.data
      
      switch (status) {
        case 401:
          throw new Error('登录已过期，请重新登录')
        case 413:
          throw new Error('文件过大，请选择更小的文件')
        case 415:
          throw new Error('不支持的文件格式')
        case 500:
          throw new Error('服务器错误，请稍后重试')
        default:
          throw new Error(data?.msg || `上传失败 (${status})`)
      }
    } else if (error.request) {
      // 网络错误
      throw new Error('网络连接失败，请检查网络连接')
    } else {
      // 其他错误
      throw new Error(error.message || '上传失败')
    }
  }
}

/**
 * 获取文件信息
 * @param {string} fileId - 文件ID
 * @returns {Promise} 返回文件信息
 */
export async function getFileInfoApi(fileId) {
  try {
    const response = await request.get(`/file/${fileId}`)
    return response
  } catch (error) {
    console.error('获取文件信息失败:', error)
    throw error
  }
}

/**
 * 删除文件
 * @param {string} fileId - 文件ID
 * @returns {Promise} 返回删除结果
 */
export async function deleteFileApi(fileId) {
  try {
    const response = await request.delete(`/file/${fileId}`)
    return response
  } catch (error) {
    console.error('删除文件失败:', error)
    throw error
  }
}

/**
 * 格式化文件大小
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} 格式化后的文件大小
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 获取文件类型
 * @param {File} file - 文件对象
 * @returns {string} 文件类型 ('image' | 'video' | 'unknown')
 */
export function getFileType(file) {
  const fileName = file.name.toLowerCase()
  
  // 通过MIME类型检查
  if (file.type.startsWith('image/')) {
    return 'image'
  } else if (file.type.startsWith('video/')) {
    return 'video'
  }
  
  // 通过文件扩展名检查（备用方案）
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  const videoExts = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']
  
  if (imageExts.some(ext => fileName.endsWith(ext))) {
    return 'image'
  } else if (videoExts.some(ext => fileName.endsWith(ext))) {
    return 'video'
  }
  
  return 'unknown'
}
