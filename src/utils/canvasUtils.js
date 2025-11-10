// Complete canvas utility functions - all drawing logic
import { coverDrawParams, roundedRectPath, hexToRgb, calculateImagePosition, calculateLogoPosition } from './canvasHelpers'

// Draw blurred background with extra padding
function drawBlurredBackground(ctx, img, blurAmount, canvasW, canvasH, scaleFactor = 1.5) {
  const bgWidth = canvasW * scaleFactor
  const bgHeight = canvasH * scaleFactor
  const bgX = (canvasW - bgWidth) / 2
  const bgY = (canvasH - bgHeight) / 2
  
  const c = coverDrawParams(img.width, img.height, bgWidth, bgHeight)
  ctx.save()
  ctx.filter = `blur(${blurAmount}px)`
  ctx.drawImage(
    img,
    c.sx, c.sy, c.sw, c.sh,
    bgX + c.dx, bgY + c.dy, c.dw, c.dh
  )
  ctx.restore()
}

// Draw image at position helper
function drawImageAtPosition(ctx, img, size, radius, position, canvasW, canvasH, shadow = true) {
  const pos = calculateImagePosition(size, position, canvasW, canvasH)
  const inner = coverDrawParams(img.width, img.height, size, size)
  
  if (shadow) {
    ctx.save()
    ctx.globalAlpha = 0.35
    ctx.filter = 'blur(16px)'
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fill(roundedRectPath(pos.x, pos.y + 10, size, size, radius))
    ctx.restore()
  }
  
  ctx.save()
  ctx.clip(roundedRectPath(pos.x, pos.y, size, size, radius))
  ctx.drawImage(
    img,
    inner.sx, inner.sy, inner.sw, inner.sh,
    pos.x + inner.dx, pos.y + inner.dy, inner.dw, inner.dh
  )
  ctx.restore()
  
  return pos
}

// Template drawing functions
function drawBlurredTemplate(ctx, settings, canvasW, canvasH) {
  const { img, blur, vignette, vignetteIntensity, size, radius, position } = settings
  
  drawBlurredBackground(ctx, img, blur, canvasW, canvasH)
  
  if (vignette) {
    const intensity = vignetteIntensity / 100
    const g = ctx.createRadialGradient(
      canvasW / 2, canvasH / 2, Math.min(canvasW, canvasH) * 0.3,
      canvasW / 2, canvasH / 2, Math.max(canvasW, canvasH) * 0.65
    )
    g.addColorStop(0, 'rgba(0,0,0,0)')
    g.addColorStop(1, `rgba(0,0,0,${0.22 * intensity})`)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, canvasW, canvasH)
  }
  
  drawImageAtPosition(ctx, img, size, radius, position, canvasW, canvasH)
}

function drawCenteredTemplate(ctx, settings, canvasW, canvasH) {
  const { img, size, radius, position } = settings
  
  ctx.fillStyle = '#1e293b'
  ctx.fillRect(0, 0, canvasW, canvasH)
  
  const pos = drawImageAtPosition(ctx, img, size, radius, position, canvasW, canvasH, true)
  
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  ctx.lineWidth = 2
  ctx.stroke(roundedRectPath(pos.x - 1, pos.y - 1, size + 2, size + 2, radius + 1))
  ctx.restore()
}

function drawGradientTemplate(ctx, settings, canvasW, canvasH) {
  const { img, blur, size, radius, position } = settings
  
  drawBlurredBackground(ctx, img, blur, canvasW, canvasH)
  
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasH)
  gradient.addColorStop(0, 'rgba(0,0,0,0.4)')
  gradient.addColorStop(0.5, 'rgba(0,0,0,0.2)')
  gradient.addColorStop(1, 'rgba(0,0,0,0.6)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvasW, canvasH)
  
  drawImageAtPosition(ctx, img, size, radius, position, canvasW, canvasH, false)
}

function drawMinimalTemplate(ctx, settings, canvasW, canvasH) {
  const { img, size, radius, position } = settings
  
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, canvasW, canvasH)
  
  const pos = calculateImagePosition(size, position, canvasW, canvasH)
  const inner = coverDrawParams(img.width, img.height, size, size)
  
  ctx.save()
  ctx.globalAlpha = 0.15
  ctx.filter = 'blur(12px)'
  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  ctx.fill(roundedRectPath(pos.x, pos.y + 8, size, size, radius))
  ctx.restore()
  
  ctx.save()
  ctx.clip(roundedRectPath(pos.x, pos.y, size, size, radius))
  ctx.drawImage(
    img,
    inner.sx, inner.sy, inner.sw, inner.sh,
    pos.x + inner.dx, pos.y + inner.dy, inner.dw, inner.dh
  )
  ctx.restore()
}

