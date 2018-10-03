import * as d from '.';


export interface ScreenshotConnector {
  initBuild(opts: ScreenshotConnectorOptions): Promise<void>;
  completeBuild(): Promise<void>;
  publishBuild(): Promise<void>;
  getComparisonSummaryUrl(): string;
  getTotalScreenshotImages(): number;
  toJson(): string;
}


export interface ScreenshotConnectorOptions {
  rootDir: string;
  cacheDir: string;
  compareAppDir: string;
  logger: d.Logger;
  screenshotDirName?: string;
  imagesDirName?: string;
  buildsDirName?: string;
  currentBuildDirName?: string;
  compareAppFileName?: string;
  buildId: string;
  buildMessage: string;
  updateMaster?: boolean;
  gitIgnoreImages?: boolean;
  gitIgnoreLocal?: boolean;
  gitIgnoreCompareApp?: boolean;
  allowableMismatchedPixels?: number;
  allowableMismatchedRatio?: number;
  pixelmatchThreshold?: number;
}


export interface ScreenshotBuildData {
  id: string;
  rootDir: string;
  cacheDir: string;
  screenshotDirPath: string;
  imagesDirPath: string;
  buildsDirPath: string;
  currentBuildDirPath: string;
  updateMaster: boolean;
  compareUrlTemplate: string;
  allowableMismatchedPixels: number;
  allowableMismatchedRatio: number;
  pixelmatchThreshold: number;
}


export interface ScreenshotBuild {
  id: string;
  message: string;
  screenshots: ScreenshotData[];
}


export interface ScreenshotData {
  id: string;
  desc: string;
  image: string;
  device?: string;
  userAgent?: string;
  width?: number;
  height?: number;
  deviceScaleFactor?: number;
  naturalWidth?: number;
  naturalHeight?: number;
  hasTouch?: boolean;
  isLandscape?: boolean;
  isMobile?: boolean;
  testPath?: string;
}


export interface ScreenshotCompare {
  mismatchedPixels: number;
  mismatchedRatio: number;
  id?: string;
  desc?: string;
  expectedImage?: string;
  receivedImage?: string;
  device?: string;
  userAgent?: string;
  width?: number;
  height?: number;
  deviceScaleFactor?: number;
  naturalWidth?: number;
  naturalHeight?: number;
  hasTouch?: boolean;
  isLandscape?: boolean;
  isMobile?: boolean;
  allowableMismatchedPixels: number;
  allowableMismatchedRatio: number;
  testPath?: string;
}


export interface ScreenshotOptions {
  /**
   * When true, takes a screenshot of the full scrollable page.
   * Default: `false`
   */
  fullPage?: boolean;

  /**
   * An object which specifies clipping region of the page.
   */
  clip?: ScreenshotBoundingBox;

  /**
   * Hides default white background and allows capturing screenshots with transparency.
   * Default: `false`
   */
  omitBackground?: boolean;

  /**
   * Matching threshold, ranges from `0` to 1. Smaller values make the comparison
   * more sensitive. Defaults to the testing config `pixelmatchThreshold` value;
   */
  pixelmatchThreshold?: number;
}


export interface ScreenshotBoundingBox {
  /**
   * The x-coordinate of top-left corner.
   */
  x: number;

  /**
   * The y-coordinate of top-left corner.
   */
  y: number;

  /**
   * The width in pixels.
   */
  width: number;

  /**
   * The height in pixels.
   */
  height: number;
}
