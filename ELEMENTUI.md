# Element UI 常用组件速查手册

> 基于 Vue 2.x 的 Element UI 组件库使用指南

---

## 一、布局组件

### 1. Container 布局容器

```vue
<template>
  <el-container>
    <el-header>头部</el-header>
    <el-container>
      <el-aside width="200px">侧边栏</el-aside>
      <el-main>主内容区</el-main>
    </el-container>
    <el-footer>底部</el-footer>
  </el-container>
</template>

<style>
  .el-header, .el-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
</style>
```

#### Container 组件说明

| 组件 | 说明 |
|------|------|
| `<el-container>` | 外层容器 |
| `<el-header>` | 顶栏容器，高度默认 60px |
| `<el-aside>` | 侧边栏容器，宽度默认 300px |
| `<el-main>` | 主要区域容器 |
| `<el-footer>` | 底栏容器，高度默认 60px |

---

### 2. Layout 布局（栅格系统）

```vue
<template>
  <!-- 基础布局：24栏栅格 -->
  <el-row>
    <el-col :span="24"><div class="grid-content">占24栏</div></el-col>
  </el-row>
  
  <el-row>
    <el-col :span="12"><div class="grid-content">占12栏</div></el-col>
    <el-col :span="12"><div class="grid-content">占12栏</div></el-col>
  </el-row>
  
  <el-row>
    <el-col :span="8"><div class="grid-content">占8栏</div></el-col>
    <el-col :span="8"><div class="grid-content">占8栏</div></el-col>
    <el-col :span="8"><div class="grid-content">占8栏</div></el-col>
  </el-row>
</template>

<style>
  .el-row {
    margin-bottom: 20px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    background: #d3dce6;
    padding: 10px;
  }
</style>
```

#### Row 属性

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| gutter | 栅格间隔（像素） | number | — | 0 |
| type | 布局模式 | string | flex | — |
| justify | 水平排列方式 | string | start/end/center/space-around/space-between | start |
| align | 垂直排列方式 | string | top/middle/bottom | top |

#### Col 属性

| 属性 | 说明 | 类型 | 可选值 |
|------|------|------|--------|
| span | 栅格占据的列数 | number | 1-24 |
| offset | 栅格左侧的间隔格数 | number | 1-24 |
| push | 栅格向右移动格数 | number | 1-24 |
| pull | 栅格向左移动格数 | number | 1-24 |
| xs | <768px 响应式栅格数 | number/object | — |
| sm | ≥768px 响应式栅格数 | number/object | — |
| md | ≥992px 响应式栅格数 | number/object | — |
| lg | ≥1200px 响应式栅格数 | number/object | — |
| xl | ≥1920px 响应式栅格数 | number/object | — |

#### 响应式布局示例

```vue
<template>
  <el-row :gutter="10">
    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
      <div class="grid-content">响应式列</div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
      <div class="grid-content">响应式列</div>
    </el-col>
  </el-row>
</template>
```

---

## 二、基础组件

### 1. Button 按钮

```vue
<template>
  <!-- 基础按钮 -->
  <el-button>默认按钮</el-button>
  <el-button type="primary">主要按钮</el-button>
  <el-button type="success">成功按钮</el-button>
  <el-button type="warning">警告按钮</el-button>
  <el-button type="danger">危险按钮</el-button>
  <el-button type="info">信息按钮</el-button>
  
  <!-- 朴素按钮 -->
  <el-button plain>朴素按钮</el-button>
  <el-button type="primary" plain>主要朴素</el-button>
  
  <!-- 圆角按钮 -->
  <el-button round>圆角按钮</el-button>
  
  <!-- 圆形按钮 -->
  <el-button icon="el-icon-search" circle></el-button>
  
  <!-- 禁用状态 -->
  <el-button disabled>禁用按钮</el-button>
  
  <!-- 加载中 -->
  <el-button loading>加载中</el-button>
  
  <!-- 按钮组 -->
  <el-button-group>
    <el-button type="primary" icon="el-icon-arrow-left">上一页</el-button>
    <el-button type="primary">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
  </el-button-group>
</template>
```

