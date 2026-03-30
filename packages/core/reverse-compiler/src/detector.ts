import { UIElementType, UIElement, ElementDetectorResult } from './types';

const BUTTON_TAGS = ['button', 'a'];
const INPUT_TAGS = ['input', 'textarea', 'select'];
const TEXT_TAGS = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label', 'strong', 'em', 'b', 'i'];
const CONTAINER_TAGS = ['div', 'section', 'article', 'main', 'aside', 'header', 'footer', 'nav', 'form', 'ul', 'ol', 'li', 'body', 'html'];
const TABLE_TAGS = ['table'];
const TABLE_ROW_TAGS = ['tr'];
const TABLE_CELL_TAGS = ['td', 'th'];
const IMAGE_TAGS = ['img'];
const DIVIDER_TAGS = ['hr'];

const BUTTON_ROLES = ['button', 'link'];
const INPUT_ROLES = ['textbox', 'checkbox', 'radio', 'combobox', 'searchbox'];

const BUTTON_TYPES = ['button', 'submit', 'reset'];

export function detectElementType(element: unknown): ElementDetectorResult {
  if (!element || typeof element !== 'object') {
    return { type: 'unknown', confidence: 0, reason: 'Invalid element' };
  }

  const el = element as Record<string, unknown>;
  const tagName = getStringAttribute(el, 'tagName')?.toLowerCase();
  const role = getStringAttribute(el, 'role')?.toLowerCase();
  const type = getStringAttribute(el, 'type')?.toLowerCase();
  const inputType = getStringAttribute(el, 'inputType')?.toLowerCase();

  if (isTable(tagName, el)) {
    return { type: 'table', confidence: 0.95, reason: 'table tag detected' };
  }

  if (isTableRow(tagName)) {
    return { type: 'table-row', confidence: 0.95, reason: 'tr tag detected' };
  }

  if (isTableCell(tagName)) {
    return { type: 'table-cell', confidence: 0.95, reason: 'td/th tag detected' };
  }

  if (isButton(tagName, role, type, el)) {
    return { type: 'button', confidence: 0.9, reason: 'button element detected' };
  }

  if (isCheckbox(type, inputType, role)) {
    return { type: 'checkbox', confidence: 0.9, reason: 'checkbox input detected' };
  }

  if (isRadio(type, inputType, role)) {
    return { type: 'radio', confidence: 0.9, reason: 'radio input detected' };
  }

  if (isSelect(tagName, role)) {
    return { type: 'select', confidence: 0.9, reason: 'select element detected' };
  }

  if (isTextarea(tagName, role)) {
    return { type: 'textarea', confidence: 0.9, reason: 'textarea element detected' };
  }

  if (isInput(tagName, role, type)) {
    return { type: 'input', confidence: 0.85, reason: 'input element detected' };
  }

  if (isImage(tagName, el)) {
    return { type: 'image', confidence: 0.9, reason: 'img tag detected' };
  }

  if (isDivider(tagName)) {
    return { type: 'divider', confidence: 0.9, reason: 'hr tag detected' };
  }

  if (isLink(tagName, el)) {
    return { type: 'link', confidence: 0.85, reason: 'anchor tag detected' };
  }

  if (isContainer(tagName, el)) {
    return { type: 'container', confidence: 0.7, reason: 'container element detected' };
  }

  if (isText(tagName, el)) {
    return { type: 'text', confidence: 0.8, reason: 'text element detected' };
  }

  return { type: 'unknown', confidence: 0.3, reason: 'Could not determine element type' };
}

function getStringAttribute(obj: Record<string, unknown>, key: string): string | undefined {
  const value = obj[key];
  return typeof value === 'string' ? value : undefined;
}

function getBooleanAttribute(obj: Record<string, unknown>, key: string): boolean {
  const value = obj[key];
  return value === true || value === 'true' || value === '';
}

function hasChildren(el: Record<string, unknown>): boolean {
  const children = el.children || el.childNodes || el.child;
  return Array.isArray(children) && children.length > 0;
}

function hasTextContent(el: Record<string, unknown>): boolean {
  const text = el.text || el.textContent || el.innerText || el.value;
  return typeof text === 'string' && text.trim().length > 0;
}

