export class MockEvent {
    constructor(type, eventInitDict) {
        this.bubbles = false;
        this.cancelBubble = false;
        this.cancelable = false;
        this.composed = false;
        this.currentTarget = null;
        this.defaultPrevented = false;
        this.srcElement = null;
        this.target = null;
        if (typeof type !== 'string') {
            throw new Error(`Event type required`);
        }
        this.type = type;
        this.timeStamp = Date.now();
        if (eventInitDict != null) {
            Object.assign(this, eventInitDict);
        }
    }
    preventDefault() {
        this.defaultPrevented = true;
    }
    stopPropagation() {
        this.cancelBubble = true;
    }
    stopImmediatePropagation() {
        this.cancelBubble = true;
    }
    composedPath() {
        const composedPath = [];
        let currentElement = this.target;
        while (currentElement) {
            composedPath.push(currentElement);
            if (!currentElement.parentElement && currentElement.nodeName === "#document" /* NODE_NAMES.DOCUMENT_NODE */) {
                // the current element doesn't have a parent, but we've detected it's our root document node. push the window
                // object associated with the document onto the path
                composedPath.push(currentElement.defaultView);
                break;
            }
            currentElement = currentElement.parentElement;
        }
        return composedPath;
    }
}
export class MockCustomEvent extends MockEvent {
    constructor(type, customEventInitDic) {
        super(type);
        this.detail = null;
        if (customEventInitDic != null) {
            Object.assign(this, customEventInitDic);
        }
    }
}
export class MockKeyboardEvent extends MockEvent {
    constructor(type, keyboardEventInitDic) {
        super(type);
        this.code = '';
        this.key = '';
        this.altKey = false;
        this.ctrlKey = false;
        this.metaKey = false;
        this.shiftKey = false;
        this.location = 0;
        this.repeat = false;
        if (keyboardEventInitDic != null) {
            Object.assign(this, keyboardEventInitDic);
        }
    }
}
export class MockMouseEvent extends MockEvent {
    constructor(type, mouseEventInitDic) {
        super(type);
        this.screenX = 0;
        this.screenY = 0;
        this.clientX = 0;
        this.clientY = 0;
        this.ctrlKey = false;
        this.shiftKey = false;
        this.altKey = false;
        this.metaKey = false;
        this.button = 0;
        this.buttons = 0;
        this.relatedTarget = null;
        if (mouseEventInitDic != null) {
            Object.assign(this, mouseEventInitDic);
        }
    }
}
export class MockUIEvent extends MockEvent {
    constructor(type, uiEventInitDic) {
        super(type);
        this.detail = null;
        this.view = null;
        if (uiEventInitDic != null) {
            Object.assign(this, uiEventInitDic);
        }
    }
}
export class MockFocusEvent extends MockUIEvent {
    constructor(type, focusEventInitDic) {
        super(type);
        this.relatedTarget = null;
        if (focusEventInitDic != null) {
            Object.assign(this, focusEventInitDic);
        }
    }
}
export class MockEventListener {
    constructor(type, handler) {
        this.type = type;
        this.handler = handler;
    }
}
export function addEventListener(elm, type, handler) {
    const target = elm;
    if (target.__listeners == null) {
        target.__listeners = [];
    }
    target.__listeners.push(new MockEventListener(type, handler));
}
export function removeEventListener(elm, type, handler) {
    const target = elm;
    if (target != null && Array.isArray(target.__listeners) === true) {
        const elmListener = target.__listeners.find((e) => e.type === type && e.handler === handler);
        if (elmListener != null) {
            const index = target.__listeners.indexOf(elmListener);
            target.__listeners.splice(index, 1);
        }
    }
}
export function resetEventListeners(target) {
    if (target != null && target.__listeners != null) {
        target.__listeners = null;
    }
}
function triggerEventListener(elm, ev) {
    if (elm == null || ev.cancelBubble === true) {
        return;
    }
    const target = elm;
    ev.currentTarget = elm;
    if (Array.isArray(target.__listeners) === true) {
        const listeners = target.__listeners.filter((e) => e.type === ev.type);
        listeners.forEach((listener) => {
            try {
                listener.handler.call(target, ev);
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    if (ev.bubbles === false) {
        return;
    }
    if (elm.nodeName === "#document" /* NODE_NAMES.DOCUMENT_NODE */) {
        triggerEventListener(elm.defaultView, ev);
    }
    else {
        triggerEventListener(elm.parentElement, ev);
    }
}
export function dispatchEvent(currentTarget, ev) {
    ev.target = currentTarget;
    triggerEventListener(currentTarget, ev);
    return true;
}
//# sourceMappingURL=event.js.map