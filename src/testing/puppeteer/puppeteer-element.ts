import type { EventInitDict, HostElement, SerializedEvent } from '@stencil/core/internal';
import type * as pd from './puppeteer-declarations';
import type * as puppeteer from 'puppeteer';
import { EventSpy, addE2EListener, waitForEvent } from './puppeteer-events';
import { MockHTMLElement, cloneAttributes, parseHtmlToFragment } from '@stencil/core/mock-doc';

export class E2EElement extends MockHTMLElement implements pd.E2EElementInternal {
  private _queuedActions: ElementAction[] = [];

  private _queueAction(action: ElementAction) {
    this._queuedActions.push(action);
  }

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
    this._queueAction({
      methodName: methodName,
      methodArgs: methodArgs,
    });

    return this.e2eRunActions();
  }

  triggerEvent(eventName: string, eventInitDict?: EventInitDict) {
    this._queueAction({
      eventName: eventName,
      eventInitDict: eventInitDict,
    });
  }

  async spyOnEvent(eventName: string) {
    const eventSpy = new EventSpy(eventName);

    await addE2EListener(this._page, this._elmHandle, eventName, (ev: SerializedEvent) => {
      eventSpy.push(ev);
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

      isVisible = await executionContext.evaluate((elm: HostElement) => {
        return new Promise<boolean>((resolve) => {
          window.requestAnimationFrame(() => {
            if (elm.isConnected) {
              const style = window.getComputedStyle(elm);
              const isVisible =
                !!style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';

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

  waitForEvent(eventName: string) {
    return waitForEvent(this._page, eventName, this._elmHandle);
  }

  waitForVisible() {
    return new Promise<void>((resolve, reject) => {
      const checkVisible = async () => {
        const isVisible = await this.isVisible();
        if (isVisible) {
          clearInterval(resolveTmr);
          clearTimeout(rejectTmr);
          resolve();
        }
      };
      const resolveTmr = setInterval(checkVisible, 10);
      const timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL * 0.5;
      const timeoutError = new Error(`waitForVisible timed out: ${timeout}ms`);
      const rejectTmr = setTimeout(() => {
        clearTimeout(resolveTmr);
        reject(timeoutError);
      }, timeout);
    });
  }

  waitForNotVisible() {
    return new Promise<void>((resolve, reject) => {
      const checkVisible = async () => {
        const isVisible = await this.isVisible();
        if (!isVisible) {
          clearInterval(resolveTmr);
          clearTimeout(rejectTmr);
          resolve();
        }
      };
      const resolveTmr = setInterval(checkVisible, 10);
      const timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL * 0.5;
      const timeoutError = new Error(`waitForNotVisible timed out: ${timeout}ms`);
      const rejectTmr = setTimeout(() => {
        clearTimeout(resolveTmr);
        reject(timeoutError);
      }, timeout);
    });
  }

  isIntersectingViewport() {
    return this._elmHandle.isIntersectingViewport();
  }

  async press(key: puppeteer.KeyInput, options?: { text?: string; delay?: number }) {
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

    const propValue = await executionContext.evaluate(
      (elm: any, propertyName: string) => {
        return elm[propertyName];
      },
      this._elmHandle,
      propertyName
    );

    return propValue;
  }

  setProperty(propertyName: string, value: any) {
    this._queueAction({
      setPropertyName: propertyName,
      setPropertyValue: value,
    });
  }

  getAttribute(name: string) {
    this._validate();
    return super.getAttribute(name);
  }

  setAttribute(name: string, value: any) {
    this._queueAction({
      setAttributeName: name,
      setAttributeValue: value,
    });
  }

  removeAttribute(name: string) {
    this._queueAction({
      removeAttribute: name,
    });
  }

  toggleAttribute(name: string, force?: boolean) {
    this._queueAction({
      toggleAttributeName: name,
      toggleAttributeForce: force,
    });
  }

  get classList() {
    const api: any = {
      add: (...classNames: string[]) => {
        classNames.forEach((className) => {
          this._queueAction({
            classAdd: className,
          });
        });
      },
      remove: (...classNames: string[]) => {
        classNames.forEach((className) => {
          this._queueAction({
            classRemove: className,
          });
        });
      },
      toggle: (className: string) => {
        this._queueAction({
          classToggle: className,
        });
      },
      contains: (className: string) => {
        this._validate();
        return super.className.split(' ').includes(className);
      },
    };
    return api;
  }

  get className() {
    this._validate();
    return super.className;
  }

  set className(value: string) {
    this._queueAction({
      setPropertyName: 'className',
      setPropertyValue: value,
    });
  }

  get id() {
    this._validate();
    return super.id;
  }

  set id(value: string) {
    this._queueAction({
      setPropertyName: 'id',
      setPropertyValue: value,
    });
  }

  get innerHTML() {
    this._validate();
    return super.innerHTML;
  }

  set innerHTML(value: string) {
    this._queueAction({
      setPropertyName: 'innerHTML',
      setPropertyValue: value,
    });
  }

  get innerText() {
    this._validate();
    return super.innerText;
  }

  set innerText(value: string) {
    this._queueAction({
      setPropertyName: 'innerText',
      setPropertyValue: value,
    });
  }

  get nodeValue() {
    this._validate();
    return super.nodeValue;
  }

  set nodeValue(value: string) {
    if (typeof value === 'string') {
      this._queueAction({
        setPropertyName: 'nodeValue',
        setPropertyValue: value,
      });
    }
  }

  get outerHTML() {
    this._validate();
    return super.outerHTML;
  }

  set outerHTML(_: any) {
    throw new Error(`outerHTML is read-only`);
  }

  get shadowRoot() {
    this._validate();
    return super.shadowRoot;
  }

  set shadowRoot(value: any) {
    super.shadowRoot = value;
  }

  get tabIndex() {
    this._validate();
    return super.tabIndex;
  }

  set tabIndex(value: number) {
    this._queueAction({
      setPropertyName: 'tabIndex',
      setPropertyValue: value,
    });
  }

  get textContent() {
    this._validate();
    return super.textContent;
  }

  set textContent(value: string) {
    this._queueAction({
      setPropertyName: 'textContent',
      setPropertyValue: value,
    });
  }

  get title() {
    this._validate();
    return super.title;
  }

  set title(value: string) {
    this._queueAction({
      setPropertyName: 'title',
      setPropertyValue: value,
    });
  }

  async getComputedStyle(pseudoElt?: string | null) {
    const style = await this._page.evaluate(
      (elm: HTMLElement, pseudoElt: string) => {
        const rtn: any = {};

        const computedStyle = window.getComputedStyle(elm, pseudoElt);

        const keys = Object.keys(computedStyle);

        keys.forEach((key) => {
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
      },
      this._elmHandle,
      pseudoElt
    );

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

    const rtn = await executionContext.evaluate<unknown>(
      (elm: HTMLElement, queuedActions: ElementAction[]) => {
        // BROWSER CONTEXT
        // cannot use async/await in here cuz typescript transpiles it in the node context
        return (elm as any).componentOnReady().then(() => {
          let rtn: any = null;

          queuedActions.forEach((queuedAction) => {
            if (queuedAction.methodName) {
              rtn = (elm as any)[queuedAction.methodName].apply(elm, queuedAction.methodArgs);
            } else if (queuedAction.setPropertyName) {
              (elm as any)[queuedAction.setPropertyName] = queuedAction.setPropertyValue;
            } else if (queuedAction.setAttributeName) {
              elm.setAttribute(queuedAction.setAttributeName, queuedAction.setAttributeValue);
            } else if (queuedAction.removeAttribute) {
              elm.removeAttribute(queuedAction.removeAttribute);
            } else if (queuedAction.toggleAttributeName) {
              if (typeof queuedAction.toggleAttributeForce === 'boolean') {
                elm.toggleAttribute(queuedAction.toggleAttributeName, queuedAction.toggleAttributeForce);
              } else {
                elm.toggleAttribute(queuedAction.toggleAttributeName);
              }
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
      },
      this._elmHandle,
      this._queuedActions as any
    );

    this._queuedActions.length = 0;

    return rtn;
  }

  async e2eSync() {
    const executionContext = this._elmHandle.executionContext();

    const { outerHTML, shadowRootHTML } = await executionContext.evaluate((elm: HTMLElement) => {
      return {
        outerHTML: elm.outerHTML,
        shadowRootHTML: elm.shadowRoot ? elm.shadowRoot.innerHTML : null,
      };
    }, this._elmHandle);

    if (typeof shadowRootHTML === 'string') {
      (this as any).shadowRoot = parseHtmlToFragment(shadowRootHTML) as any;
      (this as any).shadowRoot.host = this;
    } else {
      (this as any).shadowRoot = null;
    }

    const frag = parseHtmlToFragment(outerHTML);

    const rootElm = frag.firstElementChild;

    this.nodeName = rootElm.nodeName;
    this.attributes = cloneAttributes(rootElm.attributes);

    while (this.childNodes.length > 0) {
      this.removeChild(this.childNodes[0]);
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

export async function find(page: pd.E2EPageInternal, rootHandle: puppeteer.ElementHandle, selector: pd.FindSelector) {
  const { lightSelector, shadowSelector, text, contains } = getSelector(selector);

  let elmHandle: puppeteer.ElementHandle;

  if (typeof lightSelector === 'string') {
    elmHandle = await findWithCssSelector(page, rootHandle, lightSelector, shadowSelector);
  } else {
    elmHandle = await findWithText(page, rootHandle, text, contains);
  }

  if (!elmHandle) {
    return null;
  }

  const elm = new E2EElement(page, elmHandle);
  await elm.e2eSync();
  return elm;
}

async function findWithCssSelector(
  page: pd.E2EPageInternal,
  rootHandle: puppeteer.ElementHandle,
  lightSelector: string,
  shadowSelector: string
) {
  let elmHandle = await rootHandle.$(lightSelector);

  if (!elmHandle) {
    return null;
  }

  if (shadowSelector) {
    const shadowHandle = await page.evaluateHandle(
      (elm: HTMLElement, shadowSelector: string) => {
        if (!elm.shadowRoot) {
          throw new Error(`shadow root does not exist for element: ${elm.tagName.toLowerCase()}`);
        }

        return elm.shadowRoot.querySelector(shadowSelector);
      },
      elmHandle,
      shadowSelector
    );

    await elmHandle.dispose();

    if (!shadowHandle) {
      return null;
    }

    elmHandle = shadowHandle.asElement();
  }

  return elmHandle;
}

async function findWithText(
  page: pd.E2EPageInternal,
  rootHandle: puppeteer.ElementHandle,
  text: string,
  contains: string
) {
  const jsHandle = await page.evaluateHandle(
    (rootElm: HTMLElement, text: string, contains: string) => {
      let foundElm: any = null;

      function checkContent(elm: Node) {
        if (!elm || foundElm) {
          return;
        }

        if (elm.nodeType === 3) {
          if (typeof text === 'string' && elm.textContent.trim() === text) {
            foundElm = elm.parentElement;
            return;
          }
          if (typeof contains === 'string' && elm.textContent.includes(contains)) {
            foundElm = elm.parentElement;
            return;
          }
        } else {
          if (elm.nodeName === 'SCRIPT' || elm.nodeName === 'STYLE') {
            return;
          }
          checkContent((elm as Element).shadowRoot);
          if (elm.childNodes) {
            for (let i = 0; i < elm.childNodes.length; i++) {
              checkContent(elm.childNodes[i]);
            }
          }
        }
      }

      checkContent(rootElm);

      return foundElm;
    },
    rootHandle,
    text,
    contains
  );

  if (jsHandle) {
    return jsHandle.asElement();
  }

  return null;
}

export async function findAll(
  page: pd.E2EPageInternal,
  rootHandle: puppeteer.ElementHandle,
  selector: pd.FindSelector
) {
  const foundElms: E2EElement[] = [];

  const { lightSelector, shadowSelector } = getSelector(selector);

  const lightElmHandles = await rootHandle.$$(lightSelector);
  if (lightElmHandles.length === 0) {
    return foundElms;
  }

  if (shadowSelector) {
    // light dom selected, then shadow dom selected inside of light dom elements
    for (let i = 0; i < lightElmHandles.length; i++) {
      const executionContext = lightElmHandles[i].executionContext();

      const shadowJsHandle = await executionContext.evaluateHandle(
        (elm, shadowSelector) => {
          if (!elm.shadowRoot) {
            throw new Error(`shadow root does not exist for element: ${elm.tagName.toLowerCase()}`);
          }

          return elm.shadowRoot.querySelectorAll(shadowSelector);
        },
        lightElmHandles[i],
        shadowSelector
      );

      await lightElmHandles[i].dispose();

      const shadowJsProperties = await shadowJsHandle.getProperties();
      await shadowJsHandle.dispose();

      for (const shadowJsProperty of shadowJsProperties.values()) {
        const shadowElmHandle = shadowJsProperty.asElement();
        if (shadowElmHandle) {
          const elm = new E2EElement(page, shadowElmHandle);
          await elm.e2eSync();
          foundElms.push(elm);
        }
      }
    }
  } else {
    // light dom only
    for (let i = 0; i < lightElmHandles.length; i++) {
      const elm = new E2EElement(page, lightElmHandles[i]);
      await elm.e2eSync();
      foundElms.push(elm);
    }
  }

  return foundElms;
}

function getSelector(selector: pd.FindSelector) {
  const rtn = {
    lightSelector: null as string,
    shadowSelector: null as string,
    text: null as string,
    contains: null as string,
  };

  if (typeof selector === 'string') {
    const splt = selector.split('>>>');

    rtn.lightSelector = splt[0].trim();
    rtn.shadowSelector = splt.length > 1 ? splt[1].trim() : null;
  } else if (typeof selector.text === 'string') {
    rtn.text = selector.text.trim();
  } else if (typeof selector.contains === 'string') {
    rtn.contains = selector.contains.trim();
  } else {
    throw new Error(`invalid find selector: ${selector}`);
  }

  return rtn;
}

interface ElementAction {
  classAdd?: string;
  classRemove?: string;
  classToggle?: string;
  eventName?: string;
  eventInitDict?: EventInitDict;
  methodName?: string;
  methodArgs?: any[];
  removeAttribute?: string;
  setAttributeName?: string;
  setAttributeValue?: any;
  setPropertyName?: string;
  setPropertyValue?: any;
  toggleAttributeName?: string;
  toggleAttributeForce?: boolean;
}
