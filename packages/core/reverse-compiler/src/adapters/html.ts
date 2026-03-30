import { UIElement, UITree, UIElementType, UIStyles, UIPosition, ConversionOptions, ConversionResult } from '../types';
import { detectElementType } from '../detector';
import { extractStyles, extractPosition } from '../extractor';
import { generateSolarWire } from '../generator';

export class HTMLAdapter {
  name = 'html';
  supportedFormats = ['html', 'htm', 'xhtml'];

  parse(source: string | unknown): UITree {
    const htmlString = typeof source === 'string' ? source : this.serializeToString(source);

    const doc = this.createDocument(htmlString);
    const root = doc.body || doc.documentElement;

    const uiRoot = this.parseNode(root, 0);

    return {
      root: uiRoot,
      metadata: {
        source: 'html',
        title: doc.title || undefined,
        createdAt: new Date(),
      },
    };
  }

  private createDocument(htmlString: string): Document {
    if (typeof DOMParser !== 'undefined') {
      const parser = new DOMParser();
      return parser.parseFromString(htmlString, 'text/html');
    }

    if (typeof require !== 'undefined') {
      try {
        const { JSDOM } = require('jsdom');
        const dom = new JSDOM(htmlString);
        return dom.window.document;
      } catch {
        throw new Error('jsdom is required for Node.js environment. Install it with: npm install jsdom');
      }
    }

    throw new Error('No DOM parser available. This adapter requires a browser environment or jsdom package.');
  }

  private parseNode(node: Node, depth: number): UIElement {
    if (node.nodeType === (typeof Node !== 'undefined' ? Node.TEXT_NODE : 3)) {
      return this.parseTextNode(node as Text);
    }

    if (node.nodeType !== (typeof Node !== 'undefined' ? Node.ELEMENT_NODE : 1)) {
      return this.createUnknownElement(node);
    }

    const element = node as Element;
    const htmlElement = element as HTMLElement;

    const detection = detectElementType(htmlElement);
    const position = this.getElementPosition(htmlElement);
    const styles = this.getElementStyles(htmlElement);
    const attributes = this.extractAttributes(htmlElement);

    const uiElement: UIElement = {
      type: detection.type as UIElementType,
      tagName: element.tagName?.toLowerCase(),
      position,
      styles,
      attributes,
      children: [],
    };

    const textContent = this.extractTextContent(htmlElement);
    if (textContent) {
      uiElement.text = textContent;
    }

    if ((htmlElement as any).title) {
      uiElement.note = (htmlElement as any).title;
    }

    for (const child of element.childNodes) {
      const childElement = this.parseNode(child, depth + 1);
      if (childElement && childElement.type !== 'unknown') {
        uiElement.children.push(childElement);
      }
    }

    if (uiElement.type === 'container' && uiElement.children.length === 0) {
      if (textContent) {
        uiElement.type = 'text';
      }
    }

    return uiElement;
  }

  private parseTextNode(node: Text): UIElement {
    const text = node.textContent?.trim();
    if (!text) {
      return this.createUnknownElement(node);
    }

    return {
      type: 'text',
      text,
      position: { x: 0, y: 0, width: 0, height: 0 },
      styles: {},
      attributes: {},
      children: [],
    };
  }

  private createUnknownElement(node: Node): UIElement {
    return {
      type: 'unknown',
      position: { x: 0, y: 0, width: 0, height: 0 },
      styles: {},
      attributes: {},
      children: [],
    };
  }

  private getElementPosition(element: HTMLElement): UIPosition {
    if (typeof window !== 'undefined' && element.getBoundingClientRect) {
      const rect = element.getBoundingClientRect();
      return {
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    }

    return extractPosition(element);
  }

  private getElementStyles(element: HTMLElement): UIStyles {
    if (typeof window !== 'undefined' && window.getComputedStyle) {
      const computedStyle = window.getComputedStyle(element);
      return {
        backgroundColor: computedStyle.backgroundColor || undefined,
        color: computedStyle.color || undefined,
        borderColor: computedStyle.borderColor || undefined,
        borderWidth: parseFloat(computedStyle.borderWidth) || undefined,
        borderRadius: parseFloat(computedStyle.borderRadius) || undefined,
        fontSize: parseFloat(computedStyle.fontSize) || undefined,
        fontWeight: computedStyle.fontWeight === 'bold' || parseInt(computedStyle.fontWeight) >= 700 ? 'bold' : 'normal',
        fontStyle: computedStyle.fontStyle === 'italic' ? 'italic' : 'normal',
        textAlign: computedStyle.textAlign as 'left' | 'center' | 'right' || undefined,
        opacity: parseFloat(computedStyle.opacity) || undefined,
        width: parseFloat(computedStyle.width) || undefined,
        height: parseFloat(computedStyle.height) || undefined,
        padding: parseFloat(computedStyle.padding) || undefined,
        margin: parseFloat(computedStyle.margin) || undefined,
      };
    }

    return extractStyles(element);
  }

  private extractAttributes(element: HTMLElement): Record<string, string> {
    const attrs: Record<string, string> = {};

    if (element.id) {
      attrs.id = element.id;
    }

    if (element.className && typeof element.className === 'string') {
      attrs.class = element.className;
    }

    const attrNames = ['type', 'name', 'placeholder', 'value', 'href', 'src', 'alt'];
    for (const name of attrNames) {
      const value = element.getAttribute(name);
      if (value) {
        attrs[name] = value;
      }
    }

    if (element.getAttribute('disabled') !== null) {
      attrs.disabled = 'true';
    }

    if (element.getAttribute('readonly') !== null) {
      attrs.readonly = 'true';
    }

    if (element.getAttribute('required') !== null) {
      attrs.required = 'true';
    }

    return attrs;
  }

  private extractTextContent(element: HTMLElement): string {
    const tagName = element.tagName?.toLowerCase();

    const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];
    if (selfClosingTags.includes(tagName)) {
      return element.getAttribute('alt') || element.getAttribute('value') || element.getAttribute('placeholder') || '';
    }

    const text = element.textContent?.trim() || '';

    const maxTextLength = 100;
    if (text.length > maxTextLength) {
      return text.substring(0, maxTextLength) + '...';
    }

    return text;
  }

  private serializeToString(source: unknown): string {
    if (typeof source === 'string') {
      return source;
    }

    if (source && typeof source === 'object') {
      if (typeof XMLSerializer !== 'undefined') {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(source as Node);
      }
    }

    return String(source);
  }
}

export function parseHTML(htmlString: string): UITree {
  const adapter = new HTMLAdapter();
  return adapter.parse(htmlString);
}

export function convertHTMLToSolarWire(
  htmlString: string,
  options: ConversionOptions = {}
): ConversionResult {
  const tree = parseHTML(htmlString);
  return generateSolarWire(tree, options);
}
