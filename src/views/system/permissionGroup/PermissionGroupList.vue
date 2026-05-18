<template>
  <div class="permission-group-list">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="群组名称">
          <el-input v-model="searchForm.name" placeholder="请输入群组名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="群组类型">
          <el-select v-model="searchForm.type" placeholder="请选择群组类型" clearable style="width: 150px">
            <el-option label="人员" value="user"></el-option>
            <el-option label="权限" value="permission"></el-option>
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
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增权限群组</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleBatchDelete" :disabled="selectedRows.length === 0">批量删除</el-button>
      </div>

      <!-- 权限群组列表 -->
      <el-table
        :data="groupList"
        stripe
        border
        v-loading="loading"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="群组名称" min-width="150"></el-table-column>
        <el-table-column prop="code" label="群组编码" min-width="180"></el-table-column>
        <el-table-column prop="type" label="群组类型" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.type === 'user' ? 'primary' : 'success'" size="mini">
              {{ scope.row.type === 'user' ? '人员' : '权限' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="等级" width="80"></el-table-column>
        <el-table-column prop="users" label="成员数" width="100">
          <template slot-scope="scope">
            <el-tag size="mini">{{ scope.row.users ? scope.row.users.length : 0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="permissions" label="权限数" width="100">
          <template slot-scope="scope">
            <el-tag size="mini" type="success">{{ scope.row.permissions ? scope.row.permissions.length : 0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template slot-scope="scope">
            {{ formatTime(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button-group size="mini">
              <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)" title="编辑"></el-button>
              <el-button type="info" icon="el-icon-view" @click="handleDetail(scope.row)" title="详情"></el-button>
              <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)" title="删除"></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getPermissionGroupList,
  deletePermissionGroup,
  batchDeletePermissionGroup
} from '@/api/permissionGroup'

export default {
  name: 'PermissionGroupList',
  data() {
    return {
      loading: false,
      selectedRows: [],
      groupList: [],
      searchForm: {
        name: '',
        type: ''
      },
      pagination: {
        page: 1,
        size: 10,
        total: 0
      }
    }
  },
  created() {
    this.fetchGroupList()
  },
  methods: {
    // 获取权限群组列表
    async fetchGroupList() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          size: this.pagination.size
        }
        // 只添加非空的查询参数
        if (this.searchForm.name) {
          params.name = this.searchForm.name
        }
        if (this.searchForm.type) {
          params.type = this.searchForm.type
        }
        const res = await getPermissionGroupList(params)
        this.groupList = res.data || []
        this.pagination.total = res.total || this.groupList.length
      } catch (error) {
        console.error('获取权限群组列表失败:', error)
        this.$message.error('获取权限群组列表失败')
      } finally {
        this.loading = false
      }
    },
    // 格式化时间
    formatTime(time) {
      return time || '-'
    },
    // 搜索
    handleSearch() {
      this.pagination.page = 1
      this.fetchGroupList()
    },
    // 重置
    handleReset() {
      this.searchForm = {
        name: '',
        type: ''
      }
      this.pagination.page = 1
      this.fetchGroupList()
    },
    // 选择变化
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    // 分页大小变化
    handleSizeChange(val) {
      this.pagination.size = val
      this.fetchGroupList()
    },
    // 页码变化
    handleCurrentChange(val) {
      this.pagination.page = val
      this.fetchGroupList()
    },
    // 新增
    handleAdd() {
      this.$router.push('/permissionGroup/add')
    },
    // 编辑
    handleEdit(row) {
      this.$router.push(`/permissionGroup/edit/${row.uuid}`)
    },
    // 详情
    handleDetail(row) {
      this.$router.push(`/permissionGroup/detail/${row.uuid}`)
    },
    // 删除
    handleDelete(row) {
      this.$confirm(`确定要删除权限群组 "${row.name}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deletePermissionGroup(row.uuid)
          this.$message.success('删除成功')
          this.fetchGroupList()
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    // 批量删除
    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要删除的权限群组')
        return
      }
      this.$confirm(`确定要删除选中的 ${this.selectedRows.length} 个权限群组吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const uuids = this.selectedRows.map(row => row.uuid)
          await batchDeletePermissionGroup(uuids)
          this.$message.success('批量删除成功')
          this.fetchGroupList()
        } catch (error) {
          this.$message.error('批量删除失败')
        }
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.permission-group-list {
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
      width: 60px;
      margin: 0;
      padding: 0;
    }
  }
}
</style>
