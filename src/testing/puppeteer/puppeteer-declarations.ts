import * as d from '../../declarations';
import * as puppeteer from 'puppeteer';


export interface NewE2EPageOptions {
  url?: string;
  html?: string;
}


type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type PuppeteerPage = Omit<puppeteer.Page,
'bringToFront' | 'browser' | 'screenshot' | 'close' | 'emulate' | 'emulateMedia' | 'frames' | 'goBack' | 'goForward' | 'isClosed' | 'mainFrame' | 'pdf' | 'reload' | 'target' | 'title' | 'url' | 'viewport' | 'waitForNavigation' | 'screenshot' | 'workers' | 'addListener' | 'prependListener' | 'prependOnceListener' | 'removeListener' | 'removeAllListeners' | 'setMaxListeners' | 'getMaxListeners' | 'listeners' | 'rawListeners' | 'emit' | 'eventNames' | 'listenerCount' | '$x' | 'waitForXPath'
>;


/**
 * The E2EPage is a wrapper utility to Puppeteer in order to
 * to create easier to write and read end-to-end tests.
 */
export interface E2EPage extends PuppeteerPage {

  /**
   * Find an element using a selector, which is the same as
   * `document.querySelector(selector)`. Use `>>>` within the
   * selector to find elements within the host element's shadow root.
   * For example, to select the first `div` inside of the component
   * `my-cmp`, the call would be `page.find('my-cmp >>> div')`.
   */
  find(selector: string): Promise<E2EElement>;

  /**
   * During an end-to-end test, a dev-server is started so `page.goto(url)` can be used
   * on the app being tested. Urls are always relative since the dev server provides
   * a localhost address. A shortcut to `page.goto(url)` is to set the `url` option
   * when creating a new page, such as `const page = await newE2EPage({ url })`.
   */
  goTo(url: string, options?: Partial<puppeteer.NavigationOptions>): Promise<puppeteer.Response | null>;

  /**
   * Instead of testing a url directly, html content can be mocked using
   * `page.setContent(html)`. A shortcut to `page.setContent(html)` is to set
   * the `html` option when creating a new page, such as
   * `const page = await newE2EPage({ html })`.
   */
  setContent(html: string): Promise<void>;

  /**
   * Used to test if an event was, or was not dispatched. This method
   * returns a promise, that resolves with an EventSpy. The EventSpy
   * can be used along with `expect(spy).toHaveReceivedEvent()`,
   * `expect(spy).toHaveReceivedEventTimes(x)` and
   * `expect(spy).toHaveReceivedEventDetail({...})`.
   */
  spyOnEvent(eventName: string, selector?: 'window' | 'document'): Promise<d.EventSpy>;

  /**
   * Both Stencil and Puppeteer have an asynchronous architecture, which is a good thing
   * for performance. Since all calls are async, it's required that
   * `await page.waitForChanges()` is called when changes are made to components.
   * An error will be thrown if changes were made to a component but `waitForChanges()`
   * was not called.
   */
  waitForChanges(): Promise<void>;
}


export interface E2EPageInternal extends E2EPage {
  isClosed(): boolean;
  _elements: E2EElementInternal[];
  _goto(url: string, options?: Partial<puppeteer.NavigationOptions>): Promise<puppeteer.Response | null>;
  _events: WaitForEvent[];
  _eventIds: number;
  _screenshot(options?: puppeteer.ScreenshotOptions): Promise<Buffer>;
}


export interface E2EElement {
  /**
   * Used to call a method on a component. For example, if a component
   * has the method `cmp.myMethod(arg1, arg2)`, calling this method
   * from a e2e test could be `cmp.callMethod('myMethod', arg1, arg2)`.
   */
  callMethod(methodName: string, ...methodArgs: any[]): Promise<any>;

  /**
   * Gets and sets the value of the class attribute of the e2e element.
   * Note that `await page.waitForChanges()` must be called before reading
   * the value if content has changed.
   */
  className: string;

  /**
   * Using classList is a convenient alternative to accessing an element's list of classes as a space-delimited string via element.className.
   */
  classList: {
    /**
     * Add specified class values. If these classes already exist in
     * attribute of the element, then they are ignored.
     */
    add: (...tokens: string[]) => void;

    /**
     * Remove specified class values. Note: Removing a class that does
     * not exist does NOT throw an error.
     */
    remove: (...tokens: string[]) => void;

    /**
     * If class exists then remove it, if not, then add it.
     */
    toggle: (token: string) => void;

    /**
     * Checks if specified class value exists in class attribute of the element.
     */
    contains: (className: string) => void;
  };

  /**
   * Calling click() on an element crolls it into view if needed, and
   * then uses page.mouse to click in the center of the element. Bear
   * in mind that if click() triggers a navigation event and there's a
   * separate page.waitForNavigation() promise to be resolved, you
   * may end up with a race condition that yields unexpected results.
   * Please see the puppeteer docs for more information.
   */
  click(options?: puppeteer.ClickOptions): void;

