import React from 'react'

export default function ControlsPanel({
  template, setTemplate,
  portraitSide, setPortraitSide,
  portraitStyle, setPortraitStyle,
  position, setPosition,
  size, setSize,
  wideWidth, setWideWidth,
  wideHeight, setWideHeight,
  radius, setRadius,
  outerRadius, setOuterRadius,
  blur, setBlur,
  vignette, setVignette,
  vignetteIntensity, setVignetteIntensity,
  textEnabled, setTextEnabled,
  title, setTitle,
  subtitle, setSubtitle,
  titleFontSize, setTitleFontSize,
  subtitleFontSize, setSubtitleFontSize,
  titleColor, setTitleColor,
  subtitleColor, setSubtitleColor,
  textPosition, setTextPosition,
  textAlign, setTextAlign,
  textSpacing, setTextSpacing,
  logoEnabled, setLogoEnabled,
  logoSize, setLogoSize,
  logoPosition, setLogoPosition,
  logoOpacity, setLogoOpacity,
  bgTint, setBgTint,
  bgOpacity, setBgOpacity,
  loadImage,
  loadLogo,
  onDownloadPNG,
  onDownloadJPG
}) {
  const showPortrait = template === 'portrait'
  const showWide = template === 'wide'
  const showStandard = !showPortrait && !showWide

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) loadImage(file)
  }

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) loadLogo(file)
  }

  return (
    <aside className="controls-panel">
      <div className="controls-panel-header">
        <h2>⚙️ Design Controls</h2>
      </div>
      <div className="controls-panel-body">
        <div className="panel-section">
          <div className="panel-section-header">
            <h2>Image</h2>
          </div>
          <div className="control-group">
            <label className="file-upload-label">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <span className="file-upload-button">📁 Upload Image</span>
            </label>
            <p className="hint-text">Drag & drop or click to select</p>
          </div>
        </div>

        <div className="panel-section">
          <div className="panel-section-header">
            <h2>Layout</h2>
          </div>
          <div className="control-group">
            <label>Template</label>
            <select value={template} onChange={(e) => setTemplate(e.target.value)} className="select-control">
              <optgroup label="Featured Layouts">
                <option value="portrait">Portrait Photo (Side Layout)</option>
                <option value="wide">Wide Photo (Overlay Text)</option>
              </optgroup>
              <optgroup label="Classic Styles">
                <option value="blurred">Blurred Background</option>
                <option value="centered">Centered Card</option>
                <option value="gradient">Gradient Overlay</option>
                <option value="minimal">Minimal Frame</option>
              </optgroup>
              <optgroup label="Creative Styles">
                <option value="split">Split Screen</option>
                <option value="asymmetric">Asymmetric Layout</option>
                <option value="border">Bordered Frame</option>
                <option value="polaroid">Polaroid Style</option>
                <option value="magazine">Magazine Layout</option>
                <option value="diagonal">Diagonal Split</option>
              </optgroup>
            </select>
          </div>

          {showPortrait && (
            <>
              <div className="control-group">
                <label>Photo Side</label>
                <select value={portraitSide} onChange={(e) => setPortraitSide(e.target.value)} className="select-control">
                  <option value="left">Left Side</option>
                  <option value="right">Right Side</option>
                </select>
              </div>
              <div className="control-group">
                <label>Portrait Style</label>
                <select value={portraitStyle} onChange={(e) => setPortraitStyle(e.target.value)} className="select-control">
                  <option value="blurred">Blurred Background</option>
                  <option value="gradient">Gradient Overlay</option>
                  <option value="solid">Solid Color</option>
                  <option value="pattern">Pattern Background</option>
                </select>
              </div>
            </>
          )}

          {showStandard && (
            <div className="control-group">
              <label>Image Position</label>
              <select value={position} onChange={(e) => setPosition(e.target.value)} className="select-control">
                <option value="center">Center</option>
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="top-center">Top Center</option>
                <option value="bottom-center">Bottom Center</option>
                <option value="left-center">Left Center</option>
                <option value="right-center">Right Center</option>
                <option value="golden-top-left">Golden Ratio (Top Left)</option>
                <option value="golden-top-right">Golden Ratio (Top Right)</option>
                <option value="golden-bottom-left">Golden Ratio (Bottom Left)</option>
                <option value="golden-bottom-right">Golden Ratio (Bottom Right)</option>
                <option value="golden-center">Golden Ratio (Center)</option>
              </select>
            </div>
          )}

          {showStandard && (
            <div className="control-group">
              <label>Image Size</label>
              <div className="slider-control">
                <input type="range" min="200" max="900" value={size} step="10" onChange={(e) => setSize(Number(e.target.value))} />
                <span className="slider-value">{size}</span>
              </div>
            </div>
          )}

          {showWide && (
            <>
              <div className="control-group">
                <label>Photo Width</label>
                <div className="slider-control">
                  <input type="range" min="60" max="95" value={wideWidth} step="1" onChange={(e) => setWideWidth(Number(e.target.value))} />
                  <span className="slider-value">{wideWidth}</span>
                </div>
              </div>
              <div className="control-group">
                <label>Photo Height</label>
                <div className="slider-control">
                  <input type="range" min="40" max="80" value={wideHeight} step="1" onChange={(e) => setWideHeight(Number(e.target.value))} />
                  <span className="slider-value">{wideHeight}</span>
                </div>
              </div>
            </>
          )}

          <div className="control-group">
            <label>Inner Corner Radius</label>
            <div className="slider-control">
              <input type="range" min="0" max="60" value={radius} step="1" onChange={(e) => setRadius(Number(e.target.value))} />
              <span className="slider-value">{radius}</span>
            </div>
          </div>

          <div className="control-group">
            <label>Outer Corner Radius</label>
            <div className="slider-control">
              <input type="range" min="0" max="60" value={outerRadius} step="1" onChange={(e) => setOuterRadius(Number(e.target.value))} />
              <span className="slider-value">{outerRadius}</span>
            </div>
          </div>
        </div>

        <div className="panel-section">
          <div className="panel-section-header">
            <h2>Effects</h2>
          </div>
          <div className="control-group">
            <label>Background Blur</label>
            <div className="slider-control">
              <input type="range" min="0" max="40" value={blur} step="1" onChange={(e) => setBlur(Number(e.target.value))} />
              <span className="slider-value">{blur}</span>
            </div>
          </div>

          <div className="control-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={vignette} onChange={(e) => setVignette(e.target.checked)} />
              <span>Vignette Effect</span>
            </label>
          </div>

          <div className="control-group">
            <label>Vignette Intensity</label>
            <div className="slider-control">
              <input type="range" min="0" max="100" value={vignetteIntensity} step="1" onChange={(e) => setVignetteIntensity(Number(e.target.value))} />
              <span className="slider-value">{vignetteIntensity}</span>
            </div>
          </div>
        </div>

        <div className="panel-section">
          <div className="panel-section-header">
            <h2>Text Overlay</h2>
          </div>
          <div className="control-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={textEnabled} onChange={(e) => setTextEnabled(e.target.checked)} />
              <span>Enable Text</span>
            </label>
          </div>

          {textEnabled && (
            <>
              <div className="control-group">
                <label>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="text-input" placeholder="Enter title..." />
              </div>
              <div className="control-group">
                <label>Subtitle</label>
                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="text-input" placeholder="Enter subtitle..." />
              </div>
              <div className="control-group">
                <label>Title Font Size</label>
                <div className="slider-control">
                  <input type="range" min="24" max="120" value={titleFontSize} step="2" onChange={(e) => setTitleFontSize(Number(e.target.value))} />
                  <span className="slider-value">{titleFontSize}</span>
                </div>
              </div>
              <div className="control-group">
                <label>Subtitle Font Size</label>
                <div className="slider-control">
                  <input type="range" min="18" max="80" value={subtitleFontSize} step="2" onChange={(e) => setSubtitleFontSize(Number(e.target.value))} />
                  <span className="slider-value">{subtitleFontSize}</span>
                </div>
              </div>
              <div className="control-group">
                <label>Title Color</label>
                <div className="color-picker-group">
                  <input type="color" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} />
                  <input type="text" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} className="color-input" />
                </div>
              </div>
              <div className="control-group">
                <label>Subtitle Color</label>
                <div className="color-picker-group">
                  <input type="color" value={subtitleColor} onChange={(e) => setSubtitleColor(e.target.value)} />
                  <input type="text" value={subtitleColor} onChange={(e) => setSubtitleColor(e.target.value)} className="color-input" />
                </div>
              </div>
              <div className="control-group">
                <label>Text Position</label>
                <select value={textPosition} onChange={(e) => setTextPosition(e.target.value)} className="select-control">
                  <option value="top">Top</option>
                  <option value="center">Center</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
              <div className="control-group">
                <label>Text Alignment</label>
                <select value={textAlign} onChange={(e) => setTextAlign(e.target.value)} className="select-control">
                  <option value="center">Center</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div className="control-group">
                <label>Text Spacing</label>
                <div className="slider-control">
                  <input type="range" min="0" max="60" value={textSpacing} step="2" onChange={(e) => setTextSpacing(Number(e.target.value))} />
                  <span className="slider-value">{textSpacing}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="panel-section">
          <div className="panel-section-header">
            <h2>Logo</h2>
          </div>
          <div className="control-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={logoEnabled} onChange={(e) => setLogoEnabled(e.target.checked)} />
              <span>Enable Logo</span>
            </label>
          </div>

          {logoEnabled && (
            <>
              <div className="control-group">
                <label className="file-upload-label">
                  <input type="file" accept="image/*" onChange={handleLogoChange} />
                  <span className="file-upload-button">📷 Upload Logo</span>
                </label>
                <p className="hint-text">PNG with transparency recommended</p>
              </div>
              <div className="control-group">
                <label>Logo Size</label>
                <div className="slider-control">
                  <input type="range" min="40" max="300" value={logoSize} step="5" onChange={(e) => setLogoSize(Number(e.target.value))} />
                  <span className="slider-value">{logoSize}</span>
                </div>
              </div>
              <div className="control-group">
                <label>Logo Position</label>
                <select value={logoPosition} onChange={(e) => setLogoPosition(e.target.value)} className="select-control">
                  <option value="top-left">Top Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-right">Top Right</option>
                  <option value="center-left">Center Left</option>
                  <option value="center">Center</option>
                  <option value="center-right">Center Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
              </div>
              <div className="control-group">
                <label>Logo Opacity</label>
                <div className="slider-control">
                  <input type="range" min="0" max="100" value={logoOpacity} step="1" onChange={(e) => setLogoOpacity(Number(e.target.value))} />
                  <span className="slider-value">{logoOpacity}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="panel-section">
          <div className="panel-section-header">
            <h2>Colors</h2>
          </div>
          <div className="control-group">
            <label>Background Tint</label>
            <div className="color-picker-group">
              <input type="color" value={bgTint} onChange={(e) => setBgTint(e.target.value)} />
              <input type="text" value={bgTint} onChange={(e) => setBgTint(e.target.value)} className="color-input" />
            </div>
          </div>
          <div className="control-group">
            <label>Background Opacity</label>
            <div className="slider-control">
              <input type="range" min="0" max="100" value={bgOpacity} step="1" onChange={(e) => setBgOpacity(Number(e.target.value))} />
              <span className="slider-value">{bgOpacity}</span>
            </div>
          </div>
        </div>

        <div className="panel-section">
          <div className="panel-section-header">
            <h2>Export</h2>
          </div>
          <div className="control-group">
            <button onClick={onDownloadPNG} className="btn-primary">💾 Download PNG</button>
            <button onClick={onDownloadJPG} className="btn-secondary">📷 Download JPG</button>
          </div>
        </div>
      </div>
    </aside>
  )
}

