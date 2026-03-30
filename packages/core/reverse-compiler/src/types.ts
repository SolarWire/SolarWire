export type UIElementType =
  | 'button'
  | 'input'
  | 'text'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'image'
  | 'icon'
  | 'link'
  | 'container'
  | 'table'
  | 'table-row'
  | 'table-cell'
  | 'divider'
  | 'unknown';

export interface UIPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UIStyles {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
  width?: number;
  height?: number;
  padding?: number;
  margin?: number;
}

export interface UIElement {
  type: UIElementType;
  tagName?: string;
  text?: string;
  position: UIPosition;
  styles: UIStyles;
  attributes: Record<string, string>;
  children: UIElement[];
  note?: string;
  sourceLocation?: {
    line?: number;
    column?: number;
    source?: string;
  };
}

export interface UITree {
  root: UIElement;
  metadata: {
    source: 'html' | 'jsx' | 'figma' | 'vue';
    title?: string;
    description?: string;
    createdAt: Date;
  };
}

export interface ConversionOptions {
  includeNotes?: boolean;
  includePositions?: boolean;
  preserveTextContent?: boolean;
  simplifyLayout?: boolean;
  targetWidth?: number;
  targetHeight?: number;
}

export interface ConversionResult {
  success: boolean;
  code?: string;
  errors?: ConversionError[];
  warnings?: ConversionWarning[];
  elements?: UIElement[];
}

export interface ConversionError {
  code: string;
  message: string;
  element?: UIElement;
  location?: { line: number; column: number };
}

export interface ConversionWarning {
  code: string;
  message: string;
  element?: UIElement;
}

export interface ElementDetectorResult {
  type: UIElementType;
  confidence: number;
  reason?: string;
}

export interface SourceAdapter {
  name: string;
  parse(source: string | unknown): UITree;
  supportedFormats: string[];
}
