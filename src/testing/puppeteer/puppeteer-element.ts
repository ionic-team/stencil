import * as d from '../../declarations';
import * as pd from './puppeteer-declarations';
import * as puppeteer from 'puppeteer';
import { EventSpy, addE2EListener } from './puppeteer-events';
import { MockElement } from '../mock-doc/node';
import { parseFragment } from '../parse-html';


export class E2EElement extends MockElement implements pd.E2EElementInternal {
  private _queuedActions: ElementAction[] = [];

  constructor(private _page: pd.E2EPageInternal, private _elmHandle: puppeteer.ElementHandle) {
    super(null, null);
  }

  callMethod(methodName: string, ...methodArgs: any[]) {
    this._queuedActions.push({
      methodName: methodName,
      methodArgs: methodArgs
    });

    return this.e2eRunActions();
  }

  triggerEvent(eventName: string, eventInitDict?: d.EventInitDict) {
    this._queuedActions.push({
      eventName: eventName,
      eventInitDict: eventInitDict
    });
  }

  async spyOnEvent(eventName: string) {
    const eventSpy = new EventSpy(eventName);

    await addE2EListener(this._page, this._elmHandle, eventName, (ev: d.SerializedEvent) => {
      eventSpy.events.push(ev);
    });

    return eventSpy;
  }

  async click(options?: puppeteer.ClickOptions) {
    return this._elmHandle.click(options);
  }

  async focus() {
    return this._elmHandle.focus();
  }

  async hover() {
    return this._elmHandle.hover();
  }

  async isIntersectingViewport() {
    return this._elmHandle.isIntersectingViewport();
  }

  async press(key: string, options?: { text?: string, delay?: number }) {
    return this._elmHandle.press(key, options);
  }

  async tap() {
    return this._elmHandle.tap();
  }

  async type(text: string, options?: { delay: number }) {
    return this._elmHandle.type(text, options);
  }

  async getProperty(propertyName: string) {
    this._validate();

    const executionContext = this._elmHandle.executionContext();

    const propValue = await executionContext.evaluate((elm: any, propertyName: string) => {
      return elm[propertyName];
    }, this._elmHandle, propertyName);

    return propValue;
  }

  setProperty(propertyName: string, value: any) {
    this._queuedActions.push({
      setPropertyName: propertyName,
      setPropertyValue: value
    });
  }

  getAttribute(name: string) {
    this._validate();
    return super.getAttribute(name);
  }

  setAttribute(name: string, value: any) {
    this._queuedActions.push({
      setAttributeName: name,
      setAttributeValue: value
    });
  }

  get classList() {
    const api: any = {
      add: (...classNames: string[]) => {
        classNames.forEach(className => {
          this._queuedActions.push({
            classAdd: className
          });
        });
      },
      remove: (...classNames: string[]) => {
        classNames.forEach(className => {
          this._queuedActions.push({
            classRemove: className
          });
        });
      },
      toggle: (className: string) => {
        this._queuedActions.push({
          classToggle: className
        });
      },
      contains: (className: string) => {
        this._validate();
        return this.className.split(' ').includes(className);
      }
    };
    return api;
  }

  get id() {
    this._validate();
    return super.id;
  }

  set id(value: string) {
    this._queuedActions.push({
      setPropertyName: 'id',
      setPropertyValue: value
    });
  }

  get innerHTML() {
    this._validate();
    return super.innerHTML;
  }

  set innerHTML(value: string) {
    this._queuedActions.push({
      setPropertyName: 'innerHTML',
      setPropertyValue: value
    });
  }

  get innerText() {
    this._validate();
    return super.innerText;
  }

  set innerText(value: string) {
    this._queuedActions.push({
      setPropertyName: 'innerText',
      setPropertyValue: value
    });
  }

  get nodeValue() {
    this._validate();
    return super.nodeValue;
  }

  set nodeValue(value: string) {
    this._queuedActions.push({
      setPropertyName: 'nodeValue',
      setPropertyValue: value
    });
  }