#### Button 属性

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| size | 尺寸 | string | medium / small / mini | — |
| type | 类型 | string | primary / success / warning / danger / info / text | — |
| plain | 是否朴素按钮 | boolean | — | false |
| round | 是否圆角按钮 | boolean | — | false |
| circle | 是否圆形按钮 | boolean | — | false |
| loading | 是否加载中 | boolean | — | false |
| disabled | 是否禁用 | boolean | — | false |
| icon | 图标类名 | string | — | — |
| autofocus | 是否默认聚焦 | boolean | — | false |
| native-type | 原生 type 属性 | string | button / submit / reset | button |

---

### 2. Icon 图标

```vue
<template>
  <i class="el-icon-edit"></i>
  <i class="el-icon-share"></i>
  <i class="el-icon-delete"></i>
  <el-button type="primary" icon="el-icon-search">搜索</el-button>
</template>
```

#### 常用图标类名

| 图标类名 | 说明 |
|----------|------|
| `el-icon-edit` | 编辑 |
| `el-icon-delete` | 删除 |
| `el-icon-search` | 搜索 |
| `el-icon-share` | 分享 |
| `el-icon-upload` | 上传 |
| `el-icon-download` | 下载 |
| `el-icon-plus` | 加号 |
| `el-icon-minus` | 减号 |
| `el-icon-check` | 勾选 |
| `el-icon-close` | 关闭 |
| `el-icon-arrow-left` | 左箭头 |
| `el-icon-arrow-right` | 右箭头 |
| `el-icon-arrow-up` | 上箭头 |
| `el-icon-arrow-down` | 下箭头 |
| `el-icon-refresh` | 刷新 |
| `el-icon-full-screen` | 全屏 |
| `el-icon-menu` | 菜单 |
| `el-icon-setting` | 设置 |
| `el-icon-user` | 用户 |
| `el-icon-lock` | 锁定 |

---

## 三、表单组件

### 1. Input 输入框

```vue
<template>
  <!-- 基础用法 -->
  <el-input v-model="input" placeholder="请输入内容"></el-input>
  
  <!-- 禁用状态 -->
  <el-input v-model="input" placeholder="禁用" disabled></el-input>
  
  <!-- 可清空 -->
  <el-input v-model="input" placeholder="可清空" clearable></el-input>
  
  <!-- 密码框 -->
  <el-input v-model="input" placeholder="密码" show-password></el-input>
  
  <!-- 带图标 -->
  <el-input
    placeholder="请输入内容"
    prefix-icon="el-icon-search"
    v-model="input">
  </el-input>
  
  <!-- 带后缀 -->
  <el-input placeholder="请输入内容" v-model="input">
    <template slot="append">.com</template>
  </el-input>
  
  <!-- 文本域 -->
  <el-input
    type="textarea"
    :rows="2"
    placeholder="请输入内容"
    v-model="textarea">
  </el-input>
  
  <!-- 自适应高度文本域 -->
  <el-input
    type="textarea"
    autosize
    placeholder="请输入内容"
    v-model="textarea">
  </el-input>
</template>

<script>
export default {
  data() {
    return {
      input: '',
      textarea: ''
    }
  }
}
</script>
```

#### Input 属性

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| type | 类型 | string | text / textarea / password | text |
| v-model | 绑定值 | string/number | — | — |
| placeholder | 占位文本 | string | — | — |
| disabled | 禁用 | boolean | — | false |
| clearable | 是否可清空 | boolean | — | false |
| show-password | 是否显示密码 | boolean | — | false |
| prefix-icon | 输入框头部图标 | string | — | — |
| suffix-icon | 输入框尾部图标 | string | — | — |
| rows | 文本域行数（type="textarea"） | number | — | 2 |
| autosize | 自适应内容高度 | boolean/object | — | false |
| maxlength | 最大输入长度 | number | — | — |
| minlength | 最小输入长度 | number | — | — |
| readonly | 只读 | boolean | — | false |
| size | 输入框尺寸 | string | medium / small / mini | — |

