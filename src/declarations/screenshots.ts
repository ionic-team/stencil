import { Logger } from './logger';


export interface ScreenshotConnector {
  initBuild(opts: ScreenshotConnectorOptions): Promise<void>;
  completeBuild(masterBuild: ScreenshotBuild): Promise<ScreenshotBuildResults>;
  getMasterBuild(): Promise<ScreenshotBuild>;
  pullMasterBuild(): Promise<void>;
  publishBuild(buildResults: ScreenshotBuildResults): Promise<ScreenshotBuildResults>;
  getScreenshotCache(): Promise<ScreenshotCache>;
  updateScreenshotCache(screenshotCache: ScreenshotCache, buildResults: ScreenshotBuildResults): Promise<ScreenshotCache>;
  generateJsonpDataUris(build: ScreenshotBuild): Promise<void>;
  sortScreenshots(screenshots: Screenshot[]): Screenshot[];
  toJson(masterBuild: ScreenshotBuild, screenshotCache: ScreenshotCache): string;
}


export interface ScreenshotBuildResults {
  appNamespace: string;
  masterBuild: ScreenshotBuild;
  currentBuild: ScreenshotBuild;
  compare: ScreenshotCompareResults;
}


export interface ScreenshotCompareResults {
  id: string;
  a: {
    id: string;
    message: string;
    author: string;
    url: string;
    previewUrl: string;
  };
  b: {
    id: string;
    message: string;
    author: string;
    url: string;
    previewUrl: string;
  };
  timestamp: number;
  url: string;
  appNamespace: string;
  diffs: ScreenshotDiff[];
}


export interface ScreenshotConnectorOptions {
  buildId: string;
  buildMessage: string;
  buildAuthor?: string;
  buildUrl?: string;
  previewUrl?: string;
  appNamespace: string;
  buildTimestamp: number;
  logger: Logger;
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
  waitBeforeScreenshot?: number;
  pixelmatchModulePath?: string;
}


export interface ScreenshotBuildData {
  buildId: string;
  rootDir: string;
  screenshotDir: string;
  imagesDir: string;
  buildsDir: string;
  currentBuildDir: string;
  updateMaster: boolean;
  allowableMismatchedPixels: number;
  allowableMismatchedRatio: number;
  pixelmatchThreshold: number;
  masterScreenshots: {[screenshotId: string]: string};
  cache: {[cacheKey: string]: number};
  timeoutBeforeScreenshot: number;
  pixelmatchModulePath: string;
}


export interface PixelMatchInput {
  imageAPath: string;
  imageBPath: string;
  width: number;
  height: number;
  pixelmatchThreshold: number;
}


export interface ScreenshotBuild {
  id: string;
  message: string;
  author?: string;
  url?: string;
  previewUrl?: string;
  appNamespace: string;
  timestamp: number;
  screenshots: Screenshot[];
}


export interface ScreenshotCache {
  timestamp?: number;
  lastBuildId?: string;
  size?: number;
  items?: {
    /**
     * Cache key
     */
    key: string;

    /**
     * Timestamp used to remove the oldest data
     */
    ts: number;

    /**
     * Mismatched pixels
     */
    mp: number;
  }[];
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
  hasTouch?: boolean;
  isLandscape?: boolean;
  isMobile?: boolean;
  testPath?: string;
  diff?: ScreenshotDiff;
}


export interface ScreenshotDiff {
  mismatchedPixels: number;
  id?: string;
  desc?: string;
  imageA?: string;
  imageB?: string;
  device?: string;
  userAgent?: string;
  width?: number;
  height?: number;
  deviceScaleFactor?: number;
  hasTouch?: boolean;
  isLandscape?: boolean;
  isMobile?: boolean;
  allowableMismatchedPixels: number;
  allowableMismatchedRatio: number;
  testPath?: string;
  cacheKey?: string;
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
