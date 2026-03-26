"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderRectangle = renderRectangle;
const context_1 = require("../context");
function renderRectangle(element, context) {
    const isRounded = element.type === 'rounded-rectangle';
    let pos;
    if (element.coordinates) {
        pos = (0, context_1.calculatePosition)(context, element.coordinates);
    }
    else {
        pos = { x: context.offsetX, y: context.offsetY };
    }
    const w = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'w', 100);
    const h = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'h', 40);
    const bg = (0, context_1.getColorAttribute)(element.attributes, context.globalDefaults, 'bg', '#ffffff');
    const c = (0, context_1.getColorAttribute)(element.attributes, context.globalDefaults, 'c', '#000000');
    const b = (0, context_1.getColorAttribute)(element.attributes, context.globalDefaults, 'b', '#333333');
    const s = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 's', 1);
    const r = isRounded ? (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'r', 6) : 0;
    const fontSize = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'text-size', (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'size', 12));
    const align = (0, context_1.getAlignAttribute)(element.attributes, 'start');
    const bold = (0, context_1.getBooleanAttribute)(element.attributes, context.globalDefaults, 'bold');
    const italic = (0, context_1.getBooleanAttribute)(element.attributes, context.globalDefaults, 'italic');
    const note = element.attributes['note'];
    const opacity = element.attributes['opacity'] ? parseFloat(element.attributes['opacity']) : undefined;
    let svgParts = [];
    const opacityAttr = opacity !== undefined ? ` opacity="${opacity}"` : '';
    if (isRounded) {
        svgParts.push(`<rect x="${pos.x}" y="${pos.y}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${bg}" stroke="${b}" stroke-width="${s}"${opacityAttr}/>`);
    }
    else {
        svgParts.push(`<rect x="${pos.x}" y="${pos.y}" width="${w}" height="${h}" fill="${bg}" stroke="${b}" stroke-width="${s}"${opacityAttr}/>`);
    }
    if (element.text) {
        const lines = element.text.split('\n');
        const lineHeight = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'line-height', 22);
        const textX = pos.x + w / 2;
        const textY = pos.y + h / 2 - ((lines.length - 1) * lineHeight) / 2 + fontSize / 2 - 2;
        let fontStyle = '';
        if (bold)
            fontStyle += 'font-weight="bold" ';
        if (italic)
            fontStyle += 'font-style="italic" ';
        svgParts.push(`<text x="${textX}" y="${textY}" text-anchor="middle" fill="${c}" font-size="${fontSize}" ${fontStyle}>`);
        lines.forEach((line, i) => {
            if (i === 0) {
                svgParts.push(line);
            }
            else {
                svgParts.push(`<tspan x="${textX}" dy="${lineHeight}">${line}</tspan>`);
            }
        });
        svgParts.push('</text>');
    }
    const bounds = {
        x: pos.x,
        y: pos.y,
        width: w,
        height: h,
    };
    (0, context_1.updateLastElementBounds)(context, bounds);
    if (note) {
        svgParts.push(`<title>${note}</title>`);
    }
    return {
        svg: svgParts.join(''),
        bounds,
    };
}
