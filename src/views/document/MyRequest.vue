<template>
  <div class="my-request">
    <!-- 操作栏 -->
    <el-card class="table-card">
      <div class="table-header">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加请示</el-button>
        <div class="search-area">
          <el-input
            v-model="searchKeyword"
            placeholder="标题 / 内容 / 备注 模糊查询"
            clearable
            style="width: 260px"
            @keyup.enter.native="handleSearch"
            @clear="handleSearch">
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
        </div>
      </div>

      <!-- 我的请示列表 -->
      <el-table
        :data="requestList"
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
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">{{ scope.row.status_title }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="申请时间" width="180"></el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              v-if="scope.row.status === 'new'"
              @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- 添加请示对话框 -->
    <el-dialog title="添加请示" :visible.sync="dialogVisible" width="640px" @closed="handleDialogClosed">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入请示标题"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择请示类型" style="width: 100%">
            <el-option label="总办会" value="zongbanhui"></el-option>
            <el-option label="党委会" value="dangweihui"></el-option>
            <el-option label="董事会" value="dongshihui"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="5" placeholder="请输入请示内容"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注（选填）"></el-input>
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            multiple
            :http-request="handleUpload"
            :file-list="fileList"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :limit="10"
            :on-exceed="handleExceed">
            <el-button size="small" type="primary">选择附件（可多选）</el-button>
          </el-upload>
          <div v-if="uploading" class="upload-tip">
            <i class="el-icon-loading"></i> 正在上传附件...
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">提交</el-button>
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
  getDocumentMine,
  createDocument,
  getDocumentDetail,
  deleteDocument,
  uploadDocumentFiles
} from '../../api/document'
import { PAGINATION } from '../../config/constants'

export default {
  name: 'MyRequest',
  data() {
    return {
      loading: false,
      submitLoading: false,
      uploading: false,
      dialogVisible: false,
      detailDialogVisible: false,
      requestList: [],
      searchKeyword: '',
      page: {
        current: PAGINATION.DEFAULT_CURRENT_PAGE,
        per_page: PAGINATION.DEFAULT_PAGE_SIZE,
        total: 0
      },
      pageSizes: PAGINATION.PAGE_SIZES,
      form: {
        title: '',
        type: '',
        content: '',
        remark: '',
        files: []
      },
      fileList: [],
      rules: {
        title: [
          { required: true, message: '请输入请示标题', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择请示类型', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入请示内容', trigger: 'blur' }
        ]
      },
      currentDetail: null
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    // 获取我的请示列表
    async fetchList() {
      this.loading = true
      try {
        const params = {
          page: this.page.current,
          per_page: this.page.per_page,
          keyword: this.searchKeyword || undefined
        }
        const res = await getDocumentMine(params)
        if (res.data) {
          this.requestList = res.data || []
          this.page.total = res.paginator ? res.paginator.total : 0
        }
      } catch (error) {
        this.$message.error('获取请示列表失败')
      } finally {
        this.loading = false
      }
    },
    // 搜索
    handleSearch() {
      this.page.current = 1
      this.fetchList()
    },
    // 新增
    handleAdd() {
      this.form = {
        title: '',
        type: '',
        content: '',
        remark: '',
        files: []
      }
      this.fileList = []
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },
    // 对话框关闭后重置
    handleDialogClosed() {
      this.fileList = []
      this.form.files = []
    },
    // 上传附件（自定义 http-request，走统一 axios，自动带 token）
    async handleUpload(options) {
      this.uploading = true
      try {
        const formData = new FormData()
        formData.append('files[]', options.file)
        const res = await uploadDocumentFiles(formData)
        options.onSuccess(res)
      } catch (error) {
        options.onError(error)
        this.$message.error('附件上传失败')
      } finally {
        this.uploading = false
      }
    },
    // 文件列表变化
    handleFileChange(file, fileList) {
      this.fileList = fileList
      this.form.files = fileList
        .filter(f => f.status === 'success' && f.response && f.response.data)
        .map(f => {
          const d = f.response.data
          const item = Array.isArray(d) ? d[0] : d
          return {
            file_name: item.title,
            file_path: item.file_path,
            title: item.title
          }
        })
    },
    // 移除附件
    handleFileRemove(file, fileList) {
      this.fileList = fileList
      this.form.files = fileList
        .filter(f => f.status === 'success' && f.response && f.response.data)
        .map(f => {
          const d = f.response.data
          const item = Array.isArray(d) ? d[0] : d
          return {
            file_name: item.title,
            file_path: item.file_path,
            title: item.title
          }
        })
    },
    // 超出数量限制
    handleExceed() {
      this.$message.warning('最多只能上传 10 个附件')
    },
    // 提交
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.submitLoading = true
          try {
            await createDocument(this.form)
            this.$message.success('提交成功')
            this.dialogVisible = false
            this.fetchList()
          } catch (error) {
            this.$message.error('提交失败')
          } finally {
            this.submitLoading = false
          }
        }
      })
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
    // 删除
    handleDelete(row) {
      this.$confirm('确认删除该请示吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteDocument(row.uuid)
          this.$message.success('删除成功')
          this.fetchList()
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
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
.my-request {
  padding: 20px;

  .table-card {
    .table-header {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }

  .upload-tip {
    margin-top: 6px;
    font-size: 12px;
    color: #5482EE;
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
