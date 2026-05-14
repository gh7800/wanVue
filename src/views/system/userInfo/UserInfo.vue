<template>
  <div class="user-info-page">
    <el-row :gutter="20">
      <!-- 左侧：个人资料卡片 -->
      <el-col :span="8">
        <el-card class="profile-card">
          <div class="avatar-section">
            <el-avatar :size="100" :src="userInfo.avatar || defaultAvatar" class="user-avatar"></el-avatar>
            <el-upload
              class="avatar-uploader"
              action="#"
              :http-request="handleAvatarUpload"
              :show-file-list="false"
              accept="image/*">
              <el-button size="small" type="primary" icon="el-icon-camera">更换头像</el-button>
            </el-upload>
          </div>
          <div class="user-name">{{ userInfo.real_name || userInfo.username }}</div>
          <div class="user-role">{{ userInfo.role && userInfo.role.name || '普通用户' }}</div>
          <div class="user-dept">{{ userInfo.department && userInfo.department.name || '-' }}</div>
          
          <el-divider></el-divider>
          
          <div class="profile-info">
            <div class="info-item">
              <i class="el-icon-user"></i>
              <span>{{ userInfo.username }}</span>
            </div>
            <div class="info-item">
              <i class="el-icon-phone"></i>
              <span>{{ userInfo.phone || '未绑定' }}</span>
            </div>
            <div class="info-item">
              <i class="el-icon-message"></i>
              <span>{{ userInfo.email || '未绑定' }}</span>
            </div>
            <div class="info-item">
              <i class="el-icon-time"></i>
              <span>注册时间：{{ userInfo.create_time }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 右侧：编辑区域 -->
      <el-col :span="16">
        <el-card>
          <el-tabs v-model="activeTab">
            <!-- 基本信息 -->
            <el-tab-pane label="基本信息" name="basic">
              <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="info-form">
                <el-form-item label="用户名">
                  <el-input v-model="form.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="real_name">
                  <el-input v-model="form.real_name" placeholder="请输入真实姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                  <el-input v-model="form.address" placeholder="请输入地址"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleSave" :loading="saveLoading">保存修改</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            
            <!-- 修改密码 -->
            <el-tab-pane label="修改密码" name="password">
              <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-width="100px" class="info-form">
                <el-form-item label="原密码" prop="old_password">
                  <el-input v-model="passwordForm.old_password" type="password" placeholder="请输入原密码" show-password></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="new_password">
                  <el-input v-model="passwordForm.new_password" type="password" placeholder="请输入新密码" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirm_password">
                  <el-input v-model="passwordForm.confirm_password" type="password" placeholder="请再次输入新密码" show-password></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleChangePassword" :loading="passwordLoading">修改密码</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getUserInfo, updateUserInfo, changePassword, uploadAvatar } from '@/api/userInfo'

export default {
  name: 'UserInfo',
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.passwordForm.new_password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      defaultAvatar: require('@/assets/icon_logo.png'),
      activeTab: 'basic',
      userInfo: {},
      form: {
        username: '',
        real_name: '',
        phone: '',
        email: '',
        address: ''
      },
      rules: {
        real_name: [
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      },
      saveLoading: false,
      passwordForm: {
        old_password: '',
        new_password: '',
        confirm_password: ''
      },
      passwordRules: {
        old_password: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ],
        new_password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ],
        confirm_password: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      },
      passwordLoading: false
    }
  },
  created() {
    this.fetchUserInfo()
  },
  methods: {
    // 获取个人信息
    async fetchUserInfo() {
      try {
        const res = await getUserInfo()
        this.userInfo = res.data || {}
        // 填充表单
        this.form = {
          username: this.userInfo.username || '',
          real_name: this.userInfo.real_name || '',
          phone: this.userInfo.phone || '',
          email: this.userInfo.email || '',
          address: this.userInfo.address || ''
        }
      } catch (error) {
        this.$message.error('获取个人信息失败')
      }
    },
    // 保存基本信息
    handleSave() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.saveLoading = true
          try {
            await updateUserInfo(this.form)
            this.$message.success('保存成功')
            this.fetchUserInfo()
          } catch (error) {
            this.$message.error('保存失败')
          } finally {
            this.saveLoading = false
          }
        }
      })
    },
    // 修改密码
    handleChangePassword() {
      this.$refs.passwordForm.validate(async (valid) => {
        if (valid) {
          this.passwordLoading = true
          try {
            await changePassword({
              old_password: this.passwordForm.old_password,
              new_password: this.passwordForm.new_password
            })
            this.$message.success('密码修改成功')
            this.passwordForm = {
              old_password: '',
              new_password: '',
              confirm_password: ''
            }
          } catch (error) {
            this.$message.error('密码修改失败')
          } finally {
            this.passwordLoading = false
          }
        }
      })
    },
    // 上传头像
    async handleAvatarUpload({ file }) {
      const formData = new FormData()
      formData.append('avatar', file)
      try {
        await uploadAvatar(formData)
        this.$message.success('头像上传成功')
        this.fetchUserInfo()
      } catch (error) {
        this.$message.error('头像上传失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-info-page {
  padding: 20px;

  .profile-card {
    text-align: center;

    .avatar-section {
      margin-bottom: 15px;

      .user-avatar {
        margin-bottom: 10px;
      }
    }

    .user-name {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }

    .user-role {
      font-size: 14px;
      color: #5482EE;
      margin-bottom: 5px;
    }

    .user-dept {
      font-size: 13px;
      color: #909399;
      margin-bottom: 15px;
    }

    .profile-info {
      text-align: left;

      .info-item {
        padding: 10px 0;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #606266;
        font-size: 14px;

        &:last-child {
          border-bottom: none;
        }

        i {
          color: #5482EE;
          font-size: 16px;
        }
      }
    }
  }

  .info-form {
    max-width: 500px;
    padding: 20px 0;
  }
}
</style>