function drawSplitTemplate(ctx, settings, canvasW, canvasH) {
  const { img, blur, size, radius } = settings
  
  drawBlurredBackground(ctx, img, blur, canvasW, canvasH)
  
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
  ctx.fillRect(canvasW / 2, 0, canvasW / 2, canvasH)
  
  const pos = { x: canvasW - size - 60, y: (canvasH - size) / 2 }
  const inner = coverDrawParams(img.width, img.height, size, size)
  
  ctx.save()
  ctx.clip(roundedRectPath(pos.x, pos.y, size, size, radius))
  ctx.drawImage(
    img,
    inner.sx, inner.sy, inner.sw, inner.sh,
    pos.x + inner.dx, pos.y + inner.dy, inner.dw, inner.dh
  )
  ctx.restore()
}

function drawAsymmetricTemplate(ctx, settings, canvasW, canvasH) {
  const { img, blur, size, radius, position } = settings
  
  const gradient = ctx.createLinearGradient(0, 0, canvasW, canvasH)
  gradient.addColorStop(0, '#0f172a')
  gradient.addColorStop(1, '#1e293b')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvasW, canvasH)
  
  const bgWidth = canvasW * 1.5
  const bgHeight = canvasH * 1.5
  const bgX = (canvasW - bgWidth) / 2
  const bgY = (canvasH - bgHeight) / 2
  const c = coverDrawParams(img.width, img.height, bgWidth, bgHeight)
  ctx.save()
  ctx.globalAlpha = 0.3
  ctx.filter = `blur(${blur * 1.5}px)`
  ctx.drawImage(
    img,
    c.sx, c.sy, c.sw, c.sh,
    bgX + c.dx, bgY + c.dy, c.dw, c.dh
  )
  ctx.restore()
  
  drawImageAtPosition(ctx, img, size, radius, position, canvasW, canvasH)
}

function drawBorderTemplate(ctx, settings, canvasW, canvasH) {
  const { img, blur, size, radius, position } = settings
  
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvasW, canvasH)
  
  const bgWidth = canvasW * 1.5
  const bgHeight = canvasH * 1.5
  const bgX = (canvasW - bgWidth) / 2
  const bgY = (canvasH - bgHeight) / 2
  const c = coverDrawParams(img.width, img.height, bgWidth, bgHeight)
  ctx.save()
  ctx.filter = `blur(${blur}px)`
  ctx.globalAlpha = 0.4
  ctx.drawImage(
    img,
    c.sx, c.sy, c.sw, c.sh,
    bgX + c.dx, bgY + c.dy, c.dw, c.dh
  )
  ctx.restore()
  
  const pos = drawImageAtPosition(ctx, img, size, radius, position, canvasW, canvasH, true)
  
  ctx.save()
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 8
  ctx.stroke(roundedRectPath(pos.x - 4, pos.y - 4, size + 8, size + 8, radius + 4))
  ctx.restore()
}

function drawPolaroidTemplate(ctx, settings, canvasW, canvasH) {
  const { img, size, radius, position } = settings
  
  ctx.fillStyle = '#f5f5dc'
  ctx.fillRect(0, 0, canvasW, canvasH)
  
  const framePadding = 40
  const frameSize = size + framePadding * 2
  const pos = calculateImagePosition(frameSize, position, canvasW, canvasH)
  
  ctx.save()
  ctx.globalAlpha = 0.3
  ctx.filter = 'blur(20px)'
  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  ctx.fill(roundedRectPath(pos.x + 5, pos.y + 5, frameSize, frameSize, 8))
  ctx.restore()
  
  ctx.fillStyle = '#ffffff'
  ctx.fill(roundedRectPath(pos.x, pos.y, frameSize, frameSize, 8))
  
  const imgPos = { x: pos.x + framePadding, y: pos.y + framePadding }
  const inner = coverDrawParams(img.width, img.height, size, size)
  
  ctx.save()
  ctx.clip(roundedRectPath(imgPos.x, imgPos.y, size, size, radius))
  ctx.drawImage(
    img,
    inner.sx, inner.sy, inner.sw, inner.sh,
    imgPos.x + inner.dx, imgPos.y + inner.dy, inner.dw, inner.dh
  )
  ctx.restore()
}

