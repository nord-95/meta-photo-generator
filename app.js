// Canvas dimensions
const W = 1300;
const H = 867;

// DOM elements
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const frame = document.getElementById('frame');

// Input controls
const imageInput = document.getElementById('imageInput');
const templateSelect = document.getElementById('templateSelect');
const portraitSideSelect = document.getElementById('portraitSideSelect');
const portraitStyleSelect = document.getElementById('portraitStyleSelect');
const positionSelect = document.getElementById('positionSelect');
const sizeRange = document.getElementById('sizeRange');
const wideWidthRange = document.getElementById('wideWidthRange');
const wideHeightRange = document.getElementById('wideHeightRange');
const radiusRange = document.getElementById('radiusRange');
const blurRange = document.getElementById('blurRange');
const outerRadiusRange = document.getElementById('outerRadiusRange');
const toggleVignette = document.getElementById('toggleVignette');
const vignetteRange = document.getElementById('vignetteRange');
const toggleText = document.getElementById('toggleText');
const titleText = document.getElementById('titleText');
const subtitleText = document.getElementById('subtitleText');
const titleFontSizeRange = document.getElementById('titleFontSizeRange');
const subtitleFontSizeRange = document.getElementById('subtitleFontSizeRange');
const titleColorPicker = document.getElementById('titleColorPicker');
const titleColorInput = document.getElementById('titleColorInput');
const subtitleColorPicker = document.getElementById('subtitleColorPicker');
const subtitleColorInput = document.getElementById('subtitleColorInput');
const textPositionSelect = document.getElementById('textPositionSelect');
const textAlignSelect = document.getElementById('textAlignSelect');
const textSpacingRange = document.getElementById('textSpacingRange');
const toggleLogo = document.getElementById('toggleLogo');
const logoInput = document.getElementById('logoInput');
const logoSizeRange = document.getElementById('logoSizeRange');
const logoPositionSelect = document.getElementById('logoPositionSelect');
const logoOpacityRange = document.getElementById('logoOpacityRange');
const bgTintPicker = document.getElementById('bgTintPicker');
const bgTintInput = document.getElementById('bgTintInput');
const bgOpacityRange = document.getElementById('bgOpacityRange');

// Value displays
const sizeVal = document.getElementById('sizeVal');
const wideWidthVal = document.getElementById('wideWidthVal');
const wideHeightVal = document.getElementById('wideHeightVal');
const radiusVal = document.getElementById('radiusVal');
const blurVal = document.getElementById('blurVal');
const outerRadiusVal = document.getElementById('outerRadiusVal');
const vignetteVal = document.getElementById('vignetteVal');
const titleFontSizeVal = document.getElementById('titleFontSizeVal');
const subtitleFontSizeVal = document.getElementById('subtitleFontSizeVal');
const textSpacingVal = document.getElementById('textSpacingVal');
const logoSizeVal = document.getElementById('logoSizeVal');
const logoOpacityVal = document.getElementById('logoOpacityVal');
const bgOpacityVal = document.getElementById('bgOpacityVal');

// Buttons
const downloadBtn = document.getElementById('downloadBtn');
const downloadJpgBtn = document.getElementById('downloadJpgBtn');

// Text controls container
const textControls = document.getElementById('textControls');
const textStyleControls = document.getElementById('textStyleControls');
const logoControls = document.getElementById('logoControls');
const logoStyleControls = document.getElementById('logoStyleControls');

// Template-specific controls
const portraitSideControl = document.getElementById('portraitSideControl');
const portraitStyleControl = document.getElementById('portraitStyleControl');
const standardPositionControl = document.getElementById('standardPositionControl');
const standardSizeControl = document.getElementById('standardSizeControl');
const wideSizeControl = document.getElementById('wideSizeControl');
const wideHeightControl = document.getElementById('wideHeightControl');

// State
let img = null;
let imgName = 'image';
let logo = null;

// Hi-DPI crisp export
function ensureDPR(scaleForPreview = false) {
  const dpr = window.devicePixelRatio || 1;
  const target = scaleForPreview ? 1 : dpr;
  if (canvas.width !== W * target || canvas.height !== H * target) {
    canvas.width = W * target;
    canvas.height = H * target;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(target, 0, 0, target, 0, 0);
  }
}

// Calculate cover draw parameters
function coverDrawParams(imgW, imgH, boxW, boxH) {
  const r = Math.max(boxW / imgW, boxH / imgH);
  const dw = imgW * r;
  const dh = imgH * r;
  const dx = (boxW - dw) / 2;
  const dy = (boxH - dh) / 2;
  return { sx: 0, sy: 0, sw: imgW, sh: imgH, dx, dy, dw, dh };
}

