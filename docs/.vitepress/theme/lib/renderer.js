// SolarWire SVG Renderer - Browser Bundle
// Bundled from @solarwire/renderer-svg

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function wrapText(text, maxWidth, fontSize = 12) {
  const lines = [];
  const avgCharWidth = fontSize * 0.65;
  const cjkCharWidth = fontSize * 1.0;
  const isCJK = (char) => /[\u4e00-\u9fa5\u3400-\u4dbf\u3040-\u30ff\u31f0-\u31ff\uac00-\ud7af]/.test(char);
  const getCharWidth = (char) => {
    return isCJK(char) ? cjkCharWidth : avgCharWidth;
  };
  
  text.split('\n').forEach(paragraph => {
    if (paragraph.trim() === '') {
      lines.push('');
      return;
    }
    let currentLine = '';
    let currentWidth = 0;
    let i = 0;
    while (i < paragraph.length) {
      const char = paragraph[i];
      if (char === ' ' || char === '\t') {
        currentLine += char;
        currentWidth += avgCharWidth;
        i++;
        continue;
      }
      let token = '';
      let tokenWidth = 0;
      if (isCJK(char)) {
        token = char;
        tokenWidth = cjkCharWidth;
        i++;
      } else {
        let j = i;
        while (j < paragraph.length && !isCJK(paragraph[j]) && paragraph[j] !== ' ' && paragraph[j] !== '\t') {
          token += paragraph[j];
          tokenWidth += avgCharWidth;
          j++;
        }
        i = j;
      }
      if (currentWidth + tokenWidth <= maxWidth || currentLine === '') {
        currentLine += token;
        currentWidth += tokenWidth;
      } else {
        if (tokenWidth > maxWidth) {
          if (currentLine.trim() !== '') {
            lines.push(currentLine.trim());
          }
          let remainingToken = token;
          while (remainingToken.length > 0) {
            let part = '';
            let partWidth = 0;
            let k = 0;
            while (k < remainingToken.length) {
              const charWidth = getCharWidth(remainingToken[k]);
              if (partWidth + charWidth > maxWidth && part.length > 0) {
                break;
              }
              part += remainingToken[k];
              partWidth += charWidth;
              k++;
            }
            if (k >= remainingToken.length) {
              currentLine = part;
              currentWidth = partWidth;
              remainingToken = '';
            } else {
              lines.push(part);
              remainingToken = remainingToken.substring(k);
            }
          }
        } else {
          lines.push(currentLine.trim());
          currentLine = token;
          currentWidth = tokenWidth;
        }
      }
    }
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }
  });
  return lines;
}

function createRenderContext(declarations = [], sourceInput) {
  const globalDefaults = {};
  declarations.forEach(decl => {
    const { key, value } = decl;
    if (['size', 'line-height', 'gap', 'r'].includes(key)) {
      globalDefaults[key] = parseFloat(value);
    } else if (key === 'bold') {
      globalDefaults[key] = true;
    } else {
      globalDefaults[key] = value;
    }
  });
  return {
    offsetX: 0,
    offsetY: 0,
    lastElementBounds: null,
    isFirstElement: true,
    globalDefaults,
    sourceInput,
  };
}

