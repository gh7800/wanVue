# HTML 常用标签速查手册

## 一、基础结构标签

```html
<!DOCTYPE html>      <!-- 声明文档类型 -->
<html>               <!-- 根元素 -->
<head>               <!-- 头部信息 -->
    <title>页面标题</title>
</head>
<body>               <!-- 页面主体 -->
    页面内容
</body>
</html>
```

---

## 二、文本标签

### 标题标签
```html
<h1>一级标题（最大）</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题（最小）</h6>
```

### 段落与文本
```html
<p>这是一个段落</p>
<span>行内文本</span>
<div>块级容器</div>
<br>                    <!-- 换行 -->
<hr>                    <!-- 水平分割线 -->
```

---

## 三、文本格式化标签

```html
<b>粗体文字</b>
<strong>强调粗体（语义化）</strong>

<i>斜体文字</i>
<em>强调斜体（语义化）</em>

<u>下划线</u>
<s>删除线</s>
<del>删除文本（语义化）</del>

<sup>上标</sup>         <!-- 如：x² -->
<sub>下标</sub>         <!-- 如：H₂O -->
```

---

## 四、链接与图片

### 超链接
```html
<!-- 基础链接 -->
<a href="https://www.baidu.com">访问百度</a>

<!-- 新窗口打开 -->
<a href="https://www.baidu.com" target="_blank">新窗口打开</a>

<!-- 页面内锚点 -->
<a href="#section1">跳转到第一章</a>

<!-- 邮件链接 -->
<a href="mailto:email@example.com">发送邮件</a>

<!-- 电话链接 -->
<a href="tel:13800138000">拨打电话</a>
```

### 图片
```html
<!-- 基础图片 -->
<img src="image.jpg" alt="图片描述">

<!-- 带尺寸 -->
<img src="logo.png" alt="Logo" width="200" height="100">

<!-- 响应式图片 -->
<img src="banner.jpg" alt="Banner" style="max-width: 100%;">
```

---

## 五、列表标签

### 无序列表
```html
<ul>
    <li>苹果</li>
    <li>香蕉</li>
    <li>橙子</li>
</ul>
```

### 有序列表
```html
<ol>
    <li>第一步：注册账号</li>
    <li>第二步：完善信息</li>
    <li>第三步：开始使用</li>
</ol>

<!-- 指定起始数字 -->
<ol start="5">
    <li>第五项</li>
    <li>第六项</li>
</ol>
```

### 定义列表
```html
<dl>
    <dt>HTML</dt>
    <dd>超文本标记语言</dd>
    <dt>CSS</dt>
    <dd>层叠样式表</dd>
</dl>
```

---

## 六、表格标签

```html
<table border="1">
    <thead>
        <tr>
            <th>姓名</th>
            <th>年龄</th>
            <th>城市</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>张三</td>
            <td>25</td>
            <td>北京</td>
        </tr>
        <tr>
            <td>李四</td>
            <td>30</td>
            <td>上海</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td colspan="3">总计：2人</td>
        </tr>
    </tfoot>
</table>
```

### 表格标签说明

| 标签 | 作用 |
|------|------|
| `<table>` | 表格容器 |
| `<tr>` | 表格行（table row） |
| `<th>` | 表头单元格（table header） |
| `<td>` | 数据单元格（table data） |
| `<thead>` | 表头区域 |
| `<tbody>` | 表体区域 |
| `<tfoot>` | 表尾区域 |
| `<caption>` | 表格标题 |

### 表格属性
```html
<td colspan="2">跨2列</td>      <!-- 合并列 -->
<td rowspan="2">跨2行</td>      <!-- 合并行 -->
```

---

## 七、表单标签

### 基础表单
```html
<form action="/submit" method="post">
    <!-- 文本输入 -->
    <input type="text" name="username" placeholder="请输入用户名">
    
    <!-- 密码输入 -->
    <input type="password" name="pwd" placeholder="请输入密码">
    
    <!-- 邮箱输入 -->
    <input type="email" name="email" placeholder="邮箱地址">
    
    <!-- 数字输入 -->
    <input type="number" name="age" min="1" max="120">
    
    <!-- 日期选择 -->
    <input type="date" name="birthday">
    
    <!-- 单选按钮 -->
    <input type="radio" name="gender" value="male"> 男
    <input type="radio" name="gender" value="female"> 女
    
    <!-- 复选框 -->
    <input type="checkbox" name="hobby" value="reading"> 阅读
    <input type="checkbox" name="hobby" value="sports"> 运动
    
    <!-- 下拉选择 -->
    <select name="city">
        <option value="">请选择城市</option>
        <option value="beijing">北京</option>
        <option value="shanghai">上海</option>
        <option value="guangzhou">广州</option>
    </select>
    
    <!-- 文本域 -->
    <textarea name="description" rows="4" cols="50" placeholder="请输入描述"></textarea>
    
    <!-- 文件上传 -->
    <input type="file" name="avatar" accept="image/*">
    
    <!-- 提交按钮 -->
    <button type="submit">提交</button>
    <button type="reset">重置</button>
</form>
```

### 表单属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `placeholder` | 占位提示文字 | `placeholder="请输入"` |
| `required` | 必填项 | `<input required>` |
| `disabled` | 禁用 | `<input disabled>` |
| `readonly` | 只读 | `<input readonly>` |
| `maxlength` | 最大长度 | `maxlength="10"` |
| `min` / `max` | 最小/最大值 | `min="1" max="100"` |
| `pattern` | 正则验证 | `pattern="[0-9]{11}"` |

