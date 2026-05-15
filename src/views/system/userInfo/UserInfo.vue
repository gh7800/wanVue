<template>
  <div class="user-info-page">
    <el-row :gutter="20">
      <!-- 左侧：个人资料卡片 -->
      <el-col :span="8">
        <el-card class="profile-card" v-loading="loading">
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
          <div class="user-name">{{ displayName }}</div>
          <div class="user-role">{{ roleName }}</div>
          <div class="user-dept">{{ departmentName }}</div>
          
          <el-divider></el-divider>
          
          <div class="profile-info">
            <div class="info-item">
              <i class="el-icon-user"></i>
              <span>{{ userInfo.username || '-' }}</span>
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
              <span>注册时间：{{ userInfo.create_time || '-' }}</span>
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
      // 用户信息
      userInfo: {},
      // 加载状态
      loading: false,
      saveLoading: false,
      passwordLoading: false,
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
      }
    }
  },
  computed: {
    displayName() {
      return this.userInfo.real_name || this.userInfo.username || ''
    },
    roleName() {
      return this.userInfo.role?.name || '普通用户'
    },
    departmentName() {
      return this.userInfo.department?.name || '-'
    }
  },
  created() {
    this.fetchUserInfo()
  },
  methods: {
    // 获取用户信息
    async fetchUserInfo() {
      this.loading = true
      try {
        const res = await getUserInfo()
        if (res.success) {
          this.userInfo = res.data || {}
          // 填充表单
          this.form = {
            username: this.userInfo.username || '',
            real_name: this.userInfo.real_name || '',
            phone: this.userInfo.phone || '',
            email: this.userInfo.email || '',
            address: this.userInfo.address || ''
          }
        } else {
          this.$message.error(res.message || '获取个人信息失败')
        }
      } catch (error) {
        console.error('获取个人信息失败:', error)
        this.$message.error('获取个人信息失败')
      } finally {
        this.loading = false
      }
    },

    // 保存基本信息
    handleSave() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        
        this.saveLoading = true
        try {
          const res = await updateUserInfo({ ...this.form })
          if (res.success) {
            this.$message.success('保存成功')
            this.fetchUserInfo()
          } else {
            this.$message.error(res.message || '保存失败')
          }
        } catch (error) {
          this.$message.error('保存失败')
        } finally {
          this.saveLoading = false
        }
      })
    },

    // 修改密码
    handleChangePassword() {
      this.$refs.passwordForm.validate(async (valid) => {
        if (!valid) return
        
        this.passwordLoading = true
        try {
          const res = await changePassword({
            old_password: this.passwordForm.old_password,
            new_password: this.passwordForm.new_password
          })
          
          if (res.success) {
            this.$message.success('密码修改成功')
            // 重置密码表单
            this.passwordForm.old_password = ''
            this.passwordForm.new_password = ''
            this.passwordForm.confirm_password = ''
            this.$refs.passwordForm.clearValidate()
          } else {
            this.$message.error(res.message || '密码修改失败')
          }
        } catch (error) {
          this.$message.error('密码修改失败')
        } finally {
          this.passwordLoading = false
        }
      })
    },

    // 上传头像
    async handleAvatarUpload({ file }) {
      const formData = new FormData()
      formData.append('avatar', file)
      try {
        const res = await uploadAvatar(formData)
        if (res.success) {
          this.$message.success('头像上传成功')
          this.fetchUserInfo()
        } else {
          this.$message.error(res.message || '头像上传失败')
        }
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
      margin-bottom: 8px;
    }

    .user-role {
      font-size: 14px;
      color: #409EFF;
      margin-bottom: 5px;
    }

    .user-dept {
      font-size: 13px;
      color: #909399;
      margin-bottom: 15px;
    }

    .profile-info {
      text-align: left;
      padding: 0 20px;

      .info-item {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        font-size: 14px;
        color: #606266;

        i {
          margin-right: 10px;
          color: #909399;
          font-size: 16px;
        }
      }
    }
  }

  .info-form {
    max-width: 500px;
    padding: 20px;
  }
}
</style>
