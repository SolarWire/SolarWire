"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCircle = renderCircle;
exports.renderText = renderText;
exports.renderPlaceholder = renderPlaceholder;
exports.renderImage = renderImage;
exports.renderTable = renderTable;
const context_1 = require("../context");
function renderCircle(element, context) {
    let pos;
    if (element.coordinates) {
        pos = (0, context_1.calculatePosition)(context, element.coordinates);
    }
    else {
        pos = { x: context.offsetX, y: context.offsetY };
    }
    const w = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'w', 100);
    const h = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'h', 40);
    const radius = Math.min(w, h) / 2;
    const cx = pos.x + w / 2;
    const cy = pos.y + h / 2;
    const bg = (0, context_1.getColorAttribute)(element.attributes, context.globalDefaults, 'bg', 'transparent');
    const b = (0, context_1.getColorAttribute)(element.attributes, context.globalDefaults, 'b', '#333333');
    const s = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 's', 1);
    const c = (0, context_1.getColorAttribute)(element.attributes, context.globalDefaults, 'c', '#000000');
    const fontSize = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'text-size', (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'size', 12));
    const bold = (0, context_1.getBooleanAttribute)(element.attributes, context.globalDefaults, 'bold');
    const italic = (0, context_1.getBooleanAttribute)(element.attributes, context.globalDefaults, 'italic');
    const note = element.attributes['note'];
    const opacity = element.attributes['opacity'] ? parseFloat(element.attributes['opacity']) : undefined;
    const opacityAttr = opacity !== undefined ? ` opacity="${opacity}"` : '';
    let svgParts = [];
    svgParts.push(`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${bg}" stroke="${b}" stroke-width="${s}"${opacityAttr}/>`);
    if (element.text) {
        let fontStyle = '';
        if (bold)
            fontStyle += 'font-weight="bold" ';
        if (italic)
            fontStyle += 'font-style="italic" ';
        svgParts.push(`<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle" fill="${c}" font-size="${fontSize}" ${fontStyle}>${element.text}</text>`);
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
function renderText(element, context) {
    let pos;
    if (element.coordinates) {
        pos = (0, context_1.calculatePosition)(context, element.coordinates);
    }
    else {
        pos = { x: context.offsetX, y: context.offsetY };
    }
    const lines = element.text.split('\n');
    const w = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'w', 0);
    const lineHeight = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'line-height', (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'line-height', 22));
    const c = (0, context_1.getColorAttribute)(element.attributes, context.globalDefaults, 'c', '#000000');
    const fontSize = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'text-size', (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'size', 12));
    const align = (0, context_1.getAlignAttribute)(element.attributes, 'start');
    const bold = (0, context_1.getBooleanAttribute)(element.attributes, context.globalDefaults, 'bold');
    const italic = (0, context_1.getBooleanAttribute)(element.attributes, context.globalDefaults, 'italic');
    const note = element.attributes['note'];
    const opacity = element.attributes['opacity'] ? parseFloat(element.attributes['opacity']) : undefined;
    let fontStyle = '';
    if (bold)
        fontStyle += 'font-weight="bold" ';
    if (italic)
        fontStyle += 'font-style="italic" ';
    const textAnchor = align;
    let textX = pos.x;
    if (textAnchor === 'middle') {
        textX = pos.x + (w || 100) / 2;
    }
    else if (textAnchor === 'end') {
        textX = pos.x + (w || 100);
    }
    const textY = pos.y + fontSize;
    const opacityAttr = opacity !== undefined ? ` opacity="${opacity}"` : '';
    let svgParts = [];
    svgParts.push(`<text x="${textX}" y="${textY}" text-anchor="${textAnchor}" fill="${c}" font-size="${fontSize}" ${fontStyle}${opacityAttr}>`);
    lines.forEach((line, i) => {
        if (i === 0) {
            svgParts.push(line);
        }
        else {
            svgParts.push(`<tspan x="${textX}" dy="${lineHeight}">${line}</tspan>`);
        }
    });
    svgParts.push('</text>');
    const estimatedWidth = w || Math.max(...lines.map(l => l.length * fontSize * 0.6));
    const estimatedHeight = lines.length * lineHeight;
    const bounds = {
        x: pos.x,
        y: pos.y,
        width: estimatedWidth,
        height: estimatedHeight,
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
function renderPlaceholder(element, context) {
    let pos;
    if (element.coordinates) {
        pos = (0, context_1.calculatePosition)(context, element.coordinates);
    }
    else {
        pos = { x: context.offsetX, y: context.offsetY };
    }
    const w = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'w', 100);
    const h = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'h', 40);
    const bg = (0, context_1.getColorAttribute)(element.attributes, context.globalDefaults, 'bg', '#f0f0f0');
    const b = (0, context_1.getColorAttribute)(element.attributes, context.globalDefaults, 'b', '#999999');
    const s = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 's', 1);
    const c = (0, context_1.getColorAttribute)(element.attributes, context.globalDefaults, 'c', '#999999');
    const fontSize = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'text-size', (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'size', 12));
    const note = element.attributes['note'];
    const svgParts = [];
    svgParts.push(`<rect x="${pos.x}" y="${pos.y}" width="${w}" height="${h}" fill="${bg}" stroke="${b}" stroke-width="${s}"/>`);
    svgParts.push(`<line x1="${pos.x}" y1="${pos.y}" x2="${pos.x + w}" y2="${pos.y + h}" stroke="${b}" stroke-width="${s}"/>`);
    svgParts.push(`<line x1="${pos.x + w}" y1="${pos.y}" x2="${pos.x}" y2="${pos.y + h}" stroke="${b}" stroke-width="${s}"/>`);
    const text = element.text || 'Placeholder';
    svgParts.push(`<text x="${pos.x + w / 2}" y="${pos.y + h / 2}" text-anchor="middle" dominant-baseline="middle" fill="${c}" font-size="${fontSize}">${text}</text>`);
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
function renderImage(element, context) {
    let pos;
    if (element.coordinates) {
        pos = (0, context_1.calculatePosition)(context, element.coordinates);
    }
    else {
        pos = { x: context.offsetX, y: context.offsetY };
    }
    const w = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'w', 100);
    const h = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'h', 80);
    const bg = (0, context_1.getColorAttribute)(element.attributes, context.globalDefaults, 'bg', '#f0f0f0');
    const c = (0, context_1.getColorAttribute)(element.attributes, context.globalDefaults, 'c', '#999999');
    const fontSize = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'text-size', (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'size', 12));
    const note = element.attributes['note'];
    const svgParts = [];
    svgParts.push(`<rect x="${pos.x}" y="${pos.y}" width="${w}" height="${h}" fill="${bg}"/>`);
    const iconSize = Math.min(w, h) * 0.3;
    const iconX = pos.x + w / 2;
    const iconY = pos.y + h / 2 - fontSize;
    svgParts.push(`<g transform="translate(${iconX - iconSize / 2}, ${iconY - iconSize / 2})">`);
    svgParts.push(`<rect x="0" y="0" width="${iconSize}" height="${iconSize}" fill="none" stroke="${c}" stroke-width="2" rx="4"/>`);
    svgParts.push(`<path d="M${iconSize * 0.2} ${iconSize * 0.3} L${iconSize * 0.5} ${iconSize * 0.6} L${iconSize * 0.8} ${iconSize * 0.3}" fill="none" stroke="${c}" stroke-width="2"/>`);
    svgParts.push(`<circle cx="${iconSize * 0.35}" cy="${iconSize * 0.4}" r="${iconSize * 0.08}" fill="${c}"/>`);
    svgParts.push(`</g>`);
    svgParts.push(`<text x="${pos.x + w / 2}" y="${pos.y + h / 2 + fontSize}" text-anchor="middle" fill="${c}" font-size="${fontSize}">Image</text>`);
    svgParts.push(`<image x="${pos.x}" y="${pos.y}" width="${w}" height="${h}" href="${element.url}"/>`);
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
function renderTable(element, context, renderChild) {
    let pos;
    if (element.coordinates) {
        pos = (0, context_1.calculatePosition)(context, element.coordinates);
    }
    else {
        pos = { x: context.offsetX, y: context.offsetY };
    }
    if (element.type === 'table') {
        return renderTableElement(element, context, pos, renderChild);
    }
    else {
        return renderTableRow(element, context, pos, renderChild);
    }
}
function renderTableElement(element, context, pos, renderChild) {
    const border = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'border', 1);
    const cellspacing = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'cellspacing', 0);
    const b = (0, context_1.getColorAttribute)(element.attributes, context.globalDefaults, 'b', '#333333');
    const note = element.attributes['note'];
    const svgParts = [];
    const rows = element.children || [];
    const declaredNumRows = rows.length;
    const tableWidth = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'w', 600);
    const declaredTableHeight = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'h', 0);
    const defaultRowHeight = 40;
    let estimatedMaxColCount = 0;
    let estimatedMaxRowSpan = 0;
    rows.forEach((row, rowIndex) => {
        const rowNote = row.attributes?.['note'];
        if (rowNote) {
            throw new Error(`Table row element does not support "note" attribute.\n` +
                `Row: ${rowIndex + 1}\n` +
                `Found: note="${rowNote}"\n` +
                `Reason: Notes are only supported on individual cell elements, not on row elements.\n` +
                `Solution: Remove the "note" attribute from the row element and add notes to individual cells if needed.`);
        }
    });
    rows.forEach((row, rowIndex) => {
        const cells = row.children || [];
        cells.forEach((cell, cellIndex) => {
            if ('w' in cell.attributes || 'h' in cell.attributes) {
                const attrName = 'w' in cell.attributes ? 'w' : 'h';
                const attrValue = cell.attributes[attrName];
                throw new Error(`Table cell element cannot specify "${attrName}" attribute.\n` +
                    `Cell content: "${cell.content || ''}"\n` +
                    `Row: ${rowIndex + 1}, Cell: ${cellIndex + 1}\n` +
                    `Found: ${attrName}=${attrValue}\n` +
                    `Reason: Table cell dimensions are automatically calculated based on table width and row height.\n` +
                    `Solution: Remove the "${attrName}" attribute from this cell element.`);
            }
            if (cell.type === 'line') {
                throw new Error(`Table cell element cannot be a line element.\n` +
                    `Row: ${rowIndex + 1}, Cell: ${cellIndex + 1}\n` +
                    `Found: line element\n` +
                    `Reason: Lines are not supported inside table cells.\n` +
                    `Solution: Use text ("..."), rectangle ([...]), rounded rectangle ((...)), circle (((...))), or placeholder ([?...]) elements instead.`);
            }
            const colspan = cell.attributes['colspan'] ? parseInt(cell.attributes['colspan']) : 1;
            const rowspan = cell.attributes['rowspan'] ? parseInt(cell.attributes['rowspan']) : 1;
            estimatedMaxColCount = Math.max(estimatedMaxColCount, colspan);
            estimatedMaxRowSpan = Math.max(estimatedMaxRowSpan, rowIndex + rowspan);
        });
    });
    estimatedMaxColCount = Math.max(estimatedMaxColCount, 10);
    let tempGrid = [];
    for (let r = 0; r < estimatedMaxRowSpan + 10; r++) {
        tempGrid[r] = [];
        for (let c = 0; c < estimatedMaxColCount + 10; c++) {
            tempGrid[r][c] = false;
        }
    }
    let actualMaxColCount = 0;
    let actualMaxRowCount = 0;
    rows.forEach((row, rowIndex) => {
        const cells = row.children || [];
        let colIndex = 0;
        while (colIndex < tempGrid[rowIndex].length && tempGrid[rowIndex][colIndex]) {
            colIndex++;
        }
        cells.forEach((cell) => {
            const colspan = cell.attributes['colspan'] ? parseInt(cell.attributes['colspan']) : 1;
            const rowspan = cell.attributes['rowspan'] ? parseInt(cell.attributes['rowspan']) : 1;
            actualMaxColCount = Math.max(actualMaxColCount, colIndex + colspan);
            actualMaxRowCount = Math.max(actualMaxRowCount, rowIndex + rowspan);
            for (let r = rowIndex; r < rowIndex + rowspan; r++) {
                for (let c = colIndex; c < colIndex + colspan; c++) {
                    tempGrid[r][c] = true;
                }
            }
            colIndex += colspan;
            while (colIndex < tempGrid[rowIndex].length && tempGrid[rowIndex][colIndex]) {
                colIndex++;
            }
        });
    });
    const finalNumRows = Math.max(declaredNumRows, actualMaxRowCount);
    const finalNumCols = actualMaxColCount;
    let tableHeight;
    let rowHeight;
    if (declaredTableHeight > 0) {
        tableHeight = declaredTableHeight;
        rowHeight = tableHeight / finalNumRows;
    }
    else {
        tableHeight = finalNumRows * defaultRowHeight + (finalNumRows - 1) * cellspacing;
        rowHeight = defaultRowHeight;
    }
    const grid = [];
    for (let r = 0; r < finalNumRows; r++) {
        grid[r] = [];
        for (let c = 0; c < finalNumCols; c++) {
            grid[r][c] = false;
        }
    }
    const cellData = [];
    rows.forEach((row, rowIndex) => {
        const cells = row.children || [];
        let colIndex = 0;
        while (colIndex < finalNumCols && grid[rowIndex][colIndex]) {
            colIndex++;
        }
        cells.forEach((cell) => {
            const colspan = cell.attributes['colspan'] ? parseInt(cell.attributes['colspan']) : 1;
            const rowspan = cell.attributes['rowspan'] ? parseInt(cell.attributes['rowspan']) : 1;
            const actualColspan = Math.min(colspan, finalNumCols - colIndex);
            const actualRowspan = Math.min(rowspan, finalNumRows - rowIndex);
            cellData.push({
                row: rowIndex,
                col: colIndex,
                colspan: actualColspan,
                rowspan: actualRowspan,
                cell
            });
            for (let r = rowIndex; r < rowIndex + actualRowspan; r++) {
                for (let c = colIndex; c < colIndex + actualColspan; c++) {
                    grid[r][c] = true;
                }
            }
            colIndex += actualColspan;
            while (colIndex < finalNumCols && grid[rowIndex][colIndex]) {
                colIndex++;
            }
        });
    });
    const colWidth = finalNumCols > 0 ? tableWidth / finalNumCols : 100;
    cellData.forEach(data => {
        const cellX = pos.x + data.col * colWidth;
        const cellY = pos.y + data.row * rowHeight;
        const cellWidth = colWidth * data.colspan;
        const cellHeight = data.rowspan * rowHeight;
        const cellBg = (0, context_1.getColorAttribute)(data.cell.attributes, context.globalDefaults, 'bg', '#ffffff');
        const cellBorder = (0, context_1.getColorAttribute)(data.cell.attributes, context.globalDefaults, 'b', '#333333');
        const cellStrokeWidth = (0, context_1.getNumberAttribute)(data.cell.attributes, context.globalDefaults, 's', 1);
        svgParts.push(`<rect x="${cellX}" y="${cellY}" width="${cellWidth}" height="${cellHeight}" fill="${cellBg}" stroke="${cellBorder}" stroke-width="${cellStrokeWidth}"/>`);
        const cellContext = (0, context_1.createChildContext)(context, cellX, cellY);
        const modifiedCell = { ...data.cell };
        modifiedCell.attributes = { ...modifiedCell.attributes };
        modifiedCell.attributes['w'] = cellWidth.toString();
        modifiedCell.attributes['h'] = cellHeight.toString();
        const result = renderChild(modifiedCell, cellContext);
        svgParts.push(result.svg);
    });
    if (border > 0) {
        svgParts.push(`<rect x="${pos.x}" y="${pos.y}" width="${tableWidth}" height="${tableHeight}" fill="none" stroke="${b}" stroke-width="${border}"/>`);
    }
    const bounds = {
        x: pos.x,
        y: pos.y,
        width: tableWidth,
        height: tableHeight,
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
function renderTableRow(element, context, pos, renderChild) {
    const bg = (0, context_1.getColorAttribute)(element.attributes, context.globalDefaults, 'bg', 'transparent');
    const note = element.attributes['note'];
    if (note) {
        throw new Error(`Table row element does not support "note" attribute.\n` +
            `Reason: Notes are only supported on individual cell elements, not on row elements.\n` +
            `Solution: Remove the "note" attribute from the row element and add notes to individual cells if needed.`);
    }
    const rowAttributes = element.attributes;
    const rowDefaults = {};
    const inheritableAttrs = ['c', 'bg', 'b', 's', 'size', 'bold', 'italic', 'align'];
    inheritableAttrs.forEach(attr => {
        if (rowAttributes[attr] !== undefined) {
            rowDefaults[attr] = rowAttributes[attr];
        }
    });
    const svgParts = [];
    let currentX = pos.x;
    let maxHeight = 0;
    const cellResults = [];
    const cells = element.children || [];
    cells.forEach(cell => {
        const mergedAttributes = { ...rowDefaults, ...cell.attributes };
        const modifiedCell = { ...cell, attributes: mergedAttributes };
        const cellContext = (0, context_1.createChildContext)(context, currentX, pos.y);
        const result = renderChild(modifiedCell, cellContext);
        cellResults.push(result);
        maxHeight = Math.max(maxHeight, result.bounds.height);
        let cellWidth = result.bounds.width;
        const colspan = cell.attributes['colspan'] ? parseInt(cell.attributes['colspan']) : 1;
        if (colspan > 1) {
            cellWidth *= colspan;
        }
        currentX += cellWidth;
    });
    const rowWidth = currentX - pos.x;
    const rowHeight = (0, context_1.getNumberAttribute)(element.attributes, context.globalDefaults, 'h', maxHeight || 40);
    if (bg !== 'transparent') {
        svgParts.push(`<rect x="${pos.x}" y="${pos.y}" width="${rowWidth}" height="${rowHeight}" fill="${bg}"/>`);
    }
    let renderX = pos.x;
    cellResults.forEach((result, index) => {
        const cell = cells[index];
        let cellWidth = result.bounds.width;
        let cellHeight = result.bounds.height;
        const colspan = cell.attributes['colspan'] ? parseInt(cell.attributes['colspan']) : 1;
        const rowspan = cell.attributes['rowspan'] ? parseInt(cell.attributes['rowspan']) : 1;
        if (colspan > 1) {
            cellWidth *= colspan;
        }
        if (rowspan > 1) {
            cellHeight *= rowspan;
        }
        if (colspan > 1 || rowspan > 1) {
            const cellBg = (0, context_1.getColorAttribute)(cell.attributes, context.globalDefaults, 'bg', '#ffffff');
            const cellBorder = (0, context_1.getColorAttribute)(cell.attributes, context.globalDefaults, 'b', '#333333');
            const cellStrokeWidth = (0, context_1.getNumberAttribute)(cell.attributes, context.globalDefaults, 's', 1);
            svgParts.push(`<rect x="${renderX}" y="${pos.y}" width="${cellWidth}" height="${cellHeight}" fill="${cellBg}" stroke="${cellBorder}" stroke-width="${cellStrokeWidth}"/>`);
        }
        svgParts.push(result.svg);
        renderX += cellWidth;
    });
    const bounds = {
        x: pos.x,
        y: pos.y,
        width: rowWidth,
        height: rowHeight,
    };
    (0, context_1.updateLastElementBounds)(context, bounds);
    return {
        svg: svgParts.join(''),
        bounds,
    };
}
