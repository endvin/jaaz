# Jaaz 画布提取包

🎨 **从 Jaaz AI 设计代理中提取的独立画布组件**

这个项目包含了从 Jaaz 开源项目中提取的画布功能，可以作为独立的 React 组件使用。

## 📁 文件结构

```
jaaz-canvas-extraction/
├── StandaloneCanvas.tsx      # 核心画布组件
├── CanvasExample.tsx         # 使用示例组件  
├── App.css                   # 示例样式
├── standalone-canvas-example.html  # 纯HTML版本示例
├── canvas-package.json       # 包配置
└── README.md                 # 本文件
```

## 🚀 快速开始

### 方法1: HTML 版本（推荐新手）

直接打开 `standalone-canvas-example.html` 文件即可在浏览器中测试。

```bash
# 在浏览器中打开
open standalone-canvas-example.html
# 或双击文件
```

### 方法2: React 组件版本

1. **安装依赖**
```bash
npm install @excalidraw/excalidraw react react-dom
```

2. **导入组件**
```tsx
import StandaloneCanvas from './StandaloneCanvas'
import '@excalidraw/excalidraw/dist/excalidraw.css'
```

3. **使用组件**
```tsx
<StandaloneCanvas
  width="100%"
  height="600px"
  theme="light"
  onChange={(elements, appState, files) => {
    console.log('画布数据', { elements, appState, files })
  }}
/>
```

## ✨ 核心功能

### 🎨 画布功能
- **基于 Excalidraw 引擎** - 专业级画布功能
- **多种图形支持** - 矩形、圆形、线条、箭头、文本等
- **图片插入** - 支持本地和在线图片
- **拖拽调整** - 所有元素都支持拖拽和缩放

### 🎛️ 交互功能  
- **工具栏** - 可自定义的工具按钮
- **导出功能** - PNG、SVG、JSON 格式导出
- **主题切换** - 浅色/深色主题
- **响应式设计** - 适配各种屏幕尺寸

### 🔧 自定义选项
```tsx
<StandaloneCanvas
  width="100%"              // 画布宽度
  height="600px"            // 画布高度  
  theme="light"             // 主题: 'light' | 'dark'
  readOnly={false}          // 只读模式
  showSidebar={true}        // 显示侧边栏
  showToolbar={true}        // 显示工具栏
  initialData={data}        // 初始数据
  onChange={handler}        // 变化回调
  exportOptions={{
    showExportButtons: true,    // 显示导出按钮
    showThemeToggle: true       // 显示主题切换
  }}
/>
```

## 📝 API 参考

### 组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `width` | string | '100%' | 画布宽度 |
| `height` | string | '600px' | 画布高度 |
| `theme` | 'light' \\| 'dark' | 'light' | 主题 |
| `readOnly` | boolean | false | 只读模式 |
| `showSidebar` | boolean | true | 显示侧边栏 |
| `showToolbar` | boolean | true | 显示工具栏 |
| `initialData` | object | null | 初始画布数据 |
| `onChange` | function | null | 画布变化回调 |
| `exportOptions` | object | 默认对象 | 导出选项 |

### 回调函数

```tsx
onChange: (elements: any[], appState: any, files: any) => void

// elements: 画布元素数组
// appState: 应用状态
// files: 文件数据
```

### 导出功能

组件内置了导出功能，支持：
- **PNG** - 位图格式，适合图片展示
- **SVG** - 矢量格式，适合打印和缩放
- **JSON** - 数据格式，包含完整画布信息

## 🔗 画布数据结构

```tsx
// 画布元素类型
interface CanvasElement {
  id: string                    // 唯一标识
  type: 'rectangle' \\| 'circle' \\| 'line' \\| 'text' \\| 'arrow' | 'image'
  x: number                     // X坐标
  y: number                     // Y坐标  
  width: number                 // 宽度
  height: number                // 高度
  angle: number                 // 旋转角度
  strokeColor: string           // 边框颜色
  backgroundColor: string       // 背景颜色
  strokeWidth: number           // 边框宽度
  text?: string                 // 文本内容（仅文本类型）
  // ... 其他属性
}

// 画布数据格式
interface CanvasData {
  elements: CanvasElement[]     // 元素数组
  appState: {                   // 应用状态
    viewBackgroundColor: string // 背景色
    gridSize: number           // 网格大小
    // ... 其他状态
  }
  files: { [key: string]: any } // 文件数据
}
```

## 🎯 使用示例

### 基础画布
```tsx
<StandaloneCanvas
  height="500px"
  showToolbar={false}
  onChange={(elements) => {
    console.log('元素数量:', elements.length)
  }}
/>
```

### 定制工具栏
```tsx
<StandaloneCanvas
  width="800px"
  height="600px" 
  theme="dark"
  showSidebar={false}
  exportOptions={{
    showExportButtons: true,
    showThemeToggle: true
  }}
/>
```

### 保存/加载画布
```tsx
const [canvasData, setCanvasData] = useState(null)

// 保存
const saveCanvas = () => {
  const data = {
    elements: excalidrawAPI.current.getSceneElements(),
    appState: excalidrawAPI.current.getAppState(),
    files: excalidrawAPI.current.getFiles()
  }
  localStorage.setItem('my-canvas', JSON.stringify(data))
  setCanvasData(data)
}

// 加载
const loadCanvas = () => {
  const saved = localStorage.getItem('my-canvas')
  if (saved) {
    setCanvasData(JSON.parse(saved))
  }
}
```

## 🛠️ 技术细节

### 依赖项
- **@excalidraw/excalidraw** - 核心画布引擎
- **React 18+** - 组件框架
- **CSS** - 样式支持

### 兼容性
- ✅ Chrome 80+
- ✅ Firefox 75+  
- ✅ Safari 13+
- ✅ Edge 80+

### 性能优化
- 元素变化防抖处理
- 虚拟化大画布支持
- 文件懒加载

## 📄 许可证

本提取包基于 Jaaz 项目的画布功能。Jaaz 项目使用自定义许可证：

- **社区版**: 个人免费使用
- **商业版**: 需要购买授权

了解更多: [Jaaz 许可证](https://github.com/11cafe/jaaz/blob/main/LICENSE)

## 🔗 相关链接

- **Jaaz 项目**: https://github.com/11cafe/jaaz
- **Excalidraw**: https://excalidraw.com/
- **原始文档**: 查看 Jaaz 项目的 `react/src/components/canvas/` 目录

## 🤝 贡献

如果你改进这个画布组件或发现bug，欢迎提交 Pull Request！

## 📞 支持

如有问题，请：
1. 查看 Jaaz 项目的 Issues
2. 检查 Excalidraw 文档
3. 提交新的 Issue

---

**由 Jaaz AI 设计代理项目提取 ❤️**
