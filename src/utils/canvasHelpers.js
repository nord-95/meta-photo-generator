// Canvas helper functions
export const W = 1300
export const H = 867
export const PHI = 1.618033988749895

export function coverDrawParams(imgW, imgH, boxW, boxH) {
  const r = Math.max(boxW / imgW, boxH / imgH)
  const dw = imgW * r
  const dh = imgH * r
  const dx = (boxW - dw) / 2
  const dy = (boxH - dh) / 2
  return { sx: 0, sy: 0, sw: imgW, sh: imgH, dx, dy, dw, dh }
}

export function roundedRectPath(x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2)
  const p = new Path2D()
  p.moveTo(x + rr, y)
  p.arcTo(x + w, y, x + w, y + h, rr)
  p.arcTo(x + w, y + h, x, y + h, rr)
  p.arcTo(x, y + h, x, y, rr)
  p.arcTo(x, y, x + w, y, rr)
  p.closePath()
  return p
}

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export function getGoldenRatioPoint(imageWidth, imageHeight, quadrant) {
  const goldenSection = 1 / PHI
  let x, y
  
  switch (quadrant) {
    case 'top-left':
      x = W * goldenSection - imageWidth / 2
      y = H * goldenSection - imageHeight / 2
      break
    case 'top-right':
      x = W * (1 - goldenSection) - imageWidth / 2
      y = H * goldenSection - imageHeight / 2
      break
    case 'bottom-left':
      x = W * goldenSection - imageWidth / 2
      y = H * (1 - goldenSection) - imageHeight / 2
      break
    case 'bottom-right':
      x = W * (1 - goldenSection) - imageWidth / 2
      y = H * (1 - goldenSection) - imageHeight / 2
      break
    case 'center':
      x = W / 2 - imageWidth / 2
      y = H / 2 - imageHeight / 2
      break
    default:
      x = W / 2 - imageWidth / 2
      y = H / 2 - imageHeight / 2
  }
  
  return { x, y }
}

export function calculateImagePosition(size, position, canvasW = W, canvasH = H) {
  const padding = 40
  let x, y
  
  if (position.startsWith('golden-')) {
    const quadrant = position.replace('golden-', '')
    const pos = getGoldenRatioPoint(size, size, quadrant)
    x = pos.x
    y = pos.y
  } else {
    switch (position) {
      case 'center':
        x = (canvasW - size) / 2
        y = (canvasH - size) / 2
        break
      case 'top-left':
        x = padding
        y = padding
        break
      case 'top-right':
        x = canvasW - size - padding
        y = padding
        break
      case 'bottom-left':
        x = padding
        y = canvasH - size - padding
        break
      case 'bottom-right':
        x = canvasW - size - padding
        y = canvasH - size - padding
        break
      case 'top-center':
        x = (canvasW - size) / 2
        y = padding
        break
      case 'bottom-center':
        x = (canvasW - size) / 2
        y = canvasH - size - padding
        break
      case 'left-center':
        x = padding
        y = (canvasH - size) / 2
        break
      case 'right-center':
        x = canvasW - size - padding
        y = (canvasH - size) / 2
        break
      default:
        x = (canvasW - size) / 2
        y = (canvasH - size) / 2
    }
  }
  
  return { x: Math.max(0, Math.min(x, canvasW - size)), y: Math.max(0, Math.min(y, canvasH - size)) }
}

export function calculateLogoPosition(logoSize, position, canvasW = W, canvasH = H) {
  const padding = 40
  let x, y
  
  switch (position) {
    case 'top-left':
      x = padding
      y = padding
      break
    case 'top-center':
      x = (canvasW - logoSize) / 2
      y = padding
      break
    case 'top-right':
      x = canvasW - logoSize - padding
      y = padding
      break
    case 'center-left':
      x = padding
      y = (canvasH - logoSize) / 2
      break
    case 'center':
      x = (canvasW - logoSize) / 2
      y = (canvasH - logoSize) / 2
      break
    case 'center-right':
      x = canvasW - logoSize - padding
      y = (canvasH - logoSize) / 2
      break
    case 'bottom-left':
      x = padding
      y = canvasH - logoSize - padding
      break
    case 'bottom-center':
      x = (canvasW - logoSize) / 2
      y = canvasH - logoSize - padding
      break
    case 'bottom-right':
      x = canvasW - logoSize - padding
      y = canvasH - logoSize - padding
      break
    default:
      x = padding
      y = padding
  }
  
  return { x: Math.max(0, Math.min(x, canvasW - logoSize)), y: Math.max(0, Math.min(y, canvasH - logoSize)) }
}

