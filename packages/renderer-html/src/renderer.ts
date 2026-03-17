import { Document, Element, RectangleElement, RoundedRectangleElement, CircleElement, TextElement, IconElement, PlaceholderElement, ImageElement, LineElement, RowContainer, ColContainer, TableElement, TableRowElement } from '@solarwire/parser';
import { renderIcon as getIconSvg } from '@solarwire/icons';
import { createRenderContext, RenderContext, AbsolutePosition, ElementBounds, calculatePosition, calculateLineEnd, getNumberAttribute, getColorAttribute, getBooleanAttribute, getAlignAttribute, updateLastElementBounds, createChildContext, getStyleAttribute } from './context';

export interface RenderResult {
  html: string;
  bounds: ElementBounds;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderRectangle(element: RectangleElement | RoundedRectangleElement, context: RenderContext): RenderResult {
  const isRounded = element.type === 'rounded-rectangle';
  
  let pos: AbsolutePosition;
  if (element.coordinates) {
    pos = calculatePosition(context, element.coordinates);
  } else {
    pos = { x: context.offsetX, y: context.offsetY };
  }
  
  const w = getNumberAttribute(element.attributes, context.globalDefaults, 'w', 100);
  const h = getNumberAttribute(element.attributes, context.globalDefaults, 'h', 40);
  const bg = getColorAttribute(element.attributes, context.globalDefaults, 'bg', '#ffffff');
  const c = getColorAttribute(element.attributes, context.globalDefaults, 'c', '#000000');
  const b = getColorAttribute(element.attributes, context.globalDefaults, 'b', '#333333');
  const s = getNumberAttribute(element.attributes, context.globalDefaults, 's', 1);
  const r = isRounded ? getNumberAttribute(element.attributes, context.globalDefaults, 'r', 6) : 0;
  const fontSize = getNumberAttribute(element.attributes, context.globalDefaults, 'text-size', getNumberAttribute(element.attributes, context.globalDefaults, 'size', 12));
  const align = getAlignAttribute(element.attributes, 'center');
  const bold = getBooleanAttribute(element.attributes, context.globalDefaults, 'bold');
  const italic = getBooleanAttribute(element.attributes, context.globalDefaults, 'italic');
  const note = element.attributes['note'];
  
  const styles: string[] = [];
  styles.push(`position: absolute;`);
  styles.push(`left: ${pos.x}px;`);
  styles.push(`top: ${pos.y}px;`);
  styles.push(`width: ${w}px;`);
  styles.push(`height: ${h}px;`);
  styles.push(`background-color: ${bg};`);
  styles.push(`border: ${s}px solid ${b};`);
  styles.push(`box-sizing: border-box;`);
  styles.push(`display: flex;`);
  styles.push(`align-items: center;`);
  styles.push(`justify-content: ${align};`);
  
  if (isRounded && r > 0) {
    styles.push(`border-radius: ${r}px;`);
  }
  
  const textStyles: string[] = [];
  textStyles.push(`color: ${c};`);
  textStyles.push(`font-size: ${fontSize}px;`);
  if (bold) textStyles.push(`font-weight: bold;`);
  if (italic) textStyles.push(`font-style: italic;`);
  
  const htmlParts: string[] = [];
  htmlParts.push(`<div class="solarwire-rectangle" style="${styles.join(' ')}"${note ? ` title="${escapeHtml(note)}"` : ''}>`);
  
  if (element.text) {
    htmlParts.push(`<span style="${textStyles.join(' ')}">${escapeHtml(element.text)}</span>`);
  }
  
  htmlParts.push('</div>');
  
  const bounds: ElementBounds = {
    x: pos.x,
    y: pos.y,
    width: w,
    height: h,
  };
  
  updateLastElementBounds(context, bounds);
  
  return {
    html: htmlParts.join(''),
    bounds,
  };
}

function renderCircle(element: CircleElement, context: RenderContext): RenderResult {
  let pos: AbsolutePosition;
  if (element.coordinates) {
    pos = calculatePosition(context, element.coordinates);
  } else {
    pos = { x: context.offsetX, y: context.offsetY };
  }
  
  const w = getNumberAttribute(element.attributes, context.globalDefaults, 'w', 100);
  const h = getNumberAttribute(element.attributes, context.globalDefaults, 'h', 40);
  const bg = getColorAttribute(element.attributes, context.globalDefaults, 'bg', 'transparent');
  const b = getColorAttribute(element.attributes, context.globalDefaults, 'b', '#333333');
  const s = getNumberAttribute(element.attributes, context.globalDefaults, 's', 1);
  const c = getColorAttribute(element.attributes, context.globalDefaults, 'c', '#000000');
  const fontSize = getNumberAttribute(element.attributes, context.globalDefaults, 'text-size', getNumberAttribute(element.attributes, context.globalDefaults, 'size', 12));
  const bold = getBooleanAttribute(element.attributes, context.globalDefaults, 'bold');
  const italic = getBooleanAttribute(element.attributes, context.globalDefaults, 'italic');
  const note = element.attributes['note'];
  
  const styles: string[] = [];
  styles.push(`position: absolute;`);
  styles.push(`left: ${pos.x}px;`);
  styles.push(`top: ${pos.y}px;`);
  styles.push(`width: ${w}px;`);
  styles.push(`height: ${h}px;`);
  styles.push(`background-color: ${bg};`);
  styles.push(`border: ${s}px solid ${b};`);
  styles.push(`border-radius: 50%;`);
  styles.push(`box-sizing: border-box;`);
  styles.push(`display: flex;`);
  styles.push(`align-items: center;`);
  styles.push(`justify-content: center;`);
  
  const textStyles: string[] = [];
  textStyles.push(`color: ${c};`);
  textStyles.push(`font-size: ${fontSize}px;`);
  if (bold) textStyles.push(`font-weight: bold;`);
  if (italic) textStyles.push(`font-style: italic;`);
  
  const htmlParts: string[] = [];
  htmlParts.push(`<div class="solarwire-circle" style="${styles.join(' ')}"${note ? ` title="${escapeHtml(note)}"` : ''}>`);
  
  if (element.text) {
    htmlParts.push(`<span style="${textStyles.join(' ')}">${escapeHtml(element.text)}</span>`);
  }
  
  htmlParts.push('</div>');
  
  const bounds: ElementBounds = {
    x: pos.x,
    y: pos.y,
    width: w,
    height: h,
  };
  
  updateLastElementBounds(context, bounds);
  
  return {
    html: htmlParts.join(''),
    bounds,
  };
}

function renderText(element: TextElement, context: RenderContext): RenderResult {
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
  const align = getAlignAttribute(element.attributes, 'left');
  const bold = getBooleanAttribute(element.attributes, context.globalDefaults, 'bold');
  const italic = getBooleanAttribute(element.attributes, context.globalDefaults, 'italic');
  const note = element.attributes['note'];
  
  const styles: string[] = [];
  styles.push(`position: absolute;`);
  styles.push(`left: ${pos.x}px;`);
  styles.push(`top: ${pos.y}px;`);
  if (w > 0) styles.push(`width: ${w}px;`);
  styles.push(`color: ${c};`);
  styles.push(`font-size: ${fontSize}px;`);
  styles.push(`line-height: ${lineHeight}px;`);
  styles.push(`text-align: ${align};`);
  if (bold) styles.push(`font-weight: bold;`);
  if (italic) styles.push(`font-style: italic;`);
  
  const htmlParts: string[] = [];
  htmlParts.push(`<div class="solarwire-text" style="${styles.join(' ')}"${note ? ` title="${escapeHtml(note)}"` : ''}>`);
  
  lines.forEach((line, i) => {
    if (i > 0) {
      htmlParts.push('<br>');
    }
    htmlParts.push(escapeHtml(line));
  });
  
  htmlParts.push('</div>');
  
  const estimatedWidth = w || Math.max(...lines.map(l => l.length * fontSize * 0.6));
  const estimatedHeight = lines.length * lineHeight;
  
  const bounds: ElementBounds = {
    x: pos.x,
    y: pos.y,
    width: estimatedWidth,
    height: estimatedHeight,
  };
  
  updateLastElementBounds(context, bounds);
  
  return {
    html: htmlParts.join(''),
    bounds,
  };
}

function renderIcon(element: IconElement, context: RenderContext): RenderResult {
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
  
  const iconSvg = getIconSvg(element.name, size, c, library);
  
  const styles: string[] = [];
  styles.push(`position: absolute;`);
  styles.push(`left: ${pos.x}px;`);
  styles.push(`top: ${pos.y}px;`);
  styles.push(`width: ${size}px;`);
  styles.push(`height: ${size}px;`);
  
  const htmlParts: string[] = [];
  htmlParts.push(`<div class="solarwire-icon" style="${styles.join(' ')}"${note ? ` title="${escapeHtml(note)}"` : ''}>`);
  htmlParts.push(iconSvg);
  htmlParts.push('</div>');
  
  const bounds: ElementBounds = {
    x: pos.x,
    y: pos.y,
    width: size,
    height: size,
  };
  
  updateLastElementBounds(context, bounds);
  
  return {
    html: htmlParts.join(''),
    bounds,
  };
}

function renderPlaceholder(element: PlaceholderElement, context: RenderContext): RenderResult {
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
  
  const styles: string[] = [];
  styles.push(`position: absolute;`);
  styles.push(`left: ${pos.x}px;`);
  styles.push(`top: ${pos.y}px;`);
  styles.push(`width: ${w}px;`);
  styles.push(`height: ${h}px;`);
  styles.push(`background-color: ${bg};`);
  styles.push(`box-sizing: border-box;`);
  styles.push(`display: flex;`);
  styles.push(`align-items: center;`);
  styles.push(`justify-content: center;`);
  
  const textStyles: string[] = [];
  textStyles.push(`color: ${c};`);
  textStyles.push(`font-size: ${fontSize}px;`);
  
  const htmlParts: string[] = [];
  htmlParts.push(`<div class="solarwire-placeholder" style="${styles.join(' ')}"${note ? ` title="${escapeHtml(note)}"` : ''}>`);
  
  const text = element.text || 'Placeholder';
  htmlParts.push(`<span style="${textStyles.join(' ')}">${escapeHtml(text)}</span>`);
  
  htmlParts.push('</div>');
  
  const bounds: ElementBounds = {
    x: pos.x,
    y: pos.y,
    width: w,
    height: h,
  };
  
  updateLastElementBounds(context, bounds);
  
  return {
    html: htmlParts.join(''),
    bounds,
  };
}

function renderImage(element: ImageElement, context: RenderContext): RenderResult {
  let pos: AbsolutePosition;
  if (element.coordinates) {
    pos = calculatePosition(context, element.coordinates);
  } else {
    pos = { x: context.offsetX, y: context.offsetY };
  }
  
  const w = getNumberAttribute(element.attributes, context.globalDefaults, 'w', 100);
  const h = getNumberAttribute(element.attributes, context.globalDefaults, 'h', 80);
  const note = element.attributes['note'];
  
  const styles: string[] = [];
  styles.push(`position: absolute;`);
  styles.push(`left: ${pos.x}px;`);
  styles.push(`top: ${pos.y}px;`);
  styles.push(`width: ${w}px;`);
  styles.push(`height: ${h}px;`);
  styles.push(`object-fit: contain;`);
  
  const htmlParts: string[] = [];
  htmlParts.push(`<img class="solarwire-image" src="${escapeHtml(element.url)}" style="${styles.join(' ')}"${note ? ` title="${escapeHtml(note)}"` : ''} alt="Image">`);
  
  const bounds: ElementBounds = {
    x: pos.x,
    y: pos.y,
    width: w,
    height: h,
  };
  
  updateLastElementBounds(context, bounds);
  
  return {
    html: htmlParts.join(''),
    bounds,
  };
}

function renderLine(element: LineElement, context: RenderContext): RenderResult {
  const start = calculatePosition(context, element.start);
  const end = calculateLineEnd(context, start, element.end);
  
  const c = getColorAttribute(element.attributes, context.globalDefaults, 'c', '#333333');
  const s = getNumberAttribute(element.attributes, context.globalDefaults, 's', 1);
  const style = getStyleAttribute(element.attributes);
  const textSize = getNumberAttribute(element.attributes, context.globalDefaults, 'text-size', getNumberAttribute(element.attributes, context.globalDefaults, 'size', 12));
  const textColor = getColorAttribute(element.attributes, context.globalDefaults, 'text-color', '#333333');
  const note = element.attributes['note'];
  
  const lineStyles: string[] = [];
  lineStyles.push(`position: absolute;`);
  lineStyles.push(`left: ${start.x}px;`);
  lineStyles.push(`top: ${start.y}px;`);
  lineStyles.push(`width: ${Math.abs(end.x - start.x)}px;`);
  lineStyles.push(`height: ${Math.abs(end.y - start.y)}px;`);
  lineStyles.push(`pointer-events: none;`);
  
  const borderStyles: string[] = [];
  borderStyles.push(`border-top: ${s}px solid ${c};`);
  if (style.borderStyle) {
    borderStyles.push(`border-style: ${style.borderStyle};`);
  }
  
  const htmlParts: string[] = [];
  
  const lineAngle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
  const lineLength = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
  
  htmlParts.push(`<div class="solarwire-line" style="${lineStyles.join(' ')}"${note ? ` title="${escapeHtml(note)}"` : ''}>`);
  htmlParts.push(`<div style="position: absolute; left: 0; top: 0; width: ${lineLength}px; height: 0; ${borderStyles.join(' ')} transform: rotate(${lineAngle}deg); transform-origin: 0 0;"></div>`);
  
  if (element.label) {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const labelPadding = 4;
    const labelWidth = element.label.length * textSize * 0.6 + labelPadding * 2;
    const labelHeight = textSize + labelPadding * 2;
    
    htmlParts.push(`<div style="position: absolute; left: ${midX - labelWidth / 2}px; top: ${midY - labelHeight / 2}px; width: ${labelWidth}px; height: ${labelHeight}px; background-color: white; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">`);
    htmlParts.push(`<span style="color: ${textColor}; font-size: ${textSize}px;">${escapeHtml(element.label)}</span>`);
    htmlParts.push('</div>');
  }
  
  htmlParts.push('</div>');
  
  const bounds: ElementBounds = {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  };
  
  updateLastElementBounds(context, {
    x: end.x,
    y: end.y,
    width: 0,
    height: 0,
  });
  
  return {
    html: htmlParts.join(''),
    bounds,
  };
}

function renderContainer(
  element: RowContainer | ColContainer,
  context: RenderContext,
  renderChild: (child: any, childContext: RenderContext) => RenderResult
): RenderResult {
  const isRow = element.type === 'row';
  
  let containerPos: AbsolutePosition;
  if (element.coordinates) {
    containerPos = calculatePosition(context, element.coordinates);
  } else {
    containerPos = { x: context.offsetX, y: context.offsetY };
  }
  
  const gap = getNumberAttribute(element.attributes, context.globalDefaults, 'gap', 0);
  const note = element.attributes['note'];
  
  const childContext = createChildContext(context, containerPos.x, containerPos.y);
  
  let childResults: RenderResult[] = [];
  let currentX = 0;
  let currentY = 0;
  let maxX = 0;
  let maxY = 0;
  
  element.children.forEach((child, index) => {
    if (index > 0) {
      if (isRow) {
        currentX += gap;
      } else {
        currentY += gap;
      }
    }
    
    if (child.coordinates) {
      const result = renderChild(child, childContext);
      childResults.push(result);
      maxX = Math.max(maxX, result.bounds.x + result.bounds.width - containerPos.x);
      maxY = Math.max(maxY, result.bounds.y + result.bounds.height - containerPos.y);
    } else {
      const tempContext = createChildContext(childContext, currentX, currentY);
      const result = renderChild(child, tempContext);
      childResults.push(result);
      
      if (isRow) {
        currentX += result.bounds.width;
        maxX = currentX;
        maxY = Math.max(maxY, result.bounds.height);
      } else {
        currentY += result.bounds.height;
        maxX = Math.max(maxX, result.bounds.width);
        maxY = currentY;
      }
    }
  });
  
  const containerWidth = getNumberAttribute(element.attributes, context.globalDefaults, 'w', maxX || 100);
  const containerHeight = getNumberAttribute(element.attributes, context.globalDefaults, 'h', maxY || 100);
  
  const bg = getColorAttribute(element.attributes, context.globalDefaults, 'bg', '#ffffff');
  const b = getColorAttribute(element.attributes, context.globalDefaults, 'b', 'none');
  const s = getNumberAttribute(element.attributes, context.globalDefaults, 's', 0);
  
  const htmlParts: string[] = [];
  
  const containerStyles: string[] = [];
  containerStyles.push(`position: absolute;`);
  containerStyles.push(`left: ${containerPos.x}px;`);
  containerStyles.push(`top: ${containerPos.y}px;`);
  containerStyles.push(`width: ${containerWidth}px;`);
  containerStyles.push(`height: ${containerHeight}px;`);
  containerStyles.push(`background-color: ${bg};`);
  if (b !== 'none') {
    containerStyles.push(`border: ${s}px solid ${b};`);
  }
  containerStyles.push(`box-sizing: border-box;`);
  containerStyles.push(`display: flex;`);
  containerStyles.push(`flex-direction: ${isRow ? 'row' : 'column'};`);
  containerStyles.push(`gap: ${gap}px;`);
  
  htmlParts.push(`<div class="solarwire-container ${isRow ? 'solarwire-row' : 'solarwire-col'}" style="${containerStyles.join(' ')}"${note ? ` title="${escapeHtml(note)}"` : ''}>`);
  
  childResults.forEach(result => {
    htmlParts.push(result.html);
  });
  
  htmlParts.push('</div>');
  
  const bounds: ElementBounds = {
    x: containerPos.x,
    y: containerPos.y,
    width: containerWidth,
    height: containerHeight,
  };
  
  updateLastElementBounds(context, bounds);
  
  return {
    html: htmlParts.join(''),
    bounds,
  };
}

function renderTable(
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
  
  const htmlParts: string[] = [];
  let currentY = 0;
  let maxWidth = 0;
  const rowResults: RenderResult[] = [];
  
  const rows = element.children || [];
  rows.forEach(row => {
    const rowContext = createChildContext(context, pos.x, pos.y + currentY);
    const result = renderChild(row as any, rowContext);
    rowResults.push(result);
    maxWidth = Math.max(maxWidth, result.bounds.width);
    currentY += result.bounds.height + cellspacing;
  });
  
  const tableWidth = getNumberAttribute(element.attributes, context.globalDefaults, 'w', maxWidth || 200);
  const tableHeight = currentY - cellspacing;
  
  const tableStyles: string[] = [];
  tableStyles.push(`position: absolute;`);
  tableStyles.push(`left: ${pos.x}px;`);
  tableStyles.push(`top: ${pos.y}px;`);
  tableStyles.push(`width: ${tableWidth}px;`);
  tableStyles.push(`border-collapse: separate;`);
  tableStyles.push(`border-spacing: ${cellspacing}px;`);
  if (border > 0) {
    tableStyles.push(`border: ${border}px solid ${b};`);
  }
  
  htmlParts.push(`<table class="solarwire-table" style="${tableStyles.join(' ')}"${note ? ` title="${escapeHtml(note)}"` : ''}>`);
  
  rowResults.forEach(result => {
    htmlParts.push(result.html);
  });
  
  htmlParts.push('</table>');
  
  const bounds: ElementBounds = {
    x: pos.x,
    y: pos.y,
    width: tableWidth,
    height: tableHeight,
  };
  
  updateLastElementBounds(context, bounds);
  
  return {
    html: htmlParts.join(''),
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
  
  const htmlParts: string[] = [];
  let currentX = 0;
  let maxHeight = 0;
  const cellResults: RenderResult[] = [];
  
  const cells = element.children || [];
  cells.forEach(cell => {
    const cellContext = createChildContext(context, pos.x + currentX, pos.y);
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
  
  const rowWidth = currentX;
  const rowHeight = getNumberAttribute(element.attributes, context.globalDefaults, 'h', maxHeight || 40);
  
  const rowStyles: string[] = [];
  if (bg !== 'transparent') {
    rowStyles.push(`background-color: ${bg};`);
  }
  
  htmlParts.push(`<tr class="solarwire-table-row" style="${rowStyles.join(' ')}"${note ? ` title="${escapeHtml(note)}"` : ''}>`);
  
  cellResults.forEach((result, index) => {
    const cell = cells[index];
    const colspan = cell.attributes['colspan'] ? parseInt(cell.attributes['colspan']) : 1;
    const rowspan = cell.attributes['rowspan'] ? parseInt(cell.attributes['rowspan']) : 1;
    
    let tdAttributes = '';
    if (colspan > 1) {
      tdAttributes += ` colspan="${colspan}"`;
    }
    if (rowspan > 1) {
      tdAttributes += ` rowspan="${rowspan}"`;
    }
    
    htmlParts.push(`<td style="padding: 0; margin: 0;"${tdAttributes}>${result.html}</td>`);
  });
  
  htmlParts.push('</tr>');
  
  const bounds: ElementBounds = {
    x: pos.x,
    y: pos.y,
    width: rowWidth,
    height: rowHeight,
  };
  
  updateLastElementBounds(context, bounds);
  
  return {
    html: htmlParts.join(''),
    bounds,
  };
}

function renderElement(element: Element, context: RenderContext): RenderResult {
  switch (element.type) {
    case 'rectangle':
    case 'rounded-rectangle':
      return renderRectangle(element, context);
    case 'circle':
      return renderCircle(element, context);
    case 'text':
      return renderText(element, context);
    case 'icon':
      return renderIcon(element, context);
    case 'placeholder':
      return renderPlaceholder(element, context);
    case 'image':
      return renderImage(element, context);
    case 'line':
      return renderLine(element, context);
    case 'row':
    case 'col':
      return renderContainer(element, context, renderElement);
    case 'table':
    case 'table-row':
      return renderTable(element, context, renderElement);
    default:
      throw new Error(`Unknown element type: ${(element as any).type}`);
  }
}

interface NoteInfo {
  number: number;
  note: string;
  bounds: ElementBounds;
}

export function render(ast: Document): string {
  const context = createRenderContext(ast.declarations);
  const htmlParts: string[] = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = 0;
  let maxY = 0;
  const elementResults: RenderResult[] = [];
  const notes: NoteInfo[] = [];
  let noteNumber = 1;
  
  ast.elements.forEach(element => {
    const result = renderElement(element, context);
    elementResults.push(result);
    minX = Math.min(minX, result.bounds.x);
    minY = Math.min(minY, result.bounds.y);
    maxX = Math.max(maxX, result.bounds.x + result.bounds.width);
    maxY = Math.max(maxY, result.bounds.y + result.bounds.height);
    
    if (element.attributes && element.attributes.note) {
      notes.push({
        number: noteNumber,
        note: element.attributes.note,
        bounds: result.bounds
      });
      noteNumber++;
    }
  });
  
  let notesAreaHeight = 0;
  if (notes.length > 0) {
    const cardHeight = 70;
    const cardsPerRow = 2;
    const cardMargin = 10;
    const rows = Math.ceil(notes.length / cardsPerRow);
    notesAreaHeight = rows * cardHeight + (rows + 1) * cardMargin;
  }
  
  const margin = 20;
  const width = maxX - minX + margin * 2;
  const height = maxY - minY + margin * 2 + notesAreaHeight;
  
  htmlParts.push('<!DOCTYPE html>');
  htmlParts.push('<html>');
  htmlParts.push('<head>');
  htmlParts.push('<meta charset="UTF-8">');
  htmlParts.push('<title>SolarWire</title>');
  htmlParts.push('<style>');
  htmlParts.push('* { margin: 0; padding: 0; box-sizing: border-box; }');
  htmlParts.push('body { font-family: Arial, sans-serif; }');
  htmlParts.push('.solarwire-container { position: relative; }');
  htmlParts.push('.note-badge { position: absolute; width: 20px; height: 20px; background-color: #e74c3c; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold; z-index: 100; }');
  htmlParts.push('.notes-area { position: absolute; left: 0; right: 0; display: flex; flex-wrap: wrap; gap: 10px; padding: 10px; }');
  htmlParts.push('.note-card { flex: 0 0 calc(50% - 5px); background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 10px; position: relative; min-height: 50px; }');
  htmlParts.push('.note-card-badge { position: absolute; top: 10px; left: 10px; width: 16px; height: 16px; background-color: #e74c3c; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold; }');
  htmlParts.push('.note-card-content { margin-left: 26px; color: #333; font-size: 12px; line-height: 1.4; word-wrap: break-word; }');
  htmlParts.push('</style>');
  htmlParts.push('</head>');
  htmlParts.push('<body>');
  
  htmlParts.push(`<div class="solarwire-canvas" style="position: relative; width: ${width}px; height: ${height}px; overflow: hidden;">`);
  
  elementResults.forEach(result => {
    htmlParts.push(result.html);
  });
  
  notes.forEach(note => {
    const badgeX = note.bounds.x + note.bounds.width - 10;
    const badgeY = note.bounds.y - 10;
    htmlParts.push(`<div class="note-badge" style="left: ${badgeX}px; top: ${badgeY}px;">${note.number}</div>`);
  });
  
  if (notes.length > 0) {
    const notesY = maxY + margin;
    htmlParts.push(`<div class="notes-area" style="top: ${notesY}px;">`);
    
    notes.forEach(note => {
      htmlParts.push(`<div class="note-card">`);
      htmlParts.push(`  <div class="note-card-badge">${note.number}</div>`);
      htmlParts.push(`  <div class="note-card-content">${escapeHtml(note.note)}</div>`);
      htmlParts.push(`</div>`);
    });
    
    htmlParts.push('</div>');
  }
  
  htmlParts.push('</div>');
  
  htmlParts.push('</body>');
  htmlParts.push('</html>');
  
  return htmlParts.join('\n');
}