function drawMagazineTemplate(ctx, settings, canvasW, canvasH) {
  const { img, blur, size, radius, position } = settings
  
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, canvasW, canvasH)
  
  const bgWidth = canvasW * 1.5
  const bgHeight = canvasH * 1.5
  const bgX = (canvasW - bgWidth) / 2
  const bgY = (canvasH - bgHeight) / 2
  const c = coverDrawParams(img.width, img.height, bgWidth, bgHeight)
  ctx.save()
  ctx.filter = `blur(${blur * 2}px)`
  ctx.globalAlpha = 0.2
  ctx.drawImage(
    img,
    c.sx, c.sy, c.sw, c.sh,
    bgX + c.dx, bgY + c.dy, c.dw, c.dh
  )
  ctx.restore()
  
  const pos = calculateImagePosition(size, position, canvasW, canvasH)
  const inner = coverDrawParams(img.width, img.height, size, size)
  
  ctx.save()
  ctx.globalAlpha = 0.6
  ctx.filter = 'blur(25px)'
  ctx.fillStyle = 'rgba(0,0,0,0.9)'
  ctx.fill(roundedRectPath(pos.x, pos.y + 20, size, size, radius))
  ctx.restore()
  
  ctx.save()
  ctx.clip(roundedRectPath(pos.x, pos.y, size, size, radius))
  ctx.drawImage(
    img,
    inner.sx, inner.sy, inner.sw, inner.sh,
    pos.x + inner.dx, pos.y + inner.dy, inner.dw, inner.dh
  )
  ctx.restore()
}

function drawDiagonalTemplate(ctx, settings, canvasW, canvasH) {
  const { img, blur, size, radius, position } = settings
  
  drawBlurredBackground(ctx, img, blur, canvasW, canvasH)
  
  const gradient = ctx.createLinearGradient(0, 0, canvasW, canvasH)
  gradient.addColorStop(0, 'rgba(0,0,0,0.6)')
  gradient.addColorStop(0.5, 'rgba(0,0,0,0.2)')
  gradient.addColorStop(1, 'rgba(0,0,0,0.8)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvasW, canvasH)
  
  drawImageAtPosition(ctx, img, size, radius, position, canvasW, canvasH)
}

function drawPortraitTemplate(ctx, settings, canvasW, canvasH) {
  const { img, blur, portraitSide, portraitStyle, vignette, vignetteIntensity } = settings
  const photoWidth = canvasW * 0.5
  
  if (portraitStyle === 'blurred' || portraitStyle === 'gradient') {
    drawBlurredBackground(ctx, img, blur, canvasW, canvasH)
    
    if (portraitStyle === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, canvasW, canvasH)
      gradient.addColorStop(0, 'rgba(0,0,0,0.4)')
      gradient.addColorStop(1, 'rgba(0,0,0,0.6)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvasW, canvasH)
    }
  } else if (portraitStyle === 'solid') {
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, canvasW, canvasH)
  } else if (portraitStyle === 'pattern') {
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvasW, canvasH)
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'
    ctx.lineWidth = 1
    for (let i = 0; i < canvasW; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvasH)
      ctx.stroke()
    }
    for (let i = 0; i < canvasH; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvasW, i)
      ctx.stroke()
    }
  }
  
  const photoX = portraitSide === 'left' ? 0 : canvasW - photoWidth
  const photoHeight = canvasH
  const photoParams = coverDrawParams(img.width, img.height, photoWidth, photoHeight)
  
  ctx.save()
  ctx.clip(roundedRectPath(photoX, 0, photoWidth, photoHeight, 0))
  ctx.drawImage(
    img,
    photoParams.sx, photoParams.sy, photoParams.sw, photoParams.sh,
    photoX + photoParams.dx, photoParams.dy, photoParams.dw, photoParams.dh
  )
  ctx.restore()
  
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  ctx.lineWidth = 1
  const dividerX = portraitSide === 'left' ? photoWidth : canvasW - photoWidth
  ctx.beginPath()
  ctx.moveTo(dividerX, 0)
  ctx.lineTo(dividerX, canvasH)
  ctx.stroke()
  ctx.restore()
}

