// SolarWire SVG Renderer - Browser Bundle
// Simplified version for browser use

const defaultColors = {
  text: '#333333',
  secondary: '#AAAAAA',
  border: '#F2F2F2',
  background: '#FFFFFF',
  primary: '#1890FF',
  error: '#D9001B'
};

const defaultFont = {
  size: 13,
  lineHeight: 22
};

function render(ast, options = {}) {
  const showNotes = options.showNotes !== false;
  
  // Get declarations
  const declarations = {};
  (ast.declarations || []).forEach(d => {
    declarations[d.name] = d.value;
  });
  
  const bgColor = declarations.bg || defaultColors.background;
  const textColor = declarations.c || defaultColors.text;
  const fontSize = declarations.size || defaultFont.size;
  
  // Calculate bounds
  let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
  const elements = ast.elements || [];
  
  elements.forEach(el => {
    if (el.x !== undefined) {
      minX = Math.min(minX, el.x);
      minY = Math.min(minY, el.y);
    }
    const w = el.attributes?.w || 100;
    const h = el.attributes?.h || 40;
    if (el.x !== undefined) {
      maxX = Math.max(maxX, el.x + w);
      maxY = Math.max(maxY, el.y + h);
    }
  });
  
  if (minX === Infinity) minX = 0;
  if (minY === Infinity) minY = 0;
  
  const margin = 20;
  const width = Math.max(400, maxX - minX + margin * 2);
  const height = maxY - minY + margin * 2;
  
  // Build SVG
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX - margin} ${minY - margin} ${width} ${height}" width="${width}" height="${height}">
<style>
  text { font-family: Arial, sans-serif; }
  .note-badge { fill: #70B603; }
  .note-badge-text { fill: white; font-size: 12px; font-weight: bold; }
</style>`;
  
  let noteNumber = 1;
  const notes = [];
  
  // Render elements
  elements.forEach(el => {
    const x = el.x || 0;
    const y = el.y || 0;
    const w = el.attributes?.w || 100;
    const h = el.attributes?.h || 40;
    const bg = el.attributes?.bg || bgColor;
    const c = el.attributes?.c || textColor;
    const size = el.attributes?.size || fontSize;
    const r = el.attributes?.r || 0;
    const b = el.attributes?.b || 'none';
    const opacity = el.attributes?.opacity;
    
    const opacityAttr = opacity ? ` opacity="${opacity}"` : '';
    const borderAttr = b !== 'none' ? ` stroke="${b}" stroke-width="1"` : '';
    const radiusAttr = r > 0 ? ` rx="${r}"` : '';
    
    switch (el.type) {
      case 'rectangle':
      case 'placeholder':
        svg += `\n  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}"${radiusAttr}${borderAttr}${opacityAttr}/>`;
        if (el.content) {
          const textX = x + w / 2;
          const textY = y + h / 2 + size / 3;
          svg += `\n  <text x="${textX}" y="${textY}" text-anchor="middle" fill="${c}" font-size="${size}"${el.attributes?.bold ? ' font-weight="bold"' : ''}>${escapeXml(el.content)}</text>`;
        }
        break;
        
      case 'rounded-rectangle':
        svg += `\n  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}" rx="${r || 8}"${borderAttr}${opacityAttr}/>`;
        if (el.content) {
          const textX = x + w / 2;
          const textY = y + h / 2 + size / 3;
          svg += `\n  <text x="${textX}" y="${textY}" text-anchor="middle" fill="${c}" font-size="${size}"${el.attributes?.bold ? ' font-weight="bold"' : ''}>${escapeXml(el.content)}</text>`;
        }
        break;
        
      case 'circle':
        const cx = x + w / 2;
        const cy = y + h / 2;
        const radius = Math.min(w, h) / 2;
        svg += `\n  <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${bg}"${borderAttr}${opacityAttr}/>`;
        if (el.content) {
          svg += `\n  <text x="${cx}" y="${cy + size / 3}" text-anchor="middle" fill="${c}" font-size="${size}"${el.attributes?.bold ? ' font-weight="bold"' : ''}>${escapeXml(el.content)}</text>`;
        }
        break;
        
      case 'text':
        svg += `\n  <text x="${x}" y="${y + size}" fill="${c}" font-size="${size}"${el.attributes?.bold ? ' font-weight="bold"' : ''}>${escapeXml(el.content)}</text>`;
        break;
        
      case 'line':
        svg += `\n  <line x1="${el.x1}" y1="${el.y1}" x2="${el.x2}" y2="${el.y2}" stroke="${b || '#F2F2F2'}" stroke-width="1"/>`;
        break;
        
      case 'table':
        svg += renderTable(el, showNotes);
        break;
    }
    
    // Add note badge
    if (showNotes && el.attributes?.note) {
      const badgeX = x + w - 8;
      const badgeY = y - 8;
      svg += `\n  <circle cx="${badgeX}" cy="${badgeY}" r="10" class="note-badge"/>`;
      svg += `\n  <text x="${badgeX}" y="${badgeY + 4}" text-anchor="middle" class="note-badge-text">${noteNumber}</text>`;
      notes.push({ number: noteNumber, note: el.attributes.note });
      noteNumber++;
    }
  });
  
  svg += '\n</svg>';
  
  return svg;
}

function renderTable(table, showNotes) {
  let svg = '';
  const x = table.x || 0;
  const y = table.y || 0;
  const w = table.attributes?.w || 400;
  const border = table.attributes?.border || 1;
  
  // Simple table rendering
  const rows = table.children || [];
  let rowY = y;
  
  rows.forEach((row, rowIndex) => {
    const rowH = 40;
    const rowBg = row.attributes?.bg || (rowIndex === 0 ? '#f5f5f5' : '#ffffff');
    
    svg += `\n  <rect x="${x}" y="${rowY}" width="${w}" height="${rowH}" fill="${rowBg}" stroke="#ddd" stroke-width="${border}"/>`;
    
    const cells = row.cells || [];
    const cellWidth = w / Math.max(cells.length, 1);
    
    cells.forEach((cell, cellIndex) => {
      const cellX = x + cellIndex * cellWidth;
      const cellY = rowY + 25;
      const cellC = cell.attributes?.c || '#333';
      const cellSize = cell.attributes?.size || 13;
      
      if (cell.type === 'text') {
        svg += `\n  <text x="${cellX + 10}" y="${cellY}" fill="${cellC}" font-size="${cellSize}">${escapeXml(cell.content)}</text>`;
      } else if (cell.type === 'rectangle') {
        svg += `\n  <rect x="${cellX + 5}" y="${rowY + 8}" width="60" height="24" fill="${cell.attributes?.bg || '#3498db'}" rx="4"/>`;
        if (cell.content) {
          svg += `\n  <text x="${cellX + 35}" y="${rowY + 24}" text-anchor="middle" fill="${cell.attributes?.c || 'white'}" font-size="12">${escapeXml(cell.content)}</text>`;
        }
      }
    });
    
    rowY += rowH;
  });
  
  return svg;
}

function escapeXml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export { render };
