import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState, useMemo, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { eventBus } from '@/lib/event'
import { useConfigs } from '@/contexts/configs'
import { useChat } from '@/contexts/chat'
import ModelSelectorV3 from '../ModelSelectorV3'

type MediaOverlayProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: 'image' | 'video'
  url: string
  poster?: string
}

const MediaOverlay: React.FC<MediaOverlayProps> = ({ open, onOpenChange, type, url, poster }) => {
  const { t } = useTranslation()
  const { textModel, selectedTools } = useConfigs()
  const { messages } = useChat()
  const [prompt, setPrompt] = useState('请基于当前内容生成更多风格变化')
  const videoRef = useRef<HTMLVideoElement>(null)

  const mediaTitle = useMemo(() => (type === 'image' ? '图片预览' : '视频预览'), [type])

  const fetchToBase64 = useCallback(async (resourceUrl: string): Promise<string> => {
    if (!resourceUrl) return ''
    if (resourceUrl.startsWith('data:')) return resourceUrl
    const resp = await fetch(resourceUrl)
    const blob = await resp.blob()
    return new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  }, [])

  const captureVideoFrameToBase64 = useCallback(async (): Promise<string> => {
    if (!videoRef.current) return ''
    const video = videoRef.current
    // 优先使用 poster
    if (poster) {
      try {
        const poster64 = await fetchToBase64(poster)
        if (poster64) return poster64
      } catch {}
    }
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return ''
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        return canvas.toDataURL('image/png')
      } catch (err) {
        console.warn('capture frame failed', err)
      }
    }
    return ''
  }, [poster, fetchToBase64])

  const handleGenerate = useCallback(async () => {
    let base64 = ''
    if (type === 'image') {
      base64 = await fetchToBase64(url)
    } else {
      base64 = await captureVideoFrameToBase64()
    }

    if (!base64) {
      // 无法获取内容时直接返回
      return
    }

    const newUserMessage = {
      role: 'user' as const,
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: base64 } }
      ]
    }

    eventBus.emit('Chat::GenerateFromMedia', {
      newMessages: messages.concat([newUserMessage]),
      configs: {
        textModel: textModel!,
        toolList: selectedTools || []
      }
    })
    onOpenChange(false)
  }, [prompt, messages, textModel, selectedTools, url, type, fetchToBase64, captureVideoFrameToBase64, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{mediaTitle}</span>
            <ModelSelectorV3 />
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-center bg-muted rounded-lg p-2">
            {type === 'image' ? (
              <img src={url} className="max-h-[60vh] rounded-md border border-border" />
            ) : (
              <video ref={videoRef} src={url} poster={poster} controls className="max-h-[60vh] rounded-md border border-border" />
            )}
          </div>

          <div className="flex flex-col gap-3">
            <textarea
              className="w-full h-40 rounded-md border border-border bg-background p-3 text-sm"
              placeholder={t('chat:overlay.promptPlaceholder', '输入提示（可选）')}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Button
                className="shrink-0"
                disabled={!textModel}
                onClick={handleGenerate}
              >
                {t('chat:overlay.generateFromMedia', '根据当前内容再次生成图片')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MediaOverlay
