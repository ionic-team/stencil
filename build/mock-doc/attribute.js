import { XLINK_NS } from '../runtime/runtime-constants';
const attrHandler = {
    get(obj, prop) {
        if (prop in obj) {
            return obj[prop];
        }
        if (typeof prop !== 'symbol' && !isNaN(prop)) {
            return obj.__items[prop];
        }
        return undefined;
    },
};
export const createAttributeProxy = (caseInsensitive) => new Proxy(new MockAttributeMap(caseInsensitive), attrHandler);
export class MockAttributeMap {
    constructor(caseInsensitive = false) {
        this.caseInsensitive = caseInsensitive;
        this.__items = [];
    }
    get length() {
        return this.__items.length;
    }
    item(index) {
        return this.__items[index] || null;
    }
    setNamedItem(attr) {
        attr.namespaceURI = null;
        this.setNamedItemNS(attr);
    }
    setNamedItemNS(attr) {
        if (attr != null && attr.value != null) {
            attr.value = String(attr.value);
        }
        const existingAttr = this.__items.find((a) => a.name === attr.name && a.namespaceURI === attr.namespaceURI);
        if (existingAttr != null) {
            existingAttr.value = attr.value;
        }
        else {
            this.__items.push(attr);
        }
    }
    getNamedItem(attrName) {
        if (this.caseInsensitive) {
            attrName = attrName.toLowerCase();
        }
        return this.getNamedItemNS(null, attrName);
    }
    getNamedItemNS(namespaceURI, attrName) {
        namespaceURI = getNamespaceURI(namespaceURI);
        return (this.__items.find((attr) => attr.name === attrName && getNamespaceURI(attr.namespaceURI) === namespaceURI) || null);
    }
    removeNamedItem(attr) {
        this.removeNamedItemNS(attr);
    }
    removeNamedItemNS(attr) {
        for (let i = 0, ii = this.__items.length; i < ii; i++) {
            if (this.__items[i].name === attr.name && this.__items[i].namespaceURI === attr.namespaceURI) {
                this.__items.splice(i, 1);
                break;
            }
        }
    }
    [Symbol.iterator]() {
        let i = 0;
        return {
            next: () => ({
                done: i === this.length,
                value: this.item(i++),
            }),
        };
    }
    get [Symbol.toStringTag]() {
        return 'MockAttributeMap';
    }
}
function getNamespaceURI(namespaceURI) {
    return namespaceURI === XLINK_NS ? null : namespaceURI;
}
export function cloneAttributes(srcAttrs, sortByName = false) {
    const dstAttrs = new MockAttributeMap(srcAttrs.caseInsensitive);
    if (srcAttrs != null) {
        const attrLen = srcAttrs.length;
        if (sortByName && attrLen > 1) {
            const sortedAttrs = [];
            for (let i = 0; i < attrLen; i++) {
                const srcAttr = srcAttrs.item(i);
                const dstAttr = new MockAttr(srcAttr.name, srcAttr.value, srcAttr.namespaceURI);
                sortedAttrs.push(dstAttr);
            }
            sortedAttrs.sort(sortAttributes).forEach((attr) => {
                dstAttrs.setNamedItemNS(attr);
            });
        }
        else {
            for (let i = 0; i < attrLen; i++) {
                const srcAttr = srcAttrs.item(i);
                const dstAttr = new MockAttr(srcAttr.name, srcAttr.value, srcAttr.namespaceURI);
                dstAttrs.setNamedItemNS(dstAttr);
            }
        }
    }
    return dstAttrs;
}
function sortAttributes(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}
export class MockAttr {
    constructor(attrName, attrValue, namespaceURI = null) {
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
//# sourceMappingURL=attribute.js.map