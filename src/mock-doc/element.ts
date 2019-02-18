import { MockDocumentFragment } from './document-fragment';
import { MockElement } from './node';
import { creatCustomElement } from './custom-element-registry';


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
      return creatCustomElement(win.customElements, ownerDocument, tagName);
    }
  }

  return new MockElement(ownerDocument, tagName);
}


class MockAnchorElement extends MockElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'a');
  }
}
patchPropAttributes(MockAnchorElement.prototype, {
  href: String
});


class MockButtonElement extends MockElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'button');
  }
}
patchPropAttributes(MockButtonElement.prototype, {
  type: String
});


class MockImgElement extends MockElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'img');
  }
}
patchPropAttributes(MockImgElement.prototype, {
  height: Number,
  src: String,
  width: Number
});


class MockInputElement extends MockElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'input');
  }
}
patchPropAttributes(MockInputElement.prototype, {
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
patchPropAttributes(MockFormElement.prototype, {
  name: String
});


class MockLinkElement extends MockElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'link');
  }
}
patchPropAttributes(MockLinkElement.prototype, {
  crossorigin: String,
  href: String,
  media: String,
  rel: String,
  type: String
});


class MockMetaElement extends MockElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'meta');
  }
}
patchPropAttributes(MockMetaElement.prototype, {
  charset: String,
  content: String,
  name: String
});


class MockScriptElement extends MockElement {
  constructor(ownerDocument: any) {
    super(ownerDocument, 'script');
  }
}
patchPropAttributes(MockScriptElement.prototype, {
  src: String,
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
