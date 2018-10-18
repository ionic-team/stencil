import * as d from '../../declarations';
import * as pd from './puppeteer-declarations';
import * as puppeteer from 'puppeteer';
import { EventSpy, addE2EListener } from './puppeteer-events';
import { find, findAll } from './puppeteer-find';
import { MockElement, parseHtmlToFragment } from '@stencil/core/mock-doc';


export class E2EElement extends MockElement implements pd.E2EElementInternal {
  private _queuedActions: ElementAction[] = [];

  constructor(private _page: pd.E2EPageInternal, private _elmHandle: puppeteer.ElementHandle) {
    super(null, null);
    _page._e2eElements.push(this);
  }

  find(selector: string) {
    return find(this._page, this._elmHandle, selector);
  }

  findAll(selector: string) {
    return findAll(this._page, this._elmHandle, selector);
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
    await this._elmHandle.click(options);
    await this._page.waitForChanges();
  }

  async focus() {
    await this._elmHandle.focus();
    await this._page.waitForChanges();
  }

  async hover() {
    await this._elmHandle.hover();
    await this._page.waitForChanges();
  }

  async isVisible() {
    this._validate();

    let isVisible = false;

    try {
      const executionContext = this._elmHandle.executionContext();

      isVisible = await executionContext.evaluate((elm: d.HostElement) => {

        return new Promise<boolean>(resolve => {

          window.requestAnimationFrame(() => {
            if (elm.isConnected) {
              const style = window.getComputedStyle(elm);
              const isVisible = !!style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';

              if (isVisible) {
                window.requestAnimationFrame(() => {
                  elm.clientWidth;
                  resolve(true);
                });

              } else {
                resolve(false);
              }

            } else {
              resolve(false);
            }
          });

        });

      }, this._elmHandle);

    } catch (e) {}

    return isVisible;
  }

  waitForVisible() {
    return new Promise<void>((resolve, reject) => {
      let resolveTmr: any;

      const rejectTmr = setTimeout(() => {
        clearTimeout(resolveTmr);
        reject(`waitForVisible timed out`);
      }, 15000);

      const checkVisible = async () => {
        const isVisible = await this.isVisible();
        if (isVisible) {
          clearTimeout(rejectTmr);
          resolve();
        } else {
          resolveTmr = setTimeout(checkVisible, 10);
        }
      };

      checkVisible();
    });
  }

  waitForNotVisible() {
    return new Promise<void>((resolve, reject) => {
      let resolveTmr: any;

      const rejectTmr = setTimeout(() => {
        clearTimeout(resolveTmr);
        reject(`waitForNotVisible timed out`);
      }, 15000);

      const checkVisible = async () => {
        const isVisible = await this.isVisible();
        if (isVisible) {
          resolveTmr = setTimeout(checkVisible, 10);
        } else {
          clearTimeout(rejectTmr);
          resolve();
        }
      };

      checkVisible();
    });
  }

  isIntersectingViewport() {
    return this._elmHandle.isIntersectingViewport();
  }

  async press(key: string, options?: { text?: string, delay?: number }) {
    await this._elmHandle.press(key, options);
    await this._page.waitForChanges();
  }

  async tap() {
    await this._elmHandle.tap();
    await this._page.waitForChanges();
  }

  async type(text: string, options?: { delay: number }) {
    await this._elmHandle.type(text, options);
    await this._page.waitForChanges();
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

  get className() {
    this._validate();
    return super.className;
  }

  set className(value: string) {
    this._queuedActions.push({
      setPropertyName: 'className',
      setPropertyValue: value
    });
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

  set outerHTML(_: any) {
    throw new Error(`outerHTML is read-only`);
  }

  private _shadowRoot: DocumentFragment = null;
  get shadowRoot() {
    this._validate();
    return this._shadowRoot;
  }

  set shadowRoot(_: any) {
    throw new Error(`shadowRoot is read-only`);
  }

  get tabIndex() {
    this._validate();
    return super.tabIndex;
  }

  set tabIndex(value: number) {
    this._queuedActions.push({
      setPropertyName: 'tabIndex',
      setPropertyValue: value
    });
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

  get title() {
    this._validate();
    return super.title;
  }

  set title(value: string) {
    this._queuedActions.push({
      setPropertyName: 'title',
      setPropertyValue: value
    });
  }

  async getComputedStyle(pseudoElt?: string | null) {
    const style = await this._page.evaluate((elm: HTMLElement, pseudoElt: string) => {
      const rtn: any = {};

      const computedStyle = window.getComputedStyle(elm, pseudoElt);

      const keys = Object.keys(computedStyle);

      keys.forEach(key => {
        if (isNaN(key as any)) {
          const value = computedStyle[key as any];
          if (value != null) {
            rtn[key] = value;
          }

        } else {
          const dashProp = computedStyle[key as any];
          if (dashProp.includes('-')) {
            const value = computedStyle.getPropertyValue(dashProp);
            if (value != null) {
              rtn[dashProp] = value;
            }
          }
        }
      });

      return rtn;

    }, this._elmHandle, pseudoElt);

    style.getPropertyValue = (propName: string) => {
      return style[propName];
    };

    return style;
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

    const { outerHTML, shadowRootHTML } = await executionContext.evaluate((elm: HTMLElement) => {
      return {
        outerHTML: elm.outerHTML,
        shadowRootHTML: elm.shadowRoot ? elm.shadowRoot.innerHTML : null
      };
    }, this._elmHandle);

    if (shadowRootHTML) {
      this._shadowRoot = parseHtmlToFragment(shadowRootHTML) as any;
      (this._shadowRoot as any).host = this;

    } else {
      this._shadowRoot = null;
    }

    const frag = parseHtmlToFragment(outerHTML);

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

    const index = this._page._e2eElements.indexOf(this);
    if (index > -1) {
      this._page._e2eElements.splice(index, 1);
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