  get outerHTML() {
    this._validate();
    return super.outerHTML;
  }

  set outerHTML(_value: string) {
    throw new Error(`outerHTML is read only`);
  }

  get textContent() {
    this._validate();
    return super.textContent;
  }

  set textContent(value: string) {
    this._queuedActions.push({
      setPropertyName: 'textContent',
      setPropertyValue: value
    });
  }

  async e2eRunActions() {
    if (this._queuedActions.length === 0) {
      return;
    }

    const executionContext = this._elmHandle.executionContext();

    const rtn = await executionContext.evaluate((elm: HTMLElement, queuedActions: ElementAction[]) => {
      // BROWSER CONTEXT
      // cannot use async/await in here cuz typescript transpiles it in the node context
      return (elm as any).componentOnReady().then(() => {
        let rtn: any = null;

        queuedActions.forEach(queuedAction => {
          if (queuedAction.methodName) {
            rtn = (elm as any)[queuedAction.methodName].apply(elm, queuedAction.methodArgs);

          } else if (queuedAction.setPropertyName) {
            (elm as any)[queuedAction.setPropertyName] = queuedAction.setPropertyValue;

          } else if (queuedAction.setAttributeName) {
            elm.setAttribute(queuedAction.setAttributeName, queuedAction.setAttributeValue);

          } else if (queuedAction.classAdd) {
            elm.classList.add(queuedAction.classAdd);

          } else if (queuedAction.classRemove) {
            elm.classList.remove(queuedAction.classRemove);

          } else if (queuedAction.classToggle) {
            elm.classList.toggle(queuedAction.classToggle);

          } else if (queuedAction.eventName) {
            const eventInitDict = queuedAction.eventInitDict || {};

            if (typeof eventInitDict.bubbles !== 'boolean') {
              eventInitDict.bubbles = true;
            }

            if (typeof eventInitDict.cancelable !== 'boolean') {
              eventInitDict.cancelable = true;
            }

            if (typeof eventInitDict.composed !== 'boolean') {
              eventInitDict.composed = true;
            }

            const ev = new CustomEvent(queuedAction.eventName, eventInitDict);
            elm.dispatchEvent(ev);
          }
        });

        if (rtn && typeof rtn.then === 'function') {
          return rtn.then((value: any) => {
            return value;
          });
        }

        return rtn;
      });

    }, this._elmHandle, this._queuedActions);

    this._queuedActions.length = 0;

    return rtn;
  }

  async e2eSync() {
    const executionContext = this._elmHandle.executionContext();

    const outerHTML = await executionContext.evaluate((elm: HTMLElement) => {

      return elm.outerHTML;

    }, this._elmHandle);

    const frag = parseFragment(outerHTML);

    const rootElm = frag.firstElementChild;

    this.nodeName = rootElm.nodeName;
    this.attributes = rootElm.attributes.cloneAttributes();

    for (let i = this.childNodes.length - 1; i >= 0; i--) {
      this.removeChild(this.childNodes[i]);
    }

    while (rootElm.childNodes.length > 0) {
      this.appendChild(rootElm.childNodes[0]);
    }
  }

  private _validate() {
    if (this._queuedActions.length > 0) {
      throw new Error(`await page.waitForChanges() must be called before reading element information`);
    }
  }

  async e2eDispose() {
    if (this._elmHandle) {
      await this._elmHandle.dispose();
      this._elmHandle = null;
    }

    const index = this._page._elements.indexOf(this);
    if (index > -1) {
      this._page._elements.splice(index, 1);
    }

    this._page = null;
  }

}


interface ElementAction {
  classAdd?: string;
  classRemove?: string;
  classToggle?: string;
  eventName?: string;
  eventInitDict?: d.EventInitDict;
  methodName?: string;
  methodArgs?: any[];
  setAttributeName?: string;
  setAttributeValue?: any;
  setPropertyName?: string;
  setPropertyValue?: any;
}
