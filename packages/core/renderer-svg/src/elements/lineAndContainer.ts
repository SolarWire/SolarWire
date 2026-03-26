import { LineElement, Element } from '@solarwire/parser';
import { RenderContext, AbsolutePosition, ElementBounds, calculatePosition, calculateLineEnd, getNumberAttribute, getColorAttribute, getStyleAttribute, updateLastElementBounds } from '../context';
import { RenderResult } from './rectangle';

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
