import * as d from '../declarations';
import * as fs from './screenshot-fs';
import * as path from 'path';
import * as os from 'os';


export class ScreenshotConnector implements d.ScreenshotConnector {
  rootDir: string;
  cacheDir: string;
  packageDir: string;
  screenshotDirName = 'screenshot';
  imagesDirName = 'images';
  buildsDirName = 'builds';
  masterBuildFileName = 'master.json';
  logger: d.Logger;
  buildId: string;
  buildMessage: string;
  buildAuthor: string;
  buildTimestamp: number;
  screenshotDir: string;
  imagesDir: string;
  buildsDir: string;
  masterBuildFilePath: string;
  currentBuildDir: string;
  updateMaster: boolean;
  allowableMismatchedRatio: number;
  allowableMismatchedPixels: number;
  pixelmatchThreshold: number;

  async initBuild(opts: d.ScreenshotConnectorOptions) {
    this.logger = opts.logger;

    this.buildId = opts.buildId;
    this.buildMessage = opts.buildMessage || '';
    this.buildAuthor = opts.buildAuthor || '';
    this.buildTimestamp = typeof opts.buildTimestamp === 'number' ? opts.buildTimestamp : Date.now(),
    this.cacheDir = opts.cacheDir;
    this.packageDir = opts.packageDir;
    this.rootDir = opts.rootDir;

    if (!opts.logger) {
      throw new Error(`logger option required`);
    }

    if (typeof opts.buildId !== 'string') {
      throw new Error(`buildId option required`);
    }

    if (typeof opts.cacheDir !== 'string') {
      throw new Error(`cacheDir option required`);
    }

    if (typeof opts.packageDir !== 'string') {
      throw new Error(`packageDir option required`);
    }

    if (typeof opts.rootDir !== 'string') {
      throw new Error(`rootDir option required`);
    }

    this.updateMaster = !!opts.updateMaster;
    this.allowableMismatchedPixels = opts.allowableMismatchedPixels;
    this.allowableMismatchedRatio = opts.allowableMismatchedRatio;
    this.pixelmatchThreshold = opts.pixelmatchThreshold;

    this.logger.debug(`screenshot build: ${this.buildId}, ${this.buildMessage}, updateMaster: ${this.updateMaster}`);
    this.logger.debug(`screenshot, allowableMismatchedPixels: ${this.allowableMismatchedPixels}, allowableMismatchedRatio: ${this.allowableMismatchedRatio}, pixelmatchThreshold: ${this.pixelmatchThreshold}`);

    if (typeof opts.screenshotDirName === 'string') {
      this.screenshotDirName = opts.screenshotDirName;
    }

    if (typeof opts.imagesDirName === 'string') {
      this.imagesDirName = opts.imagesDirName;
    }

    if (typeof opts.buildsDirName === 'string') {
      this.buildsDirName = opts.buildsDirName;
    }

    this.screenshotDir = path.join(this.rootDir, this.screenshotDirName);
    this.imagesDir = path.join(this.screenshotDir, this.imagesDirName);
    this.buildsDir = path.join(this.screenshotDir, this.buildsDirName);
    this.masterBuildFilePath = path.join(this.buildsDir, this.masterBuildFileName);
    this.currentBuildDir = path.join(os.tmpdir(), 'screenshot-build-' + this.buildId);

    this.logger.debug(`screenshotDirPath: ${this.screenshotDir}`);
    this.logger.debug(`imagesDirPath: ${this.imagesDir}`);
    this.logger.debug(`buildsDirPath: ${this.buildsDir}`);
    this.logger.debug(`currentBuildDir: ${this.currentBuildDir}`);

    await fs.mkDir(this.screenshotDir);

    await Promise.all([
      fs.mkDir(this.imagesDir),
      fs.mkDir(this.buildsDir),
      fs.mkDir(this.currentBuildDir)
    ]);
  }

  async pullMasterBuild() {/**/}