---

### 2. Select 选择器

```vue
<template>
  <!-- 基础用法 -->
  <el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  
  <!-- 多选 -->
  <el-select v-model="value" multiple placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  
  <!-- 可搜索 -->
  <el-select v-model="value" filterable placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  
  <!-- 分组 -->
  <el-select v-model="value" placeholder="请选择">
    <el-option-group
      v-for="group in options"
      :key="group.label"
      :label="group.label">
      <el-option
        v-for="item in group.options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script>
export default {
  data() {
    return {
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }],
      value: ''
    }
  }
}
</script>
```

#### Select 属性

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| v-model | 绑定值 | boolean/string/number/array | — | — |
| multiple | 是否多选 | boolean | — | false |
| disabled | 是否禁用 | boolean | — | false |
| clearable | 是否可清空 | boolean | — | false |
| filterable | 是否可搜索 | boolean | — | false |
| placeholder | 占位符 | string | — | 请选择 |
| size | 输入框尺寸 | string | large/small/mini | — |

---

### 3. Form 表单

```vue
<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
    <el-form-item label="活动名称" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
    </el-form-item>
    
    <el-form-item label="活动区域" prop="region">
      <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    
    <el-form-item label="活动时间" required>
      <el-col :span="11">
        <el-form-item prop="date1">
          <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col class="line" :span="2">-</el-col>
      <el-col :span="11">
        <el-form-item prop="date2">
          <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
        </el-form-item>
      </el-col>
    </el-form-item>
    
    <el-form-item label="即时配送" prop="delivery">
      <el-switch v-model="ruleForm.delivery"></el-switch>
    </el-form-item>
    
    <el-form-item label="活动性质" prop="type">
      <el-checkbox-group v-model="ruleForm.type">
        <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
        <el-checkbox label="地推活动" name="type"></el-checkbox>
        <el-checkbox label="线下主题活动" name="type"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    
    <el-form-item label="特殊资源" prop="resource">
      <el-radio-group v-model="ruleForm.resource">
        <el-radio label="线上品牌商赞助"></el-radio>
        <el-radio label="线下场地免费"></el-radio>
      </el-radio-group>
    </el-form-item>
    
    <el-form-item label="活动形式" prop="desc">
      <el-input type="textarea" v-model="ruleForm.desc"></el-input>
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
```

#### Form 属性

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| model | 表单数据对象 | object | — | — |
| rules | 表单验证规则 | object | — | — |
| inline | 行内表单模式 | boolean | — | false |
| label-position | 表单域标签的位置 | string | right/left/top | right |
| label-width | 表单域标签的宽度 | string | — | — |
| size | 表单内组件的尺寸 | string | medium / small / mini | — |

---

## 四、数据展示组件

### 1. Table 表格

```vue
<template>
  <!-- 基础表格 -->
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table>
  
  <!-- 带斑马纹 -->
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="date" label="日期"></el-table-column>
    <el-table-column prop="name" label="姓名"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table>
  
  <!-- 带边框 -->
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="date" label="日期"></el-table-column>
    <el-table-column prop="name" label="姓名"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table>
  
  <!-- 带操作列 -->
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="日期"></el-table-column>
    <el-table-column prop="name" label="姓名"></el-table-column>
    <el-table-column label="操作" width="180">
      <template slot-scope="scope">
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  
  <!-- 带分页 -->
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="日期"></el-table-column>
    <el-table-column prop="name" label="姓名"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[10, 20, 30, 40]"
    :page-size="10"
    layout="total, sizes, prev, pager, next, jumper"
    :total="400">
  </el-pagination>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }],
      currentPage: 1
    }
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>
```

