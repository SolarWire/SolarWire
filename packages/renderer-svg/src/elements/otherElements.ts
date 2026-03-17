import { CircleElement, TextElement, IconElement, PlaceholderElement, ImageElement, TableElement, TableRowElement, Element } from '@solarwire/parser';
import { renderIcon as getIconSvg } from '@solarwire/icons';
import { RenderContext, AbsolutePosition, ElementBounds, calculatePosition, getNumberAttribute, getColorAttribute, getBooleanAttribute, getAlignAttribute, updateLastElementBounds, createChildContext } from '../context';
import { RenderResult } from './rectangle';

export function renderCircle(element: CircleElement, context: RenderContext): RenderResult {
  let pos: AbsolutePosition;
  if (element.coordinates) {
    pos = calculatePosition(context, element.coordinates);
  } else {
    pos = { x: context.offsetX, y: context.offsetY };
  }
  
  const w = getNumberAttribute(element.attributes, context.globalDefaults, 'w', 100);
  const h = getNumberAttribute(element.attributes, context.globalDefaults, 'h', 40);
  const radius = Math.min(w, h) / 2;
  const cx = pos.x + w / 2;
  const cy = pos.y + h / 2;
  const bg = getColorAttribute(element.attributes, context.globalDefaults, 'bg', 'transparent');
  const b = getColorAttribute(element.attributes, context.globalDefaults, 'b', '#333333');
  const s = getNumberAttribute(element.attributes, context.globalDefaults, 's', 1);
  const c = getColorAttribute(element.attributes, context.globalDefaults, 'c', '#000000');
  const fontSize = getNumberAttribute(element.attributes, context.globalDefaults, 'text-size', getNumberAttribute(element.attributes, context.globalDefaults, 'size', 12));
  const bold = getBooleanAttribute(element.attributes, context.globalDefaults, 'bold');
  const italic = getBooleanAttribute(element.attributes, context.globalDefaults, 'italic');
  const note = element.attributes['note'];
  
  let svgParts: string[] = [];
  svgParts.push(`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${bg}" stroke="${b}" stroke-width="${s}"/>`);
  
  if (element.text) {
    let fontStyle = '';
    if (bold) fontStyle += 'font-weight="bold" ';
    if (italic) fontStyle += 'font-style="italic" ';
    svgParts.push(`<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle" fill="${c}" font-size="${fontSize}" ${fontStyle}>${element.text}</text>`);
  }
  
  const bounds: ElementBounds = {
    x: pos.x,
    y: pos.y,
    width: w,
    height: h,
  };
  
  updateLastElementBounds(context, bounds);
  
  if (note) {
    svgParts.push(`<title>${note}</title>`);
  }
  
  return {
    svg: svgParts.join(''),
    bounds,
  };
}

export function renderText(element: TextElement, context: RenderContext): RenderResult {
  let pos: AbsolutePosition;
  if (element.coordinates) {
    pos = calculatePosition(context, element.coordinates);
  } else {
    pos = { x: context.offsetX, y: context.offsetY };
  }
  
  const lines = element.text.split('\n');
  const w = getNumberAttribute(element.attributes, context.globalDefaults, 'w', 0);
  const lineHeight = getNumberAttribute(element.attributes, context.globalDefaults, 'line-height', getNumberAttribute(element.attributes, context.globalDefaults, 'line-height', 22));
  const c = getColorAttribute(element.attributes, context.globalDefaults, 'c', '#000000');
  const fontSize = getNumberAttribute(element.attributes, context.globalDefaults, 'text-size', getNumberAttribute(element.attributes, context.globalDefaults, 'size', 12));
  const align = getAlignAttribute(element.attributes, 'start');
  const bold = getBooleanAttribute(element.attributes, context.globalDefaults, 'bold');
  const italic = getBooleanAttribute(element.attributes, context.globalDefaults, 'italic');
  const note = element.attributes['note'];
  
  let fontStyle = '';
  if (bold) fontStyle += 'font-weight="bold" ';
  if (italic) fontStyle += 'font-style="italic" ';
  
  const textAnchor = align;
  let textX = pos.x;
  if (textAnchor === 'middle') {
    textX = pos.x + (w || 100) / 2;
  } else if (textAnchor === 'end') {
    textX = pos.x + (w || 100);
  }
  
  const textY = pos.y + fontSize;
  
  let svgParts: string[] = [];
  svgParts.push(`<text x="${textX}" y="${textY}" text-anchor="${textAnchor}" fill="${c}" font-size="${fontSize}" ${fontStyle}>`);
  
  lines.forEach((line, i) => {
    if (i === 0) {
      svgParts.push(line);
    } else {
      svgParts.push(`<tspan x="${textX}" dy="${lineHeight}">${line}</tspan>`);
    }
  });
  
  svgParts.push('</text>');
  
  const estimatedWidth = w || Math.max(...lines.map(l => l.length * fontSize * 0.6));
  const estimatedHeight = lines.length * lineHeight;
  
  const bounds: ElementBounds = {
    x: pos.x,
    y: pos.y,
    width: estimatedWidth,
    height: estimatedHeight,
  };
  
  updateLastElementBounds(context, bounds);
  
  if (note) {
    svgParts.push(`<title>${note}</title>`);
  }
  
  return {
    svg: svgParts.join(''),
    bounds,
  };
}

