

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualHtml(expectHtml: string): void;
      toEqualText(expectTextContent: string): void;

      toHaveAttribute(expectAttrName: string): void;
      toEqualAttribute(expectAttrName: string, expectAttrValue: string): void;
      toEqualAttributes(expectAttrs: {[attrName: string]: any}): void;

      toHaveClass(expectClassName: string): void;
      toHaveClasses(expectClassNames: string[]): void;

      toHaveReceivedEvent(): void;
      toHaveReceivedEventTimes(count: number): void;
      toHaveReceivedEventDetail(eventDetail: any): void;
    }
  }
}


export interface EventSpy {
  events: SerializedEvent[];
  eventName: string;
  firstEvent: SerializedEvent;
  lastEvent: SerializedEvent;
  length: number;
}


export interface SerializedEvent {
  bubbles: boolean;
  cancelBubble: boolean;
  cancelable: boolean;
  composed: boolean;
  currentTarget: any;
  defaultPrevented: boolean;
  detail: any;
  eventPhase: any;
  isTrusted: boolean;
  returnValue: any;
  srcElement: any;
  target: any;
  timeStamp: number;
  type: string;
  isSerializedEvent: boolean;
}


export interface EventInitDict {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
  detail?: any;
}


export interface JestEnvironmentGlobal {
  __BUILD_CONDITIONALS__: any;
  __NEW_TEST_PAGE__: () => Promise<any>;
  Context: any;
  loadTestWindow: (testWindow: any) => Promise<void>;
  h: any;
  resourcesUrl: string;
}


export interface E2EProcessEnv {
  STENCIL_COMMIT_ID?: string;
  STENCIL_COMMIT_MESSAGE?: string;
  STENCIL_REPO_URL?: string;
  STENCIL_SCREENSHOT_CONNECTOR?: string;
  STENCIL_SCREENSHOT_SERVER?: string;

  __STENCIL_EMULATE__?: string;
  __STENCIL_BROWSER_URL__?: string;
  __STENCIL_LOADER_URL__?: string;
  __STENCIL_BROWSER_WS_ENDPOINT__?: string;
  __STENCIL_SCREENSHOTS__?: 'true';
  __STENCIL_SCREENSHOT_IMAGES_DIR__?: string;
  __STENCIL_SCREENSHOT_DATA_DIR__?: string;

  __STENCIL_E2E_TESTS__?: 'true';

  __STENCIL_PUPPETEER_MODULE__?: string;
  __STENCIL_JEST_ENVIRONMENT_NODE_MODULE__?: string;
}


export interface Testing {
  isValid: boolean;
  runTests(): Promise<void>;
  destroy(): Promise<void>;
}


export interface TestingConfig {
  /**
   * Additional arguments to pass to the browser instance.
   */
  browserArgs?: string[];

  /**
   * Whether to run browser e2e tests in headless mode. Defaults to true.
   */
  browserHeadless?: boolean;

  /**
   * Slows down e2e browser operations by the specified amount of milliseconds.
   * Useful so that you can see what is going on.
   */
  browserSlowMo?: number;

  /**
   * Array of browser emulations to be using during e2e tests. A full e2e
   * test is ran for each emulation.
   */
  emulate?: EmulateConfig[];

  moduleFileExtensions?: string[];
  setupTestFrameworkScriptFile?: string;
  testEnvironment?: string;
  testMatch?: string[];
  testPathIgnorePatterns?: string[];
  testRegex?: string;
  transform?: {[key: string]: string };
}


export interface EmulateConfig {
  /**
   * Predefined device descriptor name, such as "iPhone X" or "Nexus 10".
   * For a complete list please see: https://github.com/GoogleChrome/puppeteer/blob/master/DeviceDescriptors.js
   */
  device?: string;

  /**
   * Page width in pixels.
   */
  width?: number;

  /**
   * page height in pixels.
   */
  height?: number;

  /**
   * Specify device scale factor (can be thought of as dpr). Defaults to 1.
   */
  deviceScaleFactor?: number;

  /**
   * Whether the meta viewport tag is taken into account. Defaults to false.
   */
  isMobile?: boolean;

  /**
   * Specifies if viewport supports touch events. Defaults to false
   */
  hasTouch?: boolean;

  /**
   * Specifies if viewport is in landscape mode. Defaults to false.
   */
  isLandscape?: boolean;

  userAgent?: string;

  /**
   * Changes the CSS media type of the page. The only allowed values are 'screen', 'print' and null. Passing null disables media emulation.
   */
  mediaType?: 'screen' | 'print';
}


export interface E2EScreenshotOptions {
  /**
   * When true, takes a screenshot of the full scrollable page.
   * @default false
   */
  fullPage?: boolean;

  /**
   * Hides default white background and allows capturing screenshots with transparency.
   * @default false
   */
  omitBackground?: boolean;

  /**
   * An object which specifies clipping region of the page.
   */
  clip?: {
    /** The x-coordinate of top-left corner. */
    x: number;
    /** The y-coordinate of top-left corner. */
    y: number;
    /** The width. */
    width: number;
    /** The height. */
    height: number;
  };
}
