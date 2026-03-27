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
function isElementStart(char) {
    return char === '[' || char === '(' || char === '"' || char === "'";
}
function checkForMultipleElementsOnLine(line, lineNum, input, inMultilineStringRef, stringCharRef) {
    const trimmed = line.trim();
    if (!trimmed)
        return;
    if (trimmed.startsWith('//'))
        return;
    if (trimmed.startsWith('!'))
        return;
    if (trimmed.startsWith('#'))
        return;
    if (inMultilineStringRef.value) {
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '\\' && i + 1 < line.length) {
                i++;
                continue;
            }
            if (line[i] === stringCharRef.value) {
                inMultilineStringRef.value = false;
                return;
            }
        }
        return;
    }
    let elementCount = 0;
    let i = 0;
    const len = line.length;
    while (i < len) {
        const char = line[i];
        if (char === ' ' || char === '\t') {
            i++;
            continue;
        }
        if (char === '/' && i + 1 < len && line[i + 1] === '/') {
            break;
        }
        if (char === '@') {
            while (i < len && line[i] !== ')')
                i++;
            if (i < len)
                i++;
            continue;
        }
        if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
            while (i < len && /[\w-]/.test(line[i]))
                i++;
            if (i < len && line[i] === '=') {
                i++;
                if (i < len && (line[i] === '"' || line[i] === "'")) {
                    const quote = line[i];
                    i++;
                    let foundClose = false;
                    while (i < len) {
                        if (line[i] === '\\' && i + 1 < len) {
                            i += 2;
                            continue;
                        }
                        if (line[i] === quote) {
                            foundClose = true;
                            i++;
                            break;
                        }
                        i++;
                    }
                    if (!foundClose) {
                        inMultilineStringRef.value = true;
                        stringCharRef.value = quote;
                        return;
                    }
                }
                else {
                    while (i < len && !/[\s\t]/.test(line[i]))
                        i++;
                }
            }
            continue;
        }
        if (char === '-' && i + 1 < len && line[i + 1] === '-') {
            elementCount++;
            i += 2;
            while (i < len && (line[i] === ' ' || line[i] === '\t'))
                i++;
            if (i < len && line[i] === '@') {
                while (i < len && line[i] !== ')')
                    i++;
                if (i < len)
                    i++;
            }
            while (i < len && (line[i] === ' ' || line[i] === '\t'))
                i++;
            if (i < len && line[i] === '-' && i + 1 < len && line[i + 1] === '>') {
                i += 2;
                while (i < len && (line[i] === ' ' || line[i] === '\t'))
                    i++;
                if (i < len && line[i] === '@') {
                    while (i < len && line[i] !== ')')
                        i++;
                    if (i < len)
                        i++;
                }
                else if (i < len && line[i] === '(') {
                    let depth = 1;
                    i++;
                    while (i < len && depth > 0) {
                        if (line[i] === '(')
                            depth++;
                        else if (line[i] === ')')
                            depth--;
                        i++;
                    }
                }
            }
            continue;
        }
        if (char === '<') {
            elementCount++;
            while (i < len && line[i] !== '>')
                i++;
            if (i < len)
                i++;
            continue;
        }
        if (char === '[' || char === '(' || char === '"' || char === "'") {
            elementCount++;
            if (char === '"' || char === "'") {
                const quote = char;
                i++;
                let foundClose = false;
                while (i < len) {
                    if (line[i] === '\\' && i + 1 < len) {
                        i += 2;
                        continue;
                    }
                    if (line[i] === quote) {
                        foundClose = true;
                        i++;
                        break;
                    }
                    i++;
                }
                if (!foundClose) {
                    inMultilineStringRef.value = true;
                    stringCharRef.value = quote;
                }
            }
            else if (char === '[') {
                let depth = 1;
                i++;
                while (i < len && depth > 0) {
                    if (line[i] === '[')
                        depth++;
                    else if (line[i] === ']')
                        depth--;
                    else if (line[i] === '"' || line[i] === "'") {
                        const quote = line[i];
                        i++;
                        while (i < len) {
                            if (line[i] === '\\' && i + 1 < len) {
                                i += 2;
                                continue;
                            }
                            if (line[i] === quote) {
                                i++;
                                break;
                            }
                            i++;
                        }
                        continue;
                    }
                    i++;
                }
            }
            else if (char === '(') {
                let depth = 1;
                i++;
                while (i < len && depth > 0) {
                    if (line[i] === '(')
                        depth++;
                    else if (line[i] === ')')
                        depth--;
                    else if (line[i] === '"' || line[i] === "'") {
                        const quote = line[i];
                        i++;
                        while (i < len) {
                            if (line[i] === '\\' && i + 1 < len) {
                                i += 2;
                                continue;
                            }
                            if (line[i] === quote) {
                                i++;
                                break;
                            }
                            i++;
                        }
                        continue;
                    }
                    i++;
                }
            }
            continue;
        }
        i++;
    }
    if (elementCount > 1) {
        throw new Error(formatError(`Multiple elements on the same line are not supported.\n` +
            `Each element must be on its own line.\n` +
            `Line content: ${trimmed}\n` +
            `Found ${elementCount} elements on this line.\n` +
            `Solution: Put each element on a separate line.`, input, lineNum, 1, 'one element per line', `${elementCount} elements`));
    }
}
function parse(input) {
    if (!parser) {
        throw new Error('Parser not generated. Please run: npm run build');
    }
    try {
        const lines = input.split(/\r?\n/);
        const inMultilineStringRef = { value: false };
        const stringCharRef = { value: '' };
        lines.forEach((line, index) => {
            checkForMultipleElementsOnLine(line, index + 1, input, inMultilineStringRef, stringCharRef);
        });
        const rawResult = parser.parse(input);
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