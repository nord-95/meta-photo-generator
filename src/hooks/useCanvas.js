import { useState, useCallback, useRef } from 'react'
import { drawCanvas } from '../utils/canvasUtils'

const W = 1300
const H = 867

export function useCanvas(canvasRef) {
  const [img, setImg] = useState(null)
  const [logo, setLogo] = useState(null)
  const imgNameRef = useRef('image')

  const loadImage = useCallback((file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.onload = () => {
        setImg(image)
        imgNameRef.current = file.name.replace(/\.[^.]+$/, '') || 'image'
      }
      image.onerror = () => alert('Could not load image. Please try a different file.')
      image.src = e.target.result
    }
    reader.readAsDataURL(file)
  }, [])

  const loadLogo = useCallback((file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.onload = () => setLogo(image)
      image.onerror = () => alert('Could not load logo. Please try a different file.')
      image.src = e.target.result
    }
    reader.readAsDataURL(file)
  }, [])

  const draw = useCallback((settings) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Ensure DPR for preview (scale 1 for preview)
    const dpr = 1
    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    drawCanvas(ctx, settings, W, H)
  }, [])

  const redrawAtDPRAndSave = useCallback((format, name, settings) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Render at device DPR for crisp export
    const dpr = window.devicePixelRatio || 1
    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Redraw with settings at high DPR
    drawCanvas(ctx, settings, W, H)

    // Download
    const a = document.createElement('a')
    a.download = `${name || 'meta'}_meta.${format}`
    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png'
    const quality = format === 'jpg' ? 0.95 : undefined
    a.href = canvas.toDataURL(mimeType, quality)
    a.click()

    // Reset to preview scale
    const previewDpr = 1
    canvas.width = W * previewDpr
    canvas.height = H * previewDpr
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'
    ctx.setTransform(previewDpr, 0, 0, previewDpr, 0, 0)
    drawCanvas(ctx, settings, W, H)
  }, [])

  return {
    img,
    logo,
    loadImage,
    loadLogo,
    draw,
    redrawAtDPRAndSave,
    imgName: imgNameRef.current
  }
}

