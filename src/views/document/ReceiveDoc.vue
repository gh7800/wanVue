<template>
  <div class="receive-doc">
    <el-card class="table-card">
      <!-- 顶部：tab + 搜索 -->
      <div class="table-header">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="待处理" name="todo"></el-tab-pane>
          <el-tab-pane label="已处理" name="processed"></el-tab-pane>
          <el-tab-pane label="全部" name="all"></el-tab-pane>
        </el-tabs>
        <div class="search-area">
          <el-input
            v-model="searchKeyword"
            placeholder="标题 / 内容 / 备注 / 申请人 模糊查询"
            clearable
            style="width: 280px"
            @keyup.enter.native="handleSearch"
            @clear="handleSearch">
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
        </div>
      </div>

      <!-- 收文列表 -->
      <el-table
        :data="docList"
        stripe
        border
        v-loading="loading"
        style="width: 100%">
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column label="类型" width="100">
          <template slot-scope="scope">
            <el-tag :type="getTypeTagType(scope.row.type)">{{ getTypeLabel(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="申请人" width="100"></el-table-column>
        <el-table-column label="单位" width="140" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.user_company || '-' }}</template>
        </el-table-column>
        <el-table-column label="部门" width="120" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.user_department || '-' }}</template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">{{ scope.row.status_title }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="申请时间" width="180"></el-table-column>
        <el-table-column label="操作" width="170" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-check"
              v-if="activeTab === 'todo'"
              @click="handleApprove(scope.row)">审批</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.current"
          :page-sizes="pageSizes"
          :page-size="page.per_page"
          layout="sizes, prev, pager, next, jumper, total"
          :total="page.total">
        </el-pagination>
      </div>
    </el-card>

    <!-- 审批对话框 -->
    <el-dialog title="审批请示" :visible.sync="approveDialogVisible" width="520px" :close-on-click-modal="false">
      <el-form :model="approveForm" label-width="100px">
        <el-form-item label="请示标题">
          <span>{{ currentRow ? currentRow.title : '' }}</span>
        </el-form-item>
        <el-form-item label="审批结果" required>
          <el-radio-group v-model="approveForm.action">
            <el-radio label="agree">同意</el-radio>
            <el-radio label="reject">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见">
          <el-input
            v-model="approveForm.reply"
            type="textarea"
            :rows="4"
            :maxlength="200"
            show-word-limit
            placeholder="请输入审批意见"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="approveDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleApproveSubmit" :loading="approveLoading">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog title="请示详情" :visible.sync="detailDialogVisible" width="820px">
      <el-descriptions :column="2" border v-if="currentDetail">
        <el-descriptions-item label="标题" :span="2">{{ currentDetail.title }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ getTypeLabel(currentDetail.type) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusTagType(currentDetail.status)">{{ currentDetail.status_title }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="申请人">{{ currentDetail.user_name }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ currentDetail.created_at }}</el-descriptions-item>
        <el-descriptions-item label="单位">{{ currentDetail.user_company || '无' }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ currentDetail.user_department || '无' }}</el-descriptions-item>
        <el-descriptions-item label="内容" :span="2">{{ currentDetail.content || '无' }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentDetail.remark || '无' }}</el-descriptions-item>
        <el-descriptions-item label="附件" :span="2">
          <div v-if="currentDetail.files && currentDetail.files.length">
            <a
              v-for="(file, i) in currentDetail.files"
              :key="i"
              :href="file.file_url"
              target="_blank"
              class="file-link">
              <i class="el-icon-paperclip"></i> {{ file.title || file.file_name }}
            </a>
          </div>
          <span v-else>无</span>
        </el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">审批流程</el-divider>
      <el-timeline v-if="currentDetail && currentDetail.logs && currentDetail.logs.length">
        <el-timeline-item
          v-for="(log, index) in currentDetail.logs"
          :key="index"
          :timestamp="log.created_at"
          :type="getTimelineType(log.status)">
          <div>
            <strong>{{ log.user_name }}</strong>
            <el-tag size="mini" style="margin-left: 10px">{{ log.status_title }}</el-tag>
          </div>
          <div v-if="log.reply" style="margin-top: 5px; color: #666">意见：{{ log.reply }}</div>
        </el-timeline-item>
      </el-timeline>
      <el-empty v-else description="暂无审批记录" :image-size="80"></el-empty>

      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDocumentTodo,
  getDocumentProcessed,
  getDocumentList,
  getDocumentDetail,
  approveDocument
} from '../../api/document'
import { PAGINATION } from '../../config/constants'