export function renderIcon(element: IconElement, context: RenderContext): RenderResult {
  let pos: AbsolutePosition;
  if (element.coordinates) {
    pos = calculatePosition(context, element.coordinates);
  } else {
    pos = { x: context.offsetX, y: context.offsetY };
  }
  
  const size = getNumberAttribute(element.attributes, context.globalDefaults, 's', getNumberAttribute(element.attributes, context.globalDefaults, 'size', 24));
  const c = getColorAttribute(element.attributes, context.globalDefaults, 'c', '#000000');
  const library = element.attributes['library'] || context.globalDefaults['icon-library'] || 'material-icons';
  const note = element.attributes['note'];
  
  const svgParts: string[] = [];
  const iconSvg = getIconSvg(element.name, size, c, library);
  svgParts.push(`<g transform="translate(${pos.x}, ${pos.y})">${iconSvg}</g>`);
  
  const bounds: ElementBounds = {
    x: pos.x,
    y: pos.y,
    width: size,
    height: size,
  };
  
  updateLastElementBounds(context, bounds);
  
  if (note) {
    svgParts.push(`<title>${note}</title>`);
  }
  
  return {
    svg: svgParts.join(''),
    bounds,
  };
}

export function renderPlaceholder(element: PlaceholderElement, context: RenderContext): RenderResult {
  let pos: AbsolutePosition;
  if (element.coordinates) {
    pos = calculatePosition(context, element.coordinates);
  } else {
    pos = { x: context.offsetX, y: context.offsetY };
  }
  
  const w = getNumberAttribute(element.attributes, context.globalDefaults, 'w', 100);
  const h = getNumberAttribute(element.attributes, context.globalDefaults, 'h', 40);
  const bg = getColorAttribute(element.attributes, context.globalDefaults, 'bg', '#f0f0f0');
  const c = getColorAttribute(element.attributes, context.globalDefaults, 'c', '#999999');
  const fontSize = getNumberAttribute(element.attributes, context.globalDefaults, 'text-size', getNumberAttribute(element.attributes, context.globalDefaults, 'size', 12));
  const note = element.attributes['note'];
  
  const svgParts: string[] = [];
  svgParts.push(`<rect x="${pos.x}" y="${pos.y}" width="${w}" height="${h}" fill="${bg}"/>`);
  
  const text = element.text || 'Placeholder';
  svgParts.push(`<text x="${pos.x + w / 2}" y="${pos.y + h / 2}" text-anchor="middle" dominant-baseline="middle" fill="${c}" font-size="${fontSize}">${text}</text>`);
  
  const bounds: ElementBounds = {
    x: pos.x,
    y: pos.y,
    width: w,
    height: h,
  };
  
  updateLastElementBounds(context, bounds);
  
  if (note) {
    svgParts.push(`<title>${note}</title>`);
  }
  
  return {
    svg: svgParts.join(''),
    bounds,
  };
}