#### Table 属性

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| data | 显示的数据 | array | — | — |
| height | Table 的高度 | string/number | — | — |
| stripe | 是否为斑马纹 | boolean | — | false |
| border | 是否带有纵向边框 | boolean | — | false |
| size | Table 的尺寸 | string | medium / small / mini | — |
| fit | 列的宽度是否自撑开 | boolean | — | true |
| show-header | 是否显示表头 | boolean | — | true |
| highlight-current-row | 是否要高亮当前行 | boolean | — | false |
| row-class-name | 行的 className | function | — | — |

#### Table-Column 属性

| 属性 | 说明 | 类型 | 可选值 |
|------|------|------|--------|
| type | 对应列的类型 | string | selection / index / expand |
| prop | 对应列内容的字段名 | string | — |
| label | 显示的标题 | string | — |
| width | 对应列的宽度 | string | — |
| min-width | 对应列的最小宽度 | string | — |
| fixed | 列是否固定在左侧或者右侧 | string/ boolean | true / left / right |
| sortable | 对应列是否可以排序 | boolean / string | true / false / 'custom' |
| formatter | 用来格式化内容 | function | — |

---

### 2. Pagination 分页

```vue
<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[10, 20, 30, 40]"
    :page-size="10"
    layout="total, sizes, prev, pager, next, jumper"
    :total="400">
  </el-pagination>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>
```

#### Pagination 属性

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| page-size | 每页显示条目个数 | number | — | 10 |
| total | 总条目数 | number | — | — |
| page-count | 总页数 | number | — | — |
| current-page | 当前页数 | number | — | 1 |
| layout | 组件布局 | string | sizes, prev, pager, next, jumper, ->, total, slot | 'prev, pager, next, jumper, ->, total' |
| page-sizes | 每页显示个数选择器的选项设置 | number[] | — | [10, 20, 30, 40, 50, 100] |
| small | 是否使用小型分页样式 | boolean | — | false |
| background | 是否为分页按钮添加背景色 | boolean | — | false |

---

## 五、导航组件

### 1. Menu 导航菜单

```vue
<template>
  <!-- 侧栏菜单 -->
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>导航一</span>
      </template>
      <el-menu-item-group>
        <template slot="title">分组一</template>
        <el-menu-item index="1-1">选项1</el-menu-item>
        <el-menu-item index="1-2">选项2</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="分组2">
        <el-menu-item index="1-3">选项3</el-menu-item>
      </el-menu-item-group>
      <el-submenu index="1-4">
        <template slot="title">选项4</template>
        <el-menu-item index="1-4-1">选项1</el-menu-item>
      </el-submenu>
    </el-submenu>
    <el-menu-item index="2">
      <i class="el-icon-menu"></i>
      <span slot="title">导航二</span>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <i class="el-icon-document"></i>
      <span slot="title">导航三</span>
    </el-menu-item>
    <el-menu-item index="4">
      <i class="el-icon-setting"></i>
      <span slot="title">导航四</span>
    </el-menu-item>
  </el-menu>
  
  <!-- 顶部菜单 -->
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1">处理中心</el-menu-item>
    <el-submenu index="2">
      <template slot="title">我的工作台</template>
      <el-menu-item index="2-1">选项1</el-menu-item>
      <el-menu-item index="2-2">选项2</el-menu-item>
      <el-menu-item index="2-3">选项3</el-menu-item>
    </el-submenu>
    <el-menu-item index="3" disabled>消息中心</el-menu-item>
    <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
```

#### Menu 属性

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| mode | 模式 | string | horizontal / vertical | vertical |
| collapse | 是否水平折叠 | boolean | — | false |
| background-color | 背景色 | string | — | #ffffff |
| text-color | 文字颜色 | string | — | #303133 |
| active-text-color | 当前激活菜单的文字颜色 | string | — | #409EFF |
| default-active | 当前激活菜单的 index | string | — | — |
| router | 是否使用 vue-router 的模式 | boolean | — | false |

