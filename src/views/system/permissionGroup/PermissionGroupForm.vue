<template>
  <div class="permission-group-form">
    <el-card class="form-card">
      <div slot="header" class="card-header">
        <span>{{ isDetail ? '权限群组详情' : (isEdit ? '编辑权限群组' : '新增权限群组') }}</span>
        <el-button v-if="isDetail" type="primary" icon="el-icon-edit" @click="handleToEdit">编辑</el-button>
      </div>

      <!-- 基本信息 -->
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="group-form">
        <el-form-item label="群组名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入群组名称" :disabled="isDetail"></el-input>
        </el-form-item>
        <el-form-item label="群组类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择群组类型" style="width: 100%" :disabled="isDetail" clearable>
            <el-option key="user" label="人员" value="user"></el-option>
            <el-option key="permission" label="权限" value="permission"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入描述" :disabled="isDetail"></el-input>
        </el-form-item>
      </el-form>

      <!-- 人员选择区域 -->
      <div v-if="form.type === 'user' || !form.type" class="section">
        <div class="section-title">群组成员</div>
        <div v-if="!isDetail" class="section-header">
          <el-button type="primary" icon="el-icon-plus" @click="showUserSelector = true">选择人员</el-button>
        </div>
        <div v-if="selectedUsers.length > 0" class="user-waterfall">
          <div v-for="user in selectedUsers" :key="user.uuid" class="user-card">
            <div class="user-info">
              <span class="user-name">{{ user.real_name || user.username }}</span>
              <span class="user-account">{{ user.username }}</span>
            </div>
            <el-button v-if="!isDetail" size="mini" type="danger" icon="el-icon-delete" @click="handleRemoveUser(user)">移除</el-button>
          </div>
        </div>
        <el-empty v-else description="暂无成员"></el-empty>
      </div>

      <!-- 权限选择区域 -->
      <div class="section">
        <div class="section-title">群组权限</div>
        <div v-if="!isDetail" class="section-header">
          <el-button type="primary" icon="el-icon-plus" @click="showPermissionSelector = true">选择权限</el-button>
        </div>
        <div v-if="groupedPermissions.length > 0" class="permission-list">
          <el-collapse v-model="activeModules">
            <el-collapse-item v-for="module in groupedPermissions" :key="module.name" :title="module.name" :name="module.name">
              <el-table :data="module.permissions" stripe border size="small">
                <el-table-column prop="name" label="权限名称" min-width="150"></el-table-column>
                <el-table-column prop="code" label="权限编码" min-width="180"></el-table-column>
                <el-table-column prop="type" label="权限类型" width="100">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.type === 'page' ? 'primary' : 'success'" size="mini">
                      {{ scope.row.type === 'page' ? '页面权限' : '功能权限' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column v-if="!isDetail" label="操作" width="100" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleRemovePermission(scope.row)">移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
        <el-empty v-else description="暂无权限"></el-empty>
      </div>

      <!-- 操作按钮 -->
      <div v-if="!isDetail" class="form-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">保存</el-button>
      </div>
      <div v-else class="form-actions">
        <el-button @click="handleBack">返回</el-button>
      </div>
    </el-card>

    <!-- 人员选择对话框 -->
    <el-dialog title="选择人员" :visible.sync="showUserSelector" width="800px">
      <div class="user-selector">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="dept-tree">
              <div class="tree-header">组织架构</div>
              <el-tree
                :data="departmentTree"
                :props="{ label: 'name', children: 'children' }"
                node-key="uuid"
                highlight-current
                @node-click="handleDeptClick">
              </el-tree>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="user-list">
              <div class="list-header">
                <el-input v-model="userSearch" placeholder="搜索姓名/用户名" clearable style="width: 200px">
                  <i slot="prefix" class="el-icon-search"></i>
                </el-input>
              </div>
              <el-table :data="filteredUsers" stripe border height="400" @selection-change="handleUserSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="real_name" label="姓名" min-width="100">
                  <template slot-scope="scope">
                    {{ scope.row.real_name || scope.row.username }}
                  </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名" min-width="100"></el-table-column>
                <el-table-column prop="department_name" label="部门" min-width="120">
                  <template slot-scope="scope">
                    {{ scope.row.department_name || '-' }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer">
        <el-button @click="showUserSelector = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmUsers" :disabled="tempSelectedUsers.length === 0">确定</el-button>
      </div>
    </el-dialog>

    <!-- 权限选择对话框 -->
    <el-dialog title="选择权限" :visible.sync="showPermissionSelector" width="700px">
      <div class="permission-selector">
        <div v-if="groupedAllPermissions.length > 0" class="permission-list">
          <el-collapse v-model="activeAllModules">
            <el-collapse-item v-for="module in groupedAllPermissions" :key="module.name" :title="module.name" :name="module.name">
              <el-table :data="module.permissions" stripe border size="small" @selection-change="handlePermissionSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="权限名称" min-width="150"></el-table-column>
                <el-table-column prop="code" label="权限编码" min-width="180"></el-table-column>
                <el-table-column prop="type" label="权限类型" width="100">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.type === 'page' ? 'primary' : 'success'" size="mini">
                      {{ scope.row.type === 'page' ? '页面权限' : '功能权限' }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
        <el-empty v-else description="暂无权限数据"></el-empty>
      </div>
      <div slot="footer">
        <el-button @click="showPermissionSelector = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmPermissions" :disabled="tempSelectedPermissions.length === 0">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionGroupDetail,
  addPermissionGroup,
  updatePermissionGroup,
  addGroupUser,
  addGroupPermission
} from '@/api/permissionGroup'
import { getPermissionList } from '@/api/permission'
import { getUserList } from '@/api/userManager'
import { getDepartmentTree } from '@/api/department'

export default {
  name: 'PermissionGroupForm',
  data() {
    return {
      isEdit: false,
      isDetail: false,
      groupUuid: null,
      loading: false,
      submitLoading: false,
      form: {
        name: '',
        type: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入群组名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择群组类型', trigger: 'change' }
        ]
      },
      // 人员相关
      selectedUsers: [],
      showUserSelector: false,
      departmentTree: [],
      allUsers: [],
      userSearch: '',
      currentDeptUuid: null,
      tempSelectedUsers: [],
      // 权限相关
      selectedPermissions: [],
      showPermissionSelector: false,
      allPermissions: [],
      tempSelectedPermissions: [],
      activeModules: [],
      activeAllModules: []
    }
  },
  computed: {
    // 按模块分组的权限（已选择）
    groupedPermissions() {
      const groups = {}
      this.selectedPermissions.forEach(perm => {
        const module = perm.module || '其他'
        if (!groups[module]) {
          groups[module] = {
            name: module,
            permissions: []
          }
        }
        groups[module].permissions.push(perm)
      })
      return Object.values(groups)
    },
    // 按模块分组的权限（所有可选）
    groupedAllPermissions() {
      const groups = {}
      // 过滤掉已选择的权限
      const selectedUuids = this.selectedPermissions.map(p => p.uuid)
      const availablePermissions = this.allPermissions.filter(p => !selectedUuids.includes(p.uuid))
      
      availablePermissions.forEach(perm => {
        const module = perm.module || '其他'
        if (!groups[module]) {
          groups[module] = {
            name: module,
            permissions: []
          }
        }
        groups[module].permissions.push(perm)
      })
      return Object.values(groups)
    },
    // 过滤后的用户列表
    filteredUsers() {
      let users = this.allUsers
      // 按部门过滤
      if (this.currentDeptUuid) {
        users = users.filter(u => u.department_uuid === this.currentDeptUuid)
      }
      // 按搜索关键词过滤
      if (this.userSearch) {
        const keyword = this.userSearch.toLowerCase()
        users = users.filter(u => 
          (u.real_name && u.real_name.toLowerCase().includes(keyword)) ||
          (u.username && u.username.toLowerCase().includes(keyword))
        )
      }
      // 排除已选择的用户
      const selectedUuids = this.selectedUsers.map(u => u.uuid)
      return users.filter(u => !selectedUuids.includes(u.uuid))
    }
  },
  created() {
    const { type, uuid } = this.$route.params
    if (type === 'edit') {
      this.isEdit = true
      this.groupUuid = uuid
      this.fetchGroupDetail()
    } else if (type === 'detail') {
      this.isDetail = true
      this.groupUuid = uuid
      this.fetchGroupDetail()
    }
    this.fetchDepartmentTree()
    this.fetchAllUsers()
    this.fetchAllPermissions()
  },
  methods: {
    // 获取群组详情
    async fetchGroupDetail() {
      this.loading = true
      try {
        const res = await getPermissionGroupDetail(this.groupUuid)
        const data = res.data
        if (data) {
          this.form.name = data.name || ''
          // 处理成员
          if (data.users && data.users.length > 0) {
            this.selectedUsers = data.users.map(item => item.user).filter(Boolean)
          }
          // 处理权限
          if (data.permissions && data.permissions.length > 0) {
            this.selectedPermissions = data.permissions.map(item => item.permission).filter(Boolean)
          }
          // 设置群组类型，如果 type 为 null，则根据数据推断
          if (data.type) {
            this.form.type = data.type
          } else if (this.selectedUsers.length > 0 && this.selectedPermissions.length === 0) {
            this.form.type = 'user'
          } else if (this.selectedPermissions.length > 0 && this.selectedUsers.length === 0) {
            this.form.type = 'permission'
          } else {
            this.form.type = ''
          }
          this.form.description = data.description || ''
        }
      } catch (error) {
        console.error('获取群组详情失败:', error)
        this.$message.error('获取群组详情失败')
      } finally {
        this.loading = false
      }
    },
    // 获取部门树
    async fetchDepartmentTree() {
      try {
        const res = await getDepartmentTree()
        this.departmentTree = res.data || []
      } catch (error) {
        console.error('获取部门树失败:', error)
      }
    },
    // 获取所有用户
    async fetchAllUsers() {
      try {
        const res = await getUserList({ page: 1, size: 9999 })
        this.allUsers = res.data || []
      } catch (error) {
        console.error('获取用户列表失败:', error)
      }
    },
    // 获取所有权限
    async fetchAllPermissions() {
      try {
        const res = await getPermissionList({ flat: 1 })
        this.allPermissions = res.data || []
        // 默认展开所有模块
        this.activeAllModules = this.allPermissions.map(p => p.module || '其他')
      } catch (error) {
        console.error('获取权限列表失败:', error)
      }
    },
    // 点击部门
    handleDeptClick(data) {
      this.currentDeptUuid = data.uuid
    },
    // 人员选择变化
    handleUserSelectionChange(selection) {
      this.tempSelectedUsers = selection
    },
    // 确认选择人员
    handleConfirmUsers() {
      this.selectedUsers = [...this.selectedUsers, ...this.tempSelectedUsers]
      this.showUserSelector = false
      this.tempSelectedUsers = []
    },
    // 移除人员
    handleRemoveUser(row) {
      const index = this.selectedUsers.findIndex(u => u.uuid === row.uuid)
      if (index > -1) {
        this.selectedUsers.splice(index, 1)
      }
    },
    // 权限选择变化
    handlePermissionSelectionChange(selection) {
      this.tempSelectedPermissions = selection
    },
    // 确认选择权限
    handleConfirmPermissions() {
      this.selectedPermissions = [...this.selectedPermissions, ...this.tempSelectedPermissions]
      this.showPermissionSelector = false
      this.tempSelectedPermissions = []
      // 更新展开的模块
      this.activeModules = this.groupedPermissions.map(g => g.name)
    },
    // 移除权限
    handleRemovePermission(row) {
      const index = this.selectedPermissions.findIndex(p => p.uuid === row.uuid)
      if (index > -1) {
        this.selectedPermissions.splice(index, 1)
      }
    },
    // 跳转到编辑
    handleToEdit() {
      this.$router.push(`/permissionGroup/edit/${this.groupUuid}`)
    },
    // 返回
    handleBack() {
      this.$router.push('/permissionGroup')
    },
    // 取消
    handleCancel() {
      this.$confirm('确定要取消吗？未保存的数据将丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push('/permissionGroup')
      }).catch(() => {})
    },
    // 提交
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.submitLoading = true
          try {
            const data = {
              name: this.form.name,
              type: this.form.type,
              description: this.form.description
            }
            let res
            if (this.isEdit) {
              res = await updatePermissionGroup(this.groupUuid, data)
              this.$message.success('更新成功')
            } else {
              res = await addPermissionGroup(data)
              this.$message.success('创建成功')
              this.groupUuid = res.data.uuid
            }
            // 保存成员关联
            await this.saveUserRelations()
            // 保存权限关联
            await this.savePermissionRelations()
            this.$router.push('/permissionGroup')
          } catch (error) {
            this.$message.error(this.isEdit ? '更新失败' : '创建失败')
          } finally {
            this.submitLoading = false
          }
        }
      })
    },
    // 保存成员关联
    async saveUserRelations() {
      if (!this.groupUuid) return
      // 这里简化处理，实际应该对比差异进行增删
      for (const user of this.selectedUsers) {
        try {
          await addGroupUser(this.groupUuid, { user_uuid: user.uuid })
        } catch (error) {
          console.error('添加成员失败:', error)
        }
      }
    },
    // 保存权限关联
    async savePermissionRelations() {
      if (!this.groupUuid) return
      for (const perm of this.selectedPermissions) {
        try {
          await addGroupPermission(this.groupUuid, { permission_uuid: perm.uuid })
        } catch (error) {
          console.error('添加权限失败:', error)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.permission-group-form {
  padding: 20px;

  .form-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .group-form {
    max-width: 600px;
    margin-bottom: 30px;
  }

  .section {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;

    .section-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #303133;
    }

    .section-header {
      margin-bottom: 15px;
    }
  }

  .form-actions {
    margin-top: 30px;
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;
  }

  .user-waterfall {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    .user-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: #fff;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      min-width: 200px;
      max-width: 280px;
      flex: 1;

      .user-info {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .user-name {
          font-size: 14px;
          font-weight: 500;
          color: #303133;
        }

        .user-account {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }

  .user-selector {
    .dept-tree {
      border: 1px solid #ebeef5;
      border-radius: 4px;
      height: 450px;
      overflow-y: auto;

      .tree-header {
        padding: 10px;
        border-bottom: 1px solid #ebeef5;
        font-weight: bold;
        background-color: #f5f7fa;
      }

      .el-tree {
        padding: 10px;
      }
    }

    .user-list {
      .list-header {
        margin-bottom: 15px;
      }
    }
  }

  .permission-selector {
    max-height: 500px;
    overflow-y: auto;
  }
}
</style>
