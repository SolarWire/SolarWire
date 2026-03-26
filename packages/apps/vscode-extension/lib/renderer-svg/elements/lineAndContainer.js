"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderLine = renderLine;
const context_1 = require("../context");
function renderLine(element, context) {
    const start = (0, context_1.calculatePosition)(context, element.start);
    const end = (0, context_1.calculateLineEnd)(context, start, element.end);
    const c = (0, context_1.getColorAttribute)(element.attributes, context.globalDefaults, 'c', '#333333');
    const s = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 's', 1);
    const style = (0, context_1.getStyleAttribute)(element.attributes);
    const textSize = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'text-size', (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'size', 12));
    const textColor = (0, context_1.getColorAttribute)(element.attributes, context.globalDefaults, 'text-color', '#333333');
    const note = element.attributes['note'];
    let svgParts = [];
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
    const bounds = {
        x: Math.min(start.x, end.x),
        y: Math.min(start.y, end.y),
        width: Math.abs(end.x - start.x),
        height: Math.abs(end.y - start.y),
    };
    (0, context_1.updateLastElementBounds)(context, {
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