---

### 2. Tabs 标签页

```vue
<template>
  <!-- 基础用法 -->
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
  </el-tabs>
  
  <!-- 卡片样式 -->
  <el-tabs type="card" v-model="activeName">
    <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
  </el-tabs>
  
  <!-- 边框卡片 -->
  <el-tabs type="border-card">
    <el-tab-pane label="用户管理">用户管理</el-tab-pane>
    <el-tab-pane label="配置管理">配置管理</el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
```

---

### 3. Breadcrumb 面包屑

```vue
<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    <el-breadcrumb-item>活动详情</el-breadcrumb-item>
  </el-breadcrumb>
  
  <!-- 带图标 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-home"></i> 首页</el-breadcrumb-item>
    <el-breadcrumb-item>活动管理</el-breadcrumb-item>
  </el-breadcrumb>
</template>
```

---

## 六、反馈组件

### 1. Message 消息提示

```javascript
// 基础用法
this.$message('这是一条消息提示')

// 不同状态
this.$message.success('成功提示')
this.$message.warning('警告提示')
this.$message.error('错误提示')
this.$message.info('信息提示')

// 带配置
this.$message({
  showClose: true,
  message: '这是一条可关闭的消息',
  type: 'success',
  duration: 3000  // 显示时间（毫秒）
})
```

---

### 2. MessageBox 弹框

```javascript
// 确认框
this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
  confirmButtonText: '确定',
  cancelButtonText: '取消',
  type: 'warning'
}).then(() => {
  this.$message({
    type: 'success',
    message: '删除成功!'
  })
}).catch(() => {
  this.$message({
    type: 'info',
    message: '已取消删除'
  })
})

// 提示框
this.$alert('这是一段内容', '标题名称', {
  confirmButtonText: '确定',
  callback: action => {
    this.$message({
      type: 'info',
      message: `action: ${ action }`
    })
  }
})

// 输入框
this.$prompt('请输入邮箱', '提示', {
  confirmButtonText: '确定',
  cancelButtonText: '取消',
  inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
  inputErrorMessage: '邮箱格式不正确'
}).then(({ value }) => {
  this.$message({
    type: 'success',
    message: '你的邮箱是: ' + value
  })
}).catch(() => {
  this.$message({
    type: 'info',
    message: '取消输入'
  })
})
```

---

### 3. Dialog 对话框

```vue
<template>
  <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
  
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose">
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>
```

#### Dialog 属性

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| visible | 是否显示 Dialog | boolean | — | false |
| title | Dialog 的标题 | string | — | — |
| width | Dialog 的宽度 | string | — | 50% |
| fullscreen | 是否为全屏 Dialog | boolean | — | false |
| top | Dialog CSS 中的 margin-top 值 | string | — | 15vh |
| modal | 是否需要遮罩层 | boolean | — | true |
| close-on-click-modal | 是否可以通过点击 modal 关闭 Dialog | boolean | — | true |
| show-close | 是否显示关闭按钮 | boolean | — | true |

---

### 4. Loading 加载

```vue
<template>
  <!-- 指令方式 -->
  <el-table v-loading="loading" :data="tableData">
    <el-table-column prop="date" label="日期"></el-table-column>
  </el-table>
  
  <!-- 服务方式 -->
  <el-button type="primary" @click="openFullScreen">全屏加载</el-button>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      tableData: []
    }
  },
  methods: {
    openFullScreen() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        loading.close()
      }, 2000)
    }
  }
}
</script>
```

---

## 七、其他常用组件

### 1. Card 卡片

```vue
<template>
  <!-- 基础卡片 -->
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>卡片名称</span>
      <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
    </div>
    <div v-for="o in 4" :key="o" class="text item">
      {{'列表内容 ' + o }}
    </div>
  </el-card>
  
  <!-- 简单卡片 -->
  <el-card>
    <p>卡片内容</p>
  </el-card>
</template>

<style>
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card {
    width: 480px;
  }
</style>
```

