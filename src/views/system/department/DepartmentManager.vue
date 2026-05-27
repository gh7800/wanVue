<template>
  <div class="department-manager">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="公司">
          <el-select v-model="activeCompany" placeholder="请选择公司" clearable style="width: 150px" @change="handleCompanyChange">
            <el-option label="全部公司" value=""></el-option>
            <el-option
              v-for="company in companyList"
              :key="company.uuid"
              :label="company.name"
              :value="company.uuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称">
          <el-input v-model="searchForm.name" placeholder="请输入部门名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
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
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增部门</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleBatchDelete" :disabled="selectedRows.length === 0">批量删除</el-button>
      </div>

      <!-- 部门列表 -->
      <el-table
        :data="departmentList"
        stripe
        border
        v-loading="loading"
        row-key="uuid"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="部门名称" min-width="150"></el-table-column>
        <el-table-column prop="parent_name" label="上级部门" width="150">
          <template slot-scope="scope">
            {{ getParentDepartmentName(scope.row) || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="leader_id" label="负责人" width="120">
          <template slot-scope="scope">
            {{ scope.row.leader && scope.row.leader.real_name || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <!-- <el-button size="mini" type="success" icon="el-icon-plus" @click="handleAddChild(scope.row)">添加子部门</el-button> -->
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container" v-if="!isTreeView">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.current"
          :page-sizes="[15, 30, 100, 500]"
          :page-size="page.size"
          layout="sizes, prev, pager, next, jumper, total"
          :total="page.total">
        </el-pagination>
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="550px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="上级部门" prop="parent_id">
          <el-cascader
            v-model="form.parent_id"
            :options="departmentTree"
            :props="{ value: 'uuid', label: 'name', children: 'children', checkStrictly: true, emitPath: false }"
            placeholder="请选择上级部门"
            style="width: 100%"
            clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="负责人" prop="leader_id">
          <el-select v-model="form.leader_id" placeholder="请选择负责人" style="width: 100%" clearable>
            <el-option
              v-for="item in userList"
              :key="item.uuid"
              :label="item.real_name || item.username"
              :value="item.uuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注"></el-input>
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
  getDepartmentTree,
  addDepartment,
  getDepartmentDetail,
  updateDepartment,
  deleteDepartment
} from '@/api/department'
import { getUserList, getCompanyList } from '@/api/userManager'

export default {
  name: 'DepartmentManager',
  data() {
    return {
      loading: false,
      submitLoading: false,
      isTreeView: true,
      activeCompany: '',
      selectedRows: [],
      departmentList: [],
      departmentTree: [],
      userList: [],
      companyList: [],
      searchForm: {
        name: '',
        status: null,
        company_uuid: ''
      },
      page: {
        current: 1,
        per_page: 10,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '新增部门',
      form: {
        uuid: null,
        name: '',
        parent_id: '',
        leader_id: '',
        sort: 0,
        status: 1,
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        leader_id: [
          { validator: this.validateLeader, trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchCompanyList()
    this.fetchDepartmentTree()
    this.fetchUserList()
  },
  methods: {
    // 获取公司列表
    async fetchCompanyList() {
      try {
        const res = await getCompanyList()
        this.companyList = res.data || []
      } catch (error) {
        console.error('获取公司列表失败:', error)
      }
    },
    // 获取部门树形列表
    async fetchDepartmentTree() {
      this.loading = true
      try {
        const params = {
          ...this.searchForm,
          company_uuid: this.activeCompany || undefined
        }
        const res = await getDepartmentTree(params)
        this.departmentList = res.data || []
        // 如果返回的数据中已经包含顶级部门，则直接使用
        if (this.departmentList.length > 0 && this.departmentList[0].parent_id === null) {
          this.departmentTree = this.departmentList
        } else {
          // 否则添加一个虚拟的顶级部门节点
          this.departmentTree = [{ uuid: '', name: '顶级部门', children: res.data || [] }]
        }
      } catch (error) {
        console.error('获取部门列表失败:', error)
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
    // 公司切换
    handleCompanyChange() {
      this.fetchDepartmentTree()
    },
    // 搜索
    handleSearch() {
      this.fetchDepartmentTree()
    },
    // 重置
    handleReset() {
      this.searchForm = {
        name: '',
        status: null,
        company_uuid: ''
      }
      this.activeCompany = ''
      this.fetchDepartmentTree()
    },
    // 选择变化
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    // 新增
    handleAdd() {
      this.dialogTitle = '新增部门'
      this.form = {
        uuid: null,
        name: '',
        parent_id: '',
        leader_id: '',
        sort: 0,
        status: 1,
        remark: ''
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },
    // 添加子部门
    handleAddChild(row) {
      this.dialogTitle = '添加子部门'
      this.form = {
        uuid: null,
        name: '',
        parent_id: row.uuid,
        leader_id: '',
        sort: 0,
        status: 1,
        remark: ''
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },
    // 编辑
    async handleEdit(row) {
      this.dialogTitle = '编辑部门'
      try {
        const res = await getDepartmentDetail(row.uuid)
        const data = res.data
        this.form = {
          uuid: data.uuid,
          name: data.name,
          parent_id: data.parent_id || '',
          leader_id: data.leader_uuid || '',
          sort: data.sort || 0,
          status: data.status,
          remark: data.remark || ''
        }
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.form && this.$refs.form.clearValidate()
        })
      } catch (error) {
        this.$message.error('获取部门详情失败')
      }
    },
    // 删除
    handleDelete(row) {
      this.$confirm(`确定要删除部门 "${row.name}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteDepartment(row.uuid)
          this.$message.success('删除成功')
          this.fetchDepartmentTree()
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    // 批量删除
    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要删除的部门')
        return
      }
      this.$confirm(`确定要删除选中的 ${this.selectedRows.length} 个部门吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const promises = this.selectedRows.map(row => deleteDepartment(row.uuid))
          await Promise.all(promises)
          this.$message.success('批量删除成功')
          this.fetchDepartmentTree()
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
            // 如果选择的是虚拟顶级部门(uuid为空字符串)，则设置为null
            if (data.parent_id === '' || data.parent_id === null) {
              data.parent_id = null
            }
            if (!data.leader_id) {
              delete data.leader_id
            }
            if (this.form.uuid) {
              await updateDepartment(this.form.uuid, data)
              this.$message.success('编辑成功')
            } else {
              await addDepartment(data)
              this.$message.success('新增成功')
            }
            this.dialogVisible = false
            this.fetchDepartmentTree()
          } catch (error) {
            this.$message.error(this.form.uuid ? '编辑失败' : '新增失败')
          } finally {
            this.submitLoading = false
          }
        }
      })
    },
    // 分页大小变化
    handleSizeChange(val) {
      this.page.size = val
      this.fetchDepartmentTree()
    },
    // 页码变化
    handleCurrentChange(val) {
      this.page.current = val
      this.fetchDepartmentTree()
    },
    // 验证负责人
    validateLeader(rule, value, callback) {
      if (value === '') {
        callback()
        return
      }
      const userExists = this.userList.some(user => user.uuid === value)
      if (userExists) {
        callback()
      } else {
        callback(new Error('请选择有效的负责人'))
      }
    },
    // 获取父部门名称
    getParentDepartmentName(row) {
      // 如果有parent_name字段直接返回
      if (row.parent_name) {
        return row.parent_name
      }
      // 如果是顶级部门
      if (!row.parent_id && row.parent_id !== 0) {
        return ''
      }
      // 遍历树形结构查找父部门
      const findParent = (departments, parentId) => {
        for (let dept of departments) {
          if (dept.uuid === parentId) {
            return dept.name
          }
          if (dept.children && dept.children.length > 0) {
            const found = findParent(dept.children, parentId)
            if (found) {
              return found
            }
          }
        }
        return ''
      }
      return findParent(this.departmentList, row.parent_id)
    }
  }
}
</script>

<style lang="scss" scoped>
.department-manager {
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

    .pagination-container {
      margin-top: 20px;
      text-align: right;
    }
  }
}


</style>
