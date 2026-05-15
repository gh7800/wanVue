<template>
  <div class="plate-manager">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="车牌号">
          <el-input v-model="searchForm.plate_number" placeholder="请输入车牌号" clearable></el-input>
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
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增车牌</el-button>
      </div>

      <!-- 车牌列表 -->
      <el-table
        :data="plateList"
        stripe
        border
        v-loading="loading"
        style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="plate_number" label="车牌号" min-width="150"></el-table-column>
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
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total">
        </el-pagination>
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="车牌号" prop="plate_number">
          <el-input v-model="form.plate_number" placeholder="请输入车牌号"></el-input>
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
import { getPlateList, addPlate, updatePlate, deletePlate } from '../../api/car'

export default {
  name: 'PlateManager',
  data() {
    return {
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      dialogTitle: '新增车牌',
      searchForm: {
        plate_number: ''
      },
      plateList: [],
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      form: {
        uuid: null,
        plate_number: ''
      },
      rules: {
        plate_number: [
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          { min: 7, max: 8, message: '车牌号长度在 7 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchPlateList()
  },
  methods: {
    // 获取车牌列表
    async fetchPlateList() {
      this.loading = true
      try {
        const params = {
          page: this.page.current,
          size: this.page.size,
          plate_number: this.searchForm.plate_number
        }
        const res = await getPlateList(params)
        if (res.data) {
          this.plateList = res.data || []
          this.page.total = res.data ? res.data.length : 0
        }
      } catch (error) {
        this.$message.error('获取车牌列表失败')
      } finally {
        this.loading = false
      }
    },
    // 查询
    handleSearch() {
      this.page.current = 1
      this.fetchPlateList()
    },
    // 重置
    handleReset() {
      this.searchForm.plate_number = ''
      this.page.current = 1
      this.fetchPlateList()
    },
    // 新增
    handleAdd() {
      this.dialogTitle = '新增车牌'
      this.form = {
        uuid: null,
        plate_number: ''
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },
    // 编辑
    handleEdit(row) {
      this.dialogTitle = '编辑车牌'
      this.form = {
        uuid: row.uuid,
        plate_number: row.plate_number
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('确认删除该车牌吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deletePlate(row.uuid)
          this.$message.success('删除成功')
          this.fetchPlateList()
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    // 提交
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.submitLoading = true
          try {
            if (this.form.uuid) {
              await updatePlate(this.form.uuid, { plate_number: this.form.plate_number })
              this.$message.success('编辑成功')
            } else {
              await addPlate({ plate_number: this.form.plate_number })
              this.$message.success('新增成功')
            }
            this.dialogVisible = false
            this.fetchPlateList()
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
      this.fetchPlateList()
    },
    // 页码变化
    handleCurrentChange(val) {
      this.page.current = val
      this.fetchPlateList()
    }
  }
}
</script>

<style lang="scss" scoped>
.plate-manager {
  padding: 20px;

  .search-card {
    margin-bottom: 20px;
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
