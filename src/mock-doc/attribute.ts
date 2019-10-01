import { XLINK_NS } from '../runtime/runtime-constants';


export class MockAttributeMap {
  items: MockAttr[] = [];

  constructor(
    public caseInsensitive = false
  ) {}

  get length() {
    return this.items.length;
  }

  item(index: number) {
    return this.items[index] || null;
  }

  setNamedItem(attr: MockAttr) {
    attr.namespaceURI = null;
    this.setNamedItemNS(attr);
  }

  setNamedItemNS(attr: MockAttr) {
    if (attr != null && attr.value != null) {
      attr.value = String(attr.value);
    }

    const existingAttr = this.items.find(a => a.name === attr.name && a.namespaceURI === attr.namespaceURI);
    if (existingAttr != null) {
      existingAttr.value = attr.value;
    } else {
      this.items.push(attr);
    }
  }

  getNamedItem(attrName: string) {
    if (this.caseInsensitive) {
      attrName = attrName.toLowerCase();
    }
    return this.getNamedItemNS(null, attrName);
  }

  getNamedItemNS(namespaceURI: string, attrName: string) {
    namespaceURI = getNamespaceURI(namespaceURI);
    return this.items.find(attr => attr.name === attrName && getNamespaceURI(attr.namespaceURI) === namespaceURI) || null;
  }

  removeNamedItem(attr: MockAttr) {
    this.removeNamedItemNS(attr);
  }

  removeNamedItemNS(attr: MockAttr) {
    for (let i = 0, ii = this.items.length; i < ii; i++) {
      if (this.items[i].name === attr.name && this.items[i].namespaceURI === attr.namespaceURI) {
        this.items.splice(i, 1);
        break;
      }
    }
  }
}

function getNamespaceURI(namespaceURI: string) {
  return namespaceURI === XLINK_NS ? null : namespaceURI;
}

export function cloneAttributes(srcAttrs: MockAttributeMap, sortByName = false) {
  const dstAttrs = new MockAttributeMap(srcAttrs.caseInsensitive);
  if (srcAttrs != null) {
    const attrLen = srcAttrs.length;

    if (sortByName && attrLen > 1) {
      const sortedAttrs: MockAttr[] = [];
      for (let i = 0; i < attrLen; i++) {
        const srcAttr = srcAttrs.item(i);
        const dstAttr = new MockAttr(srcAttr.name, srcAttr.value, srcAttr.namespaceURI);
        sortedAttrs.push(dstAttr);
      }

      sortedAttrs.sort(sortAttributes).forEach(attr => {
        dstAttrs.setNamedItemNS(attr);
      });

    } else {
      for (let i = 0; i < attrLen; i++) {
        const srcAttr = srcAttrs.item(i);
        const dstAttr = new MockAttr(srcAttr.name, srcAttr.value, srcAttr.namespaceURI);
        dstAttrs.setNamedItemNS(dstAttr);
      }
    }

  }
  return dstAttrs;
}

function sortAttributes(a: MockAttr, b: MockAttr) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}


export class MockAttr {
  private _name: string;
  private _value: string;
  private _namespaceURI: string;

  constructor(attrName: string, attrValue: string, namespaceURI: string = null) {
    this._name = attrName;
    this._value = String(attrValue);
    this._namespaceURI = namespaceURI;
  }

  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }

  get value() {
    return this._value;
  }
  set value(value) {
    this._value = String(value);
  }

  get nodeName() {
    return this._name;
  }
  set nodeName(value) {
    this._name = value;
  }

  get nodeValue() {
    return this._value;
  }
  set nodeValue(value) {
    this._value = String(value);
  }

  get namespaceURI() {
    return this._namespaceURI;
  }
  set namespaceURI(namespaceURI) {
    this._namespaceURI = namespaceURI;
  }
}