---

### 2. Tag 标签

```vue
<template>
  <el-tag>标签一</el-tag>
  <el-tag type="success">标签二</el-tag>
  <el-tag type="info">标签三</el-tag>
  <el-tag type="warning">标签四</el-tag>
  <el-tag type="danger">标签五</el-tag>
  
  <!-- 可关闭 -->
  <el-tag
    v-for="tag in tags"
    :key="tag.name"
    closable
    :type="tag.type">
    {{tag.name}}
  </el-tag>
  
  <!-- 动态编辑 -->
  <el-tag
    :key="tag"
    v-for="tag in dynamicTags"
    closable
    :disable-transitions="false"
    @close="handleClose(tag)">
    {{tag}}
  </el-tag>
  <el-input
    class="input-new-tag"
    v-if="inputVisible"
    v-model="inputValue"
    ref="saveTagInput"
    size="small"
    @keyup.enter.native="handleInputConfirm"
    @blur="handleInputConfirm"
  >
  </el-input>
  <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
</template>

<script>
export default {
  data() {
    return {
      tags: [
        { name: '标签一', type: '' },
        { name: '标签二', type: 'success' },
        { name: '标签三', type: 'info' }
      ],
      dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: ''
    }
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>
```

---

### 3. Badge 标记

```vue
<template>
  <el-badge :value="12" class="item">
    <el-button size="small">评论</el-button>
  </el-badge>
  <el-badge :value="3" class="item">
    <el-button size="small">回复</el-button>
  </el-badge>
  <el-badge :value="1" class="item" type="primary">
    <el-button size="small">评论</el-button>
  </el-badge>
  <el-badge :value="1" class="item" type="warning">
    <el-button size="small">回复</el-button>
  </el-badge>
  
  <!-- 小红点 -->
  <el-badge is-dot class="item">数据查询</el-badge>
</template>

<style>
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
```

---

### 4. Avatar 头像

```vue
<template>
  <el-avatar :size="50" :src="circleUrl"></el-avatar>
  <el-avatar :size="50" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
  <el-avatar icon="el-icon-user-solid"></el-avatar>
  <el-avatar> user </el-avatar>
</template>

<script>
export default {
  data() {
    return {
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    }
  }
}
</script>
```

---

## 八、常用属性速查

### 尺寸属性 size

| 组件 | 可选值 | 默认值 |
|------|--------|--------|
| Button | medium / small / mini | — |
| Input | medium / small / mini | — |
| Select | large / small / mini | — |
| Table | medium / small / mini | — |
| Pagination | large / small / mini | — |

### 类型属性 type

| 组件 | 可选值 |
|------|--------|
| Button | primary / success / warning / danger / info / text |
| Tag | success / info / warning / danger |
| Message | success / warning / info / error |
| Notification | success / warning / info / error |
| Badge | primary / success / warning / danger / info |

### 状态属性

| 属性 | 说明 | 类型 |
|------|------|------|
| disabled | 禁用 | boolean |
| readonly | 只读 | boolean |
| loading | 加载中 | boolean |
| clearable | 可清空 | boolean |
| visible | 是否显示 | boolean |

---

## 九、组件使用技巧

### 1. 按需引入

```javascript
import { Button, Select, Input } from 'element-ui'

Vue.component(Button.name, Button)
Vue.component(Select.name, Select)
Vue.component(Input.name, Input)
```

### 2. 全局配置

```javascript
import ElementUI from 'element-ui'

Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
```

### 3. 自定义主题

```javascript
// 修改主题色
import ElementUI from 'element-ui'
import './theme/index.css'  // 自定义主题文件

Vue.use(ElementUI)
```

---

*最后更新：2024年*
*Element UI 版本：2.15.x*