// Draw blurred background with extra padding for consistent blur at edges
function drawBlurredBackground(blurAmount, scaleFactor = 1.5) {
  // Make the background larger to ensure consistent blur at edges
  const bgWidth = W * scaleFactor;
  const bgHeight = H * scaleFactor;
  const bgX = (W - bgWidth) / 2;
  const bgY = (H - bgHeight) / 2;
  
  const c = coverDrawParams(img.width, img.height, bgWidth, bgHeight);
  ctx.save();
  ctx.filter = `blur(${blurAmount}px)`;
  ctx.drawImage(
    img,
    c.sx,
    c.sy,
    c.sw,
    c.sh,
    bgX + c.dx,
    bgY + c.dy,
    c.dw,
    c.dh
  );
  ctx.restore();
}

// Create rounded rectangle path
function roundedRectPath(x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  const p = new Path2D();
  p.moveTo(x + rr, y);
  p.arcTo(x + w, y, x + w, y + h, rr);
  p.arcTo(x + w, y + h, x, y + h, rr);
  p.arcTo(x, y + h, x, y, rr);
  p.arcTo(x, y, x + w, y, rr);
  p.closePath();
  return p;
}

// Hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Golden ratio constant (phi = 1.618...)
const PHI = 1.618033988749895;

// Calculate golden ratio point
function getGoldenRatioPoint(imageWidth, imageHeight, quadrant) {
  // Golden ratio grid: divide canvas by PHI to get golden sections
  // The golden point is at 1/PHI from the edge (approximately 38.2% or 61.8%)
  const goldenSection = 1 / PHI; // ~0.618
  
  let x, y;
  
  switch (quadrant) {
    case 'top-left':
      // Position at golden point from top-left (38.2% from left, 38.2% from top)
      x = W * goldenSection - imageWidth / 2;
      y = H * goldenSection - imageHeight / 2;
      break;
    case 'top-right':
      // Position at golden point from top-right (38.2% from right, 38.2% from top)
      x = W * (1 - goldenSection) - imageWidth / 2;
      y = H * goldenSection - imageHeight / 2;
      break;
    case 'bottom-left':
      // Position at golden point from bottom-left (38.2% from left, 38.2% from bottom)
      x = W * goldenSection - imageWidth / 2;
      y = H * (1 - goldenSection) - imageHeight / 2;
      break;
    case 'bottom-right':
      // Position at golden point from bottom-right (38.2% from right, 38.2% from bottom)
      x = W * (1 - goldenSection) - imageWidth / 2;
      y = H * (1 - goldenSection) - imageHeight / 2;
      break;
    case 'center':
      // Center position
      x = W / 2 - imageWidth / 2;
      y = H / 2 - imageHeight / 2;
      break;
    default:
      x = W / 2 - imageWidth / 2;
      y = H / 2 - imageHeight / 2;
  }
  
  return { x, y };
}

// Calculate image position based on selection
function calculateImagePosition(size) {
  const position = positionSelect.value;
  const padding = 40;
  
  let x, y;
  
  if (position.startsWith('golden-')) {
    const quadrant = position.replace('golden-', '');
    const pos = getGoldenRatioPoint(size, size, quadrant);
    x = pos.x;
    y = pos.y;
  } else {
    switch (position) {
      case 'center':
        x = (W - size) / 2;
        y = (H - size) / 2;
        break;
      case 'top-left':
        x = padding;
        y = padding;
        break;
      case 'top-right':
        x = W - size - padding;
        y = padding;
        break;
      case 'bottom-left':
        x = padding;
        y = H - size - padding;
        break;
      case 'bottom-right':
        x = W - size - padding;
        y = H - size - padding;
        break;
      case 'top-center':
        x = (W - size) / 2;
        y = padding;
        break;
      case 'bottom-center':
        x = (W - size) / 2;
        y = H - size - padding;
        break;
      case 'left-center':
        x = padding;
        y = (H - size) / 2;
        break;
      case 'right-center':
        x = W - size - padding;
        y = (H - size) / 2;
        break;
      default:
        x = (W - size) / 2;
        y = (H - size) / 2;
    }
  }
  
  return { x: Math.max(0, Math.min(x, W - size)), y: Math.max(0, Math.min(y, H - size)) };
}

// Apply background tint
function applyBackgroundTint() {
  const tintColor = bgTintInput.value;
  const opacity = bgOpacityRange.value / 100;
  if (opacity > 0) {
    const rgb = hexToRgb(tintColor);
    if (rgb) {
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
      ctx.fillRect(0, 0, W, H);
    }
  }
}