export default {
  name: 'ReceiveDoc',
  data() {
    return {
      loading: false,
      approveLoading: false,
      activeTab: 'todo',
      searchKeyword: '',
      docList: [],
      page: {
        current: PAGINATION.DEFAULT_CURRENT_PAGE,
        per_page: PAGINATION.DEFAULT_PAGE_SIZE,
        total: 0
      },
      pageSizes: PAGINATION.PAGE_SIZES,
      approveDialogVisible: false,
      approveForm: {
        action: 'agree',
        reply: ''
      },
      currentRow: null,
      detailDialogVisible: false,
      currentDetail: null
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    // 获取列表
    async fetchList() {
      this.loading = true
      try {
        const params = {
          page: this.page.current,
          per_page: this.page.per_page,
          keyword: this.searchKeyword || undefined
        }
        let res
        if (this.activeTab === 'todo') {
          res = await getDocumentTodo(params)
        } else if (this.activeTab === 'processed') {
          res = await getDocumentProcessed(params)
        } else {
          res = await getDocumentList(params)
        }
        if (res.data) {
          this.docList = res.data || []
          this.page.total = res.paginator ? res.paginator.total : 0
        }
      } catch (error) {
        this.$message.error('获取收文列表失败')
      } finally {
        this.loading = false
      }
    },
    // tab 切换
    handleTabClick() {
      this.page.current = 1
      this.fetchList()
    },
    // 搜索
    handleSearch() {
      this.page.current = 1
      this.fetchList()
    },
    // 分页大小变化
    handleSizeChange(val) {
      this.page.per_page = val
      this.page.current = 1
      this.fetchList()
    },
    // 页码变化
    handleCurrentChange(val) {
      this.page.current = val
      this.fetchList()
    },
    // 详情
    async handleView(row) {
      try {
        const res = await getDocumentDetail(row.uuid)
        if (res.data) {
          this.currentDetail = res.data
          this.detailDialogVisible = true
        }
      } catch (error) {
        this.$message.error('获取详情失败')
      }
    },
    // 审批
    handleApprove(row) {
      this.currentRow = row
      this.approveForm = {
        action: 'agree',
        reply: ''
      }
      this.approveDialogVisible = true
    },
    // 提交审批
    handleApproveSubmit() {
      if (!this.approveForm.reply) {
        this.$message.warning('请填写审批意见')
        return
      }
      this.approveLoading = true
      const data = {
        uuid: this.currentRow.uuid,
        action: this.approveForm.action,
        reply: this.approveForm.reply
      }
      approveDocument(data)
        .then(() => {
          this.$message.success(
            this.approveForm.action === 'agree' ? '审批通过' : '已驳回'
          )
          this.approveDialogVisible = false
          this.fetchList()
        })
        .catch(() => {
          this.$message.error('审批失败')
        })
        .finally(() => {
          this.approveLoading = false
        })
    },
    // 类型标题
    getTypeLabel(type) {
      const map = {
        zongbanhui: '总办会',
        dangweihui: '党委会',
        dongshihui: '董事会'
      }
      return map[type] || type || '-'
    },
    // 类型标签样式
    getTypeTagType(type) {
      const map = {
        zongbanhui: '',
        dangweihui: 'warning',
        dongshihui: 'danger'
      }
      return map[type] || ''
    },
    // 状态标签样式
    getStatusTagType(status) {
      const map = {
        new: 'warning',
        pending: 'primary',
        approved: 'success',
        completed: 'success',
        rejected: 'danger'
      }
      return map[status] || ''
    },
    // 时间线样式
    getTimelineType(status) {
      const map = {
        new: 'primary',
        pending: 'primary',
        approved: 'success',
        completed: 'success',
        rejected: 'danger'
      }
      return map[status] || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.receive-doc {
  padding: 20px;

  .table-card {
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .el-tabs {
        flex: 1;
      }
    }
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }

  .file-link {
    display: inline-block;
    margin-right: 16px;
    color: #5482EE;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
