import * as d from '.';


export interface ScreenshotConnector {
  initBuild(opts: d.ScreenshotConnectorOptions): Promise<void>;
  completeBuild(): Promise<d.ScreenshotBuild>;
  getMasterBuild(): Promise<d.ScreenshotBuild>;
  pullMasterBuild(): Promise<void>;
  publishBuild(build: d.ScreenshotBuild): Promise<d.PublishBuildResults>;
  generateJsonpDataUris(build: d.ScreenshotBuild): Promise<void>;
  sortScreenshots(screenshots: d.Screenshot[]): d.Screenshot[];
  toJson(masterBuild: d.ScreenshotBuild): string;
}


export interface ScreenshotConnectorOptions {
  buildId: string;
  buildMessage: string;
  buildAuthor: string;
  buildTimestamp: number;
  logger: d.Logger;
  rootDir: string;
  cacheDir: string;
  packageDir: string;
  screenshotDirName?: string;
  imagesDirName?: string;
  buildsDirName?: string;
  currentBuildDir?: string;
  updateMaster?: boolean;
  allowableMismatchedPixels?: number;
  allowableMismatchedRatio?: number;
  pixelmatchThreshold?: number;
}


export interface ScreenshotBuildData {
  buildId: string;
  rootDir: string;
  cacheDir: string;
  screenshotDir: string;
  imagesDir: string;
  buildsDir: string;
  currentBuildDir: string;
  updateMaster: boolean;
  allowableMismatchedPixels: number;
  allowableMismatchedRatio: number;
  pixelmatchThreshold: number;
  masterScreenshots: {[screenshotId: string]: string};
}


export interface ScreenshotBuild {
  id: string;
  message: string;
  author: string;
  timestamp: number;
  screenshots: Screenshot[];
}


export interface PublishBuildResults {
  compareUrl?: string;
  screenshotsCompared?: number;
  masterBuild?: d.ScreenshotBuild;
  currentBuild?: d.ScreenshotBuild;
}


export interface Screenshot {
  id: string;
  desc?: string;
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
