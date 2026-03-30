import { UIElement, UIPosition } from './types';

export interface LayoutAnalysisOptions {
  targetWidth?: number;
  targetHeight?: number;
  simplifyLayout?: boolean;
  minGap?: number;
}

export interface LayoutAnalysisResult {
  elements: UIElement[];
  globalBounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
  };
  rows: UIElement[][];
  columns: UIElement[][];
}

export function analyzeLayout(
  elements: UIElement[],
  options: LayoutAnalysisOptions = {}
): LayoutAnalysisResult {
  if (elements.length === 0) {
    return {
      elements: [],
      globalBounds: { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 },
      rows: [],
      columns: [],
    };
  }

  const targetWidth = options.targetWidth || 800;
  const minGap = options.minGap || 5;

  const globalBounds = calculateGlobalBounds(elements);

  const rows = groupByRows(elements, minGap);
  const columns = groupByColumns(elements, minGap);

  const processedElements = elements.map((element, index) => {
    const relativePosition = calculateRelativePosition(
      element.position,
      globalBounds,
      targetWidth
    );

    return {
      ...element,
      position: relativePosition,
    };
  });

  if (options.simplifyLayout) {
    simplifyPositions(processedElements, rows, minGap);
  }

  return {
    elements: processedElements,
    globalBounds,
    rows,
    columns,
  };
}

function calculateGlobalBounds(elements: UIElement[]): LayoutAnalysisResult['globalBounds'] {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const element of elements) {
    const pos = element.position;
    minX = Math.min(minX, pos.x);
    minY = Math.min(minY, pos.y);
    maxX = Math.max(maxX, pos.x + pos.width);
    maxY = Math.max(maxY, pos.y + pos.height);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function groupByRows(elements: UIElement[], minGap: number): UIElement[][] {
  if (elements.length === 0) return [];

  const sorted = [...elements].sort((a, b) => a.position.y - b.position.y);

  const rows: UIElement[][] = [];
  let currentRow: UIElement[] = [sorted[0]];
  let currentY = sorted[0].position.y;
  let currentHeight = sorted[0].position.height;

  for (let i = 1; i < sorted.length; i++) {
    const element = sorted[i];
    const verticalGap = element.position.y - (currentY + currentHeight);

    if (verticalGap <= minGap && Math.abs(element.position.y - currentY) <= minGap) {
      currentRow.push(element);
      currentHeight = Math.max(currentHeight, element.position.height);
    } else {
      rows.push(currentRow.sort((a, b) => a.position.x - b.position.x));
      currentRow = [element];
      currentY = element.position.y;
      currentHeight = element.position.height;
    }
  }

  if (currentRow.length > 0) {
    rows.push(currentRow.sort((a, b) => a.position.x - b.position.x));
  }

  return rows;
}

function groupByColumns(elements: UIElement[], minGap: number): UIElement[][] {
  if (elements.length === 0) return [];

  const sorted = [...elements].sort((a, b) => a.position.x - b.position.x);

  const columns: UIElement[][] = [];
  let currentColumn: UIElement[] = [sorted[0]];
  let currentX = sorted[0].position.x;
  let currentWidth = sorted[0].position.width;

  for (let i = 1; i < sorted.length; i++) {
    const element = sorted[i];
    const horizontalGap = element.position.x - (currentX + currentWidth);

    if (horizontalGap <= minGap && Math.abs(element.position.x - currentX) <= minGap) {
      currentColumn.push(element);
      currentWidth = Math.max(currentWidth, element.position.width);
    } else {
      columns.push(currentColumn.sort((a, b) => a.position.y - b.position.y));
      currentColumn = [element];
      currentX = element.position.x;
      currentWidth = element.position.width;
    }
  }

  if (currentColumn.length > 0) {
    columns.push(currentColumn.sort((a, b) => a.position.y - b.position.y));
  }

  return columns;
}

function calculateRelativePosition(
  position: UIPosition,
  globalBounds: LayoutAnalysisResult['globalBounds'],
  targetWidth: number
): UIPosition {
  const safeWidth = Math.max(1, globalBounds.width);
  const scaleX = targetWidth / safeWidth;

  return {
    x: Math.round((position.x - globalBounds.minX) * scaleX),
    y: Math.round(position.y - globalBounds.minY),
    width: Math.round(position.width * scaleX),
    height: position.height,
  };
}

function simplifyPositions(
  elements: UIElement[],
  rows: UIElement[][],
  minGap: number
): void {
  for (const row of rows) {
    if (row.length < 2) continue;

    const totalWidth = row.reduce((sum, el) => sum + el.position.width, 0);
    const availableWidth = row[row.length - 1].position.x + row[row.length - 1].position.width - row[0].position.x;
    const gapCount = row.length - 1;
    const gapSize = gapCount > 0 ? (availableWidth - totalWidth) / gapCount : 0;

    let currentX = row[0].position.x;
    for (const element of row) {
      element.position.x = currentX;
      currentX += element.position.width + gapSize;
    }
  }
}

export function detectGridLayout(
  elements: UIElement[],
  options: LayoutAnalysisOptions = {}
): { isGrid: boolean; columns: number; rows: number } {
  const minGap = options.minGap || 5;
  const rows = groupByRows(elements, minGap);

  if (rows.length < 2) {
    return { isGrid: false, columns: 0, rows: rows.length };
  }

  const columnCounts = rows.map(row => row.length);
  const uniqueCounts = new Set(columnCounts);

  if (uniqueCounts.size === 1 && columnCounts[0] >= 2) {
    return { isGrid: true, columns: columnCounts[0], rows: rows.length };
  }

  return { isGrid: false, columns: 0, rows: rows.length };
}

export function calculateElementSpacing(
  elements: UIElement[]
): { horizontal: number; vertical: number } {
  if (elements.length < 2) {
    return { horizontal: 0, vertical: 0 };
  }

  const horizontalGaps: number[] = [];
  const verticalGaps: number[] = [];

  const sortedByX = [...elements].sort((a, b) => a.position.x - b.position.x);
  for (let i = 1; i < sortedByX.length; i++) {
    const gap = sortedByX[i].position.x - (sortedByX[i - 1].position.x + sortedByX[i - 1].position.width);
    if (gap > 0) horizontalGaps.push(gap);
  }

  const sortedByY = [...elements].sort((a, b) => a.position.y - b.position.y);
  for (let i = 1; i < sortedByY.length; i++) {
    const gap = sortedByY[i].position.y - (sortedByY[i - 1].position.y + sortedByY[i - 1].position.height);
    if (gap > 0) verticalGaps.push(gap);
  }

  return {
    horizontal: horizontalGaps.length > 0 ? median(horizontalGaps) : 0,
    vertical: verticalGaps.length > 0 ? median(verticalGaps) : 0,
  };
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function alignElementsToGrid(
  elements: UIElement[],
  gridSize: number = 10
): void {
  for (const element of elements) {
    element.position.x = Math.round(element.position.x / gridSize) * gridSize;
    element.position.y = Math.round(element.position.y / gridSize) * gridSize;
    element.position.width = Math.round(element.position.width / gridSize) * gridSize;
    element.position.height = Math.round(element.position.height / gridSize) * gridSize;
  }
}