export function renderImage(element: ImageElement, context: RenderContext): RenderResult {
  let pos: AbsolutePosition;
  if (element.coordinates) {
    pos = calculatePosition(context, element.coordinates);
  } else {
    pos = { x: context.offsetX, y: context.offsetY };
  }
  
  const w = getNumberAttribute(element.attributes, context.globalDefaults, 'w', 100);
  const h = getNumberAttribute(element.attributes, context.globalDefaults, 'h', 80);
  const bg = getColorAttribute(element.attributes, context.globalDefaults, 'bg', '#f0f0f0');
  const c = getColorAttribute(element.attributes, context.globalDefaults, 'c', '#999999');
  const fontSize = getNumberAttribute(element.attributes, context.globalDefaults, 'text-size', getNumberAttribute(element.attributes, context.globalDefaults, 'size', 12));
  const note = element.attributes['note'];
  
  const svgParts: string[] = [];
  
  svgParts.push(`<rect x="${pos.x}" y="${pos.y}" width="${w}" height="${h}" fill="${bg}"/>`);
  
  const iconSize = Math.min(w, h) * 0.3;
  const iconX = pos.x + w / 2;
  const iconY = pos.y + h / 2 - fontSize;
  
  svgParts.push(`<g transform="translate(${iconX - iconSize / 2}, ${iconY - iconSize / 2})">`);
  svgParts.push(`<rect x="0" y="0" width="${iconSize}" height="${iconSize}" fill="none" stroke="${c}" stroke-width="2" rx="4"/>`);
  svgParts.push(`<path d="M${iconSize * 0.2} ${iconSize * 0.3} L${iconSize * 0.5} ${iconSize * 0.6} L${iconSize * 0.8} ${iconSize * 0.3}" fill="none" stroke="${c}" stroke-width="2"/>`);
  svgParts.push(`<circle cx="${iconSize * 0.35}" cy="${iconSize * 0.4}" r="${iconSize * 0.08}" fill="${c}"/>`);
  svgParts.push(`</g>`);
  
  svgParts.push(`<text x="${pos.x + w / 2}" y="${pos.y + h / 2 + fontSize}" text-anchor="middle" fill="${c}" font-size="${fontSize}">Image</text>`);
  
  svgParts.push(`<image x="${pos.x}" y="${pos.y}" width="${w}" height="${h}" href="${element.url}"/>`);
  
  const bounds: ElementBounds = {
    x: pos.x,
    y: pos.y,
    width: w,
    height: h,
  };
  
  updateLastElementBounds(context, bounds);
  
  if (note) {
    svgParts.push(`<title>${note}</title>`);
  }
  
  return {
    svg: svgParts.join(''),
    bounds,
  };
}

export function renderTable(
  element: TableElement | TableRowElement, 
  context: RenderContext,
  renderChild: (child: Element, childContext: RenderContext) => RenderResult
): RenderResult {
  let pos: AbsolutePosition;
  if (element.coordinates) {
    pos = calculatePosition(context, element.coordinates);
  } else {
    pos = { x: context.offsetX, y: context.offsetY };
  }
  
  if (element.type === 'table') {
    return renderTableElement(element as TableElement, context, pos, renderChild);
  } else {
    return renderTableRow(element as TableRowElement, context, pos, renderChild);
  }
}

