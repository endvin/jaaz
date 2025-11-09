import React, { useState } from 'react'
import StandaloneCanvas from './StandaloneCanvas'
import './App.css'

function App() {
  const [canvasData, setCanvasData] = useState<any>(null)
  const [selectedTab, setSelectedTab] = useState('basic')

  // 基础示例数据
  const basicExample = {
    elements: [
      {
        id: 'rect-1',
        type: 'rectangle',
        x: 100,
        y: 100,
        width: 200,
        height: 100,
        angle: 0,
        strokeColor: '#000000',
        backgroundColor: '#ffcc00',
        strokeWidth: 2,
        strokeStyle: 'solid',
        fillStyle: 'solid'
      },
      {
        id: 'text-1',
        type: 'text',
        x: 150,
        y: 150,
        width: 100,
        height: 25,
        angle: 0,
        strokeColor: '#000000',
        backgroundColor: 'transparent',
        strokeWidth: 1,
        strokeStyle: 'solid',
        fillStyle: 'solid',
        text: '示例文本',
        fontSize: 20,
        fontFamily: 1,
        textAlign: 'center',
        verticalAlign: 'middle'
      },
      {
        id: 'line-1',
        type: 'line',
        x: 300,
        y: 100,
        width: 150,
        height: 0,
        angle: 0,
        strokeColor: '#000000',
        backgroundColor: 'transparent',
        strokeWidth: 2,
        strokeStyle: 'solid',
        fillStyle: 'solid',
        points: [[0, 0], [150, 0]]
      }
    ],
    appState: {
      viewBackgroundColor: '#ffffff',
      currentItemStrokeColor: '#000000',
      currentItemBackgroundColor: '#ffffff',
      gridSize: 20
    },
    files: {}
  }

  // 高级示例数据
  const advancedExample = {
    elements: [
      {
        id: 'arrow-1',
        type: 'arrow',
        x: 100,
        y: 100,
        width: 200,
        height: 0,
        angle: 0,
        strokeColor: '#000000',
        backgroundColor: 'transparent',
        strokeWidth: 2,
        strokeStyle: 'solid',
        fillStyle: 'solid',
        points: [[0, 0], [200, 0]],
        startArrowHead: 'triangle' as const,
        endArrowHead: 'triangle' as const
      },
      {
        id: 'ellipse-1',
        type: 'ellipse',
        x: 350,
        y: 100,
        width: 100,
        height: 80,
        angle: 0,
        strokeColor: '#ff0000',
        backgroundColor: '#ffe0e0',
        strokeWidth: 2,
        strokeStyle: 'solid',
        fillStyle: 'solid'
      }
    ],
    appState: {
      viewBackgroundColor: '#f8f9fa',
      currentItemStrokeColor: '#007bff',
      currentItemBackgroundColor: '#fff',
      gridSize: 20
    },
    files: {}
  }

  // 画布变化处理
  const handleCanvasChange = (elements: any[], appState: any, files: any) => {
    console.log('画布已更新:', {
      elementsCount: elements.length,
      appState,
      filesCount: Object.keys(files).length
    })
    setCanvasData({ elements, appState, files })
  }

  // 加载示例数据
  const loadBasicExample = () => {
    setCanvasData(basicExample)
    setSelectedTab('basic')
  }

  const loadAdvancedExample = () => {
    setCanvasData(advancedExample)
    setSelectedTab('advanced')
  }

  const clearCanvas = () => {
    setCanvasData(null)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎨 独立画布示例 - 基于 Jaaz 画布技术</h1>
        <p>这个画布组件是从 Jaaz 项目中提取的 Excalidraw 画布功能</p>
      </header>

      <div className="controls">
        <div className="tab-buttons">
          <button 
            className={selectedTab === 'basic' ? 'active' : ''}
            onClick={loadBasicExample}
          >
            基础示例
          </button>
          <button 
            className={selectedTab === 'advanced' ? 'active' : ''}
            onClick={loadAdvancedExample}
          >
            高级示例
          </button>
          <button onClick={clearCanvas}>
            清空
          </button>
        </div>

        <div className="features">
          <h3>✨ 功能特性</h3>
          <ul>
            <li>🎨 基于 Excalidraw 画布引擎</li>
            <li>📱 响应式设计</li>
            <li>🌙 主题切换（浅色/深色）</li>
            <li>📤 多格式导出（PNG/SVG/JSON）</li>
            <li>🔧 可自定义工具栏</li>
            <li>📐 多种几何形状支持</li>
            <li>📝 文本编辑功能</li>
            <li>🖼️ 图片插入功能</li>
          </ul>
        </div>

        <div className="code-section">
          <h3>📋 使用代码</h3>
          <pre>
{`import StandaloneCanvas from './StandaloneCanvas'

<StandaloneCanvas
  width="100%"
  height="600px"
  theme="light"
  showSidebar={true}
  showToolbar={true}
  onChange={(elements, appState, files) => {
    console.log('画布变化', { elements, appState, files })
  }}
  exportOptions={{
    showExportButtons: true,
    showThemeToggle: true
  }}
/>`}
          </pre>
        </div>
      </div>

      <div className="canvas-container">
        <StandaloneCanvas
          width="100%"
          height="600px"
          initialData={canvasData}
          onChange={handleCanvasChange}
          theme="light"
          showSidebar={true}
          showToolbar={true}
          exportOptions={{
            showExportButtons: true,
            showThemeToggle: true
          }}
        />
      </div>

      <div className="info">
        <h3>📝 画布数据</h3>
        {canvasData ? (
          <div>
            <p>元素数量: {canvasData.elements?.length || 0}</p>
            <p>背景色: {canvasData.appState?.viewBackgroundColor}</p>
            <p>网格大小: {canvasData.appState?.gridSize}</p>
          </div>
        ) : (
          <p>画布为空</p>
        )}
      </div>

      <footer className="footer">
        <h3>🔧 Jaaz 画布提取指南</h3>
        <div className="extraction-guide">
          <div className="step">
            <h4>1. 核心依赖</h4>
            <code>npm install @excalidraw/excalidraw</code>
          </div>
          <div className="step">
            <h4>2. CSS 样式</h4>
            <code>import '@excalidraw/excalidraw/dist/excalidraw.css'</code>
          </div>
          <div className="step">
            <h4>3. 基础组件</h4>
            <code>import &#123; Excalidraw &#125; from '@excalidraw/excalidraw'</code>
          </div>
          <div className="step">
            <h4>4. 自定义功能</h4>
            <p>添加工具栏、导出功能、主题切换等自定义功能</p>
          </div>
        </div>
        
        <div className="jaaz-info">
          <h4>🔗 Jaaz 相关</h4>
          <p><strong>项目地址:</strong> https://github.com/11cafe/jaaz</p>
          <p><strong>许可证:</strong> 社区版免费使用，商业版需授权</p>
          <p><strong>主要功能:</strong> AI设计代理、多模态画布、本地部署</p>
          <p><strong>技术栈:</strong> React + Excalidraw + Electron + FastAPI</p>
        </div>
      </footer>
    </div>
  )
}

export default App