// Draw text overlay (title and subtitle)
function drawText() {
  if (!toggleText.checked) return;

  const title = titleText.value.trim();
  const subtitle = subtitleText.value.trim();
  
  // Don't draw if both are empty
  if (!title && !subtitle) return;

  const titleFontSize = parseInt(titleFontSizeRange.value);
  const subtitleFontSize = parseInt(subtitleFontSizeRange.value);
  const titleColor = titleColorInput.value;
  const subtitleColor = subtitleColorInput.value;
  const position = textPositionSelect.value;
  const align = textAlignSelect.value;
  const spacing = parseInt(textSpacingRange.value);
  const template = templateSelect.value;

  ctx.save();
  ctx.textAlign = align === 'center' ? 'center' : align === 'left' ? 'left' : 'right';
  ctx.textBaseline = 'middle';

  // Calculate base position with proper padding for large text
  // Calculate total text height first to ensure proper positioning
  let totalHeight = 0;
  if (title) totalHeight += titleFontSize;
  if (subtitle) totalHeight += subtitleFontSize;
  if (title && subtitle) totalHeight += spacing;
  
  const padding = 60;
  const minPadding = Math.max(padding, totalHeight / 2 + 20); // Ensure enough space for text
  
  let baseY;
  if (position === 'top') {
    // Position from top with enough space for text
    baseY = minPadding;
  } else if (position === 'bottom') {
    // Position from bottom with enough space for text
    baseY = H - minPadding;
  } else {
    baseY = H / 2;
  }

  let x;
  
  // Special handling for portrait template - text on opposite side
  if (template === 'portrait') {
    const photoSide = portraitSideSelect.value;
    const textSideWidth = W * 0.5;
    const textSidePadding = 40;
    
    if (photoSide === 'left') {
      // Photo on left, text on right
      if (align === 'center') {
        x = W - textSideWidth / 2;
      } else if (align === 'left') {
        x = W - textSideWidth + textSidePadding;
      } else {
        x = W - textSidePadding;
      }
    } else {
      // Photo on right, text on left
      if (align === 'center') {
        x = textSideWidth / 2;
      } else if (align === 'left') {
        x = textSidePadding;
      } else {
        x = textSideWidth - textSidePadding;
      }
    }
  } else {
    // Standard positioning for other templates
    if (align === 'center') {
      x = W / 2;
    } else if (align === 'left') {
      x = padding;
    } else {
      x = W - padding;
    }
  }

  // Calculate starting position (already calculated totalHeight above)
  let currentY;
  if (position === 'top') {
    // Start from top, text flows down
    currentY = baseY;
  } else if (position === 'bottom') {
    // Start from bottom, text flows up
    currentY = baseY - totalHeight;
  } else {
    // Center: position text in middle
    currentY = baseY - totalHeight / 2;
  }

  // Draw title
  if (title) {
    ctx.font = `bold ${titleFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`;
    ctx.fillStyle = titleColor;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 3;
    // currentY is already positioned correctly for top/bottom, add half font size for middle baseline
    const titleY = currentY + titleFontSize / 2;
    ctx.fillText(title, x, titleY);
    currentY += titleFontSize + spacing;
  }

  // Draw subtitle
  if (subtitle) {
    ctx.font = `${subtitleFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`;
    ctx.fillStyle = subtitleColor;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    // currentY is already positioned correctly, add half font size for middle baseline
    const subtitleY = currentY + subtitleFontSize / 2;
    ctx.fillText(subtitle, x, subtitleY);
  }

  ctx.restore();
}

// Calculate logo position
function calculateLogoPosition(logoSize) {
  const position = logoPositionSelect.value;
  const padding = 40;
  
  let x, y;
  
  switch (position) {
    case 'top-left':
      x = padding;
      y = padding;
      break;
    case 'top-center':
      x = (W - logoSize) / 2;
      y = padding;
      break;
    case 'top-right':
      x = W - logoSize - padding;
      y = padding;
      break;
    case 'center-left':
      x = padding;
      y = (H - logoSize) / 2;
      break;
    case 'center':
      x = (W - logoSize) / 2;
      y = (H - logoSize) / 2;
      break;
    case 'center-right':
      x = W - logoSize - padding;
      y = (H - logoSize) / 2;
      break;
    case 'bottom-left':
      x = padding;
      y = H - logoSize - padding;
      break;
    case 'bottom-center':
      x = (W - logoSize) / 2;
      y = H - logoSize - padding;
      break;
    case 'bottom-right':
      x = W - logoSize - padding;
      y = H - logoSize - padding;
      break;
    default:
      x = padding;
      y = padding;
  }
  
  return { x: Math.max(0, Math.min(x, W - logoSize)), y: Math.max(0, Math.min(y, H - logoSize)) };
}

