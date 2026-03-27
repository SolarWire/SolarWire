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
    const maxLineNumWidth = Math.max(String(startLine + 1).length, String(endLine).length, 4);
    for (let i = startLine; i < endLine; i++) {
        const lineNumDisplay = i + 1;
        const isErrorLine = i === lineNum - 1;
        const lineContent = lines[i] || '';
        if (isErrorLine) {
            context += `>>> ${lineNumDisplay.toString().padStart(maxLineNumWidth, ' ')} | ${lineContent}\n`;
            const pointerOffset = columnNum > 0 ? columnNum - 1 : 0;
            const spaces = ' '.repeat(5 + maxLineNumWidth + 3 + pointerOffset);
            context += `${spaces}^\n`;
            context += `${spaces}| HERE\n`;
        }
        else {
            context += `    ${lineNumDisplay.toString().padStart(maxLineNumWidth, ' ')} | ${lineContent}\n`;
        }
    }
    return context;
}
function formatError(message, input, line, column, expected, found) {
    let errorMsg = '';
    errorMsg += '═'.repeat(60) + '\n';
    errorMsg += '  PARSE ERROR\n';
    errorMsg += '═'.repeat(60) + '\n\n';
    if (line !== undefined && column !== undefined) {
        errorMsg += `  Location: Line ${line}, Column ${column}\n\n`;
    }
    if (expected || found) {
        errorMsg += '  Details:\n';
        if (expected) {
            errorMsg += `    Expected: ${expected}\n`;
        }
        if (found) {
            errorMsg += `    Found:    ${found}\n`;
        }
        errorMsg += '\n';
    }
    errorMsg += `  ${message}\n\n`;
    if (line !== undefined) {
        errorMsg += '─'.repeat(60) + '\n';
        errorMsg += '  Context:\n';
        errorMsg += '─'.repeat(60) + '\n';
        errorMsg += getContextAroundPosition(input, line, column || 1);
        errorMsg += '─'.repeat(60) + '\n';
    }
    return errorMsg;
}
function isContainer(type) {
    return ['table', 'table-row'].includes(type);
}
function buildNestedStructure(elementsWithIndent, input, lineMap) {
    const result = [];
    const stack = [];
    let lastTableRowIndent = null;
    let lastTableIndent = null;
    elementsWithIndent.forEach((item, index) => {
        const { element, indent, lineNum } = item;
        element.location = { line: lineNum };
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
        let inMultilineString = false;
        let stringChar = '';
        lines.forEach((line, index) => {
            if (inMultilineString) {
                for (let i = 0; i < line.length; i++) {
                    if (line[i] === '\\' && i + 1 < line.length) {
                        i++;
                        continue;
                    }
                    if (line[i] === stringChar) {
                        inMultilineString = false;
                        break;
                    }
                }
                return;
            }
            const isElementLine = !isBlankLine(line) && !isCommentLine(line) && !isDeclarationLine(line);
            if (isElementLine) {
                for (let i = 0; i < line.length; i++) {
                    if (line[i] === '\\' && i + 1 < line.length) {
                        i++;
                        continue;
                    }
                    if (line[i] === '"' || line[i] === "'") {
                        stringChar = line[i];
                        let foundClose = false;
                        for (let j = i + 1; j < line.length; j++) {
                            if (line[j] === '\\' && j + 1 < line.length) {
                                j++;
                                continue;
                            }
                            if (line[j] === stringChar) {
                                foundClose = true;
                                i = j;
                                break;
                            }
                        }
                        if (!foundClose) {
                            inMultilineString = true;
                            break;
                        }
                    }
                }
                elementLines.push({ line, lineNum: index + 1 });
            }
        });
        if (rawResult.elements.length > elementLines.length) {
            const extraCount = rawResult.elements.length - elementLines.length;
            const lastLine = elementLines[elementLines.length - 1];
            throw new Error(formatError(`Multiple elements on the same line are not supported.\n` +
                `Each element must be on its own line.\n` +
                `Line ${lastLine.lineNum} appears to contain ${extraCount + 1} elements.\n` +
                `Line content: ${lastLine.line.trim()}\n` +
                `Solution: Put each element on a separate line.`, input, lastLine.lineNum, 1, 'one element per line', `${extraCount + 1} elements`));
        }
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