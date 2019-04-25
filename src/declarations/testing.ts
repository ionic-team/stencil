import * as d from '.';

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Compares HTML, but first normalizes the HTML so all
       * whitespace, attribute order and css class order are
       * the same. When given an element, it will compare
       * the element's `outerHTML`. When given a Document Fragment,
       * such as a Shadow Root, it'll compare its `innerHTML`.
       * Otherwise it'll compare two strings representing HTML.
       */
      toEqualHtml(expectHtml: string): void;

      /**
       * When given an element, it'll compare the element's
       * `textContent`. Otherwise it'll compare two strings. This
       * matcher will also `trim()` each string before comparing.
       */
      toEqualText(expectTextContent: string): void;

      /**
       * Checks if an element simply has the attribute. It does
       * not check any values of the attribute
       */
      toHaveAttribute(expectAttrName: string): void;

      /**
       * Checks if an element's attribute value equals the expect value.
       */
      toEqualAttribute(expectAttrName: string, expectAttrValue: any): void;

      /**
       * Checks if an element's has each of the expected attribute
       * names and values.
       */
      toEqualAttributes(expectAttrs: {[attrName: string]: any}): void;

      /**
       * Checks if an element has the expected css class.
       */
      toHaveClass(expectClassName: string): void;

      /**
       * Checks if an element has each of the expected css classes
       * in the array.
       */
      toHaveClasses(expectClassNames: string[]): void;

      /**
       * Checks if an element has the exact same css classes
       * as the expected array of css classes.
       */
      toMatchClasses(expectClassNames: string[]): void;

      /**
       * When given an EventSpy, checks if the event has been
       * received or not.
       */
      toHaveReceivedEvent(): void;

      /**
       * When given an EventSpy, checks how many times the
       * event has been received.
       */
      toHaveReceivedEventTimes(count: number): void;

      /**
       * When given an EventSpy, checks the event has
       * received the correct custom event `detail` data.
       */
      toHaveReceivedEventDetail(eventDetail: any): void;

      /**
       * Used to evaluate the results of `compareScreenshot()`, such as
       * `expect(compare).toMatchScreenshot()`. The `allowableMismatchedRatio`
       * value from the testing config is used by default if
       * `MatchScreenshotOptions` were not provided.
       */
      toMatchScreenshot(opts?: MatchScreenshotOptions): void;
    }
  }
}


export interface MatchScreenshotOptions {
  /**
   * The `allowableMismatchedPixels` value is the total number of pixels
   * that can be mismatched until the test fails. For example, if the value
   * is `100`, and if there were `101` pixels that were mismatched then the
   * test would fail. If the `allowableMismatchedRatio` is provided it will
   * take precedence, otherwise `allowableMismatchedPixels` will be used.
   */
  allowableMismatchedPixels?: number;

  /**
   * The `allowableMismatchedRatio` ranges from `0` to `1` and is used to
   * determine an acceptable ratio of pixels that can be mismatched before
   * the image is considered to have changes. Realistically, two screenshots
   * representing the same content may have a small number of pixels that
   * are not identical due to anti-aliasing, which is perfectly normal. The
   * `allowableMismatchedRatio` is the number of pixels that were mismatched,
   * divided by the total number of pixels in the screenshot. For example,
   * a ratio value of `0.06` means 6% of the pixels can be mismatched before
   * the image is considered to have changes. If the `allowableMismatchedRatio`
   * is provided it will take precedence, otherwise `allowableMismatchedPixels`
   * will be used.
   */
  allowableMismatchedRatio?: number;
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
  __NEW_TEST_PAGE__: () => Promise<any>;
  Context: any;
  loadTestWindow: (testWindow: any) => Promise<void>;
  h: any;
  resourcesUrl: string;
  currentSpec?: {
    id: string;
    description: string;
    fullName: string;
    testPath: string;
  };
  screenshotDescriptions: Set<string>;
}


export interface E2EProcessEnv {
  STENCIL_COMMIT_ID?: string;
  STENCIL_COMMIT_MESSAGE?: string;
  STENCIL_REPO_URL?: string;
  STENCIL_SCREENSHOT_CONNECTOR?: string;
  STENCIL_SCREENSHOT_SERVER?: string;

  __STENCIL_EMULATE_CONFIGS__?: string;
  __STENCIL_EMULATE__?: string;
  __STENCIL_BROWSER_URL__?: string;
  __STENCIL_APP_URL__?: string;
  __STENCIL_BROWSER_WS_ENDPOINT__?: string;