function drawWideTemplate(ctx, settings, canvasW, canvasH) {
  const { img, blur, wideWidth, wideHeight, radius } = settings
  
  const photoWidth = (canvasW * wideWidth) / 100
  const photoHeight = (canvasH * wideHeight) / 100
  
  const bgWidth = canvasW * 1.5
  const bgHeight = canvasH * 1.5
  const bgX = (canvasW - bgWidth) / 2
  const bgY = (canvasH - bgHeight) / 2
  const c = coverDrawParams(img.width, img.height, bgWidth, bgHeight)
  ctx.save()
  ctx.filter = `blur(${blur * 1.5}px)`
  ctx.drawImage(
    img,
    c.sx, c.sy, c.sw, c.sh,
    bgX + c.dx, bgY + c.dy, c.dw, c.dh
  )
  ctx.restore()
  
  const overlay = ctx.createLinearGradient(0, 0, 0, canvasH)
  overlay.addColorStop(0, 'rgba(0,0,0,0.3)')
  overlay.addColorStop(0.5, 'rgba(0,0,0,0.5)')
  overlay.addColorStop(1, 'rgba(0,0,0,0.7)')
  ctx.fillStyle = overlay
  ctx.fillRect(0, 0, canvasW, canvasH)
  
  const photoX = (canvasW - photoWidth) / 2
  const photoY = (canvasH - photoHeight) / 2
  const photoParams = coverDrawParams(img.width, img.height, photoWidth, photoHeight)
  
  ctx.save()
  ctx.globalAlpha = 0.4
  ctx.filter = 'blur(20px)'
  ctx.fillStyle = 'rgba(0,0,0,0.8)'
  ctx.fill(roundedRectPath(photoX, photoY + 15, photoWidth, photoHeight, radius))
  ctx.restore()
  
  ctx.save()
  ctx.clip(roundedRectPath(photoX, photoY, photoWidth, photoHeight, radius))
  ctx.drawImage(
    img,
    photoParams.sx, photoParams.sy, photoParams.sw, photoParams.sh,
    photoX + photoParams.dx, photoY + photoParams.dy, photoParams.dw, photoParams.dh
  )
  ctx.restore()
}

// Draw logo
function drawLogoOnCanvas(ctx, logo, logoSize, logoPosition, logoOpacity, canvasW, canvasH) {
  const pos = calculateLogoPosition(logoSize, logoPosition, canvasW, canvasH)
  
  ctx.save()
  ctx.globalAlpha = logoOpacity / 100
  
  const logoAspect = logo.width / logo.height
  let drawWidth = logoSize
  let drawHeight = logoSize / logoAspect
  
  if (drawHeight > logoSize) {
    drawHeight = logoSize
    drawWidth = logoSize * logoAspect
  }
  
  const offsetX = (logoSize - drawWidth) / 2
  const offsetY = (logoSize - drawHeight) / 2
  
  ctx.drawImage(logo, pos.x + offsetX, pos.y + offsetY, drawWidth, drawHeight)
  ctx.restore()
}

// Draw text
function drawTextOnCanvas(ctx, settings, canvasW, canvasH) {
  const {
    title, subtitle, titleFontSize, subtitleFontSize,
    titleColor, subtitleColor, textPosition, textAlign, textSpacing,
    template, portraitSide
  } = settings

  ctx.save()
  ctx.textAlign = textAlign === 'center' ? 'center' : textAlign === 'left' ? 'left' : 'right'
  ctx.textBaseline = 'middle'

  let totalHeight = 0
  if (title) totalHeight += titleFontSize
  if (subtitle) totalHeight += subtitleFontSize
  if (title && subtitle) totalHeight += textSpacing

  const padding = 60
  const minPadding = Math.max(padding, totalHeight / 2 + 20)

  let baseY
  if (textPosition === 'top') {
    baseY = minPadding
  } else if (textPosition === 'bottom') {
    baseY = canvasH - minPadding
  } else {
    baseY = canvasH / 2
  }

  let x
  if (template === 'portrait') {
    const textSideWidth = canvasW * 0.5
    const textSidePadding = 40
    
    if (portraitSide === 'left') {
      if (textAlign === 'center') {
        x = canvasW - textSideWidth / 2
      } else if (textAlign === 'left') {
        x = canvasW - textSideWidth + textSidePadding
      } else {
        x = canvasW - textSidePadding
      }
    } else {
      if (textAlign === 'center') {
        x = textSideWidth / 2
      } else if (textAlign === 'left') {
        x = textSidePadding
      } else {
        x = textSideWidth - textSidePadding
      }
    }
  } else {
    if (textAlign === 'center') {
      x = canvasW / 2
    } else if (textAlign === 'left') {
      x = padding
    } else {
      x = canvasW - padding
    }
  }

  let currentY
  if (textPosition === 'top') {
    currentY = baseY
  } else if (textPosition === 'bottom') {
    currentY = baseY - totalHeight
  } else {
    currentY = baseY - totalHeight / 2
  }

  if (title) {
    ctx.font = `bold ${titleFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`
    ctx.fillStyle = titleColor
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
    ctx.shadowBlur = 12
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 3
    ctx.fillText(title, x, currentY + titleFontSize / 2)
    currentY += titleFontSize + textSpacing
  }

  if (subtitle) {
    ctx.font = `${subtitleFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`
    ctx.fillStyle = subtitleColor
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 2
    ctx.fillText(subtitle, x, currentY + subtitleFontSize / 2)
  }

  ctx.restore()
}

