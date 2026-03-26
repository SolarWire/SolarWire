"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function createRenderContext(declarations = []) {
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
    };
}
function createChildContext(parentContext, offsetX, offsetY) {
    return {
        offsetX: parentContext.offsetX + offsetX,
        offsetY: parentContext.offsetY + offsetY,
        lastElementBounds: null,
        isFirstElement: true,
        globalDefaults: parentContext.globalDefaults,
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
