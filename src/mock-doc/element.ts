import { cloneAttributes } from './attribute';
import { createCustomElement } from './custom-element-registry';
import { MockCSSStyleSheet, getStyleElementText, setStyleElementText } from './css-style-sheet';
import { MockDocumentFragment } from './document-fragment';
import { MockElement, MockHTMLElement } from './node';

export function createElement(ownerDocument: any, tagName: string) {
  if (typeof tagName !== 'string' || tagName === '' || !/^[a-z0-9-_:]+$/i.test(tagName)) {
    throw new Error(`The tag name provided (${tagName}) is not a valid name.`);
  }
  tagName = tagName.toLowerCase();

  switch (tagName) {
    case 'a':
      return new MockAnchorElement(ownerDocument);

    case 'base':
      return new MockBaseElement(ownerDocument);

    case 'button':
      return new MockButtonElement(ownerDocument);

    case 'canvas':
      return new MockCanvasElement(ownerDocument);

    case 'form':
      return new MockFormElement(ownerDocument);

    case 'img':
      return new MockImageElement(ownerDocument);

    case 'input':
      return new MockInputElement(ownerDocument);

    case 'link':
      return new MockLinkElement(ownerDocument);

    case 'meta':
      return new MockMetaElement(ownerDocument);

    case 'script':
      return new MockScriptElement(ownerDocument);

    case 'style':
      return new MockStyleElement(ownerDocument);

    case 'template':
      return new MockTemplateElement(ownerDocument);

    case 'title':
      return new MockTitleElement(ownerDocument);
  }

  if (ownerDocument != null && tagName.includes('-')) {
    const win = ownerDocument.defaultView;
    if (win != null && win.customElements != null) {
      return createCustomElement(win.customElements, ownerDocument, tagName);
    }
  }

  return new MockHTMLElement(ownerDocument, tagName);
}

export function createElementNS(ownerDocument: any, namespaceURI: string, tagName: string) {
  if (namespaceURI === 'http://www.w3.org/1999/xhtml') {
    return createElement(ownerDocument, tagName);
  } else if (namespaceURI === 'http://www.w3.org/2000/svg') {
    return new MockSVGElement(ownerDocument, tagName);
  } else {
    return new MockElement(ownerDocument, tagName);
  }
}

export class MockAnchorElement extends MockHTMLElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'a');
  }

  get href() {
    return fullUrl(this, 'href');
  }
  set href(value: string) {
    this.setAttribute('href', value);
  }
}

export class MockButtonElement extends MockHTMLElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'button');
  }
}
patchPropAttributes(
  MockButtonElement.prototype,
  {
    type: String,
  },
  {
    type: 'submit',
  }
);

export class MockImageElement extends MockHTMLElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'img');
  }

  get draggable() {
    return this.getAttributeNS(null, 'draggable') !== 'false';
  }
  set draggable(value: boolean) {
    this.setAttributeNS(null, 'draggable', value);
  }

  get src() {
    return fullUrl(this, 'src');
  }
  set src(value: string) {
    this.setAttribute('src', value);
  }
}
patchPropAttributes(MockImageElement.prototype, {
  height: Number,
  width: Number,
});

export class MockInputElement extends MockHTMLElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'input');
  }

  get list() {
    const listId = this.getAttribute('list');
    if (listId) {
      return (this.ownerDocument as Document).getElementById(listId);
    }
    return null;
  }
}

patchPropAttributes(
  MockInputElement.prototype,
  {
    accept: String,
    autocomplete: String,
    autofocus: Boolean,
    capture: String,
    checked: Boolean,
    disabled: Boolean,
    form: String,
    formaction: String,
    formenctype: String,
    formmethod: String,
    formnovalidate: String,
    formtarget: String,
    height: Number,
    inputmode: String,
    max: String,
    maxLength: Number,
    min: String,
    minLength: Number,
    multiple: Boolean,
    name: String,
    pattern: String,
    placeholder: String,
    required: Boolean,
    readOnly: Boolean,
    size: Number,
    spellCheck: Boolean,
    src: String,
    step: String,
    type: String,
    value: String,
    width: Number,
  },
  {
    type: 'text',
  }
);

export class MockFormElement extends MockHTMLElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'form');
  }
}
patchPropAttributes(MockFormElement.prototype, {
  name: String,
});

export class MockLinkElement extends MockHTMLElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'link');
  }

  get href() {
    return fullUrl(this, 'href');
  }
  set href(value: string) {
    this.setAttribute('href', value);
  }
}
patchPropAttributes(MockLinkElement.prototype, {
  crossorigin: String,
  media: String,
  rel: String,
  type: String,
});

export class MockMetaElement extends MockHTMLElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'meta');
  }
}
patchPropAttributes(MockMetaElement.prototype, {
  charset: String,
  content: String,
  name: String,
});

export class MockScriptElement extends MockHTMLElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'script');
  }

  get src() {
    return fullUrl(this, 'src');
  }
  set src(value: string) {
    this.setAttribute('src', value);
  }
}
patchPropAttributes(MockScriptElement.prototype, {
  type: String,
});

export class MockStyleElement extends MockHTMLElement {
  sheet: MockCSSStyleSheet;

  constructor(ownerDocument: any) {
    super(ownerDocument, 'style');
    this.sheet = new MockCSSStyleSheet(this);
  }

  get innerHTML() {
    return getStyleElementText(this);
  }
  set innerHTML(value: string) {
    setStyleElementText(this, value);
  }

