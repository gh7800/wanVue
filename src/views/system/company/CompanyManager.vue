<template>
  <div class="company-manager">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="公司名称">
          <el-input v-model="searchForm.name" placeholder="请输入公司名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="在用" :value="1"></el-option>
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
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增公司</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleBatchDelete" :disabled="selectedRows.length === 0">批量删除</el-button>
      </div>

      <!-- 公司列表 -->
      <el-table
        :data="filteredCompanyList"
        stripe
        border
        v-loading="loading"
        row-key="uuid"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="公司名称" min-width="200" tree-key="uuid">
          <template slot-scope="scope">
            <div class="company-name-cell">
              <i class="el-icon-office-building" style="margin-right: 8px; color: #409EFF;"></i>
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="parent_name" label="上级公司" width="180">
          <template slot-scope="scope">
            {{ getParentCompanyName(scope.row) || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '在用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="success" icon="el-icon-plus" @click="handleAddChild(scope.row)">添加子公司</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="550px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入公司名称" maxlength="255" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="上级公司" prop="parent_id">
          <el-cascader
            v-model="form.parent_id"
            :options="companyTreeOptions"
            :props="{ value: 'uuid', label: 'name', children: 'children', checkStrictly: true, emitPath: false }"
            placeholder="请选择上级公司（不选则为顶级公司）"
            style="width: 100%"
            clearable
            :disabled="isEdit && form.uuid === form.parent_id">
          </el-cascader>
        </el-form-item>
        <el-form-item label="公司Logo" prop="logo">
          <el-input v-model="form.logo" placeholder="请输入公司Logo URL" maxlength="500" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="9999" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">在用</el-radio>
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
import { mapState, mapActions } from 'vuex'

export default {
  name: 'CompanyManager',
  data() {
    return {
      submitLoading: false,
      selectedRows: [],
      dialogVisible: false,
      dialogTitle: '新增公司',
      isEdit: false,
      form: {
        uuid: null,
        name: '',
        parent_id: null,
        logo: '',
        sort: 0,
        status: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' },
          { min: 2, max: 255, message: '长度在 2 到 255 个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序值', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('company', ['companyTree', 'loading', 'searchForm']),
    // 过滤后的公司列表
    filteredCompanyList() {
      if (!this.companyTree) return []
      return this.filterCompanyTree(this.companyTree)
    },
    // 公司树选项（用于级联选择器，排除当前编辑的公司及其子级）
    companyTreeOptions() {
      if (!this.companyTree) return []
      // 如果是编辑模式，需要过滤掉当前公司及其子级
      if (this.isEdit && this.form.uuid) {
        return this.filterOptionsForEdit(this.companyTree, this.form.uuid)
      }
      return this.companyTree
    }
  },
  created() {
    this.fetchCompanyTree()
  },
  methods: {
    ...mapActions('company', ['fetchCompanyTree', 'createCompany', 'updateCompany', 'deleteCompany']),

    // 递归过滤公司树（根据搜索条件）
    filterCompanyTree(tree) {
      if (!tree || tree.length === 0) return []

      const result = []
      for (const item of tree) {
        const matchName = !this.searchForm.name || item.name.toLowerCase().includes(this.searchForm.name.toLowerCase())
        const matchStatus = this.searchForm.status === '' || this.searchForm.status === null || item.status === this.searchForm.status

        // 递归过滤子级
        const filteredChildren = this.filterCompanyTree(item.children)

        if ((matchName && matchStatus) || filteredChildren.length > 0) {
          result.push({
            ...item,
            children: filteredChildren
          })
        }
      }
      return result
    },

    // 过滤选项（编辑时排除当前公司及其子级）
    filterOptionsForEdit(tree, excludeUuid) {
      if (!tree || tree.length === 0) return []

      const result = []
      for (const item of tree) {
        if (item.uuid === excludeUuid) continue

        const filteredChildren = this.filterOptionsForEdit(item.children, excludeUuid)
        result.push({
          ...item,
          children: filteredChildren
        })
      }
      return result
    },

    // 获取上级公司名称
    getParentCompanyName(row) {
      if (!row.parent_id) return null
      const parent = this.findCompanyByUuid(this.companyTree, row.parent_id)
      return parent ? parent.name : null
    },

    // 递归查找公司
    findCompanyByUuid(tree, uuid) {
      if (!tree) return null
      for (const item of tree) {
        if (item.uuid === uuid) return item
        if (item.children) {
          const found = this.findCompanyByUuid(item.children, uuid)
          if (found) return found
        }
      }
      return null
    },

    // 搜索
    handleSearch() {
      // 搜索逻辑在 computed 中处理
    },

    // 重置
    handleReset() {
      this.$store.commit('company/RESET_SEARCH_FORM')
    },

    // 选择变化
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },

    // 新增
    handleAdd() {
      this.dialogTitle = '新增公司'
      this.isEdit = false
      this.form = {
        uuid: null,
        name: '',
        parent_id: null,
        logo: '',
        sort: 0,
        status: 1
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },

    // 添加子公司
    handleAddChild(row) {
      this.dialogTitle = '添加子公司'
      this.isEdit = false
      this.form = {
        uuid: null,
        name: '',
        parent_id: row.uuid,
        logo: '',
        sort: 0,
        status: 1
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },

    // 编辑
    handleEdit(row) {
      this.dialogTitle = '编辑公司'
      this.isEdit = true
      this.form = {
        uuid: row.uuid,
        name: row.name,
        parent_id: row.parent_id,
        logo: row.logo || '',
        sort: row.sort || 0,
        status: row.status
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },

    // 删除
    handleDelete(row) {
      this.$confirm(`确定要删除公司 "${row.name}" 吗？删除后将同时删除其所有子公司！`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.deleteCompany(row.uuid)
        if (res.success) {
          this.$message.success('删除成功')
        } else {
          this.$message.error(res.message || '删除失败')
        }
      }).catch(() => {})
    },

    // 批量删除
    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要删除的公司')
        return
      }
      this.$confirm(`确定要删除选中的 ${this.selectedRows.length} 个公司吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let successCount = 0
        let failCount = 0
        for (const row of this.selectedRows) {
          const res = await this.deleteCompany(row.uuid)
          if (res.success) {
            successCount++
          } else {
            failCount++
          }
        }
        if (successCount > 0) {
          this.$message.success(`成功删除 ${successCount} 个公司`)
        }
        if (failCount > 0) {
          this.$message.error(`${failCount} 个公司删除失败`)
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
              parent_id: this.form.parent_id || null,
              logo: this.form.logo || undefined,
              sort: this.form.sort,
              status: this.form.status
            }

            let res
            if (this.isEdit) {
              res = await this.updateCompany({ uuid: this.form.uuid, data })
            } else {
              res = await this.createCompany(data)
            }

            if (res.success) {
              this.$message.success(this.isEdit ? '编辑成功' : '新增成功')
              this.dialogVisible = false
            } else {
              this.$message.error(res.message || (this.isEdit ? '编辑失败' : '新增失败'))
            }
          } catch (error) {
            this.$message.error(this.isEdit ? '编辑失败' : '新增失败')
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
.company-manager {
  padding: 20px;

  .search-card {
    margin-bottom: 20px;
  }

  .table-card {
    .table-header {
      margin-bottom: 20px;
    }
  }

  .company-name-cell {
    display: flex;
    align-items: center;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
