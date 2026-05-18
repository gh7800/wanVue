<template>
  <div class="car-manage">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用车类型">
          <el-select v-model="searchForm.car_type" placeholder="请选择用车类型" clearable>
            <el-option label="一般用车" value="general"></el-option>
            <el-option label="业务用车" value="business"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="申请中" value="applying"></el-option>
            <el-option label="已同意" value="approved"></el-option>
            <el-option label="已驳回" value="rejected"></el-option>
            <el-option label="已完成" value="completed"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="searchForm.keyword" placeholder="请输入关键字" clearable></el-input>
        </el-form-item>
        <el-form-item label="公里数状态">
          <el-select v-model="searchForm.mileage_status" placeholder="请选择公里数状态" clearable>
            <el-option label="正常" value="normal"></el-option>
            <el-option label="异常" value="abnormal"></el-option>
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
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">申请用车</el-button>
      </div>

      <!-- 用车申请列表 -->
      <el-table
        :data="applyList"
        stripe
        border
        v-loading="loading"
        style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="user_name" label="申请人" width="120"></el-table-column>
        <el-table-column prop="car_type" label="用车类型" width="120">
          <template slot-scope="scope">
            <el-tag :type="getCarTypeTagType(scope.row.car_type)">{{ getCarTypeLabel(scope.row.car_type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="用车事由" min-width="150"></el-table-column>
        <el-table-column prop="passenger_count" label="用车人数" width="100"></el-table-column>
        <el-table-column prop="use_time" label="用车时间" width="180"></el-table-column>
        <el-table-column prop="status_title" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">{{ scope.row.status_title }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="approved_plate_number" label="分配车牌" width="120"></el-table-column>
        <el-table-column label="公里数状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.mileage_status === 'abnormal' ? 'danger' : 'success'">
              {{ scope.row.mileage_status === 'abnormal' ? '异常' : '正常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="申请时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)" v-if="scope.row.status === 'applying'">删除</el-button>
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

    <!-- 申请用车对话框 -->
    <el-dialog title="申请用车" :visible.sync="dialogVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="用车类型" prop="car_type">
          <el-select v-model="form.car_type" placeholder="请选择用车类型" style="width: 100%">
            <el-option label="一般用车" value="general"></el-option>
            <el-option label="业务用车" value="business"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用车事由" prop="reason">
          <el-input v-model="form.reason" placeholder="请输入用车事由"></el-input>
        </el-form-item>
        <el-form-item label="用车人数" prop="passenger_count">
          <el-input-number v-model="form.passenger_count" :min="1" :max="50" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="用车时间" prop="use_time">
          <el-date-picker
            v-model="form.use_time"
            type="datetime"
            placeholder="选择用车时间"
            style="width: 100%"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
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

    <!-- 详情对话框 -->
    <el-dialog title="用车申请详情" :visible.sync="detailDialogVisible" width="800px">
      <el-descriptions :column="2" border v-if="currentDetail">
        <el-descriptions-item label="申请人">{{ currentDetail.user_name }}</el-descriptions-item>
        <el-descriptions-item label="用车类型">{{ getCarTypeLabel(currentDetail.car_type) }}</el-descriptions-item>
        <el-descriptions-item label="用车事由" :span="2">{{ currentDetail.reason }}</el-descriptions-item>
        <el-descriptions-item label="用车人数">{{ currentDetail.passenger_count }}</el-descriptions-item>
        <el-descriptions-item label="用车时间">{{ currentDetail.use_time }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ currentDetail.status_title }}</el-descriptions-item>
        <el-descriptions-item label="分配车牌">{{ currentDetail.approved_plate_number || '未分配' }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentDetail.remark || '无' }}</el-descriptions-item>
        <el-descriptions-item label="驳回原因" :span="2" v-if="currentDetail.reject_reason">{{ currentDetail.reject_reason }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">审批流程</el-divider>
      <el-timeline v-if="currentDetail && currentDetail.logs">
        <el-timeline-item
          v-for="(log, index) in currentDetail.logs"
          :key="index"
          :timestamp="log.created_at"
          :type="getTimelineType(log.status)">
          <div>
            <strong>{{ log.user_name }}</strong>
            <el-tag size="mini" style="margin-left: 10px">{{ log.status_title }}</el-tag>
          </div>
          <div v-if="log.reply" style="margin-top: 5px; color: #666">{{ log.reply }}</div>
        </el-timeline-item>
      </el-timeline>

      <el-divider content-position="left">待办日志</el-divider>
      <el-timeline v-if="currentDetail && currentDetail.task_logs">
        <el-timeline-item
          v-for="(log, index) in currentDetail.task_logs"
          :key="index"
          :timestamp="log.created_at"
          type="info">
          <div>
            <strong>{{ log.user_name }}</strong>
            <el-tag size="mini" style="margin-left: 10px">{{ log.status_title }}</el-tag>
          </div>
        </el-timeline-item>
      </el-timeline>

      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCarApplyList, createCarApply, deleteCarApply, getCarApplyDetail } from '../../api/car'

export default {
  name: 'CarManage',
  data() {
    return {
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      detailDialogVisible: false,
      searchForm: {
        car_type: '',
        status: '',
        keyword: '',
        mileage_status: ''
      },
      applyList: [],
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      form: {
        car_type: '',
        reason: '',
        passenger_count: 1,
        use_time: '',
        remark: ''
      },
      rules: {
        car_type: [
          { required: true, message: '请选择用车类型', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请输入用车事由', trigger: 'blur' }
        ],
        passenger_count: [
          { required: true, message: '请输入用车人数', trigger: 'blur' }
        ],
        use_time: [
          { required: true, message: '请选择用车时间', trigger: 'change' }
        ]
      },
      currentDetail: null
    }
  },
  created() {
    this.fetchApplyList()
  },
  methods: {
    // 获取用车申请列表
    async fetchApplyList() {
      this.loading = true
      try {
        const params = {
          page: this.page.current,
          size: this.page.size,
          car_type: this.searchForm.car_type,
          status: this.searchForm.status,
          keyword: this.searchForm.keyword,
          mileage_status: this.searchForm.mileage_status
        }
        const res = await getCarApplyList(params)
        if (res.data) {
          this.applyList = res.data || []
          this.page.total = res.pagination ? res.pagination.total : 0
        }
      } catch (error) {
        this.$message.error('获取用车申请列表失败')
      } finally {
        this.loading = false
      }
    },
    // 查询
    handleSearch() {
      this.page.current = 1
      this.fetchApplyList()
    },
    // 重置
    handleReset() {
      this.searchForm = {
        car_type: '',
        status: '',
        keyword: '',
        mileage_status: ''
      }
      this.page.current = 1
      this.fetchApplyList()
    },
    // 新增申请
    handleAdd() {
      this.form = {
        car_type: '',
        reason: '',
        passenger_count: 1,
        use_time: '',
        remark: ''
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },
    // 查看详情
    async handleView(row) {
      try {
        const res = await getCarApplyDetail(row.uuid)
        if (res.data) {
          this.currentDetail = res.data
          this.detailDialogVisible = true
        }
      } catch (error) {
        this.$message.error('获取详情失败')
      }
    },
    // 删除
    handleDelete(row) {
      this.$confirm('确认删除该用车申请吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteCarApply(row.uuid)
          this.$message.success('删除成功')
          this.fetchApplyList()
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    // 提交申请
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.submitLoading = true
          try {
            await createCarApply(this.form)
            this.$message.success('申请成功')
            this.dialogVisible = false
            this.fetchApplyList()
          } catch (error) {
            this.$message.error('申请失败')
          } finally {
            this.submitLoading = false
          }
        }
      })
    },
    // 分页大小变化
    handleSizeChange(val) {
      this.page.size = val
      this.fetchApplyList()
    },
    // 页码变化
    handleCurrentChange(val) {
      this.page.current = val
      this.fetchApplyList()
    },
    // 获取用车类型标签
    getCarTypeLabel(type) {
      const map = {
        general: '一般用车',
        business: '业务用车',
        other: '其他'
      }
      return map[type] || type
    },
    // 获取用车类型标签类型
    getCarTypeTagType(type) {
      const map = {
        general: '',
        business: 'success',
        other: 'info'
      }
      return map[type] || ''
    },
    // 获取状态标签类型
    getStatusTagType(status) {
      const map = {
        applying: 'warning',
        approved: 'success',
        rejected: 'danger',
        completed: 'info'
      }
      return map[status] || ''
    },
    // 获取时间线类型
    getTimelineType(status) {
      const map = {
        applying: 'primary',
        approved: 'success',
        rejected: 'danger',
        completed: 'info'
      }
      return map[status] || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.car-manage {
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