function getNumberAttribute(attributes, globalDefaults, key, defaultValue) {
  const localValue = attributes[key];
  if (localValue !== undefined) {
    const parsed = parseFloat(localValue);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  if (globalDefaults[key] !== undefined && typeof globalDefaults[key] === 'number') {
    return globalDefaults[key];
  }
  return defaultValue;
}

function getColorAttribute(attributes, globalDefaults, key, defaultValue) {
  return attributes[key] ?? globalDefaults[key] ?? defaultValue;
}

function getBooleanAttribute(attributes, globalDefaults, key) {
  if (key in attributes) return true;
  if (globalDefaults[key] !== undefined) return !!globalDefaults[key];
  return false;
}

function getAlignAttribute(attributes, defaultValue) {
  const align = attributes['align'];
  switch (align) {
    case 'l': return 'start';
    case 'c': return 'middle';
    case 'r': return 'end';
    default: return defaultValue;
  }
}

function getStyleAttribute(attributes) {
  const style = attributes['style'];
  switch (style) {
    case 'dashed': return { strokeDasharray: '5,5' };
    case 'dotted': return { strokeDasharray: '2,2' };
    default: return {};
  }
}

function getOpacityAttribute(attributes, key = 'opacity') {
  const value = attributes[key];
  if (value === undefined) return undefined;
  const parsed = parseFloat(value);
  if (isNaN(parsed)) return undefined;
  return Math.max(0, Math.min(1, parsed));
}

function calculateCoordinate(context, coord, isX, lastBounds) {
  let baseValue;
  switch (coord.type) {
    case 'absolute':
      baseValue = coord.value;
      break;
    case 'edge':
      if (!lastBounds) {
        baseValue = 0;
      } else {
        switch (coord.direction) {
          case 'L': baseValue = lastBounds.x; break;
          case 'R': baseValue = lastBounds.x + lastBounds.width; break;
          case 'T': baseValue = lastBounds.y; break;
          case 'B': baseValue = lastBounds.y + lastBounds.height; break;
          case 'C':
            baseValue = isX
              ? lastBounds.x + lastBounds.width / 2
              : lastBounds.y + lastBounds.height / 2;
            break;
          default: baseValue = 0;
        }
      }
      baseValue += coord.value;
      break;
    default:
      baseValue = 0;
  }
  return baseValue + (isX ? context.offsetX : context.offsetY);
}

function calculatePosition(context, coords) {
  const x = calculateCoordinate(context, coords.x, true, context.lastElementBounds);
  const y = calculateCoordinate(context, coords.y, false, context.lastElementBounds);
  return { x, y };
}

function renderRectangle(element, context) {
  const { coordinates, attributes, content } = element;
  const pos = calculatePosition(context, coordinates);
  const width = getNumberAttribute(attributes, context.globalDefaults, 'w', 100);
  const height = getNumberAttribute(attributes, context.globalDefaults, 'h', 40);
  const bg = getColorAttribute(attributes, context.globalDefaults, 'bg', '#FFFFFF');
  const c = getColorAttribute(attributes, context.globalDefaults, 'c', '#333333');
  const size = getNumberAttribute(attributes, context.globalDefaults, 'size', 13);
  const r = getNumberAttribute(attributes, context.globalDefaults, 'r', 0);
  const b = attributes.b || attributes.border;
  const opacity = getOpacityAttribute(attributes);
  
  const opacityAttr = opacity !== undefined ? ` opacity="${opacity}"` : '';
  const borderAttr = b ? ` stroke="${b}" stroke-width="1"` : '';
  const radiusAttr = r > 0 ? ` rx="${r}"` : '';
  const isBold = getBooleanAttribute(attributes, context.globalDefaults, 'bold');
  
  let svg = `  <rect x="${pos.x}" y="${pos.y}" width="${width}" height="${height}" fill="${bg}"${radiusAttr}${borderAttr}${opacityAttr}/>`;
  
  if (content) {
    const align = getAlignAttribute(attributes, 'middle');
    const textX = align === 'middle' ? pos.x + width / 2 : align === 'end' ? pos.x + width - 10 : pos.x + 10;
    const textY = pos.y + height / 2 + size / 3;
    svg += `\n  <text x="${textX}" y="${textY}" text-anchor="${align}" fill="${c}" font-size="${size}"${isBold ? ' font-weight="bold"' : ''}>${escapeHtml(content)}</text>`;
  }
  
  return {
    svg,
    bounds: { x: pos.x, y: pos.y, width, height }
  };
}

function renderCircle(element, context) {
  const { coordinates, attributes, content } = element;
  const pos = calculatePosition(context, coordinates);
  const width = getNumberAttribute(attributes, context.globalDefaults, 'w', 40);
  const height = getNumberAttribute(attributes, context.globalDefaults, 'h', 40);
  const bg = getColorAttribute(attributes, context.globalDefaults, 'bg', '#FFFFFF');
  const c = getColorAttribute(attributes, context.globalDefaults, 'c', '#333333');
  const size = getNumberAttribute(attributes, context.globalDefaults, 'size', 13);
  const b = attributes.b || attributes.border;
  const opacity = getOpacityAttribute(attributes);
  
  const cx = pos.x + width / 2;
  const cy = pos.y + height / 2;
  const radius = Math.min(width, height) / 2;
  const opacityAttr = opacity !== undefined ? ` opacity="${opacity}"` : '';
  const borderAttr = b ? ` stroke="${b}" stroke-width="1"` : '';
  const isBold = getBooleanAttribute(attributes, context.globalDefaults, 'bold');
  
  let svg = `  <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${bg}"${borderAttr}${opacityAttr}/>`;
  
  if (content) {
    svg += `\n  <text x="${cx}" y="${cy + size / 3}" text-anchor="middle" fill="${c}" font-size="${size}"${isBold ? ' font-weight="bold"' : ''}>${escapeHtml(content)}</text>`;
  }
  
  return {
    svg,
    bounds: { x: pos.x, y: pos.y, width, height }
  };
}

function renderText(element, context) {
  const { coordinates, attributes, content } = element;
  const pos = calculatePosition(context, coordinates);
  const c = getColorAttribute(attributes, context.globalDefaults, 'c', '#333333');
  const size = getNumberAttribute(attributes, context.globalDefaults, 'size', 13);
  const isBold = getBooleanAttribute(attributes, context.globalDefaults, 'bold');
  
  const svg = `  <text x="${pos.x}" y="${pos.y + size}" fill="${c}" font-size="${size}"${isBold ? ' font-weight="bold"' : ''}>${escapeHtml(content)}</text>`;
  
  return {
    svg,
    bounds: { x: pos.x, y: pos.y, width: content.length * size * 0.5, height: size }
  };
}

function renderLine(element, context) {
  const { coordinates, attributes } = element;
  const startPos = calculatePosition(context, coordinates);
  const endPos = element.end ? calculatePosition(context, element.end) : { x: startPos.x + 100, y: startPos.y };
  const b = attributes.b || attributes.border || '#F2F2F2';
  const style = getStyleAttribute(attributes);
  
  const dashAttr = style.strokeDasharray ? ` stroke-dasharray="${style.strokeDasharray}"` : '';
  const svg = `  <line x1="${startPos.x}" y1="${startPos.y}" x2="${endPos.x}" y2="${endPos.y}" stroke="${b}" stroke-width="1"${dashAttr}/>`;
  
  return {
    svg,
    bounds: {
      x: Math.min(startPos.x, endPos.x),
      y: Math.min(startPos.y, endPos.y),
      width: Math.abs(endPos.x - startPos.x) || 1,
      height: Math.abs(endPos.y - startPos.y) || 1
    }
  };
}

function renderElement(element, context, options) {
  let result;
  
  switch (element.type) {
    case 'rectangle':
    case 'rounded-rectangle':
      result = renderRectangle(element, context);
      break;
    case 'circle':
      result = renderCircle(element, context);
      break;
    case 'text':
      result = renderText(element, context);
      break;
    case 'line':
      result = renderLine(element, context);
      break;
    case 'placeholder':
      result = renderRectangle(element, context);
      break;
    default:
      result = renderRectangle(element, context);
  }
  
  // Handle notes
  const { notes, noteNumberRef, disableNotes } = options || {};
  if (notes && noteNumberRef && !disableNotes && element.attributes && element.attributes.note) {
    notes.push({
      number: noteNumberRef.current,
      note: element.attributes.note,
      bounds: result.bounds
    });
    noteNumberRef.current++;
  }
  
  return result;
}

function render(ast, options = {}) {
  const context = createRenderContext(ast.declarations, options?.sourceInput);
  const svgParts = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = 0;
  let maxY = 0;
  
  const notes = [];
  const noteNumberRef = { current: 1 };
  const disableNotes = options?.disableNotes ?? false;
  const showNotes = options?.showNotes !== false;
  
  const renderOptions = {
    disableNotes: !showNotes,
    sourceInput: options?.sourceInput,
    notes,
    noteNumberRef
  };
  
  const elementResults = [];
  
  (ast.elements || []).forEach(element => {
    const result = renderElement(element, context, renderOptions);
    elementResults.push(result);
    minX = Math.min(minX, result.bounds.x);
    minY = Math.min(minY, result.bounds.y);
    maxX = Math.max(maxX, result.bounds.x + result.bounds.width);
    maxY = Math.max(maxY, result.bounds.y + result.bounds.height);
  });
  
  if (minX === Infinity) {
    minX = 0;
    minY = 0;
    maxX = 400;
    maxY = 300;
  }
  
  const margin = 20;
  const viewBoxX = minX - margin;
  const viewBoxY = minY - margin;
  const viewBoxWidth = maxX - minX + margin * 2;
  
  // Calculate notes area height
  let notesAreaHeight = 0;
  const extraNoteSpacing = 20;
  
  if (showNotes && notes.length > 0) {
    const cardMargin = 10;
    const cardsPerRow = 2;
    const lineHeight = 22;
    const cardPadding = 12;
    const cardWidth = (viewBoxWidth - margin * 2 - 10) / 2;
    
    const cardHeights = notes.map(note => {
      const lines = wrapText(note.note, cardWidth - 28 - 12, 12);
      const contentHeight = lines.length * lineHeight;
      return Math.max(60, contentHeight + cardPadding * 2);
    });
    
    const rowMaxHeights = [];
    notes.forEach((_, index) => {
      const row = Math.floor(index / cardsPerRow);
      if (!rowMaxHeights[row]) rowMaxHeights[row] = 0;
      rowMaxHeights[row] = Math.max(rowMaxHeights[row], cardHeights[index]);
    });
    
    const totalRowHeight = rowMaxHeights.reduce((sum, height) => sum + height, 0);
    const rows = rowMaxHeights.length;
    notesAreaHeight = totalRowHeight + (rows + 1) * cardMargin + extraNoteSpacing;
  }
  
  const viewBoxHeight = maxY - minY + margin * 2 + notesAreaHeight;
  
  // Build SVG
  svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}" width="${viewBoxWidth}" height="${viewBoxHeight}">`);
  svgParts.push(`<style>`);
  svgParts.push(`  text { font-family: Arial, sans-serif; }`);
  if (showNotes) {
    svgParts.push(`  .note-badge { fill: #70B603; }`);
    svgParts.push(`  .note-badge-text { fill: white; font-size: 12px; font-weight: bold; }`);
    svgParts.push(`  .note-card { fill: #f8f9fa; stroke: #dee2e6; stroke-width: 1; }`);
    svgParts.push(`  .note-card-text { fill: #333; font-size: 12px; line-height: 22px; }`);
    svgParts.push(`  .note-card-badge { fill: #70B603; }`);
    svgParts.push(`  .note-card-badge-text { fill: white; font-size: 10px; font-weight: bold; }`);
  }
  svgParts.push(`</style>`);
  
  // Render elements
  elementResults.forEach(result => {
    svgParts.push(result.svg);
  });
  
  // Render note badges on elements
  if (showNotes) {
    notes.forEach(note => {
      const badgeX = note.bounds.x + note.bounds.width - 8;
      const badgeY = note.bounds.y - 8;
      const badgeRadius = 10;
      
      svgParts.push(`  <defs>`);
      svgParts.push(`    <filter id="badge-shadow-${note.number}" x="-50%" y="-50%" width="200%" height="200%">`);
      svgParts.push(`      <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="black" flood-opacity="0.7"/>`);
      svgParts.push(`    </filter>`);
      svgParts.push(`  </defs>`);
      svgParts.push(`  <path d="M${badgeX} ${badgeY - badgeRadius} C${badgeX + badgeRadius} ${badgeY - badgeRadius} ${badgeX + badgeRadius} ${badgeY + badgeRadius * 0.5} ${badgeX} ${badgeY + badgeRadius * 1.5} C${badgeX - badgeRadius} ${badgeY + badgeRadius * 0.5} ${badgeX - badgeRadius} ${badgeY - badgeRadius} ${badgeX} ${badgeY - badgeRadius} Z" fill="#70B603" stroke="white" stroke-width="1" filter="url(#badge-shadow-${note.number})"/>`);
      svgParts.push(`  <text x="${badgeX}" y="${badgeY + 2}" text-anchor="middle" class="note-badge-text">${note.number}</text>`);
    });
    
    // Render note cards at bottom
    if (notes.length > 0) {
      const notesY = maxY + margin + extraNoteSpacing;
      const cardWidth = (viewBoxWidth - margin * 2 - 10) / 2;
      const cardMargin = 10;
      const cardsPerRow = 2;
      const lineHeight = 22;
      const cardPadding = 12;
      
      const cardHeights = notes.map(note => {
        const lines = wrapText(note.note, cardWidth - 28 - 12, 12);
        const contentHeight = lines.length * lineHeight;
        return Math.max(60, contentHeight + cardPadding * 2);
      });
      
      const rowMaxHeights = [];
      notes.forEach((_, index) => {
        const row = Math.floor(index / cardsPerRow);
        if (!rowMaxHeights[row]) rowMaxHeights[row] = 0;
        rowMaxHeights[row] = Math.max(rowMaxHeights[row], cardHeights[index]);
      });
      
      const rowStartYs = [0];
      for (let row = 1; row < rowMaxHeights.length; row++) {
        rowStartYs[row] = rowStartYs[row - 1] + rowMaxHeights[row - 1] + cardMargin;
      }
      
      notes.forEach((note, index) => {
        const col = index % cardsPerRow;
        const row = Math.floor(index / cardsPerRow);
        const cardX = viewBoxX + margin + col * (cardWidth + cardMargin);
        const cardY = notesY + cardMargin + rowStartYs[row];
        const cardHeight = cardHeights[index];
        
        svgParts.push(`  <rect x="${cardX}" y="${cardY}" width="${cardWidth}" height="${cardHeight}" rx="8" class="note-card"/>`);
        
        const badgeX = cardX + 12;
        const badgeY = cardY + 12;
        const badgeRadius = 8;
        
        svgParts.push(`  <defs>`);
        svgParts.push(`    <filter id="card-badge-shadow-${index}" x="-50%" y="-50%" width="200%" height="200%">`);
        svgParts.push(`      <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="black" flood-opacity="0.7"/>`);
        svgParts.push(`    </filter>`);
        svgParts.push(`  </defs>`);
        svgParts.push(`  <circle cx="${badgeX}" cy="${badgeY}" r="${badgeRadius}" fill="#70B603" stroke="white" stroke-width="1" filter="url(#card-badge-shadow-${index})"/>`);
        svgParts.push(`  <text x="${badgeX}" y="${badgeY + 3}" text-anchor="middle" class="note-card-badge-text">${note.number}</text>`);
        
        const textX = cardX + 28;
        const textY = cardY + cardPadding;
        svgParts.push(`  <text x="${textX}" y="${textY}" fill="#333" font-size="12" dominant-baseline="hanging">`);
        
        const lines = wrapText(note.note, cardWidth - 28 - 12, 12);
        lines.forEach((line, lineIndex) => {
          if (lineIndex === 0) {
            svgParts.push(`    <tspan x="${textX}">${escapeHtml(line)}</tspan>`);
          } else {
            svgParts.push(`    <tspan x="${textX}" dy="22">${escapeHtml(line)}</tspan>`);
          }
        });
        svgParts.push(`  </text>`);
      });
    }
  }
  
  svgParts.push('</svg>');
  
  return svgParts.join('\n');
}

export { render };
