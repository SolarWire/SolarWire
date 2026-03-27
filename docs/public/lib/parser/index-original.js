"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = parse;
let parser = null;
try {
    parser = require('./parser');
}
catch {
    console.warn('Parser not generated. Please run: npm run build');
}
function isContainer(type) {
    return ['table', 'table-row'].indexOf(type) !== -1;
}
function buildNestedStructure(elementsWithIndent) {
    const result = [];
    const stack = [];
    elementsWithIndent.forEach((item) => {
        const { element, indent } = item;
        while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
            stack.pop();
        }
        if (stack.length === 0) {
            result.push(element);
        }
        else {
            const parent = stack[stack.length - 1].element;
            if (isContainer(parent.type)) {
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(element);
            }
        }
        if (isContainer(element.type)) {
            stack.push({ element, indent });
        }
    });
    return result;
}
function calculateIndent(line) {
    let indent = 0;
    while (indent < line.length && (line[indent] === ' ' || line[indent] === '\t')) {
        indent++;
    }
    return indent;
}
function isBlankLine(line) {
    return line.trim() === '';
}
function isCommentLine(line) {
    const trimmed = line.trim();
    return trimmed.startsWith('//');
}
function isDeclarationLine(line) {
    const trimmed = line.trim();
    return trimmed.startsWith('!');
}
function parse(input) {
    if (!parser) {
        throw new Error('Parser not generated. Please run: npm run build');
    }
    try {
        const rawResult = parser.parse(input);
        const lines = input.split(/\r?\n/);
        const elementLines = [];
        lines.forEach((line) => {
            if (!isBlankLine(line) && !isCommentLine(line) && !isDeclarationLine(line)) {
                elementLines.push(line);
            }
        });
        const elementsWithIndent = [];
        let elementIndex = 0;
        rawResult.elements.forEach((element) => {
            if (elementIndex < elementLines.length) {
                const line = elementLines[elementIndex];
                const indent = calculateIndent(line);
                elementsWithIndent.push({ element, indent });
                elementIndex++;
            }
        });
        return {
            declarations: rawResult.declarations,
            elements: buildNestedStructure(elementsWithIndent)
        };
    }
    catch (e) {
        const error = new Error(`Parse error at line ${e.location?.start?.line}, column ${e.location?.start?.column}: ${e.message}`);
        error.location = e.location;
        throw error;
    }
}
//# sourceMappingURL=index-original.js.map