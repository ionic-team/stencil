

export class MockAttributeMap {
  items: MockAttr[] = [];

  get length() {
    return this.items.length;
  }

  cloneAttributes() {
    const attributes = new MockAttributeMap();
    attributes.items = this.items.map(srcAttr => {
      const dstAttr = new MockAttr();
      dstAttr.name = srcAttr.name;
      dstAttr.value = srcAttr.value;
      dstAttr.namespaceURI = srcAttr.namespaceURI;
      return dstAttr;
    });
    return attributes;
  }

  getNamedItem(name: string) {
    name = name.toLowerCase();
    return this.items.find(attr => attr.name === name && (attr.namespaceURI == null || attr.namespaceURI === 'http://www.w3.org/1999/xlink')) || null;
  }

  setNamedItem(attr: MockAttr) {
    attr.namespaceURI = null;
    this.setNamedItemNS(attr);
  }

  removeNamedItem(attr: MockAttr) {
    this.removeNamedItemNS(attr);
  }

  item(index: number) {
    return this.items[index] || null;
  }

  getNamedItemNS(namespaceURI: string, name: string) {
    if (namespaceURI == null || namespaceURI === 'http://www.w3.org/1999/xlink') {
      return this.getNamedItem(name);
    }

    name = name.toLowerCase();
    return this.items.find(attr => attr.name === name && attr.namespaceURI === namespaceURI) || null;
  }

  setNamedItemNS(attr: MockAttr) {
    if (attr && attr.value != null) {
      attr.value = String(attr.value);
    }

    const existingAttr = this.items.find(a => a.name.toLowerCase() === attr.name.toLowerCase() && a.namespaceURI === attr.namespaceURI);
    if (existingAttr) {
      existingAttr.value = attr.value;
    } else {
      this.items.push(attr);
    }
  }

  removeNamedItemNS(attr: MockAttr) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name.toLowerCase() === attr.name && this.items[i].namespaceURI === attr.namespaceURI) {
        this.items.splice(i, 1);
        break;
      }
    }
  }
}


export class MockAttr {
  private _name: string;
  private _value = '';
  private _namespaceURI: string;

  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value.toLowerCase();
  }

  get value() {
    return this._value;
  }
  set value(value) {
    this._value = String(value || '');
  }

  get namespaceURI() {
    return this._namespaceURI;
  }
  set namespaceURI(value) {
    this._namespaceURI = (value != null) ? value.toLowerCase() : value;
  }
}
