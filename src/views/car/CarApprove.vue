<template>
  <div class="car-approve">
    <el-card>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <!-- 待处理 -->
        <el-tab-pane label="待处理" name="todo">
          <el-table
            :data="todoList"
            stripe
            border
            v-loading="todoLoading"
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
            <el-table-column prop="created_at" label="申请时间" width="180"></el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
                <el-button size="mini" type="success" icon="el-icon-check" @click="handleApprove(scope.row)">审批</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination
              @size-change="handleTodoSizeChange"
              @current-change="handleTodoCurrentChange"
              :current-page="todoPage.current"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="todoPage.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="todoPage.total">
            </el-pagination>
          </div>
        </el-tab-pane>

        <!-- 已处理 -->
        <el-tab-pane label="已处理" name="done">
          <el-table
            :data="doneList"
            stripe
            border
            v-loading="doneLoading"
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
            <el-table-column prop="created_at" label="申请时间" width="180"></el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
                <el-button size="mini" type="warning" icon="el-icon-stop" @click="handleEnd(scope.row)" v-if="canEnd(scope.row)">结束用车</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination
              @size-change="handleDoneSizeChange"
              @current-change="handleDoneCurrentChange"
              :current-page="donePage.current"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="donePage.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="donePage.total">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

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

    <!-- 审批对话框 -->
    <el-dialog title="审批用车申请" :visible.sync="approveDialogVisible" width="600px">
      <el-descriptions :column="2" border v-if="currentApprove">
        <el-descriptions-item label="申请人">{{ currentApprove.user_name }}</el-descriptions-item>
        <el-descriptions-item label="用车类型">{{ getCarTypeLabel(currentApprove.car_type) }}</el-descriptions-item>
        <el-descriptions-item label="用车事由" :span="2">{{ currentApprove.reason }}</el-descriptions-item>
        <el-descriptions-item label="用车人数">{{ currentApprove.passenger_count }}</el-descriptions-item>
        <el-descriptions-item label="用车时间">{{ currentApprove.use_time }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentApprove.remark || '无' }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">审批操作</el-divider>
      <el-form :model="approveForm" :rules="approveRules" ref="approveForm" label-width="100px">
        <el-form-item label="审批结果" prop="action">
          <el-radio-group v-model="approveForm.action">
            <el-radio label="agree">同意</el-radio>
            <el-radio label="reject">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分配车牌" prop="plate_id" v-if="approveForm.action === 'agree' && needPlate">
          <el-select v-model="approveForm.plate_id" placeholder="请选择车牌" style="width: 100%">
            <el-option
              v-for="plate in plateList"
              :key="plate.uuid"
              :label="plate.plate_number"
              :value="plate.uuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始公里数" prop="start_km" v-if="approveForm.action === 'agree' && needEnd">
          <el-input v-model.number="approveForm.start_km" placeholder="请输入开始公里数"></el-input>
        </el-form-item>
        <el-form-item label="结束公里数" prop="end_km" v-if="approveForm.action === 'agree' && needEnd">
          <el-input v-model.number="approveForm.end_km" placeholder="请输入结束公里数"></el-input>
        </el-form-item>
        <el-form-item label="审批意见" prop="reply">
          <el-input v-model="approveForm.reply" type="textarea" :rows="3" placeholder="请输入审批意见"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="currentApprove && currentApprove.next && currentApprove.next.length > 0">
        <el-button @click="approveDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleApproveSubmit" :loading="approveLoading">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 结束用车对话框 -->
    <el-dialog title="结束用车" :visible.sync="endDialogVisible" width="600px">
      <el-descriptions :column="2" border v-if="currentEnd">
        <el-descriptions-item label="申请人">{{ currentEnd.user_name }}</el-descriptions-item>
        <el-descriptions-item label="用车类型">{{ getCarTypeLabel(currentEnd.car_type) }}</el-descriptions-item>
        <el-descriptions-item label="用车事由" :span="2">{{ currentEnd.reason }}</el-descriptions-item>
        <el-descriptions-item label="车牌号">{{ currentEnd.approved_plate_number || '未分配' }}</el-descriptions-item>
        <el-descriptions-item label="用车时间">{{ currentEnd.use_time }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">里程信息</el-divider>
      <el-form :model="endForm" :rules="endRules" ref="endForm" label-width="120px">
        <el-form-item label="开始公里数" prop="start_km">
          <el-input v-model.number="endForm.start_km" placeholder="请输入开始公里数"></el-input>
        </el-form-item>
        <el-form-item label="结束公里数" prop="end_km">
          <el-input v-model.number="endForm.end_km" placeholder="请输入结束公里数"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="endDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEndSubmit" :loading="endLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCarApproveTodo, getCarApproveDone, approveCarApply, getPlateList, getCarApplyDetail, endCarApply } from '../../api/car'

export default {
  name: 'CarApprove',
  data() {
    return {
      activeTab: 'todo',
      todoLoading: false,
      doneLoading: false,
      approveLoading: false,
      detailDialogVisible: false,
      approveDialogVisible: false,
      todoList: [],
      doneList: [],
      plateList: [],
      todoPage: {
        current: 1,
        size: 10,
        total: 0
      },
      donePage: {
        current: 1,
        size: 10,
        total: 0
      },
      currentDetail: null,
      currentApprove: null,
      approveForm: {
        action: 'agree',
        plate_id: '',
        start_km: '',
        end_km: '',
        reply: ''
      },
      approveRules: {
        action: [
          { required: true, message: '请选择审批结果', trigger: 'change' }
        ],
        start_km: [
          { required: true, message: '请输入开始公里数', trigger: 'blur' },
          { type: 'number', min: 0, message: '开始公里数必须大于等于0', trigger: 'blur' }
        ],
        end_km: [
          { required: true, message: '请输入结束公里数', trigger: 'blur' },
          { type: 'number', min: 0, message: '结束公里数必须大于等于0', trigger: 'blur' }
        ]
      },
      endDialogVisible: false,
      endLoading: false,
      currentEnd: null,
      endForm: {
        start_km: '',
        end_km: ''
      },
      endRules: {
        start_km: [
          { required: true, message: '请输入开始公里数', trigger: 'blur' },
          { type: 'number', min: 0, message: '开始公里数必须大于等于0', trigger: 'blur' }
        ],
        end_km: [
          { required: true, message: '请输入结束公里数', trigger: 'blur' },
          { type: 'number', min: 0, message: '结束公里数必须大于等于0', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    needPlate() {
      // step=2 时需要选择车牌
      return this.currentApprove && this.currentApprove.step === 2
    },
    needEnd() {
      // step=3 时需要填写公里数
      return this.currentApprove && this.currentApprove.step === 3
    }
  },
  created() {
    this.fetchTodoList()
    this.fetchPlateList()
  },
  methods: {
    canEnd(row) {
      // step=3 且状态不是已完成时，显示结束用车按钮
      return row && row.step === 3 && row.status !== 'completed'
    },
    // 获取待处理列表
    async fetchTodoList() {
      this.todoLoading = true
      try {
        const params = {
          page: this.todoPage.current,
          size: this.todoPage.size
        }
        const res = await getCarApproveTodo(params)
        if (res.data) {
          this.todoList = res.data || []
          this.todoPage.total = res.pagination ? res.pagination.total : 0
        }
      } catch (error) {
        this.$message.error('获取待处理列表失败')
      } finally {
        this.todoLoading = false
      }
    },
    // 获取已处理列表
    async fetchDoneList() {
      this.doneLoading = true
      try {
        const params = {
          page: this.donePage.current,
          size: this.donePage.size
        }
        const res = await getCarApproveDone(params)
        if (res.data) {
          this.doneList = res.data || []
          this.donePage.total = res.pagination ? res.pagination.total : 0
        }
      } catch (error) {
        this.$message.error('获取已处理列表失败')
      } finally {
        this.doneLoading = false
      }
    },
    // 获取车牌列表
    async fetchPlateList() {
      try {
        const res = await getPlateList({ page: 1, size: 100 })
        if (res.data) {
          this.plateList = res.data || []
        }
      } catch (error) {
        console.error('获取车牌列表失败', error)
      }
    },
    // 标签切换
    handleTabClick(tab) {
      if (tab.name === 'todo') {
        this.fetchTodoList()
      } else {
        this.fetchDoneList()
      }
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
    // 审批
    async handleApprove(row) {
      try {
        const res = await getCarApplyDetail(row.uuid)
        if (res.data) {
          this.currentApprove = res.data
          this.approveForm = {
            action: 'agree',
            plate_id: '',
            start_km: res.data.start_km || '',
            end_km: '',
            reply: ''
          }
          this.approveDialogVisible = true
          this.$nextTick(() => {
            this.$refs.approveForm && this.$refs.approveForm.clearValidate()
          })
        }
      } catch (error) {
        this.$message.error('获取详情失败')
      }
    },
    // 提交审批
    handleApproveSubmit() {
      if (this.approveForm.action === 'agree' && this.needPlate && !this.approveForm.plate_id) {
        this.$message.error('请选择车牌')
        return
      }
      if (this.approveForm.action === 'agree' && this.needEnd && this.approveForm.end_km <= this.approveForm.start_km) {
        this.$message.error('结束公里数必须大于开始公里数')
        return
      }
      this.$refs.approveForm.validate(async (valid) => {
        if (valid) {
          this.approveLoading = true
          try {
            if (this.approveForm.action === 'agree' && this.needEnd) {
              const data = {
                start_km: this.approveForm.start_km,
                end_km: this.approveForm.end_km
              }
              if (this.approveForm.plate_id) {
                data.plate_id = this.approveForm.plate_id
              }
              if (this.approveForm.reply) {
                data.reply = this.approveForm.reply
              }
              await endCarApply(this.currentApprove.uuid, data)
              this.$message.success('结束用车成功')
            } else {
              const data = {
                uuid: this.currentApprove.uuid,
                action: this.approveForm.action,
                reply: this.approveForm.reply
              }
              if (this.approveForm.plate_id) {
                data.plate_id = this.approveForm.plate_id
              }
              await approveCarApply(data)
              this.$message.success('审批成功')
            }
            this.approveDialogVisible = false
            this.fetchTodoList()
          } finally {
            this.approveLoading = false
          }
        }
      })
    },
    // 结束用车
    async handleEnd(row) {
      try {
        const res = await getCarApplyDetail(row.uuid)
        if (res.data) {
          this.currentEnd = res.data
          this.endForm = {
            start_km: res.data.start_km || '',
            end_km: ''
          }
          this.endDialogVisible = true
          this.$nextTick(() => {
            this.$refs.endForm && this.$refs.endForm.clearValidate()
          })
        }
      } catch (error) {
        this.$message.error('获取详情失败')
      }
    },
    // 提交结束用车
    handleEndSubmit() {
      if (this.endForm.end_km <= this.endForm.start_km) {
        this.$message.error('结束公里数必须大于开始公里数')
        return
      }
      this.$refs.endForm.validate(async (valid) => {
        if (valid) {
          this.endLoading = true
          try {
            const data = {
              start_km: this.endForm.start_km,
              end_km: this.endForm.end_km
            }
            await endCarApply(this.currentEnd.uuid, data)
            this.$message.success('结束用车成功')
            this.endDialogVisible = false
            this.fetchDoneList()
          } catch (error) {
            // 错误提示已由请求拦截器处理
          } finally {
            this.endLoading = false
          }
        }
      })
    },
    // 待处理分页
    handleTodoSizeChange(val) {
      this.todoPage.size = val
      this.fetchTodoList()
    },
    handleTodoCurrentChange(val) {
      this.todoPage.current = val
      this.fetchTodoList()
    },
    // 已处理分页
    handleDoneSizeChange(val) {
      this.donePage.size = val
      this.fetchDoneList()
    },
    handleDoneCurrentChange(val) {
      this.donePage.current = val
      this.fetchDoneList()
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
.car-approve {
  padding: 20px;

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>