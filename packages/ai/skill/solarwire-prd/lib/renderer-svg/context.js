"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeHtml = escapeHtml;
exports.formatRenderError = formatRenderError;
exports.formatErrorWithContext = formatErrorWithContext;
exports.getElementLocationInfo = getElementLocationInfo;
exports.createRenderContext = createRenderContext;
exports.createChildContext = createChildContext;
exports.updateLastElementBounds = updateLastElementBounds;
exports.calculateCoordinate = calculateCoordinate;
exports.calculatePosition = calculatePosition;
exports.calculateLineEnd = calculateLineEnd;
exports.getNumberAttribute = getNumberAttribute;
exports.getColorAttribute = getColorAttribute;
exports.getBooleanAttribute = getBooleanAttribute;
exports.getAlignAttribute = getAlignAttribute;
exports.getStyleAttribute = getStyleAttribute;
exports.getOpacityAttribute = getOpacityAttribute;
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
function formatRenderError(details, sourceInput, location, contextLines = 3) {
    let result = '═'.repeat(60) + '\n';
    result += '  RENDER ERROR\n';
    result += '═'.repeat(60) + '\n\n';
    result += `  ${details.title}\n\n`;
    if (details.expected || details.found) {
        if (details.expected) {
            result += `  Expected: ${details.expected}\n`;
        }
        if (details.found) {
            result += `  Found:    ${details.found}\n`;
        }
        result += '\n';
    }
    if (details.location) {
        result += `  Position: ${details.location}\n\n`;
    }
    if (details.reason) {
        result += `  Reason: ${details.reason}\n\n`;
    }
    if (details.solution) {
        result += `  Solution: ${details.solution}\n`;
    }
    if (!sourceInput || !location) {
        return result;
    }
    const lines = sourceInput.split(/\r?\n/);
    const lineNum = location.line;
    const columnNum = location.column || 1;
    const startLine = Math.max(0, lineNum - contextLines - 1);
    const endLine = Math.min(lines.length, lineNum + contextLines);
    const maxLineNumWidth = Math.max(String(startLine + 1).length, String(endLine).length, 4);
    result += '\n' + '─'.repeat(60) + '\n';
    result += '  Context:\n';
    result += '─'.repeat(60) + '\n';
    for (let i = startLine; i < endLine; i++) {
        const currentLineNum = i + 1;
        const isErrorLine = i === lineNum - 1;
        const lineContent = lines[i] || '';
        if (isErrorLine) {
            result += `>>> ${currentLineNum.toString().padStart(maxLineNumWidth, ' ')} | ${lineContent}\n`;
            const pointerOffset = columnNum > 0 ? columnNum - 1 : 0;
            const spaces = ' '.repeat(5 + maxLineNumWidth + 3 + pointerOffset);
            result += `${spaces}^\n`;
            result += `${spaces}| HERE\n`;
        }
        else {
            result += `    ${currentLineNum.toString().padStart(maxLineNumWidth, ' ')} | ${lineContent}\n`;
        }
    }
    result += '─'.repeat(60) + '\n';
    return result;
}
function formatErrorWithContext(message, sourceInput, location, contextLines = 3) {
    let result = message;
    if (!sourceInput || !location) {
        return result;
    }
    const lines = sourceInput.split(/\r?\n/);
    const lineNum = location.line;
    const columnNum = location.column || 1;
    const startLine = Math.max(0, lineNum - contextLines - 1);
    const endLine = Math.min(lines.length, lineNum + contextLines);
    const maxLineNumWidth = Math.max(String(startLine + 1).length, String(endLine).length, 4);
    result += '\n\n' + '─'.repeat(60) + '\n';
    result += '  Context:\n';
    result += '─'.repeat(60) + '\n';
    for (let i = startLine; i < endLine; i++) {
        const currentLineNum = i + 1;
        const isErrorLine = i === lineNum - 1;
        const lineContent = lines[i] || '';
        if (isErrorLine) {
            result += `>>> ${currentLineNum.toString().padStart(maxLineNumWidth, ' ')} | ${lineContent}\n`;
            const pointerOffset = columnNum > 0 ? columnNum - 1 : 0;
            const spaces = ' '.repeat(5 + maxLineNumWidth + 3 + pointerOffset);
            result += `${spaces}^\n`;
            result += `${spaces}| HERE\n`;
        }
        else {
            result += `    ${currentLineNum.toString().padStart(maxLineNumWidth, ' ')} | ${lineContent}\n`;
        }
    }
    result += '─'.repeat(60) + '\n';
    return result;
}
function getElementLocationInfo(element) {
    if (element.location) {
        return `line ${element.location.line}`;
    }
    if (element.coordinates) {
        const x = element.coordinates.x.type === 'absolute'
            ? element.coordinates.x.value
            : 'relative';
        const y = element.coordinates.y.type === 'absolute'
            ? element.coordinates.y.value
            : 'relative';
        return `@(${x}, ${y})`;
    }
    return 'unknown position';
}
function createRenderContext(declarations = [], sourceInput) {
    const globalDefaults = {};
    declarations.forEach(decl => {
        const { key, value } = decl;
        if (['size', 'line-height', 'gap', 'r'].includes(key)) {
            globalDefaults[key] = parseFloat(value);
        }
        else if (key === 'bold') {
            globalDefaults[key] = true;
        }
        else {
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
function createChildContext(parentContext, offsetX, offsetY) {
    return {
        offsetX: parentContext.offsetX + offsetX,
        offsetY: parentContext.offsetY + offsetY,
        lastElementBounds: null,
        isFirstElement: true,
        globalDefaults: parentContext.globalDefaults,
        sourceInput: parentContext.sourceInput,
    };
}
function updateLastElementBounds(context, bounds) {
    context.lastElementBounds = bounds;
    context.isFirstElement = false;
}
function calculateCoordinate(context, coord, isX, lastBounds) {
    let baseValue;
    switch (coord.type) {
        case 'absolute':
            baseValue = coord.value;
            break;
        case 'relative':
            baseValue = coord.value;
            break;
        case 'edge':
            if (!lastBounds) {
                baseValue = 0;
            }
            else {
                switch (coord.direction) {
                    case 'L':
                        baseValue = lastBounds.x;
                        break;
                    case 'R':
                        baseValue = lastBounds.x + lastBounds.width;
                        break;
                    case 'T':
                        baseValue = lastBounds.y;
                        break;
                    case 'B':
                        baseValue = lastBounds.y + lastBounds.height;
                        break;
                    case 'C':
                        baseValue = isX
                            ? lastBounds.x + lastBounds.width / 2
                            : lastBounds.y + lastBounds.height / 2;
                        break;
                    default:
                        baseValue = 0;
                }
            }
            baseValue += coord.value;
            break;
        default: {
            const exhaustiveCheck = coord;
            throw new Error(`Unknown coordinate type: ${exhaustiveCheck.type}`);
        }
    }
    return baseValue + (isX ? context.offsetX : context.offsetY);
}
function calculatePosition(context, coords) {
    const x = calculateCoordinate(context, coords.x, true, context.lastElementBounds);
    const y = calculateCoordinate(context, coords.y, false, context.lastElementBounds);
    return { x, y };
}
function calculateLineEnd(context, start, end) {
    if ('dx' in end) {
        return {
            x: start.x + end.dx,
            y: start.y + end.dy,
        };
    }
    else {
        return calculatePosition(context, end);
    }
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
    if (key in attributes)
        return true;
    if (globalDefaults[key] !== undefined)
        return !!globalDefaults[key];
    return false;
}
function getAlignAttribute(attributes, defaultValue) {
    const align = attributes['align'];
    switch (align) {
        case 'l':
            return 'start';
        case 'c':
            return 'middle';
        case 'r':
            return 'end';
        default:
            return defaultValue;
    }
}
function getStyleAttribute(attributes) {
    const style = attributes['style'];
    switch (style) {
        case 'dashed':
            return { strokeDasharray: '5,5' };
        case 'dotted':
            return { strokeDasharray: '2,2' };
        default:
            return {};
    }
}
function getOpacityAttribute(attributes, key = 'opacity', defaultValue = 1) {
    const value = attributes[key];
    if (value === undefined)
        return defaultValue;
    const parsed = parseFloat(value);
    if (isNaN(parsed))
        return defaultValue;
    return Math.max(0, Math.min(1, parsed));
}
