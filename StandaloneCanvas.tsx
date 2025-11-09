import React, { useCallback, useRef, useState } from 'react'
import { Excalidraw, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/dist/excalidraw.css'

export type StandaloneCanvasProps = {
  width?: string
  height?: string
  initialData?: any
  onChange?: (elements: any[], appState: any, files: any) => void
  readOnly?: boolean
  showSidebar?: boolean
  showToolbar?: boolean
  theme?: 'light' | 'dark'
  exportOptions?: {
    showExportButtons?: boolean
    showThemeToggle?: boolean
  }
}

const StandaloneCanvas: React.FC<StandaloneCanvasProps> = ({
  width = '100%',
  height = '600px',
  initialData,
  onChange,
  readOnly = false,
  showSidebar = true,
  showToolbar = true,
  theme = 'light',
  exportOptions = {
    showExportButtons: true,
    showThemeToggle: true
  }
}) => {
  const excalidrawAPI = useRef<ExcalidrawImperativeAPI | null>(null)
  const [currentTheme, setCurrentTheme] = useState(theme)
  const [elements, setElements] = useState<any[]>(initialData?.elements || [])

  // 设置画布 API 引用
  const onChangeRef = useCallback((api: ExcalidrawImperativeAPI) => {
    excalidrawAPI.current = api
  }, [])

  // 画布变化处理
  const handleChange = useCallback((
    elements: readonly any[],
    appState: any,
    files: any
  ) => {
    setElements([...elements])
    onChange?.(elements, appState, files)
  }, [onChange])

  // 导出函数
  const exportToPNG = useCallback(async () => {
    if (excalidrawAPI.current) {
      const canvas = await excalidrawAPI.current.exportToCanvas({
        elements: excalidrawAPI.current.getSceneElements(),
        appState: excalidrawAPI.current.getAppState(),
        files: excalidrawAPI.current.getFiles(),
        mimeType: 'image/png'
      })
      
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = 'canvas.png'
      link.click()
    }
  }, [])

  const exportToSVG = useCallback(async () => {
    if (excalidrawAPI.current) {
      const svg = await excalidrawAPI.current.exportToSvg({
        elements: excalidrawAPI.current.getSceneElements(),
        appState: excalidrawAPI.current.getAppState(),
        files: excalidrawAPI.current.getFiles()
      })
      
      const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'canvas.svg'
      link.click()
      URL.revokeObjectURL(url)
    }
  }, [])

  const exportToJSON = useCallback(() => {
    if (excalidrawAPI.current) {
      const data = {
        type: 'excalidraw',
        version: 2,
        elements: excalidrawAPI.current.getSceneElements(),
        appState: excalidrawAPI.current.getAppState(),
        files: excalidrawAPI.current.getFiles()
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'canvas.json'
      link.click()
      URL.revokeObjectURL(url)
    }
  }, [])

  // 主题切换
  const toggleTheme = useCallback(() => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    setCurrentTheme(newTheme)
  }, [currentTheme])

  // 添加元素函数
  const addText = useCallback(() => {
    if (excalidrawAPI.current) {
      const newText = {
        id: `text-${Date.now()}`,
        type: 'text' as const,
        x: 200,
        y: 200,
        width: 200,
        height: 25,
        angle: 0,
        strokeColor: currentTheme === 'dark' ? '#ffffff' : '#000000',
        backgroundColor: 'transparent',
        strokeWidth: 1,
        strokeStyle: 'solid' as const,
        fillStyle: 'solid' as const,
        text: '新文本',
        fontSize: 20,
        fontFamily: 1,
        textAlign: 'left' as const,
        verticalAlign: 'top' as const
      }
      
      excalidrawAPI.current.updateScene({
        elements: [
          ...excalidrawAPI.current.getSceneElements(),
          newText
        ]
      })
    }
  }, [currentTheme])

  const addRectangle = useCallback(() => {
    if (excalidrawAPI.current) {
      const newRect = {
        id: `rect-${Date.now()}`,
        type: 'rectangle' as const,
        x: 250,
        y: 250,
        width: 150,
        height: 100,
        angle: 0,
        strokeColor: currentTheme === 'dark' ? '#ffffff' : '#000000',
        backgroundColor: currentTheme === 'dark' ? '#333333' : '#ffcc00',
        strokeWidth: 2,
        strokeStyle: 'solid' as const,
        fillStyle: 'solid' as const
      }
      
      excalidrawAPI.current.updateScene({
        elements: [
          ...excalidrawAPI.current.getSceneElements(),
          newRect
        ]
      })
    }
  }, [currentTheme])

  const clearCanvas = useCallback(() => {
    if (excalidrawAPI.current) {
      excalidrawAPI.current.updateScene({
        elements: [],
        appState: {
          viewBackgroundColor: currentTheme === 'dark' ? '#1e1e1e' : '#ffffff'
        }
      })
    }
  }, [currentTheme])

  return (
    <div style={{ 
      width, 
      height, 
      position: 'relative',
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {showToolbar && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          background: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>画布工具</div>
          <button onClick={addText} style={{ fontSize: '11px' }}>添加文本</button>
          <button onClick={addRectangle} style={{ fontSize: '11px' }}>添加矩形</button>
          <button onClick={clearCanvas} style={{ fontSize: '11px' }}>清空画布</button>
        </div>
      )}

      {exportOptions?.showExportButtons && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          background: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>导出</div>
          <button onClick={exportToPNG} style={{ fontSize: '11px' }}>PNG</button>
          <button onClick={exportToSVG} style={{ fontSize: '11px' }}>SVG</button>
          <button onClick={exportToJSON} style={{ fontSize: '11px' }}>JSON</button>
        </div>
      )}

      {exportOptions?.showThemeToggle && (
        <button
          onClick={toggleTheme}
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            zIndex: 1000,
            padding: '8px 16px',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {currentTheme === 'light' ? '🌞 浅色' : '🌙 深色'}
        </button>
      )}

      <Excalidraw
        ref={onChangeRef}
        initialData={initialData}
        onChange={handleChange}
        viewModeEnabled={readOnly}
        UIOptions={{
          canvasActions: {
            export: false,
            saveToActiveFile: false,
            loadScene: false
          }
        }}
        renderSidebar={showSidebar ? undefined : null}
      />
    </div>
  )
}

export default StandaloneCanvas
