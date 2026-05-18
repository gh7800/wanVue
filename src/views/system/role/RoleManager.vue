<template>
  <div class="role-manager">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.name" placeholder="请输入角色名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <el-card class="table-card">
      <div class="table-header">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增角色</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleBatchDelete" :disabled="selectedRows.length === 0">批量删除</el-button>
      </div>

      <!-- 角色列表 -->
      <el-table
        :data="roleList"
        stripe
        border
        v-loading="loading"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="角色名称" min-width="150"></el-table-column>
        <el-table-column prop="code" label="角色编码" width="180"></el-table-column>
        <el-table-column prop="description" label="描述" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.description || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="level" label="等级" width="80">
          <template slot-scope="scope">
            {{ scope.row.level || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="users_count" label="成员数" width="100">
          <template slot-scope="scope">
            <el-tag size="mini">{{ scope.row.users ? scope.row.users.length : 0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="permissions_count" label="权限数" width="100">
          <template slot-scope="scope">
            <el-tag size="mini" type="success">{{ scope.row.permissions ? scope.row.permissions.length : 0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <el-button-group size="mini">
              <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)" title="编辑"></el-button>
              <el-button type="success" icon="el-icon-user" @click="handleManageUsers(scope.row)" title="成员"></el-button>
              <el-button type="warning" icon="el-icon-key" @click="handleManagePermissions(scope.row)" title="权限"></el-button>
              <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)" title="删除"></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入角色编码" :disabled="!!form.uuid"></el-input>
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-input-number v-model="form.level" :min="1" :max="99" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 成员管理对话框 -->
    <el-dialog title="成员管理" :visible.sync="userDialogVisible" width="700px">
      <div class="user-manage-header">
        <el-select v-model="selectedUser" filterable placeholder="请选择用户" style="width: 300px">
          <el-option
            v-for="user in availableUsers"
            :key="user.uuid"
            :label="user.real_name || user.username"
            :value="user.uuid">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" @click="handleAddUser" :disabled="!selectedUser">添加成员</el-button>
      </div>
      <el-table :data="currentRoleUsers" stripe border style="margin-top: 20px">
        <el-table-column prop="real_name" label="姓名" min-width="120">
          <template slot-scope="scope">
            {{ scope.row.real_name || scope.row.username }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" min-width="120"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="130"></el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleRemoveUser(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 权限管理对话框 -->
    <el-dialog title="权限管理" :visible.sync="permissionDialogVisible" width="600px">
      <div class="permission-manage-header">
        <el-select v-model="selectedPermission" placeholder="请选择权限" style="width: 300px">
          <el-option
            v-for="perm in availablePermissions"
            :key="perm.code"
            :label="perm.name"
            :value="perm.code">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" @click="handleAddPermission" :disabled="!selectedPermission">添加权限</el-button>
      </div>
      <el-table :data="currentRolePermissions" stripe border style="margin-top: 20px">
        <el-table-column prop="name" label="权限名称" min-width="150"></el-table-column>
        <el-table-column prop="code" label="权限编码" min-width="200"></el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleRemovePermission(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  addRole,
  updateRole,
  deleteRole,
  addRoleUser,
  removeRoleUser,
  addRolePermission,
  removeRolePermission
} from '@/api/role'
import { getUserList } from '@/api/userManager'

export default {
  name: 'RoleManager',
  data() {
    return {
      loading: false,
      submitLoading: false,
      selectedRows: [],
      roleList: [],
      allRoles: [],
      userList: [],
      searchForm: {
        name: ''
      },
      dialogVisible: false,
      dialogTitle: '新增角色',
      form: {
        uuid: null,
        name: '',
        code: '',
        level: 1,
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请输入等级', trigger: 'blur' }
        ]
      },
      // 成员管理
      userDialogVisible: false,
      currentRole: null,
      selectedUser: '',
      currentRoleUsers: [],
      // 权限管理
      permissionDialogVisible: false,
      selectedPermission: '',
      currentRolePermissions: [],
      // 权限列表（预定义）
      allPermissions: [
        { code: 'organization_admin', name: '组织管理员' },
        { code: 'user_manage', name: '用户管理' },
        { code: 'role_manage', name: '角色管理' },
        { code: 'department_manage', name: '部门管理' },
        { code: 'document_manage', name: '公文管理' },
        { code: 'car_manage', name: '用车管理' },
        { code: 'meeting_manage', name: '会议管理' },
        { code: 'notice_manage', name: '通知管理' },
        { code: 'asset_manage', name: '资产管理' },
        { code: 'seal_manage', name: '用章管理' },
        { code: 'supervise_manage', name: '督办管理' }
      ]
    }
  },
  computed: {
    // 可添加的用户（排除已在角色中的用户）
    availableUsers() {
      if (!this.currentRole || !this.currentRole.users) {
        return this.userList
      }
      const currentUserUuids = this.currentRole.users.map(u => u.uuid)
      return this.userList.filter(user => !currentUserUuids.includes(user.uuid))
    },
    // 可添加的权限（排除已在角色中的权限）
    availablePermissions() {
      if (!this.currentRole || !this.currentRole.permissions) {
        return this.allPermissions
      }
      const currentPermCodes = this.currentRole.permissions.map(p => p.code)
      return this.allPermissions.filter(perm => !currentPermCodes.includes(perm.code))
    }
  },
  created() {
    this.fetchRoleList()
    this.fetchUserList()
  },
  methods: {
    // 获取角色列表
    async fetchRoleList() {
      this.loading = true
      try {
        const res = await getRoleList()
        this.allRoles = res.data || []
        this.handleSearch()
      } catch (error) {
        console.error('获取角色列表失败:', error)
        this.$message.error('获取角色列表失败')
      } finally {
        this.loading = false
      }
    },
    // 获取用户列表
    async fetchUserList() {
      try {
        const res = await getUserList({ page: 1, size: 999 })
        this.userList = res.data || []
      } catch (error) {
        console.error('获取用户列表失败:', error)
      }
    },
    // 搜索
    handleSearch() {
      if (this.searchForm.name) {
        this.roleList = this.allRoles.filter(role => 
          role.name && role.name.toLowerCase().includes(this.searchForm.name.toLowerCase())
        )
      } else {
        this.roleList = [...this.allRoles]
      }
    },
    // 重置
    handleReset() {
      this.searchForm.name = ''
      this.handleSearch()
    },
    // 选择变化
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    // 新增
    handleAdd() {
      this.dialogTitle = '新增角色'
      this.form = {
        uuid: null,
        name: '',
        code: '',
        level: 1,
        description: ''
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },
    // 编辑
    handleEdit(row) {
      this.dialogTitle = '编辑角色'
      this.form = {
        uuid: row.uuid,
        name: row.name,
        code: row.code,
        level: row.level || 1,
        description: row.description || ''
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm(`确定要删除角色 "${row.name}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteRole(row.uuid)
          this.$message.success('删除成功')
          this.fetchRoleList()
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    // 批量删除
    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要删除的角色')
        return
      }
      this.$confirm(`确定要删除选中的 ${this.selectedRows.length} 个角色吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const promises = this.selectedRows.map(row => deleteRole(row.uuid))
          await Promise.all(promises)
          this.$message.success('批量删除成功')
          this.fetchRoleList()
        } catch (error) {
          this.$message.error('批量删除失败')
        }
      }).catch(() => {})
    },
    // 提交
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.submitLoading = true
          try {
            const data = { ...this.form }
            delete data.uuid
            // 确保角色编码以 role_ 开头
            if (!data.code.startsWith('role_')) {
              data.code = 'role_' + data.code
            }
            if (this.form.uuid) {
              await updateRole(this.form.uuid, data)
              this.$message.success('编辑成功')
            } else {
              await addRole(data)
              this.$message.success('新增成功')
            }
            this.dialogVisible = false
            this.fetchRoleList()
          } catch (error) {
            this.$message.error(this.form.uuid ? '编辑失败' : '新增失败')
          } finally {
            this.submitLoading = false
          }
        }
      })
    },
    // 打开成员管理
    handleManageUsers(row) {
      this.currentRole = row
      this.currentRoleUsers = row.users || []
      this.selectedUser = ''
      this.userDialogVisible = true
    },
    // 添加成员
    async handleAddUser() {
      if (!this.selectedUser || !this.currentRole) return
      try {
        await addRoleUser(this.currentRole.uuid, { user_uuid: this.selectedUser })
        this.$message.success('添加成员成功')
        this.selectedUser = ''
        this.fetchRoleList()
        // 刷新当前角色的成员列表
        const role = this.allRoles.find(r => r.uuid === this.currentRole.uuid)
        if (role) {
          this.currentRole = role
          this.currentRoleUsers = role.users || []
        }
      } catch (error) {
        this.$message.error('添加成员失败')
      }
    },
    // 移除成员
    async handleRemoveUser(user) {
      try {
        await removeRoleUser(this.currentRole.uuid, user.uuid)
        this.$message.success('移除成员成功')
        this.fetchRoleList()
        // 刷新当前角色的成员列表
        const role = this.allRoles.find(r => r.uuid === this.currentRole.uuid)
        if (role) {
          this.currentRole = role
          this.currentRoleUsers = role.users || []
        }
      } catch (error) {
        this.$message.error('移除成员失败')
      }
    },
    // 打开权限管理
    handleManagePermissions(row) {
      this.currentRole = row
      this.currentRolePermissions = row.permissions || []
      this.selectedPermission = ''
      this.permissionDialogVisible = true
    },
    // 添加权限
    async handleAddPermission() {
      if (!this.selectedPermission || !this.currentRole) return
      try {
        await addRolePermission(this.currentRole.uuid, { permission_code: this.selectedPermission })
        this.$message.success('添加权限成功')
        this.selectedPermission = ''
        this.fetchRoleList()
        // 刷新当前角色的权限列表
        const role = this.allRoles.find(r => r.uuid === this.currentRole.uuid)
        if (role) {
          this.currentRole = role
          this.currentRolePermissions = role.permissions || []
        }
      } catch (error) {
        this.$message.error('添加权限失败')
      }
    },
    // 移除权限
    async handleRemovePermission(permission) {
      try {
        await removeRolePermission(this.currentRole.uuid, permission.code)
        this.$message.success('移除权限成功')
        this.fetchRoleList()
        // 刷新当前角色的权限列表
        const role = this.allRoles.find(r => r.uuid === this.currentRole.uuid)
        if (role) {
          this.currentRole = role
          this.currentRolePermissions = role.permissions || []
        }
      } catch (error) {
        this.$message.error('移除权限失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.role-manager {
  padding: 20px;

  .search-card {
    margin-bottom: 20px;

    .search-form {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }

  .table-card {
    .table-header {
      margin-bottom: 20px;
    }
  }

  .user-manage-header,
  .permission-manage-header {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .el-button-group {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    height: 32px;
    
    .el-button {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 56px;
      margin: 0;
      padding: 0;
    }
  }
}
</style>