  __STENCIL_SCREENSHOT__?: 'true';
  __STENCIL_SCREENSHOT_BUILD__?: string;

  __STENCIL_E2E_TESTS__?: 'true';
  __STENCIL_SPEC_TESTS__?: 'true';

  __STENCIL_PUPPETEER_MODULE__?: string;
  __STENCIL_DEFAULT_TIMEOUT__?: string;
}


export interface Testing {
  isValid: boolean;
  runTests(): Promise<boolean>;
  destroy(): Promise<void>;
}


export interface JestConfig {
  /**
   * This option tells Jest that all imported modules in your tests should be mocked automatically.
   * All modules used in your tests will have a replacement implementation, keeping the API surface. Default: false
   */
  automock?: boolean;

  /**
   * By default, Jest runs all tests and produces all errors into the console upon completion.
   * The bail config option can be used here to have Jest stop running tests after the first failure. Default: false
   */
  bail?: boolean;

  /**
   * The directory where Jest should store its cached dependency information. Jest attempts to scan your dependency tree once (up-front)
   * and cache it in order to ease some of the filesystem raking that needs to happen while running tests. This config option lets you
   * customize where Jest stores that cache data on disk. Default: "/tmp/<path>"
   */
  cacheDirectory?: string;

  /**
   * Automatically clear mock calls and instances between every test. Equivalent to calling jest.clearAllMocks()
   * between each test. This does not remove any mock implementation that may have been provided. Default: false
   */
  clearMocks?: boolean;

  /**
   * Indicates whether the coverage information should be collected while executing the test. Because this retrofits all
   * executed files with coverage collection statements, it may significantly slow down your tests. Default: false
   */
  collectCoverage?: boolean;

  /**
   * An array of glob patterns indicating a set of files for which coverage information should be collected.
   * If a file matches the specified glob pattern, coverage information will be collected for it even if no tests exist
   * for this file and it's never required in the test suite. Default: undefined
   */
  collectCoverageFrom?: any[];

  /**
   * The directory where Jest should output its coverage files. Default: undefined
   */
  coverageDirectory?: string;

  /**
   * An array of regexp pattern strings that are matched against all file paths before executing the test. If the file path matches
   * any of the patterns, coverage information will be skipped. These pattern strings match against the full path.
   * Use the <rootDir> string token to include the path to your project's root directory to prevent it from accidentally
   * ignoring all of your files in different environments that may have different root directories.
   * Example: ["<rootDir>/build/", "<rootDir>/node_modules/"]. Default: ["/node_modules/"]
   */
  coveragePathIgnorePatterns?: any[];

  /**
   * A list of reporter names that Jest uses when writing coverage reports. Any istanbul reporter can be used.
   * Default: ["json", "lcov", "text"]
   */
  coverageReporters?: any[];

  /**
   * This will be used to configure minimum threshold enforcement for coverage results. Thresholds can be specified as global,
   * as a glob, and as a directory or file path. If thresholds aren't met, jest will fail. Thresholds specified as a positive
   * number are taken to be the minimum percentage required. Thresholds specified as a negative number represent the maximum
   * number of uncovered entities allowed. Default: undefined
   */
  coverageThreshold?: any;

  errorOnDeprecated?: boolean;
  forceCoverageMatch?: any[];
  globals?: any;
  globalSetup?: string;
  globalTeardown?: string;

  /**
   * An array of directory names to be searched recursively up from the requiring module's location. Setting this option will
   * override the default, if you wish to still search node_modules for packages include it along with any other
   * options: ["node_modules", "bower_components"]. Default: ["node_modules"]
   */
  moduleDirectories?: string[];

  /**
   * An array of file extensions your modules use. If you require modules without specifying a file extension,
   * these are the extensions Jest will look for. Default: ['ts', 'tsx', 'js', 'json']
   */
  moduleFileExtensions?: string[];

  moduleNameMapper?: any;
  modulePaths?: any[];
  modulePathIgnorePatterns?: any[];
  notify?: boolean;
  notifyMode?: string;
  preset?: string;
  prettierPath?: string;
  projects?: any;
  reporters?: any;
  resetMocks?: boolean;
  resetModules?: boolean;
  resolver?: string;
  restoreMocks?: string;
  rootDir?: string;
  roots?: any[];
  runner?: string;