function isButton(
  tagName: string | undefined,
  role: string | undefined,
  type: string | undefined,
  el: Record<string, unknown>
): boolean {
  if (tagName && BUTTON_TAGS.includes(tagName)) {
    if (tagName === 'a') {
      return hasTextContent(el) && !hasChildren(el);
    }
    return true;
  }

  if (role && BUTTON_ROLES.includes(role)) {
    return true;
  }

  if (type && BUTTON_TYPES.includes(type)) {
    return true;
  }

  const onClick = el.onclick || el.onClick || el['@click'];
  if (onClick && hasTextContent(el) && !hasChildren(el)) {
    return true;
  }

  return false;
}

function isInput(
  tagName: string | undefined,
  role: string | undefined,
  type: string | undefined
): boolean {
  if (tagName && INPUT_TAGS.includes(tagName)) {
    if (tagName === 'input') {
      return !isCheckbox(type, undefined, role) && !isRadio(type, undefined, role);
    }
    return true;
  }

  if (role && INPUT_ROLES.includes(role) && !isCheckbox(undefined, undefined, role) && !isRadio(undefined, undefined, role)) {
    return true;
  }

  return false;
}

function isCheckbox(
  type: string | undefined,
  inputType: string | undefined,
  role: string | undefined
): boolean {
  return type === 'checkbox' || inputType === 'checkbox' || role === 'checkbox';
}

function isRadio(
  type: string | undefined,
  inputType: string | undefined,
  role: string | undefined
): boolean {
  return type === 'radio' || inputType === 'radio' || role === 'radio';
}

function isSelect(tagName: string | undefined, role: string | undefined): boolean {
  return tagName === 'select' || role === 'combobox' || role === 'listbox';
}

function isTextarea(tagName: string | undefined, role: string | undefined): boolean {
  return tagName === 'textarea';
}

function isImage(tagName: string | undefined, el: Record<string, unknown>): boolean {
  if (tagName && IMAGE_TAGS.includes(tagName)) {
    return true;
  }

  if (tagName === 'svg') {
    return true;
  }

  return false;
}

function isDivider(tagName: string | undefined): boolean {
  return tagName ? DIVIDER_TAGS.includes(tagName) : false;
}

function isLink(tagName: string | undefined, el: Record<string, unknown>): boolean {
  if (tagName === 'a') {
    const href = el.href || el['xlink:href'];
    return href !== undefined && href !== '' && href !== null;
  }
  return false;
}

function isText(tagName: string | undefined, el: Record<string, unknown>): boolean {
  if (tagName && TEXT_TAGS.includes(tagName)) {
    return true;
  }

  if (!hasChildren(el) && hasTextContent(el)) {
    const hasInteractiveAttrs = el.onclick || el.onClick || el.href;
    return !hasInteractiveAttrs;
  }

  return false;
}

function isContainer(tagName: string | undefined, el: Record<string, unknown>): boolean {
  if (tagName && CONTAINER_TAGS.includes(tagName)) {
    return true;
  }

  if (hasChildren(el)) {
    const children = (el.children || el.childNodes || el.child) as unknown[];
    return children.length > 1;
  }

  return false;
}

function isTable(tagName: string | undefined, el: Record<string, unknown>): boolean {
  if (tagName && TABLE_TAGS.includes(tagName)) {
    return true;
  }

  if (hasChildren(el)) {
    const children = (el.children || el.childNodes || el.child) as unknown[];
    const hasRows = children.some((child: unknown) => {
      const childTag = (child as Record<string, unknown>)?.tagName;
      const tagStr = typeof childTag === 'string' ? childTag.toLowerCase() : '';
      return tagStr === 'tr' || tagStr === 'thead' || tagStr === 'tbody';
    });
    return hasRows;
  }

  return false;
}

function isTableRow(tagName: string | undefined): boolean {
  return tagName ? TABLE_ROW_TAGS.includes(tagName) : false;
}

function isTableCell(tagName: string | undefined): boolean {
  return tagName ? TABLE_CELL_TAGS.includes(tagName) : false;
}

export function detectAllElements(tree: UIElement): UIElement[] {
  const results: UIElement[] = [];

  function traverse(element: UIElement) {
    const detection = detectElementType(element);
    element.type = detection.type;
    results.push(element);

    if (element.children && element.children.length > 0) {
      element.children.forEach(traverse);
    }
  }

  traverse(tree);
  return results;
}
