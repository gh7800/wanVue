<template>
  <div class="permission-manager">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="权限名称">
          <el-input v-model="searchForm.name" placeholder="请输入权限名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="权限编码">
          <el-input v-model="searchForm.code" placeholder="请输入权限编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属模块">
          <el-input v-model="searchForm.module" placeholder="请输入所属模块" clearable></el-input>
        </el-form-item>
        <el-form-item label="权限类型">
          <el-select v-model="searchForm.type" placeholder="请选择权限类型" clearable style="width: 150px">
            <el-option label="页面权限" value="page"></el-option>
            <el-option label="功能权限" value="function"></el-option>
          </el-select>
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
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增权限</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleBatchDelete" :disabled="selectedRows.length === 0">批量删除</el-button>
      </div>

      <!-- 权限列表 -->
      <el-table
        :data="permissionList"
        stripe
        border
        v-loading="loading"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="权限名称" min-width="150"></el-table-column>
        <el-table-column prop="code" label="权限编码" min-width="180"></el-table-column>
        <el-table-column prop="module" label="所属模块" min-width="120">
          <template slot-scope="scope">
            {{ scope.row.module || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="权限类型" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.type === 'page' ? 'primary' : 'success'" size="mini">
              {{ scope.row.type === 'page' ? '页面权限' : '功能权限' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.description || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180">
          <template slot-scope="scope">
            {{ formatCreateTime(scope.row) }}
          </template>
        </el-table-column>
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
          :current-page="pagination.page"
          :page-sizes="[15, 30, 100, 500]"
          :page-size="pagination.size"
          layout="sizes, prev, pager, next, jumper, total"
          :total="pagination.total">
        </el-pagination>
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="550px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入权限名称"></el-input>
        </el-form-item>
        <el-form-item label="权限编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入权限编码" :disabled="!!form.uuid"></el-input>
        </el-form-item>
        <el-form-item label="所属模块" prop="module">
          <el-input v-model="form.module" placeholder="请输入所属模块"></el-input>
        </el-form-item>
        <el-form-item label="权限类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择权限类型" style="width: 100%">
            <el-option label="页面权限" value="page"></el-option>
            <el-option label="功能权限" value="function"></el-option>
          </el-select>
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
  </div>
</template>

<script>
import {
  getPermissionList,
  addPermission,
  updatePermission,
  deletePermission,
  batchDeletePermission
} from '@/api/permission'
import { PAGINATION } from '@/config/constants'

export default {
  name: 'PermissionManager',
  data() {
    return {
      loading: false,
      submitLoading: false,
      selectedRows: [],
      permissionList: [],
      allPermissions: [],
      searchForm: {
        name: '',
        code: '',
        module: '',
        type: ''
      },
      pagination: {
        page: 1,
        per_page: 10,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '新增权限',
      form: {
        uuid: null,
        name: '',
        code: '',
        module: '',
        type: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入权限编码', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        module: [
          { required: true, message: '请输入所属模块', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择权限类型', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.fetchPermissionList()
  },
  methods: {
    // 获取权限列表
    async fetchPermissionList() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          size: this.pagination.size,
          flat: 1,
          ...this.searchForm
        }
        const res = await getPermissionList(params)
        this.allPermissions = res.data || []
        this.permissionList = this.allPermissions
        this.pagination.total = res.total || this.allPermissions.length
      } catch (error) {
        console.error('获取权限列表失败:', error)
        this.$message.error('获取权限列表失败')
      } finally {
        this.loading = false
      }
    },
    // 搜索
    handleSearch() {
      this.pagination.page = 1
      this.fetchPermissionList()
    },
    // 重置
    handleReset() {
      this.searchForm = {
        name: '',
        code: '',
        module: '',
        type: ''
      }
      this.pagination.page = 1
      this.fetchPermissionList()
    },
    // 选择变化
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    // 格式化创建时间
    formatCreateTime(row) {
      const time = row.create_time || row.createTime || row.created_at || row.createdAt
      return time || '-'
    },
    // 分页大小变化
    handleSizeChange(val) {
      this.pagination.size = val
      this.fetchPermissionList()
    },
    // 页码变化
    handleCurrentChange(val) {
      this.pagination.page = val
      this.fetchPermissionList()
    },
    // 新增
    handleAdd() {
      this.dialogTitle = '新增权限'
      this.form = {
        uuid: null,
        name: '',
        code: '',
        module: '',
        type: '',
        description: ''
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },
    // 编辑
    handleEdit(row) {
      this.dialogTitle = '编辑权限'
      this.form = {
        uuid: row.uuid,
        name: row.name,
        code: row.code,
        module: row.module || '',
        type: row.type,
        description: row.description || ''
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm(`确定要删除权限 "${row.name}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deletePermission(row.uuid)
          this.$message.success('删除成功')
          this.fetchPermissionList()
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    // 批量删除
    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要删除的权限')
        return
      }
      this.$confirm(`确定要删除选中的 ${this.selectedRows.length} 个权限吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const uuids = this.selectedRows.map(row => row.uuid)
          await batchDeletePermission(uuids)
          this.$message.success('批量删除成功')
          this.fetchPermissionList()
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
            const data = {
              name: this.form.name,
              code: this.form.code,
              module: this.form.module,
              type: this.form.type,
              description: this.form.description
            }
            if (this.form.uuid) {
              await updatePermission(this.form.uuid, data)
              this.$message.success('编辑成功')
            } else {
              await addPermission(data)
              this.$message.success('新增成功')
            }
            this.dialogVisible = false
            this.fetchPermissionList()
          } catch (error) {
            this.$message.error(this.form.uuid ? '编辑失败' : '新增失败')
          } finally {
            this.submitLoading = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.permission-manager {
  padding: 20px;

  .search-card {
    margin-bottom: 20px;
  }

  .search-form {
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .table-card {
    .table-header {
      margin-bottom: 20px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
