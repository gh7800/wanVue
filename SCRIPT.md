# Vue Script 与生命周期钩子

## 目录
- [script 标签](#script-标签)
- [Vue 实例选项](#vue-实例选项)
- [生命周期钩子](#生命周期钩子)
- [最佳实践](#最佳实践)

---

## script 标签

在 Vue 单文件组件（SFC）中，`<script>` 标签用于定义组件的 JavaScript 逻辑。

### 基本结构

```vue
<script>
export default {
  name: 'ComponentName',
  
  // 数据
  data() {
    return {
      message: 'Hello Vue'
    }
  },
  
  // 计算属性
  computed: {
    reversedMessage() {
      return this.message.split('').reverse().join('')
    }
  },
  
  // 方法
  methods: {
    greet() {
      alert(this.message)
    }
  },
  
  // 生命周期钩子
  created() {
    console.log('组件已创建')
  },
  
  mounted() {
    console.log('组件已挂载')
  }
}
</script>
```

### script 标签属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `lang` | 指定脚本语言 | `<script lang="ts">` |
| `setup` | 使用组合式 API（Vue 3） | `<script setup>` |
| `src` | 引入外部脚本文件 | `<script src="./logic.js">` |

---

## Vue 实例选项

### 常用选项

```javascript
export default {
  // 组件名称
  name: 'MyComponent',
  
  // 父组件传入的数据
  props: {
    title: String,
    count: {
      type: Number,
      default: 0
    }
  },
  
  // 响应式数据
  data() {
    return {
      list: [],
      loading: false
    }
  },
  
  // 计算属性
  computed: {
    // 只读计算属性
    fullName() {
      return this.firstName + ' ' + this.lastName
    },
    // 可读写的计算属性
    fullName: {
      get() {
        return this.firstName + ' ' + this.lastName
      },
      set(value) {
        const names = value.split(' ')
        this.firstName = names[0]
        this.lastName = names[1]
      }
    }
  },
  
  // 方法
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const res = await api.getList()
        this.list = res.data
      } finally {
        this.loading = false
      }
    },
    
    handleClick(event) {
      console.log('点击事件', event)
    }
  },
  
  // 侦听器
  watch: {
    // 简单监听
    message(newVal, oldVal) {
      console.log('message 变化:', oldVal, '->', newVal)
    },
    
    // 深度监听
    user: {
      deep: true,
      handler(newVal) {
        console.log('user 对象变化:', newVal)
      }
    },
    
    // 立即执行
    count: {
      immediate: true,
      handler(val) {
        console.log('count 初始值:', val)
      }
    }
  },
  
  // 组件
  components: {
    ChildComponent
  },
  
  // 混入
  mixins: [commonMixin],
  
  // 指令
  directives: {
    focus: {
      inserted(el) {
        el.focus()
      }
    }
  },
  
  // 过滤器
  filters: {
    currency(value) {
      return '¥' + value.toFixed(2)
    }
  }
}
```

---

## 生命周期钩子

Vue 2 组件从创建到销毁会经历一系列生命周期阶段，每个阶段都有对应的钩子函数。

### 生命周期图示

```
                    ┌─────────────────┐
                    │   beforeCreate  │  ← 实例初始化之后，数据观测之前
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │     created     │  ← 实例创建完成，数据已观测
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  beforeMount    │  ← 挂载开始之前，render 函数首次调用
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │     mounted     │  ← 实例挂载到 DOM，可以访问 el
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼───────┐   ┌────────▼────────┐   ┌──────▼──────┐
│  beforeUpdate │   │  组件运行期间    │   │ beforeDestroy│
│  (数据更新前)  │   │                 │   │ (销毁前)     │
└───────┬───────┘   └─────────────────┘   └──────┬──────┘
        │                                         │
┌───────▼───────┐                       ┌────────▼────────┐
│    updated    │                       │    destroyed    │
│  (数据更新后)  │                       │   (销毁完成)     │
└───────────────┘                       └─────────────────┘
```

### 钩子函数详解

#### 1. beforeCreate

```javascript
export default {
  beforeCreate() {
    // 实例刚初始化，数据观测和事件配置之前
    // 此时无法访问 data、computed、methods
    console.log('beforeCreate')
    console.log(this.message) // undefined
  }
}
```

**使用场景**：
- 添加全局事件监听
- 初始化非响应式数据

#### 2. created

```javascript
export default {
  created() {
    // 实例创建完成，数据观测已完成
    // 可以访问 data、computed、methods
    // 但 DOM 还未生成，不能访问 $el
    console.log('created')
    console.log(this.message) // 'Hello Vue'
    console.log(this.$el) // undefined
    
    // 常用于：初始化数据、调用 API
    this.fetchData()
  },
  
  methods: {
    async fetchData() {
      const res = await this.$http.get('/api/data')
      this.list = res.data
    }
  }
}
```

**使用场景**：
- 发起 AJAX 请求获取初始数据
- 初始化事件总线监听
- 设置定时器

#### 3. beforeMount

```javascript
export default {
  beforeMount() {
    // 挂载开始之前，模板编译完成
    // 即将渲染 DOM
    console.log('beforeMount')
    console.log(this.$el) // 虚拟 DOM，还未挂载到真实 DOM
  }
}
```

**使用场景**：
- 在渲染前修改数据（较少使用）
- 服务端渲染时在此获取数据

#### 4. mounted

```javascript
export default {
  mounted() {
    // 实例已挂载到 DOM
    // 可以访问真实的 DOM 元素
    console.log('mounted')
    console.log(this.$el) // 真实的 DOM 元素
    
    // 操作 DOM
    this.$refs.input.focus()
    
    // 初始化第三方库
    this.initChart()
  },
  
  methods: {
    initChart() {
      const chart = echarts.init(this.$refs.chart)
      chart.setOption({
        // 图表配置
      })
      this.chart = chart
    }
  }
}
```

**使用场景**：
- 操作 DOM
- 初始化第三方库（图表、地图等）
- 添加 DOM 事件监听

⚠️ **注意**：`mounted` 不保证所有子组件都已挂载。如需等待整个视图渲染完成，使用 `this.$nextTick`：

```javascript
mounted() {
  this.$nextTick(() => {
    // 整个视图渲染完成
  })
}
```

#### 5. beforeUpdate

```javascript
export default {
  beforeUpdate() {
    // 数据更新时调用，发生在虚拟 DOM 打补丁之前
    // 可以在此获取更新前的 DOM 状态
    console.log('beforeUpdate')
  }
}
```

**使用场景**：
- 获取更新前的 DOM 状态
- 在更新前执行某些操作

#### 6. updated

```javascript
export default {
  updated() {
    // 数据更新后，虚拟 DOM 重新渲染并打补丁
    // DOM 已更新
    console.log('updated')
    
    // 避免无限循环：不要在 updated 中修改可能触发更新的数据
    // 错误示例：
    // this.count++ // 会导致无限更新循环
  }
}
```

**使用场景**：
- 执行依赖于更新后 DOM 的操作
- 与第三方库同步 DOM 状态

⚠️ **注意**：避免在 `updated` 中修改组件数据，可能导致无限循环。

#### 7. beforeDestroy

```javascript
export default {
  beforeDestroy() {
    // 实例销毁之前调用
    // 实例仍然完全可用
    console.log('beforeDestroy')
    
    // 清理工作
    clearInterval(this.timer)
    window.removeEventListener('resize', this.handleResize)
    this.chart && this.chart.dispose()
  }
}
```

**使用场景**：
- 清除定时器
- 移除事件监听
- 销毁第三方库实例
- 取消未完成的 AJAX 请求

#### 8. destroyed

```javascript
export default {
  destroyed() {
    // 实例销毁后调用
    // 所有绑定解除，所有子实例销毁
    console.log('destroyed')
  }
}
```

**使用场景**：
- 执行最终的清理工作
- 通知其他组件该组件已销毁

### 完整示例

```vue
<template>
  <div class="lifecycle-demo">
    <h2>生命周期演示</h2>
    <p>计数: {{ count }}</p>
    <button @click="count++">增加</button>
    <button @click="destroyComponent">销毁组件</button>
  </div>
</template>

<script>
export default {
  name: 'LifecycleDemo',
  
  data() {
    return {
      count: 0,
      timer: null
    }
  },
  
  // ========== 创建阶段 ==========
  beforeCreate() {
    console.log('1. beforeCreate')
    console.log('   - data:', this.count) // undefined
    console.log('   - $el:', this.$el) // undefined
  },
  
  created() {
    console.log('2. created')
    console.log('   - data:', this.count) // 0
    console.log('   - $el:', this.$el) // undefined
    
    // 初始化数据
    this.initData()
  },
  
  // ========== 挂载阶段 ==========
  beforeMount() {
    console.log('3. beforeMount')
    console.log('   - $el:', this.$el) // 虚拟 DOM
  },
  
  mounted() {
    console.log('4. mounted')
    console.log('   - $el:', this.$el) // 真实 DOM
    
    // 启动定时器
    this.timer = setInterval(() => {
      console.log('定时器运行中...')
    }, 1000)
    
    // 添加事件监听
    window.addEventListener('resize', this.handleResize)
  },
  
  // ========== 更新阶段 ==========
  beforeUpdate() {
    console.log('5. beforeUpdate')
    console.log('   - count 即将从', this.count, '更新')
  },
  
  updated() {
    console.log('6. updated')
    console.log('   - count 已更新为', this.count)
  },
  
  // ========== 销毁阶段 ==========
  beforeDestroy() {
    console.log('7. beforeDestroy')
    
    // 清理定时器
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    
    // 移除事件监听
    window.removeEventListener('resize', this.handleResize)
  },
  
  destroyed() {
    console.log('8. destroyed')
    console.log('   - 组件已完全销毁')
  },
  
  methods: {
    initData() {
      console.log('   - 在 created 中初始化数据')
    },
    
    handleResize() {
      console.log('窗口大小改变')
    },
    
    destroyComponent() {
      this.$destroy()
    }
  }
}
</script>
```

---

## 最佳实践

### 1. 数据请求放在 created 还是 mounted？

```javascript
export default {
  // 推荐：在 created 中发起请求
  // 可以更早获取数据，减少用户等待时间
  created() {
    this.fetchData()
  },
  
  // 如果请求依赖于 DOM，则放在 mounted
  mounted() {
    // 例如：需要根据 DOM 尺寸计算请求参数
    const width = this.$el.offsetWidth
    this.fetchData({ width })
  }
}
```

### 2. 清理工作统一放在 beforeDestroy

```javascript
export default {
  data() {
    return {
      timer: null,
      socket: null,
      eventBusHandler: null
    }
  },
  
  created() {
    // 初始化
    this.timer = setInterval(this.poll, 5000)
    this.socket = new WebSocket('ws://example.com')
    this.eventBusHandler = (data) => this.handleEvent(data)
    this.$eventBus.$on('event', this.eventBusHandler)
  },
  
  beforeDestroy() {
    // 统一清理，避免内存泄漏
    clearInterval(this.timer)
    this.socket.close()
    this.$eventBus.$off('event', this.eventBusHandler)
  }
}
```

### 3. 使用 keep-alive 时的额外钩子

```javascript
export default {
  // 组件被 keep-alive 缓存时
  
  activated() {
    // 组件被激活时调用
    console.log('组件被激活')
    this.refreshData()
  },
  
  deactivated() {
    // 组件被停用时调用
    console.log('组件被停用')
    this.saveScrollPosition()
  }
}
```

### 4. 错误处理钩子

```javascript
export default {
  // 捕获子组件的错误
  errorCaptured(err, vm, info) {
    console.error('子组件错误:', err)
    console.log('出错组件:', vm)
    console.log('错误信息:', info)
    
    // 返回 false 阻止错误继续向上传播
    return false
  }
}
```

### 5. 服务端渲染（SSR）专用钩子

```javascript
export default {
  // 只在服务端执行
  async serverPrefetch() {
    // 服务端获取数据
    this.data = await fetchData()
  }
}
```

---

## 总结

| 钩子 | 执行时机 | 常用场景 |
|------|----------|----------|
| `beforeCreate` | 实例初始化后 | 插件初始化 |
| `created` | 实例创建完成 | 数据请求、事件监听 |
| `beforeMount` | 挂载开始前 | 较少使用 |
| `mounted` | 挂载完成后 | DOM 操作、第三方库初始化 |
| `beforeUpdate` | 数据更新前 | 获取更新前状态 |
| `updated` | 数据更新后 | DOM 同步操作 |
| `beforeDestroy` | 销毁前 | 清理工作（必须） |
| `destroyed` | 销毁后 | 最终清理 |
| `activated` | keep-alive 激活 | 刷新数据 |
| `deactivated` | keep-alive 停用 | 保存状态 |

理解生命周期钩子对于编写高质量的 Vue 组件至关重要，合理使用可以确保组件性能最优且避免内存泄漏。
