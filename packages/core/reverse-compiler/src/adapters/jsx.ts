import { UIElement, UITree, UIElementType, UIStyles, UIPosition, ConversionOptions, ConversionResult } from '../types';
import { detectElementType } from '../detector';
import { extractStyles, extractPosition } from '../extractor';
import { generateSolarWire } from '../generator';

interface JSXAttribute {
  type: string;
  name: string;
  value?: string | number | boolean | null;
}

interface JSXElement {
  type: string;
  tagName?: string;
  attributes: Record<string, string | number | boolean>;
  children: JSXElement[];
  text?: string;
}

export class JSXAdapter {
  name = 'jsx';
  supportedFormats = ['jsx', 'tsx', 'react'];

  parse(source: string | unknown): UITree {
    const jsxString = typeof source === 'string' ? source : String(source);
    
    const jsxElements = this.parseJSX(jsxString);
    const uiRoot = this.convertToUIElement(jsxElements);

    return {
      root: uiRoot,
      metadata: {
        source: 'jsx',
        createdAt: new Date(),
      },
    };
  }

  private parseJSX(jsxString: string): JSXElement[] {
    const elements: JSXElement[] = [];
    
    const tagPattern = /<(\/?)([\w-]+)([^>]*?)(\/?)>/g;
    const stack: { element: JSXElement; depth: number }[] = [];
    let lastIndex = 0;
    let currentDepth = 0;

    let match;
    while ((match = tagPattern.exec(jsxString)) !== null) {
      const [fullMatch, isClosing, tagName, attributesStr, isSelfClosing] = match;
      
      const textBefore = jsxString.slice(lastIndex, match.index).trim();
      if (textBefore && stack.length > 0) {
        const current = stack[stack.length - 1];
        if (!current.element.text) {
          current.element.text = textBefore;
        }
      }

      if (isClosing) {
        if (stack.length > 0 && stack[stack.length - 1].element.tagName === tagName) {
          const closed = stack.pop()!;
          currentDepth = closed.depth;
          
          if (stack.length > 0) {
            stack[stack.length - 1].element.children.push(closed.element);
          } else {
            elements.push(closed.element);
          }
        }
      } else {
        const element: JSXElement = {
          type: 'element',
          tagName,
          attributes: this.parseAttributes(attributesStr),
          children: [],
        };

        if (isSelfClosing) {
          if (stack.length > 0) {
            stack[stack.length - 1].element.children.push(element);
          } else {
            elements.push(element);
          }
        } else {
          stack.push({ element, depth: currentDepth++ });
        }
      }

      lastIndex = match.index + fullMatch.length;
    }

    while (stack.length > 0) {
      const remaining = stack.pop()!;
      if (stack.length > 0) {
        stack[stack.length - 1].element.children.push(remaining.element);
      } else {
        elements.push(remaining.element);
      }
    }

    return elements;
  }

  private parseAttributes(attrString: string): Record<string, string | number | boolean> {
    const attrs: Record<string, string | number | boolean> = {};
    
    const attrPattern = /(\w+)(?:=(?:\{([^}]*)\}|"([^"]*)"|'([^']*)'))?/g;
    let match;
    
    while ((match = attrPattern.exec(attrString)) !== null) {
      const [, name, jsxValue, doubleQuoted, singleQuoted] = match;
      
      if (jsxValue !== undefined) {
        attrs[name] = this.evaluateJSXExpression(jsxValue);
      } else if (doubleQuoted !== undefined) {
        attrs[name] = doubleQuoted;
      } else if (singleQuoted !== undefined) {
        attrs[name] = singleQuoted;
      } else {
        attrs[name] = true;
      }
    }

    return attrs;
  }

  private evaluateJSXExpression(expr: string): string | number | boolean {
    const trimmed = expr.trim();
    
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    if (trimmed === 'null' || trimmed === 'undefined') return '';
    
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      return parseFloat(trimmed);
    }
    
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return trimmed.slice(1, -1);
    }
    
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return trimmed.slice(1, -1);
    }
    
    return `{${trimmed}}`;
  }

  private convertToUIElement(jsxElements: JSXElement[]): UIElement {
    if (jsxElements.length === 0) {
      return {
        type: 'container',
        position: { x: 0, y: 0, width: 0, height: 0 },
        styles: {},
        attributes: {},
        children: [],
      };
    }

    if (jsxElements.length === 1) {
      return this.jsxElementToUIElement(jsxElements[0]);
    }

    const children = jsxElements.map(el => this.jsxElementToUIElement(el));
    
    return {
      type: 'container',
      tagName: 'fragment',
      position: { x: 0, y: 0, width: 0, height: 0 },
      styles: {},
      attributes: {},
      children,
    };
  }

  private jsxElementToUIElement(jsxElement: JSXElement): UIElement {
    const detection = detectElementType({
      tagName: jsxElement.tagName?.toUpperCase(),
      ...jsxElement.attributes,
    });

    const position = this.extractPosition(jsxElement);
    const styles = this.extractStyles(jsxElement);
    const attributes = this.convertAttributes(jsxElement.attributes);

    const uiElement: UIElement = {
      type: detection.type as UIElementType,
      tagName: jsxElement.tagName?.toLowerCase(),
      position,
      styles,
      attributes,
      children: [],
    };

    if (jsxElement.text) {
      uiElement.text = jsxElement.text;
    }

    if (jsxElement.children.length > 0) {
      uiElement.children = jsxElement.children.map(child => 
        this.jsxElementToUIElement(child)
      );
    }

    if (uiElement.type === 'container' && uiElement.children.length === 0 && uiElement.text) {
      uiElement.type = 'text';
    }

    return uiElement;
  }

  private extractPosition(element: JSXElement): UIPosition {
    const { style } = element.attributes;
    
    if (typeof style === 'string') {
      return extractPosition({ style });
    }

    return extractPosition(element.attributes);
  }

  private extractStyles(element: JSXElement): UIStyles {
    const { style, className, class: cls } = element.attributes;
    
    const styles: UIStyles = {};

    if (typeof style === 'string') {
      const extracted = extractStyles({ style });
      Object.assign(styles, extracted);
    }

    if (className || cls) {
      styles.backgroundColor = styles.backgroundColor || undefined;
    }

    return styles;
  }

  private convertAttributes(attrs: Record<string, string | number | boolean>): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'style' || key === 'className' || key === 'class') continue;
      
      if (value === true) {
        result[key] = 'true';
      } else if (value === false || value === null || value === undefined) {
        continue;
      } else {
        result[key] = String(value);
      }
    }

    return result;
  }
}

export function parseJSX(jsxString: string): UITree {
  const adapter = new JSXAdapter();
  return adapter.parse(jsxString);
}

export function convertJSXToSolarWire(
  jsxString: string,
  options: ConversionOptions = {}
): ConversionResult {
  const tree = parseJSX(jsxString);
  return generateSolarWire(tree, options);
}

export const convertReactToSolarWire = convertJSXToSolarWire;