  async getMasterBuild() {
    let masterBuild: d.ScreenshotBuild = null;

    try {
      masterBuild = JSON.parse(await fs.readFile(this.masterBuildFilePath));
    } catch (e) {}

    return masterBuild;
  }

  async completeBuild() {
    const filePaths = (await fs.readDir(this.currentBuildDir)).map(f => path.join(this.currentBuildDir, f)).filter(f => f.endsWith('.json'));
    const screenshots = await Promise.all(filePaths.map(async f => JSON.parse(await fs.readFile(f)) as d.Screenshot));

    this.sortScreenshots(screenshots);

    const build: d.ScreenshotBuild = {
      id: this.buildId,
      message: this.buildMessage,
      author: this.buildAuthor,
      timestamp: this.buildTimestamp,
      screenshots: screenshots
    };

    await fs.emptyDir(this.currentBuildDir);
    await fs.rmDir(this.currentBuildDir);

    return build;
  }

  async publishBuild(_build: d.ScreenshotBuild) {
    return null as d.PublishBuildResults;
  }

  async generateJsonpDataUris(build: d.ScreenshotBuild) {
    if (build && Array.isArray(build.screenshots)) {
      for (let i = 0; i < build.screenshots.length; i++) {
        const screenshot = build.screenshots[i];

        const jsonpFileName = `screenshot_${screenshot.image}.js`;
        const jsonFilePath = path.join(this.cacheDir, jsonpFileName);
        const jsonpExists = await fs.fileExists(jsonFilePath);

        if (!jsonpExists) {
          const imageFilePath = path.join(this.imagesDir, screenshot.image);
          const imageBuf = await fs.readFileBuffer(imageFilePath);
          const jsonpContent = `loadScreenshot("${screenshot.image}","data:image/png;base64,${imageBuf.toString('base64')}");`;
          await fs.writeFile(jsonFilePath, jsonpContent);
        }
      }
    }
  }

  toJson(masterBuild: d.ScreenshotBuild) {
    const masterScreenshots: {[screenshotId: string]: string} = {};
    if (masterBuild && Array.isArray(masterBuild.screenshots)) {
      masterBuild.screenshots.forEach(masterScreenshot => {
        masterScreenshots[masterScreenshot.id] = masterScreenshot.image;
      });
    }

    const screenshotBuild: d.ScreenshotBuildData = {
      buildId: this.buildId,
      rootDir: this.rootDir,
      cacheDir: this.cacheDir,
      screenshotDir: this.screenshotDir,
      imagesDir: this.imagesDir,
      buildsDir: this.buildsDir,
      masterScreenshots: masterScreenshots,
      currentBuildDir: this.currentBuildDir,
      updateMaster: this.updateMaster,
      allowableMismatchedPixels: this.allowableMismatchedPixels,
      allowableMismatchedRatio: this.allowableMismatchedRatio,
      pixelmatchThreshold: this.pixelmatchThreshold
    };

    return JSON.stringify(screenshotBuild);
  }

  sortScreenshots(screenshots: d.Screenshot[]) {
    return screenshots.sort((a, b) => {
      if (a.desc && b.desc) {
        if (a.desc.toLowerCase() < b.desc.toLowerCase()) return -1;
        if (a.desc.toLowerCase() > b.desc.toLowerCase()) return 1;
      }

      if (a.device && b.device) {
        if (a.device.toLowerCase() < b.device.toLowerCase()) return -1;
        if (a.device.toLowerCase() > b.device.toLowerCase()) return 1;
      }

      if (a.userAgent && b.userAgent) {
        if (a.userAgent.toLowerCase() < b.userAgent.toLowerCase()) return -1;
        if (a.userAgent.toLowerCase() > b.userAgent.toLowerCase()) return 1;
      }

      if (a.width < b.width) return -1;
      if (a.width > b.width) return 1;

      if (a.height < b.height) return -1;
      if (a.height > b.height) return 1;

      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;

      return 0;
    });
  }

}