// Draw logo
function drawLogo() {
  if (!toggleLogo.checked || !logo) return;

  const logoSize = parseInt(logoSizeRange.value);
  const opacity = parseInt(logoOpacityRange.value) / 100;
  const pos = calculateLogoPosition(logoSize);

  ctx.save();
  ctx.globalAlpha = opacity;
  
  // Maintain aspect ratio
  const logoAspect = logo.width / logo.height;
  let drawWidth = logoSize;
  let drawHeight = logoSize / logoAspect;
  
  // If height is larger, scale by height instead
  if (drawHeight > logoSize) {
    drawHeight = logoSize;
    drawWidth = logoSize * logoAspect;
  }
  
  const offsetX = (logoSize - drawWidth) / 2;
  const offsetY = (logoSize - drawHeight) / 2;
  
  ctx.drawImage(logo, pos.x + offsetX, pos.y + offsetY, drawWidth, drawHeight);
  ctx.restore();
}

// Main draw function
function draw() {
  ensureDPR(true); // Scale preview to CSS px; download will re-render at DPR
  ctx.clearRect(0, 0, W, H);

  const template = templateSelect.value;
  const innerSize = parseInt(sizeRange.value);
  const innerR = parseInt(radiusRange.value);
  const blur = parseInt(blurRange.value);
  const outerR = parseInt(outerRadiusRange.value);
  const vignetteIntensity = parseInt(vignetteRange.value);

  // Clip the entire canvas to have outer rounded corners
  ctx.save();
  ctx.clip(roundedRectPath(0, 0, W, H, outerR));

  if (img) {
    // Template-specific rendering
    switch (template) {
      case 'portrait':
        drawPortraitTemplate(innerSize, innerR, blur, vignetteIntensity);
        break;
      case 'wide':
        drawWideTemplate(innerSize, innerR, blur, vignetteIntensity);
        break;
      case 'blurred':
        drawBlurredTemplate(innerSize, innerR, blur, vignetteIntensity);
        break;
      case 'centered':
        drawCenteredTemplate(innerSize, innerR, blur, vignetteIntensity);
        break;
      case 'gradient':
        drawGradientTemplate(innerSize, innerR, blur, vignetteIntensity);
        break;
      case 'minimal':
        drawMinimalTemplate(innerSize, innerR, blur, vignetteIntensity);
        break;
      case 'split':
        drawSplitTemplate(innerSize, innerR, blur, vignetteIntensity);
        break;
      case 'asymmetric':
        drawAsymmetricTemplate(innerSize, innerR, blur, vignetteIntensity);
        break;
      case 'border':
        drawBorderTemplate(innerSize, innerR, blur, vignetteIntensity);
        break;
      case 'polaroid':
        drawPolaroidTemplate(innerSize, innerR, blur, vignetteIntensity);
        break;
      case 'magazine':
        drawMagazineTemplate(innerSize, innerR, blur, vignetteIntensity);
        break;
      case 'diagonal':
        drawDiagonalTemplate(innerSize, innerR, blur, vignetteIntensity);
        break;
    }
  } else {
    // Placeholder background
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, W, H);
  }

  // Apply background tint
  applyBackgroundTint();

  // Draw logo
  drawLogo();

  // Draw text overlay
  drawText();

  ctx.restore();
}

// Helper function to draw image at position
function drawImageAtPosition(size, radius, shadow = true) {
  const pos = calculateImagePosition(size);
  const inner = coverDrawParams(img.width, img.height, size, size);
  
  if (shadow) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.filter = 'blur(16px)';
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fill(roundedRectPath(pos.x, pos.y + 10, size, size, radius));
    ctx.restore();
  }
  
  ctx.save();
  ctx.clip(roundedRectPath(pos.x, pos.y, size, size, radius));
  ctx.drawImage(
    img,
    inner.sx,
    inner.sy,
    inner.sw,
    inner.sh,
    pos.x + inner.dx,
    pos.y + inner.dy,
    inner.dw,
    inner.dh
  );
  ctx.restore();
  
  return pos;
}

