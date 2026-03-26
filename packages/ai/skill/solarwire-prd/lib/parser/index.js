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
function getContextAroundPosition(input, lineNum, columnNum, contextLines = 3) {
    const lines = input.split(/\r?\n/);
    const startLine = Math.max(0, lineNum - contextLines - 1);
    const endLine = Math.min(lines.length, lineNum + contextLines);
    let context = '';
    for (let i = startLine; i < endLine; i++) {
        const lineNumDisplay = i + 1;
        const isErrorLine = i === lineNum - 1;
        context += `${lineNumDisplay.toString().padStart(4, ' ')} | ${lines[i]}\n`;
        if (isErrorLine && columnNum > 0) {
            const spaces = ' '.repeat(columnNum + 6);
            context += `${spaces}^\n`;
        }
    }
    return context;
}
function formatError(message, input, line, column, expected, found) {
    let errorMsg = '';
    if (line !== undefined && column !== undefined) {
        errorMsg += `Parse error at line ${line}, column ${column}\n\n`;
    }
    else {
        errorMsg += `Parse error\n\n`;
    }
    if (expected) {
        errorMsg += `Expected: ${expected}\n`;
    }
    if (found) {
        errorMsg += `Found:    ${found}\n`;
    }
    errorMsg += `\n${message}\n\n`;
    if (line !== undefined) {
        errorMsg += 'Context:\n';
        errorMsg += getContextAroundPosition(input, line, column || 1);
    }
    return errorMsg;
}
function isContainer(type) {
    return ['table', 'table-row'].indexOf(type) !== -1;
}
function buildNestedStructure(elementsWithIndent, input, lineMap) {
    const result = [];
    const stack = [];
    let lastTableRowIndent = null;
    let lastTableIndent = null;
    elementsWithIndent.forEach((item, index) => {
        const { element, indent, lineNum } = item;
        while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
            const popped = stack.pop();
            if (popped.element.type === 'table-row') {
                lastTableRowIndent = null;
            }
            if (popped.element.type === 'table') {
                lastTableIndent = null;
            }
        }
        if (element.type === 'table-row') {
            if (lastTableIndent === null || indent <= lastTableIndent) {
                const message = `Table-row element must be indented more than the table element. Current indent: ${indent} spaces, table indent: ${lastTableIndent} spaces.`;
                throw new Error(formatError(message, input, lineNum, indent + 1, 'table-row with more indentation', 'insufficient indentation'));
            }
        }
        if (lastTableRowIndent !== null && indent <= lastTableRowIndent) {
            const message = `Table cell element must be indented more than the table-row element. Current indent: ${indent} spaces, table-row indent: ${lastTableRowIndent} spaces.`;
            throw new Error(formatError(message, input, lineNum, indent + 1, 'cell with more indentation', 'insufficient indentation'));
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
            if (element.type === 'table-row') {
                lastTableRowIndent = indent;
            }
            if (element.type === 'table') {
                lastTableIndent = indent;
            }
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
        let inQuotes = false;
        let quoteChar = '';
        lines.forEach((line, index) => {
            let isElementLine = !isBlankLine(line) && !isCommentLine(line) && !isDeclarationLine(line);
            if (isElementLine) {
                let i = 0;
                while (i < line.length) {
                    if (!inQuotes && (line[i] === '"' || line[i] === "'")) {
                        inQuotes = true;
                        quoteChar = line[i];
                    }
                    else if (inQuotes && line[i] === quoteChar) {
                        if (i > 0 && line[i - 1] !== '\\') {
                            inQuotes = false;
                        }
                    }
                    i++;
                }
            }
            if (isElementLine && !inQuotes) {
                elementLines.push({ line, lineNum: index + 1 });
            }
        });
        const elementsWithIndent = [];
        let elementIndex = 0;
        rawResult.elements.forEach((element) => {
            if (elementIndex < elementLines.length) {
                const { line, lineNum } = elementLines[elementIndex];
                const indent = calculateIndent(line);
                elementsWithIndent.push({ element, indent, lineNum });
                elementIndex++;
            }
        });
        return {
            declarations: rawResult.declarations,
            elements: buildNestedStructure(elementsWithIndent, input, elementLines.map(e => e.lineNum))
        };
    }
    catch (e) {
        if (e.location && e.location.start) {
            const line = e.location.start.line;
            const column = e.location.start.column;
            const expected = e.expected ? e.expected.map((exp) => exp.description || exp.text || String(exp)).join(', ') : undefined;
            const found = e.found ? (e.found === '\n' ? 'newline' : e.found === '\t' ? 'tab' : e.found === ' ' ? 'space' : `"${e.found}"`) : undefined;
            const error = new Error(formatError(e.message, input, line, column, expected, found));
            error.location = e.location;
            throw error;
        }
        else {
            throw e;
        }
    }
}
//# sourceMappingURL=index.js.map