function renderTableElement(
  element: TableElement,
  context: RenderContext,
  pos: AbsolutePosition,
  renderChild: (child: Element, childContext: RenderContext) => RenderResult
): RenderResult {
  const border = getNumberAttribute(element.attributes, context.globalDefaults, 'border', 1);
  const cellspacing = getNumberAttribute(element.attributes, context.globalDefaults, 'cellspacing', 0);
  const b = getColorAttribute(element.attributes, context.globalDefaults, 'b', '#333333');
  const note = element.attributes['note'];
  
  const svgParts: string[] = [];
  
  const rows = element.children || [];
  const numRows = rows.length;
  
  const tableWidth = getNumberAttribute(element.attributes, context.globalDefaults, 'w', 600);
  const tableHeight = getNumberAttribute(element.attributes, context.globalDefaults, 'h', 200);
  
  const rowHeight = numRows > 0 ? (tableHeight - (numRows - 1) * cellspacing) / numRows : 40;
  
  let maxColCount = 0;
  const tempGrid: number[][] = [];
  
  for (let r = 0; r < numRows; r++) {
    tempGrid[r] = [];
    for (let c = 0; c < 100; c++) {
      tempGrid[r][c] = 0;
    }
  }
  
  rows.forEach((row, rowIndex) => {
    const cells = (row as any).children || [];
    let colIndex = 0;
    
    while (colIndex < 100 && tempGrid[rowIndex][colIndex] > 0) {
      colIndex++;
    }
    
    (cells as any[]).forEach((cell: any) => {
      const colspan = cell.attributes['colspan'] ? parseInt(cell.attributes['colspan']) : 1;
      const rowspan = cell.attributes['rowspan'] ? parseInt(cell.attributes['rowspan']) : 1;
      
      for (let r = rowIndex; r < rowIndex + rowspan && r < numRows; r++) {
        for (let c = colIndex; c < colIndex + colspan && c < 100; c++) {
          tempGrid[r][c] = 1;
        }
      }
      
      maxColCount = Math.max(maxColCount, colIndex + colspan);
      
      colIndex += colspan;
      while (colIndex < 100 && tempGrid[rowIndex][colIndex] > 0) {
        colIndex++;
      }
    });
  });
  
  const colWidth = maxColCount > 0 ? tableWidth / maxColCount : 100;
  
  const grid: boolean[][] = [];
  for (let r = 0; r < numRows; r++) {
    grid[r] = [];
    for (let c = 0; c < maxColCount; c++) {
      grid[r][c] = false;
    }
  }
  
  const cellData: Array<{
    row: number;
    col: number;
    colspan: number;
    rowspan: number;
    cell: any;
  }> = [];
  
  rows.forEach((row, rowIndex) => {
    const cells = (row as any).children || [];
    let colIndex = 0;
    
    while (colIndex < maxColCount && grid[rowIndex][colIndex]) {
      colIndex++;
    }
    
    (cells as any[]).forEach((cell: any) => {
      const colspan = cell.attributes['colspan'] ? parseInt(cell.attributes['colspan']) : 1;
      const rowspan = cell.attributes['rowspan'] ? parseInt(cell.attributes['rowspan']) : 1;
      
      cellData.push({
        row: rowIndex,
        col: colIndex,
        colspan,
        rowspan,
        cell
      });
      
      for (let r = rowIndex; r < rowIndex + rowspan && r < numRows; r++) {
        for (let c = colIndex; c < colIndex + colspan && c < maxColCount; c++) {
          grid[r][c] = true;
        }
      }
      
      colIndex += colspan;
      while (colIndex < maxColCount && grid[rowIndex][colIndex]) {
        colIndex++;
      }
    });
  });
  
  cellData.forEach(data => {
    const cellX = pos.x + data.col * colWidth;
    const cellY = pos.y + data.row * rowHeight;
    const cellWidth = colWidth * data.colspan;
    const cellHeight = rowHeight * data.rowspan;
    
    const cellBg = getColorAttribute(data.cell.attributes, context.globalDefaults, 'bg', '#ffffff');
    const cellBorder = getColorAttribute(data.cell.attributes, context.globalDefaults, 'b', '#333333');
    const cellStrokeWidth = getNumberAttribute(data.cell.attributes, context.globalDefaults, 's', 1);
    
    svgParts.push(`<rect x="${cellX}" y="${cellY}" width="${cellWidth}" height="${cellHeight}" fill="${cellBg}" stroke="${cellBorder}" stroke-width="${cellStrokeWidth}"/>`);
    
    const c = getColorAttribute(data.cell.attributes, context.globalDefaults, 'c', '#000000');
    const fontSize = getNumberAttribute(data.cell.attributes, context.globalDefaults, 'text-size', getNumberAttribute(data.cell.attributes, context.globalDefaults, 'size', 12));
    const bold = getBooleanAttribute(data.cell.attributes, context.globalDefaults, 'bold');
    const italic = getBooleanAttribute(data.cell.attributes, context.globalDefaults, 'italic');
    
    let fontStyle = '';
    if (bold) fontStyle += 'font-weight="bold" ';
    if (italic) fontStyle += 'font-style="italic" ';
    
    const textX = cellX + cellWidth / 2;
    const textY = cellY + cellHeight / 2;
    
    if ('text' in data.cell && data.cell.text) {
      svgParts.push(`<text x="${textX}" y="${textY}" text-anchor="middle" dominant-baseline="middle" fill="${c}" font-size="${fontSize}" ${fontStyle}>${data.cell.text}</text>`);
    }
  });
  
  if (border > 0) {
    svgParts.push(`<rect x="${pos.x}" y="${pos.y}" width="${tableWidth}" height="${tableHeight}" fill="none" stroke="${b}" stroke-width="${border}"/>`);
  }
  
  const bounds: ElementBounds = {
    x: pos.x,
    y: pos.y,
    width: tableWidth,
    height: tableHeight,
  };
  
  updateLastElementBounds(context, bounds);
  
  if (note) {
    svgParts.push(`<title>${note}</title>`);
  }
  
  return {
    svg: svgParts.join(''),
    bounds,
  };
}

