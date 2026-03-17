import { LineElement, RowContainer, ColContainer, Element } from '@solarwire/parser';
import { RenderContext, AbsolutePosition, ElementBounds, calculatePosition, calculateLineEnd, getNumberAttribute, getColorAttribute, getStyleAttribute, updateLastElementBounds, createChildContext } from '../context';
import { RenderResult } from './rectangle';
import { renderElement } from '../renderer';

export function renderLine(element: LineElement, context: RenderContext): RenderResult {
  const start = calculatePosition(context, element.start);
  const end = calculateLineEnd(context, start, element.end);
  
  const c = getColorAttribute(element.attributes, context.globalDefaults, 'c', '#333333');
  const s = getNumberAttribute(element.attributes, context.globalDefaults, 's', 1);
  const style = getStyleAttribute(element.attributes);
  const textSize = getNumberAttribute(element.attributes, context.globalDefaults, 'text-size', getNumberAttribute(element.attributes, context.globalDefaults, 'size', 12));
  const textColor = getColorAttribute(element.attributes, context.globalDefaults, 'text-color', '#333333');
  const note = element.attributes['note'];
  
  let svgParts: string[] = [];
  
  let strokeDasharray = '';
  if (style.strokeDasharray) {
    strokeDasharray = ` stroke-dasharray="${style.strokeDasharray}"`;
  }
  
  svgParts.push(`<line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" stroke="${c}" stroke-width="${s}"${strokeDasharray}/>`);
  
  if (element.label) {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const labelPadding = 4;
    const labelWidth = element.label.length * textSize * 0.6 + labelPadding * 2;
    const labelHeight = textSize + labelPadding * 2;
    
    svgParts.push(`<rect x="${midX - labelWidth / 2}" y="${midY - labelHeight / 2}" width="${labelWidth}" height="${labelHeight}" fill="white" stroke="none"/>`);
    svgParts.push(`<text x="${midX}" y="${midY}" text-anchor="middle" dominant-baseline="middle" fill="${textColor}" font-size="${textSize}">${element.label}</text>`);
  }
  
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
  
  if (note) {
    svgParts.push(`<title>${note}</title>`);
  }
  
  return {
    svg: svgParts.join(''),
    bounds,
  };
}

export function renderContainer(
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
  
  const childContext = createChildContext(context, containerPos.x - context.offsetX, containerPos.y - context.offsetY);
  
  let childResults: RenderResult[] = [];
  let currentX = gap;
  let currentY = gap;
  let maxX = gap;
  let maxY = gap;
  
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
      const relX = result.bounds.x - containerPos.x;
      const relY = result.bounds.y - containerPos.y;
      maxX = Math.max(maxX, relX + result.bounds.width);
      maxY = Math.max(maxY, relY + result.bounds.height);
    } else {
      const tempContext = createChildContext(childContext, currentX, currentY);
      const result = renderChild(child, tempContext);
      childResults.push(result);
      
      if (isRow) {
        currentX += result.bounds.width;
        maxX = currentX;
        maxY = Math.max(maxY, currentY + result.bounds.height);
      } else {
        currentY += result.bounds.height;
        maxX = Math.max(maxX, currentX + result.bounds.width);
        maxY = currentY;
      }
    }
  });
  
  const containerWidth = getNumberAttribute(element.attributes, context.globalDefaults, 'w', maxX || 100);
  const containerHeight = getNumberAttribute(element.attributes, context.globalDefaults, 'h', maxY || 100);
  
  const bg = getColorAttribute(element.attributes, context.globalDefaults, 'bg', '#ffffff');
  const b = getColorAttribute(element.attributes, context.globalDefaults, 'b', 'none');
  const s = getNumberAttribute(element.attributes, context.globalDefaults, 's', 0);
  
  let svgParts: string[] = [];
  
  if (b !== 'none' || bg !== 'transparent') {
    svgParts.push(`<rect x="${containerPos.x}" y="${containerPos.y}" width="${containerWidth}" height="${containerHeight}" fill="${bg}" stroke="${b}" stroke-width="${s}"/>`);
  }
  
  childResults.forEach(result => {
    svgParts.push(result.svg);
  });
  
  const bounds: ElementBounds = {
    x: containerPos.x,
    y: containerPos.y,
    width: containerWidth,
    height: containerHeight,
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