// Blurred background template
function drawBlurredTemplate(innerSize, innerR, blur, vignetteIntensity) {
  // Background (blurred full-bleed with extra padding)
  drawBlurredBackground(blur);

  // Vignette
  if (toggleVignette.checked) {
    const intensity = vignetteIntensity / 100;
    const g = ctx.createRadialGradient(
      W / 2,
      H / 2,
      Math.min(W, H) * 0.3,
      W / 2,
      H / 2,
      Math.max(W, H) * 0.65
    );
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, `rgba(0,0,0,${0.22 * intensity})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // Image at selected position
  drawImageAtPosition(innerSize, innerR);
}

// Centered card template
function drawCenteredTemplate(innerSize, innerR, blur, vignetteIntensity) {
  // Solid background
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, W, H);

  // Image at selected position
  const pos = drawImageAtPosition(innerSize, innerR, true);

  // White border
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 2;
  ctx.stroke(roundedRectPath(pos.x - 1, pos.y - 1, innerSize + 2, innerSize + 2, innerR + 1));
  ctx.restore();
}

// Gradient overlay template
function drawGradientTemplate(innerSize, innerR, blur, vignetteIntensity) {
  // Background with blur (larger for consistent edges)
  drawBlurredBackground(blur);

  // Gradient overlay
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, 'rgba(0,0,0,0.4)');
  gradient.addColorStop(0.5, 'rgba(0,0,0,0.2)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.6)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  // Image at selected position
  drawImageAtPosition(innerSize, innerR, false);
}

// Minimal frame template
function drawMinimalTemplate(innerSize, innerR, blur, vignetteIntensity) {
  // Light background
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, W, H);

  // Image at selected position with subtle shadow
  const pos = calculateImagePosition(innerSize);
  const inner = coverDrawParams(img.width, img.height, innerSize, innerSize);

  // Subtle shadow
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.filter = 'blur(12px)';
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fill(roundedRectPath(pos.x, pos.y + 8, innerSize, innerSize, innerR));
  ctx.restore();

  // Image
  ctx.save();
  ctx.clip(roundedRectPath(pos.x, pos.y, innerSize, innerSize, innerR));
  ctx.drawImage(
    img,
    inner.sx,
    inner.sy,
    inner.sw,
    inner.sh,
    pos.x + inner.dx,
    pos.y + inner.dy,
    inner.dw,
    inner.dh
  );
  ctx.restore();
}

// Split screen template
function drawSplitTemplate(innerSize, innerR, blur, vignetteIntensity) {
  // Split background - left side blurred, right side solid
  // Draw larger blurred background for consistent edges
  drawBlurredBackground(blur);
  
  // Right side - solid color overlay
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(W / 2, 0, W / 2, H);
  
  // Image on right side
  const pos = { x: W - innerSize - 60, y: (H - innerSize) / 2 };
  const inner = coverDrawParams(img.width, img.height, innerSize, innerSize);
  
  ctx.save();
  ctx.clip(roundedRectPath(pos.x, pos.y, innerSize, innerSize, innerR));
  ctx.drawImage(
    img,
    inner.sx,
    inner.sy,
    inner.sw,
    inner.sh,
    pos.x + inner.dx,
    pos.y + inner.dy,
    inner.dw,
    inner.dh
  );
  ctx.restore();
}

// Asymmetric layout template
function drawAsymmetricTemplate(innerSize, innerR, blur, vignetteIntensity) {
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, W, H);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(1, '#1e293b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);
  
  // Blurred background image (larger for consistent edges)
  const bgWidth = W * 1.5;
  const bgHeight = H * 1.5;
  const bgX = (W - bgWidth) / 2;
  const bgY = (H - bgHeight) / 2;
  const c = coverDrawParams(img.width, img.height, bgWidth, bgHeight);
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.filter = `blur(${blur * 1.5}px)`;
  ctx.drawImage(
    img,
    c.sx,
    c.sy,
    c.sw,
    c.sh,
    bgX + c.dx,
    bgY + c.dy,
    c.dw,
    c.dh
  );
  ctx.restore();
  
  // Image at selected position
  drawImageAtPosition(innerSize, innerR);
}

// Bordered frame template
function drawBorderTemplate(innerSize, innerR, blur, vignetteIntensity) {
  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  
  // Blurred background (larger for consistent edges)
  const bgWidth = W * 1.5;
  const bgHeight = H * 1.5;
  const bgX = (W - bgWidth) / 2;
  const bgY = (H - bgHeight) / 2;
  const c = coverDrawParams(img.width, img.height, bgWidth, bgHeight);
  ctx.save();
  ctx.filter = `blur(${blur}px)`;
  ctx.globalAlpha = 0.4;
  ctx.drawImage(
    img,
    c.sx,
    c.sy,
    c.sw,
    c.sh,
    bgX + c.dx,
    bgY + c.dy,
    c.dw,
    c.dh
  );
  ctx.restore();
  
  // Image with border
  const pos = drawImageAtPosition(innerSize, innerR, true);
  
  // Decorative border
  ctx.save();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 8;
  ctx.stroke(roundedRectPath(pos.x - 4, pos.y - 4, innerSize + 8, innerSize + 8, innerR + 4));
  ctx.restore();
}

// Polaroid style template
function drawPolaroidTemplate(innerSize, innerR, blur, vignetteIntensity) {
  // Cream background
  ctx.fillStyle = '#f5f5dc';
  ctx.fillRect(0, 0, W, H);
  
  // Calculate polaroid frame (larger than image with white border)
  const framePadding = 40;
  const frameSize = innerSize + framePadding * 2;
  const pos = calculateImagePosition(frameSize);
  
  // Polaroid shadow
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.filter = 'blur(20px)';
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fill(roundedRectPath(pos.x + 5, pos.y + 5, frameSize, frameSize, 8));
  ctx.restore();
  
  // White polaroid frame
  ctx.fillStyle = '#ffffff';
  ctx.fill(roundedRectPath(pos.x, pos.y, frameSize, frameSize, 8));
  
  // Image inside frame
  const imgPos = { x: pos.x + framePadding, y: pos.y + framePadding };
  const inner = coverDrawParams(img.width, img.height, innerSize, innerSize);
  
  ctx.save();
  ctx.clip(roundedRectPath(imgPos.x, imgPos.y, innerSize, innerSize, innerR));
  ctx.drawImage(
    img,
    inner.sx,
    inner.sy,
    inner.sw,
    inner.sh,
    imgPos.x + inner.dx,
    imgPos.y + inner.dy,
    inner.dw,
    inner.dh
  );
  ctx.restore();
}

// Magazine layout template
function drawMagazineTemplate(innerSize, innerR, blur, vignetteIntensity) {
  // Dark background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, W, H);
  
  // Blurred background with high blur (larger for consistent edges)
  const bgWidth = W * 1.5;
  const bgHeight = H * 1.5;
  const bgX = (W - bgWidth) / 2;
  const bgY = (H - bgHeight) / 2;
  const c = coverDrawParams(img.width, img.height, bgWidth, bgHeight);
  ctx.save();
  ctx.filter = `blur(${blur * 2}px)`;
  ctx.globalAlpha = 0.2;
  ctx.drawImage(
    img,
    c.sx,
    c.sy,
    c.sw,
    c.sh,
    bgX + c.dx,
    bgY + c.dy,
    c.dw,
    c.dh
  );
  ctx.restore();
  
  // Image with strong shadow
  const pos = calculateImagePosition(innerSize);
  const inner = coverDrawParams(img.width, img.height, innerSize, innerSize);
  
  // Strong shadow
  ctx.save();
  ctx.globalAlpha = 0.6;
  ctx.filter = 'blur(25px)';
  ctx.fillStyle = 'rgba(0,0,0,0.9)';
  ctx.fill(roundedRectPath(pos.x, pos.y + 20, innerSize, innerSize, innerR));
  ctx.restore();
  
  // Image
  ctx.save();
  ctx.clip(roundedRectPath(pos.x, pos.y, innerSize, innerSize, innerR));
  ctx.drawImage(
    img,
    inner.sx,
    inner.sy,
    inner.sw,
    inner.sh,
    pos.x + inner.dx,
    pos.y + inner.dy,
    inner.dw,
    inner.dh
  );
  ctx.restore();
}

// Diagonal split template
function drawDiagonalTemplate(innerSize, innerR, blur, vignetteIntensity) {
  // Blurred background (larger for consistent edges)
  drawBlurredBackground(blur);
  
  // Diagonal gradient overlay
  const gradient = ctx.createLinearGradient(0, 0, W, H);
  gradient.addColorStop(0, 'rgba(0,0,0,0.6)');
  gradient.addColorStop(0.5, 'rgba(0,0,0,0.2)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);
  
  // Image at selected position
  drawImageAtPosition(innerSize, innerR);
}

// Portrait photo template (side layout)
function drawPortraitTemplate(innerSize, innerR, blur, vignetteIntensity) {
  const photoSide = portraitSideSelect.value;
  const style = portraitStyleSelect.value;
  const photoWidth = W * 0.5; // Photo takes 50% of width
  
  // Draw background based on style
  if (style === 'blurred' || style === 'gradient') {
    // Draw larger blurred background for consistent edges
    drawBlurredBackground(blur);
    
    if (style === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, W, H);
      gradient.addColorStop(0, 'rgba(0,0,0,0.4)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);
    }
  } else if (style === 'solid') {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, W, H);
  } else if (style === 'pattern') {
    // Create subtle pattern
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);
    // Add subtle grid pattern
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < W; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, H);
      ctx.stroke();
    }
    for (let i = 0; i < H; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(W, i);
      ctx.stroke();
    }
  }
  
  // Calculate photo position
  let photoX, photoY;
  if (photoSide === 'left') {
    photoX = 0;
  } else {
    photoX = W - photoWidth;
  }
  photoY = 0;
  
  // Draw photo on side
  const photoHeight = H;
  const photoParams = coverDrawParams(img.width, img.height, photoWidth, photoHeight);
  
  ctx.save();
  if (photoSide === 'left') {
    ctx.clip(roundedRectPath(photoX, photoY, photoWidth, photoHeight, 0));
  } else {
    ctx.clip(roundedRectPath(photoX, photoY, photoWidth, photoHeight, 0));
  }
  ctx.drawImage(
    img,
    photoParams.sx,
    photoParams.sy,
    photoParams.sw,
    photoParams.sh,
    photoX + photoParams.dx,
    photoY + photoParams.dy,
    photoParams.dw,
    photoParams.dh
  );
  ctx.restore();
  
  // Add subtle divider line
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  if (photoSide === 'left') {
    ctx.beginPath();
    ctx.moveTo(photoWidth, 0);
    ctx.lineTo(photoWidth, H);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(W - photoWidth, 0);
    ctx.lineTo(W - photoWidth, H);
    ctx.stroke();
  }
  ctx.restore();
}

// Wide photo template (centered with overlay text)
function drawWideTemplate(innerSize, innerR, blur, vignetteIntensity) {
  const photoWidthPercent = parseInt(wideWidthRange.value);
  const photoHeightPercent = parseInt(wideHeightRange.value);
  const photoWidth = (W * photoWidthPercent) / 100;
  const photoHeight = (H * photoHeightPercent) / 100;
  
  // Blurred background (larger for consistent edges)
  const bgWidth = W * 1.5;
  const bgHeight = H * 1.5;
  const bgX = (W - bgWidth) / 2;
  const bgY = (H - bgHeight) / 2;
  const c = coverDrawParams(img.width, img.height, bgWidth, bgHeight);
  ctx.save();
  ctx.filter = `blur(${blur * 1.5}px)`;
  ctx.drawImage(
    img,
    c.sx,
    c.sy,
    c.sw,
    c.sh,
    bgX + c.dx,
    bgY + c.dy,
    c.dw,
    c.dh
  );
  ctx.restore();
  
  // Dark overlay for text readability
  const overlay = ctx.createLinearGradient(0, 0, 0, H);
  overlay.addColorStop(0, 'rgba(0,0,0,0.3)');
  overlay.addColorStop(0.5, 'rgba(0,0,0,0.5)');
  overlay.addColorStop(1, 'rgba(0,0,0,0.7)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);
  
  // Centered wide photo
  const photoX = (W - photoWidth) / 2;
  const photoY = (H - photoHeight) / 2;
  const photoParams = coverDrawParams(img.width, img.height, photoWidth, photoHeight);
  
  // Shadow
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.filter = 'blur(20px)';
  ctx.fillStyle = 'rgba(0,0,0,0.8)';
  ctx.fill(roundedRectPath(photoX, photoY + 15, photoWidth, photoHeight, innerR));
  ctx.restore();
  
  // Photo
  ctx.save();
  ctx.clip(roundedRectPath(photoX, photoY, photoWidth, photoHeight, innerR));
  ctx.drawImage(
    img,
    photoParams.sx,
    photoParams.sy,
    photoParams.sw,
    photoParams.sh,
    photoX + photoParams.dx,
    photoY + photoParams.dy,
    photoParams.dw,
    photoParams.dh
  );
  ctx.restore();
}

// Redraw at DPR and save
function redrawAtDPRAndSave(filename, format = 'png') {
  ensureDPR(false); // Render at device DPR for crisp export
  draw();
  const a = document.createElement('a');
  a.download = filename;
  const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
  const quality = format === 'jpg' ? 0.95 : undefined;
  a.href = canvas.toDataURL(mimeType, quality);
  a.click();
  // Return preview scale
  ensureDPR(true);
  draw();
}

// Load image
function loadImage(src, name) {
  const i = new Image();
  i.crossOrigin = 'anonymous';
  i.onload = () => {
    img = i;
    imgName = name || 'image';
    draw();
  };
  i.onerror = () => {
    alert('Could not load image. Please try a different file.');
  };
  i.src = src;
}

// Update value displays
function updateValueDisplays() {
  sizeVal.textContent = sizeRange.value;
  wideWidthVal.textContent = wideWidthRange.value;
  wideHeightVal.textContent = wideHeightRange.value;
  radiusVal.textContent = radiusRange.value;
  blurVal.textContent = blurRange.value;
  outerRadiusVal.textContent = outerRadiusRange.value;
  vignetteVal.textContent = vignetteRange.value;
  titleFontSizeVal.textContent = titleFontSizeRange.value;
  subtitleFontSizeVal.textContent = subtitleFontSizeRange.value;
  textSpacingVal.textContent = textSpacingRange.value;
  logoSizeVal.textContent = logoSizeRange.value;
  logoOpacityVal.textContent = logoOpacityRange.value;
  bgOpacityVal.textContent = bgOpacityRange.value;
}

// Toggle template-specific controls
function updateTemplateControls() {
  const template = templateSelect.value;
  
  // Portrait template controls
  const showPortrait = template === 'portrait';
  portraitSideControl.style.display = showPortrait ? 'block' : 'none';
  portraitStyleControl.style.display = showPortrait ? 'block' : 'none';
  
  // Wide template controls
  const showWide = template === 'wide';
  wideSizeControl.style.display = showWide ? 'block' : 'none';
  wideHeightControl.style.display = showWide ? 'block' : 'none';
  
  // Standard controls (hide for portrait/wide)
  const showStandard = !showPortrait && !showWide;
  standardPositionControl.style.display = showStandard ? 'block' : 'none';
  standardSizeControl.style.display = showStandard ? 'block' : 'none';
}

// Toggle text controls visibility
function toggleTextControls() {
  const isEnabled = toggleText.checked;
  textControls.style.display = isEnabled ? 'block' : 'none';
  textStyleControls.style.display = isEnabled ? 'block' : 'none';
  if (isEnabled) {
    draw();
  }
}

// Toggle logo controls visibility
function toggleLogoControls() {
  const isEnabled = toggleLogo.checked;
  logoControls.style.display = isEnabled ? 'block' : 'none';
  logoStyleControls.style.display = isEnabled ? 'block' : 'none';
  if (isEnabled) {
    draw();
  }
}

// Sync color picker and input
function syncColorInputs(picker, input) {
  picker.addEventListener('input', (e) => {
    input.value = e.target.value;
    draw();
  });
  input.addEventListener('input', (e) => {
    const value = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      picker.value = value;
      draw();
    }
  });
}

// Load logo
function loadLogo(src) {
  const i = new Image();
  i.crossOrigin = 'anonymous';
  i.onload = () => {
    logo = i;
    draw();
  };
  i.onerror = () => {
    alert('Could not load logo. Please try a different file.');
  };
  i.src = src;
}

// Event listeners
const controls = [
  sizeRange,
  wideWidthRange,
  wideHeightRange,
  radiusRange,
  blurRange,
  outerRadiusRange,
  toggleVignette,
  vignetteRange,
  templateSelect,
  portraitSideSelect,
  portraitStyleSelect,
  positionSelect,
  toggleText,
  titleText,
  subtitleText,
  titleFontSizeRange,
  subtitleFontSizeRange,
  textPositionSelect,
  textAlignSelect,
  textSpacingRange,
  toggleLogo,
  logoSizeRange,
  logoPositionSelect,
  logoOpacityRange,
  bgOpacityRange,
];

controls.forEach((el) => {
  el.addEventListener('input', () => {
    updateValueDisplays();
    updateTemplateControls();
    draw();
  });
});

// Initial template controls setup
updateTemplateControls();

// Text toggle
toggleText.addEventListener('change', toggleTextControls);

// Logo toggle
toggleLogo.addEventListener('change', toggleLogoControls);

// Color sync
syncColorInputs(titleColorPicker, titleColorInput);
syncColorInputs(subtitleColorPicker, subtitleColorInput);
syncColorInputs(bgTintPicker, bgTintInput);

// Logo input
logoInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  loadLogo(url);
});

// File input
imageInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  loadImage(url, file.name.replace(/\.[^.]+$/, ''));
});

// Drag and drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((evt) => {
  frame.addEventListener(evt, (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
});

frame.addEventListener('dragenter', () => {
  frame.classList.add('drag-over');
});

frame.addEventListener('dragleave', () => {
  frame.classList.remove('drag-over');
});

frame.addEventListener('drop', (e) => {
  frame.classList.remove('drag-over');
  const file = e.dataTransfer.files && e.dataTransfer.files[0];
  if (!file || !file.type.startsWith('image/')) {
    alert('Please drop an image file.');
    return;
  }
  const url = URL.createObjectURL(file);
  loadImage(url, file.name.replace(/\.[^.]+$/, ''));
});

// Download buttons
downloadBtn.addEventListener('click', () => {
  const filename = (imgName || 'meta') + '_meta.png';
  redrawAtDPRAndSave(filename, 'png');
});

downloadJpgBtn.addEventListener('click', () => {
  const filename = (imgName || 'meta') + '_meta.jpg';
  redrawAtDPRAndSave(filename, 'jpg');
});

// Initial render
updateTemplateControls();
updateValueDisplays();
ensureDPR(true);
draw();