  get innerText() {
    return getStyleElementText(this);
  }
  set innerText(value: string) {
    setStyleElementText(this, value);
  }

  get textContent() {
    return getStyleElementText(this);
  }
  set textContent(value: string) {
    setStyleElementText(this, value);
  }
}

export class MockSVGElement extends MockElement {
  // SVGElement properties and methods
  get ownerSVGElement(): SVGSVGElement {
    return null;
  }
  get viewportElement(): SVGElement {
    return null;
  }

  focus() {
    /**/
  }
  onunload() {
    /**/
  }

  // SVGGeometryElement properties and methods
  get pathLength(): number {
    return 0;
  }

  isPointInFill(_pt: DOMPoint): boolean {
    return false;
  }
  isPointInStroke(_pt: DOMPoint): boolean {
    return false;
  }
  getTotalLength(): number {
    return 0;
  }
}

export class MockBaseElement extends MockHTMLElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'base');
  }

  get href() {
    return fullUrl(this, 'href');
  }
  set href(value: string) {
    this.setAttribute('href', value);
  }
}

export class MockTemplateElement extends MockHTMLElement {
  content: MockDocumentFragment;

  constructor(ownerDocument: any) {
    super(ownerDocument, 'template');
    this.content = new MockDocumentFragment(ownerDocument);
  }

  get innerHTML() {
    return this.content.innerHTML;
  }
  set innerHTML(html: string) {
    this.content.innerHTML = html;
  }

  cloneNode(deep?: boolean) {
    const cloned = new MockTemplateElement(null);
    cloned.attributes = cloneAttributes(this.attributes);

    const styleCssText = this.getAttribute('style');
    if (styleCssText != null && styleCssText.length > 0) {
      cloned.setAttribute('style', styleCssText);
    }

    cloned.content = this.content.cloneNode(deep);

    if (deep) {
      for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
        const clonedChildNode = this.childNodes[i].cloneNode(true);
        cloned.appendChild(clonedChildNode);
      }
    }

    return cloned;
  }
}

export class MockTitleElement extends MockHTMLElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'title');
  }

  get text() {
    return this.textContent;
  }
  set text(value: string) {
    this.textContent = value;
  }
}

export class MockCanvasElement extends MockHTMLElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'canvas');
  }
  getContext() {
    return {
      fillRect() {
        return;
      },
      clearRect() {},
      getImageData: function (_: number, __: number, w: number, h: number) {
        return {
          data: new Array(w * h * 4),
        };
      },
      putImageData() {},
      createImageData: function (): any[] {
        return [];
      },
      setTransform() {},
      drawImage() {},
      save() {},
      fillText() {},
      restore() {},
      beginPath() {},
      moveTo() {},
      lineTo() {},
      closePath() {},
      stroke() {},
      translate() {},
      scale() {},
      rotate() {},
      arc() {},
      fill() {},
      measureText() {
        return { width: 0 };
      },
      transform() {},
      rect() {},
      clip() {},
    };
  }
}

function fullUrl(elm: MockElement, attrName: string) {
  const val = elm.getAttribute(attrName) || '';
  if (elm.ownerDocument != null) {
    const win = elm.ownerDocument.defaultView as Window;
    if (win != null) {
      const loc = win.location;
      if (loc != null) {
        try {
          const url = new URL(val, loc.href);
          return url.href;
        } catch (e) {}
      }
    }
  }
  return val.replace(/\'|\"/g, '').trim();
}

function patchPropAttributes(prototype: any, attrs: any, defaults: any = {}) {
  Object.keys(attrs).forEach((propName) => {
    const attr = attrs[propName];
    const defaultValue = defaults[propName];

    if (attr === Boolean) {
      Object.defineProperty(prototype, propName, {
        get(this: MockElement) {
          return this.hasAttribute(propName);
        },
        set(this: MockElement, value: boolean) {
          if (value) {
            this.setAttribute(propName, '');
          } else {
            this.removeAttribute(propName);
          }
        },
      });
    } else if (attr === Number) {
      Object.defineProperty(prototype, propName, {
        get(this: MockElement) {
          const value = this.getAttribute(propName);
          return value ? parseInt(value, 10) : defaultValue === undefined ? 0 : defaultValue;
        },
        set(this: MockElement, value: boolean) {
          this.setAttribute(propName, value);
        },
      });
    } else {
      Object.defineProperty(prototype, propName, {
        get(this: MockElement) {
          return this.hasAttribute(propName) ? this.getAttribute(propName) : defaultValue || '';
        },
        set(this: MockElement, value: boolean) {
          this.setAttribute(propName, value);
        },
      });
    }
  });
}

MockElement.prototype.cloneNode = function (this: MockElement, deep?: boolean) {
  // because we're creating elements, which extending specific HTML base classes there
  // is a MockElement circular reference that bundling has trouble dealing with so
  // the fix is to add cloneNode() to MockElement's prototype after the HTML classes
  const cloned = createElement(this.ownerDocument, this.nodeName);
  cloned.attributes = cloneAttributes(this.attributes);

  const styleCssText = this.getAttribute('style');
  if (styleCssText != null && styleCssText.length > 0) {
    cloned.setAttribute('style', styleCssText);
  }

  if (deep) {
    for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
      const clonedChildNode = this.childNodes[i].cloneNode(true);
      cloned.appendChild(clonedChildNode);
    }
  }

  return cloned;
};
