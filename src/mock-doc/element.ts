import { createCustomElement } from './custom-element-registry';
import { MockDocumentFragment } from './document-fragment';
import { MockElement } from './node';
import { URL } from 'url';


export function createElement(ownerDocument: any, tagName: string) {
  tagName = tagName.trim().toLowerCase();

  switch (tagName) {
    case 'a':
      return new MockAnchorElement(ownerDocument);

    case 'button':
      return new MockButtonElement(ownerDocument);

    case 'form':
      return new MockFormElement(ownerDocument);

    case 'img':
      return new MockImgElement(ownerDocument);

    case 'input':
      return new MockInputElement(ownerDocument);

    case 'link':
      return new MockLinkElement(ownerDocument);

    case 'meta':
      return new MockMetaElement(ownerDocument);

    case 'script':
      return new MockScriptElement(ownerDocument);

    case 'template':
      return new MockTemplateElement(ownerDocument);
  }

  if (ownerDocument != null && tagName.includes('-')) {
    const win = ownerDocument.defaultView;
    if (win != null && win.customElements != null) {
      return createCustomElement(win.customElements, ownerDocument, tagName);
    }
  }

  return new MockElement(ownerDocument, tagName);
}


class MockAnchorElement extends MockElement {
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


class MockButtonElement extends MockElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'button');
  }
}
/*@__PURE__*/patchPropAttributes(MockButtonElement.prototype, {
  type: String
});


class MockImgElement extends MockElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'img');
  }

  get src() {
    return fullUrl(this, 'src');
  }
  set src(value: string) {
    this.setAttribute('src', value);
  }
}
/*@__PURE__*/patchPropAttributes(MockImgElement.prototype, {
  height: Number,
  width: Number
});


class MockInputElement extends MockElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'input');
  }
}
/*@__PURE__*/patchPropAttributes(MockInputElement.prototype, {
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
  list: String,
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
  width: Number
});

class MockFormElement extends MockElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'form');
  }
}
/*@__PURE__*/patchPropAttributes(MockFormElement.prototype, {
  name: String
});


class MockLinkElement extends MockElement {
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
/*@__PURE__*/patchPropAttributes(MockLinkElement.prototype, {
  crossorigin: String,
  media: String,
  rel: String,
  type: String
});


class MockMetaElement extends MockElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'meta');
  }
}
/*@__PURE__*/patchPropAttributes(MockMetaElement.prototype, {
  charset: String,
  content: String,
  name: String
});


class MockScriptElement extends MockElement {
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
/*@__PURE__*/patchPropAttributes(MockScriptElement.prototype, {
  type: String
});


export class MockTemplateElement extends MockElement {
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
}


function fullUrl(elm: MockElement, attrName: string) {
  const val = elm.getAttribute(attrName) || '';
  if (elm.ownerDocument != null) {
    const win = elm.ownerDocument.defaultView as Window;
    if (win != null) {
      const loc = win.location;
      if (loc != null) {
        const url = new URL(val, loc.href);
        return url.href;
      }
    }
  }
  return val.replace(/\'|\"/g, '').trim();
}


function patchPropAttributes(prototype: any, attrs: any) {
  Object.keys(attrs).forEach(propName => {
    const attr = attrs[propName];

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
        }
      });

    } else if (attr === Number) {
      Object.defineProperty(prototype, propName, {
        get(this: MockElement) {
          const value = this.getAttribute(propName);
          return (value ? parseInt(value, 10) : 0);
        },
        set(this: MockElement, value: boolean) {
          this.setAttribute(propName, value);
        }
      });

    } else {
      Object.defineProperty(prototype, propName, {
        get(this: MockElement) {
          return this.getAttribute(propName) || '';
        },
        set(this: MockElement, value: boolean) {
          this.setAttribute(propName, value);
        }
      });
    }
  });
}
