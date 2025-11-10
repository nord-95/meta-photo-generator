import { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import ControlsPanel from './components/ControlsPanel'
import PreviewArea from './components/PreviewArea'
import { useCanvas } from './hooks/useCanvas'
import './styles/index.css'

function App() {
  const canvasRef = useRef(null)
  const {
    img,
    logo,
    loadImage,
    loadLogo,
    draw,
    redrawAtDPRAndSave,
    imgName
  } = useCanvas(canvasRef)

  // All state
  const [template, setTemplate] = useState('portrait')
  const [portraitSide, setPortraitSide] = useState('left')
  const [portraitStyle, setPortraitStyle] = useState('blurred')
  const [position, setPosition] = useState('center')
  const [size, setSize] = useState(640)
  const [wideWidth, setWideWidth] = useState(85)
  const [wideHeight, setWideHeight] = useState(60)
  const [radius, setRadius] = useState(24)
  const [outerRadius, setOuterRadius] = useState(22)
  const [blur, setBlur] = useState(24)
  const [vignette, setVignette] = useState(true)
  const [vignetteIntensity, setVignetteIntensity] = useState(22)
  const [textEnabled, setTextEnabled] = useState(false)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [titleFontSize, setTitleFontSize] = useState(56)
  const [subtitleFontSize, setSubtitleFontSize] = useState(32)
  const [titleColor, setTitleColor] = useState('#ffffff')
  const [subtitleColor, setSubtitleColor] = useState('#e2e8f0')
  const [textPosition, setTextPosition] = useState('center')
  const [textAlign, setTextAlign] = useState('center')
  const [textSpacing, setTextSpacing] = useState(16)
  const [logoEnabled, setLogoEnabled] = useState(false)
  const [logoSize, setLogoSize] = useState(120)
  const [logoPosition, setLogoPosition] = useState('top-left')
  const [logoOpacity, setLogoOpacity] = useState(100)
  const [bgTint, setBgTint] = useState('#000000')
  const [bgOpacity, setBgOpacity] = useState(0)

  // Setup global handler for drag and drop
  useEffect(() => {
    window.handleImageDrop = (file) => {
      const url = URL.createObjectURL(file)
      loadImage(file)
    }
    return () => {
      delete window.handleImageDrop
    }
  }, [loadImage])

  // Redraw when settings change
  useEffect(() => {
    if (canvasRef.current) {
      draw({
        template,
        portraitSide,
        portraitStyle,
        position,
        size,
        wideWidth,
        wideHeight,
        radius,
        outerRadius,
        blur,
        vignette,
        vignetteIntensity,
        textEnabled,
        title,
        subtitle,
        titleFontSize,
        subtitleFontSize,
        titleColor,
        subtitleColor,
        textPosition,
        textAlign,
        textSpacing,
        logoEnabled,
        logoSize,
        logoPosition,
        logoOpacity,
        bgTint,
        bgOpacity,
        img,
        logo
      })
    }
  }, [
    template, portraitSide, portraitStyle, position, size, wideWidth, wideHeight,
    radius, outerRadius, blur, vignette, vignetteIntensity,
    textEnabled, title, subtitle, titleFontSize, subtitleFontSize,
    titleColor, subtitleColor, textPosition, textAlign, textSpacing,
    logoEnabled, logoSize, logoPosition, logoOpacity,
    bgTint, bgOpacity, img, logo, draw
  ])

  const handleDownloadPNG = () => {
    redrawAtDPRAndSave('png', imgName || 'meta', {
      template, portraitSide, portraitStyle, position, size, wideWidth, wideHeight,
      radius, outerRadius, blur, vignette, vignetteIntensity,
      textEnabled, title, subtitle, titleFontSize, subtitleFontSize,
      titleColor, subtitleColor, textPosition, textAlign, textSpacing,
      logoEnabled, logoSize, logoPosition, logoOpacity,
      bgTint, bgOpacity, img, logo
    })
  }

  const handleDownloadJPG = () => {
    redrawAtDPRAndSave('jpg', imgName || 'meta', {
      template, portraitSide, portraitStyle, position, size, wideWidth, wideHeight,
      radius, outerRadius, blur, vignette, vignetteIntensity,
      textEnabled, title, subtitle, titleFontSize, subtitleFontSize,
      titleColor, subtitleColor, textPosition, textAlign, textSpacing,
      logoEnabled, logoSize, logoPosition, logoOpacity,
      bgTint, bgOpacity, img, logo
    })
  }

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <ControlsPanel
          template={template} setTemplate={setTemplate}
          portraitSide={portraitSide} setPortraitSide={setPortraitSide}
          portraitStyle={portraitStyle} setPortraitStyle={setPortraitStyle}
          position={position} setPosition={setPosition}
          size={size} setSize={setSize}
          wideWidth={wideWidth} setWideWidth={setWideWidth}
          wideHeight={wideHeight} setWideHeight={setWideHeight}
          radius={radius} setRadius={setRadius}
          outerRadius={outerRadius} setOuterRadius={setOuterRadius}
          blur={blur} setBlur={setBlur}
          vignette={vignette} setVignette={setVignette}
          vignetteIntensity={vignetteIntensity} setVignetteIntensity={setVignetteIntensity}
          textEnabled={textEnabled} setTextEnabled={setTextEnabled}
          title={title} setTitle={setTitle}
          subtitle={subtitle} setSubtitle={setSubtitle}
          titleFontSize={titleFontSize} setTitleFontSize={setTitleFontSize}
          subtitleFontSize={subtitleFontSize} setSubtitleFontSize={setSubtitleFontSize}
          titleColor={titleColor} setTitleColor={setTitleColor}
          subtitleColor={subtitleColor} setSubtitleColor={setSubtitleColor}
          textPosition={textPosition} setTextPosition={setTextPosition}
          textAlign={textAlign} setTextAlign={setTextAlign}
          textSpacing={textSpacing} setTextSpacing={setTextSpacing}
          logoEnabled={logoEnabled} setLogoEnabled={setLogoEnabled}
          logoSize={logoSize} setLogoSize={setLogoSize}
          logoPosition={logoPosition} setLogoPosition={setLogoPosition}
          logoOpacity={logoOpacity} setLogoOpacity={setLogoOpacity}
          bgTint={bgTint} setBgTint={setBgTint}
          bgOpacity={bgOpacity} setBgOpacity={setBgOpacity}
          loadImage={loadImage}
          loadLogo={loadLogo}
          onDownloadPNG={handleDownloadPNG}
          onDownloadJPG={handleDownloadJPG}
        />
        <PreviewArea canvasRef={canvasRef} />
      </div>
    </div>
  )
}

export default App