  /**
   * The paths to modules that run some code to configure or set up the testing environment before each test.
   * Since every test runs in its own environment, these scripts will be executed in the testing environment
   * immediately before executing the test code itself. Default: []
   */
  setupFiles?: string[];

  setupTestFrameworkScriptFile?: string;
  snapshotSerializers?: any[];
  testEnvironment?: string;
  testEnvironmentOptions?: any;
  testMatch?: string[];
  testPathIgnorePatterns?: string[];
  testPreset?: string;
  testRegex?: string;
  testResultsProcessor?: string;
  testRunner?: string;
  testURL?: string;
  timers?: string;
  transform?: {[key: string]: string };
  transformIgnorePatterns?: any[];
  unmockedModulePathPatterns?: any[];
  verbose?: boolean;
  watchPathIgnorePatterns?: any[];
}

export interface JestArgv extends JestConfig {
  _: string[];
  ci: boolean;
  config: string;
  maxWorkers: number;
}


export interface TestingConfig extends JestConfig {
  /**
   * The `allowableMismatchedPixels` value is used to determine an acceptable
   * number of pixels that can be mismatched before the image is considered
   * to have changes. Realistically, two screenshots representing the same
   * content may have a small number of pixels that are not identical due to
   * anti-aliasing, which is perfectly normal. If the `allowableMismatchedRatio`
   * is provided it will take precedence, otherwise `allowableMismatchedPixels`
   * will be used.
   */
  allowableMismatchedPixels?: number;

  /**
   * The `allowableMismatchedRatio` ranges from `0` to `1` and is used to
   * determine an acceptable ratio of pixels that can be mismatched before
   * the image is considered to have changes. Realistically, two screenshots
   * representing the same content may have a small number of pixels that
   * are not identical due to anti-aliasing, which is perfectly normal. The
   * `allowableMismatchedRatio` is the number of pixels that were mismatched,
   * divided by the total number of pixels in the screenshot. For example,
   * a ratio value of `0.06` means 6% of the pixels can be mismatched before
   * the image is considered to have changes. If the `allowableMismatchedRatio`
   * is provided it will take precedence, otherwise `allowableMismatchedPixels`
   * will be used.
   */
  allowableMismatchedRatio?: number;

  /**
   * Matching threshold while comparing two screenshots. Value ranges from `0` to `1`.
   * Smaller values make the comparison more sensitive. The `pixelmatchThreshold`
   * value helps to ignore anti-aliasing. Default: `0.1`
   */
  pixelmatchThreshold?: number;

  /**
   * Additional arguments to pass to the browser instance.
   */
  browserArgs?: string[];

  /**
   * Path to a Chromium or Chrome executable to run instead of the bundled Chromium.
   */
  browserExecutablePath?: string;

  /**
   * Url of remote Chrome instance to use instead of local Chrome.
   */
  browserWSEndpoint?: string;

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

  /**
   * Path to the Screenshot Connector module.
   */
  screenshotConnector?: string;
}


export interface EmulateConfig {
  /**
   * Predefined device descriptor name, such as "iPhone X" or "Nexus 10".
   * For a complete list please see: https://github.com/GoogleChrome/puppeteer/blob/master/DeviceDescriptors.js
   */
  device?: string;

  /**
   * User-Agent to be used. Defaults to the user-agent of the installed Puppeteer version.
   */
  userAgent?: string;

  viewport?: EmulateViewport;
}


export interface EmulateViewport {

  /**
   * Page width in pixels.
   */
  width: number;

  /**
   * page height in pixels.
   */
  height: number;

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
}

export interface AnyHTMLElement extends HTMLElement {
  [key: string]: any;
}

export interface SpecPage {
  win: Window;
  doc: HTMLDocument;
  body: HTMLBodyElement;
  root?: AnyHTMLElement;
  rootInstance?: any;
  build: d.Build;
  styles: Map<string, string>;
  setContent: (html: string) => Promise<any>;
  waitForChanges: () => Promise<any>;
  flushLoadModule: (bundleId?: string) => Promise<any>;
  flushQueue: () => Promise<any>;
}


export interface NewSpecPageOptions {
  components: any[];
  cookie?: string;
  direction?: string;
  flushQueue?: boolean;
  html?: string;
  language?: string;
  hydrateClientSide?: boolean;
  hydrateServerSide?: boolean;
  referrer?: string;
  serializedShadowDom?: boolean;
  url?: string;
  userAgent?: string;
}