// Main draw function
export function drawCanvas(ctx, settings, canvasW, canvasH) {
  const {
    template, portraitSide, portraitStyle, position, size, wideWidth, wideHeight,
    radius, outerRadius, blur, vignette, vignetteIntensity,
    textEnabled, title, subtitle, titleFontSize, subtitleFontSize,
    titleColor, subtitleColor, textPosition, textAlign, textSpacing,
    logoEnabled, logoSize, logoPosition, logoOpacity,
    bgTint, bgOpacity, img, logo
  } = settings

  ctx.clearRect(0, 0, canvasW, canvasH)

  ctx.save()
  ctx.clip(roundedRectPath(0, 0, canvasW, canvasH, outerRadius))

  if (img) {
    const templateSettings = {
      img, portraitSide, portraitStyle, position, size, wideWidth, wideHeight,
      radius, blur, vignette, vignetteIntensity
    }
    
    switch (template) {
      case 'portrait':
        drawPortraitTemplate(ctx, templateSettings, canvasW, canvasH)
        break
      case 'wide':
        drawWideTemplate(ctx, templateSettings, canvasW, canvasH)
        break
      case 'blurred':
        drawBlurredTemplate(ctx, templateSettings, canvasW, canvasH)
        break
      case 'centered':
        drawCenteredTemplate(ctx, templateSettings, canvasW, canvasH)
        break
      case 'gradient':
        drawGradientTemplate(ctx, templateSettings, canvasW, canvasH)
        break
      case 'minimal':
        drawMinimalTemplate(ctx, templateSettings, canvasW, canvasH)
        break
      case 'split':
        drawSplitTemplate(ctx, templateSettings, canvasW, canvasH)
        break
      case 'asymmetric':
        drawAsymmetricTemplate(ctx, templateSettings, canvasW, canvasH)
        break
      case 'border':
        drawBorderTemplate(ctx, templateSettings, canvasW, canvasH)
        break
      case 'polaroid':
        drawPolaroidTemplate(ctx, templateSettings, canvasW, canvasH)
        break
      case 'magazine':
        drawMagazineTemplate(ctx, templateSettings, canvasW, canvasH)
        break
      case 'diagonal':
        drawDiagonalTemplate(ctx, templateSettings, canvasW, canvasH)
        break
    }
  } else {
    ctx.fillStyle = '#111827'
    ctx.fillRect(0, 0, canvasW, canvasH)
  }

  if (bgOpacity > 0) {
    const rgb = hexToRgb(bgTint)
    if (rgb) {
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bgOpacity / 100})`
      ctx.fillRect(0, 0, canvasW, canvasH)
    }
  }

  if (logoEnabled && logo) {
    drawLogoOnCanvas(ctx, logo, logoSize, logoPosition, logoOpacity, canvasW, canvasH)
  }

  if (textEnabled && (title || subtitle)) {
    drawTextOnCanvas(ctx, {
      title, subtitle, titleFontSize, subtitleFontSize,
      titleColor, subtitleColor, textPosition, textAlign, textSpacing,
      template, portraitSide
    }, canvasW, canvasH)
  }

  ctx.restore()
}
