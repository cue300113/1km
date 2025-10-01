# API接口文档

## 用户相关接口

### 1. 发送验证码接口

**接口地址：** `POST /api/send-verification-code`

**功能描述：** 向指定邮箱发送验证码

**请求参数：**
```json
{
  "email": "string"  // 必填，邮箱地址
}
```

**参数说明：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| email | string | 是 | 接收验证码的邮箱地址 |

**响应格式：**
```json
{
  "code": 1,           // 状态码，1表示成功，0表示失败
  "msg": "string",     // 响应消息
  "data": null         // 响应数据
}
```

**响应示例：**
```json
{
  "code": 1,
  "msg": "验证码已发送到您的邮箱",
  "data": null
}
```

**错误响应示例：**
```json
{
  "code": 0,
  "msg": "邮箱格式不正确",
  "data": null
}
```

---

### 2. 检查用户名是否存在接口

**接口地址：** `POST /api/check-username`

**功能描述：** 检查用户名是否已被注册

**请求参数：**
```json
{
  "username": "string"  // 必填，要检查的用户名
}
```

**参数说明：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 要检查的用户名 |

**响应格式：**
```json
{
  "code": 1,           // 状态码，1表示用户名可用，0表示用户名已存在
  "msg": "string",     // 响应消息
  "data": null         // 响应数据
}
```

**响应示例：**

用户名可用：
```json
{
  "code": 1,
  "msg": "用户名可用",
  "data": null
}
```

用户名已存在：
```json
{
  "code": 0,
  "msg": "用户名已存在",
  "data": null
}
```

**错误响应示例：**
```json
{
  "code": 0,
  "msg": "服务器内部错误",
  "data": null
}
```

---

## 使用说明

### 前端调用示例

#### 发送验证码
```javascript
import { sendVerificationCodeApi } from '../api/user'

// 发送验证码
const sendCode = async (email) => {
  try {
    const res = await sendVerificationCodeApi(email)
    if (res.code === 1) {
      console.log('验证码发送成功')
    } else {
      console.error('验证码发送失败:', res.msg)
    }
  } catch (error) {
    console.error('请求失败:', error)
  }
}
```

#### 检查用户名
```javascript
import { checkUsernameApi } from '../api/user'

// 检查用户名
const checkUsername = async (username) => {
  try {
    const res = await checkUsernameApi(username)
    if (res.code === 1) {
      console.log('用户名可用')
    } else {
      console.log('用户名已存在:', res.msg)
    }
  } catch (error) {
    console.error('检查失败:', error)
  }
}
```

### 注意事项

1. **请求头：** 所有请求都需要设置 `Content-Type: application/json`
2. **超时时间：** 请求超时时间为10秒
3. **错误处理：** 建议在前端添加适当的错误处理和用户提示
4. **防抖处理：** 建议对用户名检查接口添加防抖处理，避免频繁请求
5. **验证码有效期：** 验证码通常有有效期限制，具体时间由后端决定

### 状态码说明

| 状态码 | 说明 |
|--------|------|
| 1 | 成功 |
| 0 | 失败 |

### 常见错误信息

- `邮箱格式不正确`
- `用户名已存在`
- `用户名不能为空`
- `服务器内部错误`
- `网络连接超时`
