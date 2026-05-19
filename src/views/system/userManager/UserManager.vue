<template>
  <div class="user-manager">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="searchForm.real_name" placeholder="请输入真实姓名" clearable></el-input>
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
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增用户</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleBatchDelete" :disabled="selectedRows.length === 0">批量删除</el-button>
      </div>

      <!-- 用户列表 -->
      <el-table
        :data="userList"
        stripe
        border
        v-loading="loading"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名" width="120"></el-table-column>
        <el-table-column prop="real_name" label="真实姓名" width="120"></el-table-column>
        <el-table-column prop="company.name" label="公司" width="150"></el-table-column>
        <el-table-column prop="department.name" label="部门" width="120"></el-table-column>
        <el-table-column prop="role.name" label="角色" width="120"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="130"></el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="180"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.current"
          :page-sizes="[15, 30, 100, 500]"
          :page-size="page.per_page"
          layout="sizes, prev, pager, next, jumper, total"
          :total="page.total">
        </el-pagination>
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="550px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!form.uuid">
          <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="real_name">
          <el-input v-model="form.real_name" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="公司" prop="company_uuid">
          <el-select v-model="form.company_uuid" placeholder="请选择公司" @change="handleCompanyChange" style="width: 100%">
            <el-option
              v-for="item in companyList"
              :key="item.uuid"
              :label="item.name"
              :value="item.uuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="dept_uuid">
          <el-cascader
            v-model="form.dept_uuid"
            :options="departmentList"
            :props="{ value: 'uuid', label: 'name', children: 'children', checkStrictly: true }"
            placeholder="请选择部门"
            style="width: 100%"
            clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="角色" prop="role_uuid">
          <el-select v-model="form.role_uuid" placeholder="请选择角色" style="width: 100%">
            <el-option
              v-for="item in roleList"
              :key="item.uuid"
              :label="item.name"
              :value="item.uuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { PAGINATION } from '../../../config/constants'

export default {
  name: 'UserManager',
  data() {
    return {
      selectedRows: [],
      dialogVisible: false,
      dialogTitle: '新增用户',
      submitLoading: false,
      originalForm: {},
      // 分页配置常量
      pageSizes: PAGINATION.PAGE_SIZES,
      form: {
        uuid: null,
        username: '',
        password: '',
        real_name: '',
        company_uuid: '',
        dept_uuid: '',
        role_uuid: '',
        phone: '',
        email: '',
        status: 1
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        real_name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        company_uuid: [
          { required: true, message: '请选择公司', trigger: 'change' }
        ],
        dept_uuid: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        role_uuid: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        phone: [
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('userManager', ['userList', 'loading', 'page', 'searchForm', 'companyList', 'departmentList', 'roleList'])
  },
  created() {
    this.fetchUserList()
    this.fetchCompanyList()
    this.fetchRoleList()
  },
  methods: {
    ...mapActions('userManager', [
      'fetchUserList',
      'addUser',
      'updateUser',
      'deleteUser',
      'batchDeleteUser',
      'updateSearchForm',
      'resetSearch',
      'updatePage',
      'fetchCompanyList',
      'fetchDepartmentTree',
      'fetchRoleList'
    ]),

    // 搜索
    handleSearch() {
      this.updateSearchForm({
        username: this.searchForm.username,
        real_name: this.searchForm.real_name
      })
    },

    // 重置
    handleReset() {
      this.resetSearch()
    },

    // 分页大小变化
    handleSizeChange(val) {
      this.updatePage({ per_page: val })
    },

    // 页码变化
    handleCurrentChange(val) {
      this.updatePage({ current: val })
    },

    // 选择行变化
    handleSelectionChange(val) {
      this.selectedRows = val
    },

    // 新增用户
    handleAdd() {
      this.dialogTitle = '新增用户'
      this.form = {
        uuid: null,
        username: '',
        password: '',
        real_name: '',
        company_uuid: '',
        dept_uuid: '',
        role_uuid: '',
        phone: '',
        email: '',
        status: 1
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },

    // 公司选择变化
    handleCompanyChange(companyUuid) {
      this.form.dept_uuid = ''
      this.fetchDepartmentTree(companyUuid)
    },

    // 编辑用户
    handleEdit(row) {
      this.dialogTitle = '编辑用户'
      this.originalForm = { ...row }
      this.form = {
        uuid: row.uuid,
        username: row.username,
        real_name: row.real_name,
        company_uuid: row.company_uuid || '',
        dept_uuid: row.dept_uuid || '',
        role_uuid: row.role_uuid || '',
        phone: row.phone,
        email: row.email,
        status: row.status
      }
      // 加载部门列表
      if (this.form.company_uuid) {
        this.fetchDepartmentTree(this.form.company_uuid)
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },

    // 删除用户（二次确认）
    handleDelete(row) {
      this.$confirm(`确定删除用户 "${row.username}" 吗？删除后无法恢复！`, '删除确认', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        // 第二次确认
        this.$confirm(`请再次确认：是否删除用户 "${row.username}"？`, '最终确认', {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'danger',
          center: true
        }).then(async () => {
          const res = await this.deleteUser(row.uuid)
          if (res.success) {
            this.$message.success('删除成功')
          } else {
            this.$message.error(res.message || '删除失败')
          }
        }).catch(() => {})
      }).catch(() => {})
    },

    // 批量删除（二次确认）
    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要删除的用户')
        return
      }
      const uuids = this.selectedRows.map(row => row.uuid)
      this.$confirm(`确定删除选中的 ${this.selectedRows.length} 个用户吗？删除后无法恢复！`, '二次确认', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        // 第二次确认
        this.$confirm(`请再次确认：是否删除这 ${this.selectedRows.length} 个用户？`, '最终确认', {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'danger',
          center: true
        }).then(async () => {
          const res = await this.batchDeleteUser(uuids)
          if (res.success) {
            this.$message.success('批量删除成功')
          } else {
            this.$message.error(res.message || '批量删除失败')
          }
        }).catch(() => {})
      }).catch(() => {})
    },

    // 提交表单
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        this.submitLoading = true
        try {
          let res
          if (this.form.uuid) {
            // 编辑：只传改动的字段
            const data = {}
            const fields = ['username', 'real_name', 'phone', 'email', 'status']
            fields.forEach(field => {
              if (this.form[field] !== this.originalForm[field]) {
                data[field] = this.form[field]
              }
            })
            res = await this.updateUser({ uuid: this.form.uuid, data })
          } else {
            // 新增：传所有字段
            res = await this.addUser(this.form)
          }
          if (res.success) {
            this.$message.success(this.form.uuid ? '更新成功' : '新增成功')
            this.dialogVisible = false
          } else {
            this.$message.error(res.message || '操作失败')
          }
        } catch (error) {
          this.$message.error('操作失败')
        } finally {
          this.submitLoading = false
        }
      })
    }
  }
}
</script>

<style scoped>
.user-manager {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 75px);
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.table-card {
  margin-bottom: 20px;
}

.table-header {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.dialog-footer {
  text-align: right;
}
</style>
