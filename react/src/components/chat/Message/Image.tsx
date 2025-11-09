import { Button } from '@/components/ui/button'
import { useCanvas } from '@/contexts/canvas'
import { useTranslation } from 'react-i18next'
import MediaOverlay from './MediaOverlay'
import { useState } from 'react'

type MessageImageProps = {
  content: {
    image_url: {
      url: string
    }
    type: 'image_url'
  }
}

const MessageImage = ({ content }: MessageImageProps) => {
  const { excalidrawAPI } = useCanvas()
  const files = excalidrawAPI?.getFiles()
  const filesArray = Object.keys(files || {}).map((key) => ({
    id: key,
    url: files![key].dataURL,
  }))

  const { t } = useTranslation()

  const handleImagePositioning = (id: string) => {
    excalidrawAPI?.scrollToContent(id, { animate: true })
  }
  const id = filesArray.find((file) =>
    content.image_url.url?.includes(file.url)
  )?.id

  const [open, setOpen] = useState(false)

  return (
    <div className="w-full max-w-[140px]">
      <div className="relative group cursor-pointer" onClick={() => setOpen(true)}>
        <img
          className="w-full h-auto max-h-[140px] object-cover rounded-md border border-border hover:scale-105 transition-transform duration-300"
          src={content.image_url.url}
          alt="Image"
        />

        {id && (
          <Button
            variant="secondary"
            size="sm"
            className="group-hover:opacity-100 opacity-0 absolute top-2 right-2 z-10 text-xs"
            onClick={(e) => {
              e.stopPropagation()
              handleImagePositioning(id)
            }}
          >
            {t('chat:messages:imagePositioning')}
          </Button>
        )}
      </div>

      <MediaOverlay
        open={open}
        onOpenChange={setOpen}
        type="image"
        url={content.image_url.url}
      />
    </div>
  )
}

export default MessageImage
