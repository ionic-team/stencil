

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
      toMatchClasses(expectClassNames: string[]): void;

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
   * Path to a Chromium or Chrome executable to run instead of the bundled Chromium.
   */
  browserExecutablePath?: string;

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
