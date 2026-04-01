import { RectangleElement, RoundedRectangleElement } from '@solarwire/parser';
import { RenderContext, AbsolutePosition, ElementBounds, calculatePosition, getNumberAttribute, getColorAttribute, getBooleanAttribute, getAlignAttribute, updateLastElementBounds, escapeHtml, getOpacityAttribute } from '../context';

export interface RenderResult {
  svg: string;
  bounds: ElementBounds;
}

export function renderRectangle(
  element: RectangleElement | RoundedRectangleElement,
  context: RenderContext
): RenderResult {
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
  const align = getAlignAttribute(element.attributes, 'start');
  const bold = getBooleanAttribute(element.attributes, context.globalDefaults, 'bold');
  const italic = getBooleanAttribute(element.attributes, context.globalDefaults, 'italic');
  const note = element.attributes['note'];
  const opacity = getOpacityAttribute(element.attributes);
  
  let svgParts: string[] = [];
  
  const opacityAttr = opacity !== 1 ? ` opacity="${opacity}"` : '';
  
  if (isRounded) {
    svgParts.push(`<rect x="${pos.x}" y="${pos.y}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${bg}" stroke="${b}" stroke-width="${s}"${opacityAttr}/>`);
  } else {
    svgParts.push(`<rect x="${pos.x}" y="${pos.y}" width="${w}" height="${h}" fill="${bg}" stroke="${b}" stroke-width="${s}"${opacityAttr}/>`);
  }
  
  if (element.text) {
    const lines = element.text.split('\n');
    const lineHeight = getNumberAttribute(element.attributes, context.globalDefaults, 'line-height', 22);
    const padding = 8;
    
    let textX: number;
    let textAnchor: string;
    
    switch (align) {
      case 'start':
        textX = pos.x + padding;
        textAnchor = 'start';
        break;
      case 'end':
        textX = pos.x + w - padding;
        textAnchor = 'end';
        break;
      case 'middle':
      default:
        textX = pos.x + w / 2;
        textAnchor = 'middle';
        break;
    }
    
    const textY = pos.y + h / 2 - ((lines.length - 1) * lineHeight) / 2 + fontSize / 2 - 2;
    
    let fontStyle = '';
    if (bold) fontStyle += 'font-weight="bold" ';
    if (italic) fontStyle += 'font-style="italic" ';
    
    svgParts.push(`<text x="${textX}" y="${textY}" text-anchor="${textAnchor}" fill="${c}" font-size="${fontSize}" ${fontStyle}>`);
    
    lines.forEach((line, i) => {
      if (i === 0) {
        svgParts.push(escapeHtml(line));
      } else {
        svgParts.push(`<tspan x="${textX}" dy="${lineHeight}">${escapeHtml(line)}</tspan>`);
      }
    });
    
    svgParts.push('</text>');
  }
  
  const bounds: ElementBounds = {
    x: pos.x,
    y: pos.y,
    width: w,
    height: h,
  };
  
  updateLastElementBounds(context, bounds);
  
  if (note) {
    svgParts.push(`<title>${escapeHtml(note)}</title>`);
  }
  
  return {
    svg: svgParts.join(''),
    bounds,
  };
}