  /**
   * Find a child element using a selector, which is the same as
   * `element.querySelector(selector)`. Use `>>>` within the
   * selector to find elements within a host element's shadow root.
   * For example, to select the first `div` inside of the component
   * `my-cmp`, the call would be `element.find('my-cmp >>> div')`.
   */
  find(selector: string): Promise<E2EElement>;

  /**
   * Sets focus on the element.
   */
  focus(): Promise<void>;

  /**
   * Returns the value of a specified attribute on the element. If the
   * given attribute does not exist, the value returned will be null.
   */
  getAttribute(name: string): string;

  /**
   * Used to get a property set on a component. For example, if a
   * component has the property `elm.myProp`, then calling
   * `elm.getProperty('myProp')` would return the `myProp` property value.
   */
  getProperty(propertyName: string): Promise<any>;

  /**
   * Sets hover on the element.
   */
  hover(): Promise<void>;

  /**
   * Gets and sets id property of the element.
   * Note that `await page.waitForChanges()` must be called before reading
   * the value if content has changed.
   */
  id: string;

  /**
   * Gets and sets innerHTML property of the element.
   * Note that `await page.waitForChanges()` must be called before reading
   * the value if content has changed.
   */
  innerHTML: string;

  /**
   * Gets and sets innerText property of the element.
   * Note that `await page.waitForChanges()` must be called before reading
   * the value if content has changed.
   */
  innerText: string;

  /**
   * Resolves to true if the element is visible in the current viewport.
   */
  isIntersectingViewport(): Promise<boolean>;

  /**
   * Node name of the node, which in an element's case is the tag name.
   * Note, this will always be upper-cased.
   */
  nodeName: string;

  /**
   * The node type of the node. An element's node type is always `1`.
   */
  nodeType: number;

  /**
   * Gets the element's outerHTML. This is a read-only property and will
   * throw an error if set.
   */
  outerHTML: string;

  /**
   * Focuses the element, and then uses keyboard.down and keyboard.up.
   * If key is a single character and no modifier keys besides Shift are
   * being held down, a keypress/input event will also be generated. The
   * text option can be specified to force an input event to be generated.
   * Note: Modifier keys DO effect elementHandle.press. Holding down Shift
   * will type the text in upper case.
   */
  press(key: string, options?: { text?: string, delay?: number }): Promise<void>;

  /**
   * Sets the value of an attribute on the specified element. If the
   * attribute already exists, the value is updated; otherwise a new
   * attribute is added with the specified name and value. The value
   * will always be converted to a string. Note that
   * `await page.waitForChanges()` must be called before reading
   * the value if content has changed.
   */
  setAttribute(name: string, value: any): void;

  /**
   * Used to set a property set on a component. For example, if a
   * component has the property `elm.myProp`, then calling
   * `elm.setProperty('myProp', 88)` would set the value `88` to
   * the `myProp` property on the component.
   */
  setProperty(propertyName: string, value: any): void;

  /**
   * The ShadowRoot interface of the Shadow DOM API is the root node of a
   * DOM subtree that is rendered separately from a document's main DOM tree.
   * This value will be `null` if the element does not have a shadowRoot.
   */
  shadowRoot: ShadowRoot;

  /**
   * Used to test if an event was, or was not dispatched. This method
   * returns a promise, that resolves with an EventSpy. The EventSpy
   * can be used along with `expect(spy).toHaveReceivedEvent()`,
   * `expect(spy).toHaveReceivedEventTimes(x)` and
   * `expect(spy).toHaveReceivedEventDetail({...})`.
   */
  spyOnEvent(eventName: string): Promise<d.EventSpy>;

  /**
   * Tag name of the element. Note, this will always be upper-cased.
   */
  tagName: string;

  /**
   * This method scrolls the element it into view if needed,
   * and then uses page.touchscreen to tap in the center of the element.
   */
  tap(): Promise<void>;

  /**
   * The textContent property represents the text content of a node
   * and its descendants. Note that `await page.waitForChanges()` must
   * be called before reading the value if content has changed.
   */
  textContent: string;

  /**
   * This is a convenience method to easily create a CustomEvent,
   * and dispatch it from the element, to include any custom event
   * detail data.
   */
  triggerEvent(eventName: string, eventInitDict?: d.EventInitDict): void;

  /**
   * Sends a keydown, keypress/input, and keyup event for each character in the text.
   * To press a special key, like Control or ArrowDown, use keyboard.press.
   * @param text A text to type into a focused element.
   */
  type(text: string, options?: { delay: number }): Promise<void>;
}


export interface E2EElementInternal extends E2EElement {
  e2eRunActions(): Promise<void>;
  e2eSync(): Promise<void>;
}


export interface WaitForEventOptions {
  timeout?: number;
}


export interface WaitForEvent {
  id: number;
  eventName: string;
  resolve: (ev: any) => void;
  cancelRejectId: any;
}


export interface BrowserContextEvent {
  id: number;
  event: any;
}


export interface BrowserWindow extends Window {
  stencilOnEvent(ev: BrowserContextEvent): void;
  stencilSerializeEvent(ev: CustomEvent): any;
  stencilSerializeEventTarget(target: any): any;
  stencilAppLoaded: boolean;
}
