<template>
  <div class="not-found">
    <div class="content">
      <h1 class="title">404</h1>
      <p class="subtitle">页面未找到</p>
      <p class="description">抱歉，您访问的页面不存在或已被移除</p>
      <el-button type="primary" @click="goHome" class="back-btn">
        <i class="el-icon-s-home"></i>
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goHome() {
      this.$router.push('/home')
    }
  }
}
</script>

<style lang="scss" scoped>
.not-found {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.content {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 120px;
  font-weight: bold;
  color: #5482EE;
  margin: 0;
  line-height: 1;
  text-shadow: 2px 2px 4px rgba(84, 130, 238, 0.3);
}

.subtitle {
  font-size: 24px;
  color: #333;
  margin: 20px 0 10px;
}

.description {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
}

.back-btn {
  padding: 12px 30px;
  font-size: 14px;
  i {
    margin-right: 5px;
  }
}
</style>
