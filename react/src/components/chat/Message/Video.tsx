import { Button } from '@/components/ui/button'
import { useCanvas } from '@/contexts/canvas'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import MediaOverlay from './MediaOverlay'

type MessageVideoProps = {
  content: {
    video_url: {
      url: string
      poster?: string
      duration?: number
    }
    type: 'video_url'
  }
}

const MessageVideo = ({ content }: MessageVideoProps) => {
  const { t } = useTranslation()
  const { excalidrawAPI } = useCanvas()
  const [open, setOpen] = useState(false)

  const handleFocusCanvas = () => {
    excalidrawAPI?.scrollToContent(undefined, { animate: true })
  }

  return (
    <div className="w-full max-w-[220px]">
      <div className="relative group">
        <video
          className="w-full h-auto rounded-md border border-border"
          src={content.video_url.url}
          poster={content.video_url.poster}
          controls
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="pointer-events-auto absolute top-2 left-2 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="text-xs"
              onClick={(e) => {
                e.stopPropagation()
                setOpen(true)
              }}
            >
              {t('chat:overlay.open', '预览/生成')}
            </Button>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="group-hover:opacity-100 opacity-0 absolute top-2 right-2 z-10 text-xs pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation()
              handleFocusCanvas()
            }}
          >
            {t('chat:messages:focusCanvas', '定位画布')}
          </Button>
        </div>
      </div>

      <MediaOverlay
        open={open}
        onOpenChange={setOpen}
        type="video"
        url={content.video_url.url}
        poster={content.video_url.poster}
      />
    </div>
  )
}

export default MessageVideo