function renderTableRow(
  element: TableRowElement,
  context: RenderContext,
  pos: AbsolutePosition,
  renderChild: (child: Element, childContext: RenderContext) => RenderResult
): RenderResult {
  const bg = getColorAttribute(element.attributes, context.globalDefaults, 'bg', 'transparent');
  const note = element.attributes['note'];
  
  const svgParts: string[] = [];
  let currentX = pos.x;
  let maxHeight = 0;
  const cellResults: RenderResult[] = [];
  
  const cells = element.children || [];
  cells.forEach(cell => {
    const cellContext = createChildContext(context, currentX, pos.y);
    const result = renderChild(cell as any, cellContext);
    cellResults.push(result);
    maxHeight = Math.max(maxHeight, result.bounds.height);
    
    let cellWidth = result.bounds.width;
    
    const colspan = cell.attributes['colspan'] ? parseInt(cell.attributes['colspan']) : 1;
    if (colspan > 1) {
      cellWidth *= colspan;
    }
    
    currentX += cellWidth;
  });
  
  const rowWidth = currentX - pos.x;
  const rowHeight = getNumberAttribute(element.attributes, context.globalDefaults, 'h', maxHeight || 40);
  
  if (bg !== 'transparent') {
    svgParts.push(`<rect x="${pos.x}" y="${pos.y}" width="${rowWidth}" height="${rowHeight}" fill="${bg}"/>`);
  }
  
  let renderX = pos.x;
  cellResults.forEach((result, index) => {
    const cell = cells[index];
    let cellWidth = result.bounds.width;
    let cellHeight = result.bounds.height;
    
    const colspan = cell.attributes['colspan'] ? parseInt(cell.attributes['colspan']) : 1;
    const rowspan = cell.attributes['rowspan'] ? parseInt(cell.attributes['rowspan']) : 1;
    
    if (colspan > 1) {
      cellWidth *= colspan;
    }
    
    if (rowspan > 1) {
      cellHeight *= rowspan;
    }
    
    if (colspan > 1 || rowspan > 1) {
      const cellBg = getColorAttribute(cell.attributes, context.globalDefaults, 'bg', '#ffffff');
      const cellBorder = getColorAttribute(cell.attributes, context.globalDefaults, 'b', '#333333');
      const cellStrokeWidth = getNumberAttribute(cell.attributes, context.globalDefaults, 's', 1);
      
      svgParts.push(`<rect x="${renderX}" y="${pos.y}" width="${cellWidth}" height="${cellHeight}" fill="${cellBg}" stroke="${cellBorder}" stroke-width="${cellStrokeWidth}"/>`);
    }
    
    svgParts.push(result.svg);
    
    renderX += cellWidth;
  });
  
  const bounds: ElementBounds = {
    x: pos.x,
    y: pos.y,
    width: rowWidth,
    height: rowHeight,
  };
  
  updateLastElementBounds(context, bounds);
  
  if (note) {
    svgParts.push(`<title>${note}</title>`);
  }
  
  return {
    svg: svgParts.join(''),
    bounds,
  };
}
