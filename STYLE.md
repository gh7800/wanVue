# CSS 属性用法手册

## 目录

1. [盒模型](#盒模型)
2. [布局](#布局)
3. [文字样式](#文字样式)
4. [背景](#背景)
5. [边框](#边框)
6. [显示与定位](#显示与定位)
7. [Flex 布局](#flex-布局)
8. [动画与过渡](#动画与过渡)
9. [变换](#变换)
10. [其他常用属性](#其他常用属性)

---

## 盒模型

### width / height

```css
/* 固定值 */
width: 100px;
height: 50px;

/* 百分比 */
width: 100%;
height: 100vh;

/* 自适应 */
width: auto;
height: auto;

/* 最大值/最小值 */
min-width: 200px;
max-width: 1200px;
min-height: 100px;
max-height: 800px;
```

### margin

```css
/* 四个方向 */
margin: 10px;

/* 上下 左右 */
margin: 10px 20px;

/* 上 左右 下 */
margin: 10px 20px 30px;

/* 上 右 下 左 */
margin: 10px 20px 30px 40px;

/* 单独设置 */
margin-top: 10px;
margin-right: 20px;
margin-bottom: 30px;
margin-left: 40px;

/* 水平居中 */
margin: 0 auto;
```

### padding

```css
/* 语法同 margin */
padding: 10px;
padding: 10px 20px;
padding-top: 10px;
```

### border

```css
/* 简写 */
border: 1px solid #ccc;

/* 分开写 */
border-width: 1px;
border-style: solid;
border-color: #ccc;

/* 单边 */
border-top: 1px solid #ccc;
border-right: 2px dashed #f00;
border-bottom: 1px solid #ccc;
border-left: 2px dashed #f00;

/* 圆角 */
border-radius: 4px;
border-radius: 50%;        /* 圆形 */
border-radius: 10px 20px;  /* 左上右下 右上左下 */
```

### box-sizing

```css
/* 标准盒模型：width/height 只包含 content */
box-sizing: content-box;

/* 怪异盒模型：width/height 包含 content + padding + border */
box-sizing: border-box;    /* 推荐使用 */
```

---

## 布局

### display

```css
/* 块级元素 */
display: block;

/* 行内元素 */
display: inline;

/* 行内块元素 */
display: inline-block;

/* 隐藏元素 */
display: none;

/* Flex 布局 */
display: flex;

/* Grid 布局 */
display: grid;
```

### position

```css
/* 静态定位（默认） */
position: static;

/* 相对定位：相对于自身原位置 */
position: relative;
top: 10px;
left: 20px;

/* 绝对定位：相对于最近的定位祖先元素 */
position: absolute;
top: 0;
right: 0;
bottom: 0;
left: 0;

/* 固定定位：相对于视口 */
position: fixed;
top: 0;
left: 0;

/* 粘性定位 */
position: sticky;
top: 0;
```

### float

```css
float: left;     /* 左浮动 */
float: right;    /* 右浮动 */
float: none;     /* 不浮动 */

/* 清除浮动 */
clear: left;
clear: right;
clear: both;
```

### overflow

```css
/* 可见（默认） */
overflow: visible;

/* 隐藏溢出 */
overflow: hidden;

/* 滚动条 */
overflow: scroll;

/* 自动（溢出时显示滚动条） */
overflow: auto;

/* 单独设置 */
overflow-x: hidden;
overflow-y: auto;
```

---

## 文字样式

### font

```css
/* 简写 */
font: italic bold 16px/1.5 'Microsoft YaHei', sans-serif;
/*     样式   粗细  大小/行高   字体族 */

/* 分开写 */
font-style: italic;          /* normal | italic | oblique */
font-weight: bold;           /* normal | bold | 100-900 */
font-size: 16px;
line-height: 1.5;            /* 无单位：字体大小的倍数 */
font-family: 'Microsoft YaHei', Arial, sans-serif;
```

### color

```css
color: red;
color: #ff0000;
color: #f00;
color: rgb(255, 0, 0);
color: rgba(255, 0, 0, 0.5);    /* 带透明度 */
color: hsl(0, 100%, 50%);
```

### text-align

```css
text-align: left;      /* 左对齐 */
text-align: center;    /* 居中 */
text-align: right;     /* 右对齐 */
text-align: justify;   /* 两端对齐 */
```

### text-decoration

```css
text-decoration: none;           /* 无 */
text-decoration: underline;      /* 下划线 */
text-decoration: line-through;   /* 删除线 */
text-decoration: overline;       /* 上划线 */
```

### text-overflow

```css
/* 单行省略 */
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;

/* 多行省略（WebKit） */
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;
```

### white-space

```css
white-space: normal;      /* 合并空白，自动换行 */
white-space: nowrap;      /* 合并空白，不换行 */
white-space: pre;         /* 保留空白，不换行 */
white-space: pre-wrap;    /* 保留空白，自动换行 */
white-space: pre-line;    /* 合并空白（保留换行），自动换行 */
```

---

## 背景

### background

```css
/* 简写 */
background: #f00 url('image.jpg') no-repeat center center / cover;

/* 分开写 */
background-color: #f00;
background-color: rgba(255, 0, 0, 0.5);
background-color: transparent;

background-image: url('image.jpg');
background-image: linear-gradient(to right, red, blue);
background-image: linear-gradient(135deg, #f00 0%, #00f 100%);

background-repeat: no-repeat;
background-repeat: repeat-x;
background-repeat: repeat-y;

background-position: center center;
background-position: top left;
background-position: 50% 50%;
background-position: 10px 20px;

background-size: cover;       /* 覆盖整个元素 */
background-size: contain;     /* 完整显示图片 */
background-size: 100% 100%;   /* 拉伸填充 */
background-size: 50px 30px;   /* 固定尺寸 */

background-attachment: fixed; /* 背景固定 */
```

---

## 边框

### border-radius

```css
border-radius: 4px;
border-radius: 50%;
border-radius: 10px 20px 30px 40px;  /* 左上 右上 右下 左下 */
border-radius: 10px / 20px;          /* 水平半径 / 垂直半径 */
border-top-left-radius: 10px;
```

### box-shadow

```css
/* 水平偏移 垂直偏移 模糊半径 扩散半径 颜色 */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

/* 内阴影 */
box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

/* 多重阴影 */
box-shadow: 
  0 2px 4px rgba(0, 0, 0, 0.1),
  0 4px 8px rgba(0, 0, 0, 0.1);
```

---

## 显示与定位

### visibility

```css
visibility: visible;     /* 可见 */
visibility: hidden;      /* 不可见（占空间） */
visibility: collapse;    /* 表格中使用 */
```

### opacity

```css
opacity: 1;      /* 完全不透明 */
opacity: 0.5;    /* 半透明 */
opacity: 0;      /* 完全透明（占空间） */
```

### z-index

```css
/* 层叠顺序，数值越大越在上层 */
z-index: 1;
z-index: 100;
z-index: 9999;

/* 需要配合 position 使用（非 static） */
position: relative;
z-index: 10;
```

### cursor

```css
cursor: default;       /* 默认 */
cursor: pointer;       /* 手型 */
cursor: text;          /* 文本 */
cursor: move;          /* 移动 */
cursor: not-allowed;   /* 禁止 */
cursor: wait;          /* 等待 */
cursor: help;          /* 帮助 */
cursor: crosshair;     /* 十字 */
```

---

## Flex 布局

### 容器属性

```css
.container {
  display: flex;
  
  /* 主轴方向 */
  flex-direction: row;            /* 水平（默认） */
  flex-direction: row-reverse;    /* 水平反向 */
  flex-direction: column;         /* 垂直 */
  flex-direction: column-reverse; /* 垂直反向 */
  
  /* 换行 */
  flex-wrap: nowrap;              /* 不换行（默认） */
  flex-wrap: wrap;                /* 换行 */
  flex-wrap: wrap-reverse;        /* 反向换行 */
  
  /* 简写 */
  flex-flow: row wrap;
  
  /* 主轴对齐 */
  justify-content: flex-start;    /* 起点对齐 */
  justify-content: flex-end;      /* 终点对齐 */
  justify-content: center;        /* 居中 */
  justify-content: space-between; /* 两端对齐 */
  justify-content: space-around;  /* 平均分布 */
  justify-content: space-evenly;  /* 等间距 */
  
  /* 交叉轴对齐 */
  align-items: stretch;           /* 拉伸（默认） */
  align-items: flex-start;        /* 起点对齐 */
  align-items: flex-end;          /* 终点对齐 */
  align-items: center;            /* 居中 */
  align-items: baseline;          /* 基线对齐 */
  
  /* 多行对齐 */
  align-content: flex-start;
  align-content: center;
  align-content: space-between;
  align-content: space-around;
  
  /* 间距 */
  gap: 10px;
  row-gap: 10px;
  column-gap: 20px;
}
```

### 项目属性

```css
.item {
  /* 排列顺序 */
  order: 1;
  
  /* 放大比例 */
  flex-grow: 1;
  
  /* 缩小比例 */
  flex-shrink: 0;
  
  /* 基础大小 */
  flex-basis: 200px;
  
  /* 简写 */
  flex: 1;              /* flex-grow: 1 */
  flex: 0 0 200px;      /* 不放大不缩小，固定200px */
  flex: 1 1 auto;       /* 可放大可缩小 */
  
  /* 单独对齐 */
  align-self: center;
  align-self: flex-start;
  align-self: flex-end;
}
```

---

## 动画与过渡

### transition

```css
/* 简写 */
transition: all 0.3s ease;
transition: width 0.5s ease-in-out;

/* 分开写 */
transition-property: width;           /* 过渡属性 */
transition-duration: 0.3s;            /* 持续时间 */
transition-timing-function: ease;     /* 时间函数 */
transition-delay: 0.1s;               /* 延迟 */

/* 时间函数 */
transition-timing-function: linear;       /* 匀速 */
transition-timing-function: ease;         /* 慢-快-慢 */
transition-timing-function: ease-in;      /* 慢开始 */
transition-timing-function: ease-out;     /* 慢结束 */
transition-timing-function: ease-in-out;  /* 慢开始慢结束 */
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
```

### animation

```css
/* 定义动画 */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* 使用动画 */
.element {
  animation: slideIn 0.5s ease-out;
  
  /* 分开写 */
  animation-name: slideIn;
  animation-duration: 0.5s;
  animation-timing-function: ease-out;
  animation-delay: 0s;
  animation-iteration-count: 1;       /* 播放次数 */
  animation-iteration-count: infinite; /* 无限循环 */
  animation-direction: normal;         /* 正常播放 */
  animation-direction: reverse;        /* 反向播放 */
  animation-direction: alternate;      /* 正反向交替 */
  animation-fill-mode: forwards;       /* 保持结束状态 */
  animation-play-state: running;       /* 播放状态 */
  animation-play-state: paused;        /* 暂停 */
}
```

---

## 变换

### transform

```css
/* 位移 */
transform: translateX(100px);
transform: translateY(50px);
transform: translate(100px, 50px);
transform: translate(-50%, -50%);    /* 居中技巧 */

/* 缩放 */
transform: scale(1.5);               /* 放大1.5倍 */
transform: scale(0.5);               /* 缩小一半 */
transform: scaleX(2);
transform: scaleY(0.5);

/* 旋转 */
transform: rotate(45deg);
transform: rotate(-90deg);
transform: rotateX(45deg);
transform: rotateY(45deg);

/* 倾斜 */
transform: skewX(30deg);
transform: skewY(15deg);

/* 组合 */
transform: translateX(100px) rotate(45deg) scale(1.5);

/* 原点 */
transform-origin: center center;     /* 默认 */
transform-origin: top left;
transform-origin: 50% 50%;
transform-origin: 10px 20px;
```

---

## 其他常用属性

### 列表样式

```css
ul, ol {
  list-style: none;
  list-style-type: disc;
  list-style-type: decimal;
  list-style-position: inside;
  list-style-image: url('bullet.png');
}
```

### 表格样式

```css
table {
  border-collapse: collapse;   /* 合并边框 */
  border-collapse: separate;   /* 分开边框 */
  border-spacing: 0;
  table-layout: fixed;         /* 固定布局 */
  table-layout: auto;          /* 自动布局 */
}
```

### 内容生成

```css
.element::before {
  content: '';
  content: '前缀';
  content: attr(data-text);
}

.element::after {
  content: '';
  display: block;
  clear: both;
}
```

### 滚动条样式（WebKit）

```css
/* 整体 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

/* 轨道 */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

/* 滑块 */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

### 用户交互

```css
/* 禁止选择 */
user-select: none;
user-select: text;
user-select: all;

/* 指针事件 */
pointer-events: none;    /* 不响应鼠标事件 */
pointer-events: auto;    /* 响应鼠标事件 */

/* 触摸行为 */
touch-action: none;      /* 禁止触摸操作 */
touch-action: pan-y;     /* 只允许垂直滚动 */
```

### 轮廓

```css
/* 去掉焦点轮廓 */
outline: none;

/* 自定义轮廓 */
outline: 2px solid #f00;
outline-offset: 4px;
```

###  resize

```css
/* 允许调整大小 */
resize: both;
resize: horizontal;
resize: vertical;
resize: none;
```

---

## 常用组合技巧

### 水平垂直居中

```css
/* 方法1：Flex */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 方法2：绝对定位 + Transform */
.element {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 方法3：Grid */
.container {
  display: grid;
  place-items: center;
}
```

### 文字省略

```css
/* 单行 */
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 多行 */
.ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 清除浮动

```css
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}
```

### 三角形

```css
.triangle {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 20px solid #f00;
}
```

### 圆形/椭圆

```css
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.ellipse {
  width: 200px;
  height: 100px;
  border-radius: 50%;
}
```