---

## 八、HTML5 语义化标签

```html
<body>
    <header>                    <!-- 页面头部 -->
        <nav>                   <!-- 导航栏 -->
            <a href="#">首页</a>
            <a href="#">关于</a>
        </nav>
    </header>
    
    <main>                      <!-- 主要内容 -->
        <article>               <!-- 独立文章 -->
            <h1>文章标题</h1>
            <p>文章内容...</p>
        </article>
        
        <section>               <!-- 文档区块 -->
            <h2>章节标题</h2>
            <p>章节内容...</p>
        </section>
    </main>
    
    <aside>                     <!-- 侧边栏 -->
        <h3>相关推荐</h3>
        <ul>
            <li>推荐1</li>
            <li>推荐2</li>
        </ul>
    </aside>
    
    <footer>                    <!-- 页面底部 -->
        <p>版权所有 © 2024</p>
    </footer>
</body>
```

### 语义化标签对比

```html
<!-- 传统 div 写法 -->
<div class="header">头部</div>
<div class="nav">导航</div>
<div class="content">内容</div>
<div class="sidebar">侧边栏</div>
<div class="footer">底部</div>

<!-- HTML5 语义化写法 -->
<header>头部</header>
<nav>导航</nav>
<main>内容</main>
<aside>侧边栏</aside>
<footer>底部</footer>
```

**语义化的好处：**
- 代码更易读、易维护
- 有利于搜索引擎优化（SEO）
- 方便屏幕阅读器解析（无障碍访问）

---

## 九、多媒体标签

### 音频
```html
<audio controls>
    <source src="music.mp3" type="audio/mpeg">
    <source src="music.ogg" type="audio/ogg">
    您的浏览器不支持音频播放
</audio>
```

### 视频
```html
<video width="640" height="360" controls poster="preview.jpg">
    <source src="movie.mp4" type="video/mp4">
    <source src="movie.webm" type="video/webm">
    您的浏览器不支持视频播放
</video>
```

### 视频属性

| 属性 | 说明 |
|------|------|
| `controls` | 显示播放控件 |
| `autoplay` | 自动播放 |
| `loop` | 循环播放 |
| `muted` | 静音 |
| `poster` | 封面图片 |

---

## 十、其他常用标签

### 内嵌框架
```html
<!-- 嵌入其他网页 -->
<iframe src="https://www.example.com" width="800" height="600"></iframe>

<!-- 嵌入地图 -->
<iframe src="https://map.baidu.com/..." width="600" height="400"></iframe>
```

### 代码相关
```html
<code>行内代码</code>
<pre>预格式化文本
    保留空格和换行</pre>

<!-- 示例 -->
<pre><code>
function hello() {
    console.log('Hello World');
}
</code></pre>
```

### 引用
```html
<!-- 短引用 -->
<q>这是一句引用</q>

<!-- 长引用 -->
<blockquote cite="https://example.com">
    这是一段较长的引用内容...
</blockquote>

<!-- 缩写 -->
<abbr title="HyperText Markup Language">HTML</abbr>
```

###  details 折叠
```html
<details>
    <summary>点击展开</summary>
    <p>这里是隐藏的内容...</p>
</details>
```

### 进度条
```html
<!-- 进度条 -->
<progress value="70" max="100">70%</progress>

<!-- 度量衡 -->
<meter value="0.6" min="0" max="1" low="0.3" high="0.7" optimum="0.8">60%</meter>
```

---

## 十一、全局属性

所有 HTML 元素都可以使用的属性：

| 属性 | 说明 | 示例 |
|------|------|------|
| `class` | 类名（用于CSS） | `class="btn active"` |
| `id` | 唯一标识 | `id="header"` |
| `style` | 内联样式 | `style="color: red;"` |
| `title` | 提示文字 | `title="点击展开"` |
| `data-*` | 自定义数据 | `data-id="123"` |
| `hidden` | 隐藏元素 | `<div hidden>` |

---

## 十二、常用字符实体

| 显示 | 实体名称 | 实体编号 |
|------|----------|----------|
| 空格 | `&nbsp;` | `&#160;` |
| < | `&lt;` | `&#60;` |
| > | `&gt;` | `&#62;` |
| & | `&amp;` | `&#38;` |
| " | `&quot;` | `&#34;` |
| ' | `&apos;` | `&#39;` |
| © | `&copy;` | `&#169;` |
| ® | `&reg;` | `&#174;` |
| ¥ | `&yen;` | `&#165;` |
| € | `&euro;` | `&#8364;` |

---

## 速查表

### 块级元素 vs 行内元素

| 块级元素（独占一行） | 行内元素（并排显示） |
|---------------------|---------------------|
| `<div>` | `<span>` |
| `<p>` | `<a>` |
| `<h1>` ~ `<h6>` | `<strong>` |
| `<ul>` / `<ol>` | `<em>` |
| `<table>` | `<img>` |
| `<form>` | `<input>` |
| `<header>` / `<footer>` | `<label>` |
| `<section>` / `<article>` | `<code>` |

**块级元素特点：**
- 独占一行
- 可以设置宽高
- 默认宽度100%

**行内元素特点：**
- 并排显示
- 不能设置宽高
- 宽度由内容决定

---

*最后更新：2024年*
