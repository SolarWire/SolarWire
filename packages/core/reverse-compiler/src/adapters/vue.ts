import { UIElement, UITree, UIElementType, UIStyles, UIPosition, ConversionOptions, ConversionResult } from '../types';
import { detectElementType } from '../detector';
import { extractStyles, extractPosition } from '../extractor';
import { generateSolarWire } from '../generator';

interface VueTemplateElement {
  tag?: string;
  attrs: Record<string, string | boolean>;
  children: VueTemplateElement[];
  text?: string;
}

export class VueAdapter {
  name = 'vue';
  supportedFormats = ['vue', 'vue-template'];

  parse(source: string | unknown): UITree {
    const vueString = typeof source === 'string' ? source : String(source);
    
    const template = this.extractTemplate(vueString);
    const vueElements = this.parseVueTemplate(template);
    const uiRoot = this.convertToUIElement(vueElements);

    return {
      root: uiRoot,
      metadata: {
        source: 'vue',
        createdAt: new Date(),
      },
    };
  }

  private extractTemplate(vueString: string): string {
    const templateMatch = vueString.match(/<template[^>]*>([\s\S]*?)<\/template>/i);
    if (templateMatch) {
      return templateMatch[1].trim();
    }
    
    if (vueString.includes('<') && vueString.includes('>')) {
      return vueString;
    }
    
    return '';
  }

  private parseVueTemplate(template: string): VueTemplateElement[] {
    const elements: VueTemplateElement[] = [];
    
    const tagPattern = /<(\/?)([\w-]+)([^>]*?)(\/?)>/g;
    const stack: { element: VueTemplateElement; depth: number }[] = [];
    let lastIndex = 0;
    let currentDepth = 0;

    let match;
    while ((match = tagPattern.exec(template)) !== null) {
      const [fullMatch, isClosing, tagName, attributesStr, isSelfClosing] = match;
      
      const textBefore = template.slice(lastIndex, match.index).trim();
      if (textBefore && stack.length > 0) {
        const current = stack[stack.length - 1];
        if (!current.element.text) {
          current.element.text = textBefore;
        }
      }

      if (isClosing) {
        if (stack.length > 0 && stack[stack.length - 1].element.tag === tagName) {
          const closed = stack.pop()!;
          currentDepth = closed.depth;
          
          if (stack.length > 0) {
            stack[stack.length - 1].element.children.push(closed.element);
          } else {
            elements.push(closed.element);
          }
        }
      } else {
        const element: VueTemplateElement = {
          tag: tagName,
          attrs: this.parseVueAttributes(attributesStr),
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

  private parseVueAttributes(attrString: string): Record<string, string | boolean> {
    const attrs: Record<string, string | boolean> = {};
    
    const attrPattern = /([@:#]?[\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|\{([^}]*)\}))?/g;
    let match;
    
    while ((match = attrPattern.exec(attrString)) !== null) {
      const [, name, doubleQuoted, singleQuoted, vueExpr] = match;
      
      if (vueExpr !== undefined) {
        attrs[name] = this.evaluateVueExpression(vueExpr);
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

  private evaluateVueExpression(expr: string): string | boolean {
    const trimmed = expr.trim();
    
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      return trimmed;
    }
    
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return trimmed.slice(1, -1);
    }
    
    return `{{${trimmed}}}`;
  }

  private convertToUIElement(vueElements: VueTemplateElement[]): UIElement {
    if (vueElements.length === 0) {
      return {
        type: 'container',
        position: { x: 0, y: 0, width: 0, height: 0 },
        styles: {},
        attributes: {},
        children: [],
      };
    }

    if (vueElements.length === 1) {
      return this.vueElementToUIElement(vueElements[0]);
    }

    const children = vueElements.map(el => this.vueElementToUIElement(el));
    
    return {
      type: 'container',
      tagName: 'template',
      position: { x: 0, y: 0, width: 0, height: 0 },
      styles: {},
      attributes: {},
      children,
    };
  }

  private vueElementToUIElement(vueElement: VueTemplateElement): UIElement {
    const attrs = this.normalizeAttributes(vueElement.attrs);
    
    const detection = detectElementType({
      tagName: vueElement.tag?.toUpperCase(),
      ...attrs,
    });

    const position = this.extractPosition(vueElement);
    const styles = this.extractStyles(vueElement);
    const attributes = this.convertAttributes(vueElement.attrs);

    const uiElement: UIElement = {
      type: detection.type as UIElementType,
      tagName: vueElement.tag?.toLowerCase(),
      position,
      styles,
      attributes,
      children: [],
    };

    if (vueElement.text) {
      uiElement.text = vueElement.text;
    }

    if (vueElement.children.length > 0) {
      uiElement.children = vueElement.children.map(child => 
        this.vueElementToUIElement(child)
      );
    }

    if (uiElement.type === 'container' && uiElement.children.length === 0 && uiElement.text) {
      uiElement.type = 'text';
    }

    return uiElement;
  }

  private normalizeAttributes(attrs: Record<string, string | boolean>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(attrs)) {
      if (key.startsWith('@')) {
        result['on' + key.slice(1).charAt(0).toUpperCase() + key.slice(2)] = value;
      } else if (key.startsWith(':')) {
        result[key.slice(1)] = value;
      } else if (key.startsWith('v-')) {
        result[key] = value;
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  private extractPosition(element: VueTemplateElement): UIPosition {
    const { style } = element.attrs;
    
    if (typeof style === 'string') {
      return extractPosition({ style });
    }

    return extractPosition(element.attrs as Record<string, unknown>);
  }

  private extractStyles(element: VueTemplateElement): UIStyles {
    const { style, class: cls, className } = element.attrs;
    
    const styles: UIStyles = {};

    if (typeof style === 'string') {
      const extracted = extractStyles({ style });
      Object.assign(styles, extracted);
    }

    return styles;
  }

  private convertAttributes(attrs: Record<string, string | boolean>): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'style' || key === 'class' || key === 'className') continue;
      if (key.startsWith('@') || key.startsWith(':') || key.startsWith('v-')) continue;
      
      if (value === true) {
        result[key] = 'true';
      } else if (value === false || value === null) {
        continue;
      } else {
        result[key] = String(value);
      }
    }

    return result;
  }
}

export function parseVue(vueString: string): UITree {
  const adapter = new VueAdapter();
  return adapter.parse(vueString);
}

export function convertVueToSolarWire(
  vueString: string,
  options: ConversionOptions = {}
): ConversionResult {
  const tree = parseVue(vueString);
  return generateSolarWire(tree, options);
}
