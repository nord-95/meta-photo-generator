import React, { useRef, useEffect } from 'react'

export default function PreviewArea({ canvasRef }) {
  const frameRef = useRef(null)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const handleDragOver = (e) => {
      e.preventDefault()
      e.stopPropagation()
      frame.classList.add('drag-over')
    }

    const handleDragLeave = (e) => {
      e.preventDefault()
      e.stopPropagation()
      frame.classList.remove('drag-over')
    }

    const handleDrop = (e) => {
      e.preventDefault()
      e.stopPropagation()
      frame.classList.remove('drag-over')
      const file = e.dataTransfer.files?.[0]
      if (file && file.type.startsWith('image/')) {
        // Handle drop - this will be passed up to parent
        if (window.handleImageDrop) {
          window.handleImageDrop(file)
        }
      }
    }

    frame.addEventListener('dragover', handleDragOver)
    frame.addEventListener('dragleave', handleDragLeave)
    frame.addEventListener('drop', handleDrop)

    return () => {
      frame.removeEventListener('dragover', handleDragOver)
      frame.removeEventListener('dragleave', handleDragLeave)
      frame.removeEventListener('drop', handleDrop)
    }
  }, [])

  return (
    <main className="preview-area">
      <div className="preview-container">
        <div id="frame" ref={frameRef} className="canvas-frame">
          <canvas ref={canvasRef} id="canvas" width="1300" height="867"></canvas>
        </div>
        <div className="preview-info">
          <span>1300 × 867px</span>
          <span>•</span>
          <span>Perfect for social media</span>
        </div>
      </div>
    </main>
  )
}

