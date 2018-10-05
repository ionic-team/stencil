import * as d from '../declarations';
import * as fs from './screenshot-fs';
import * as path from 'path';
import * as os from 'os';
import { normalizePath } from '../compiler/util';
import { URL } from 'url';


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
    this.buildMessage = opts.buildMessage;
    this.cacheDir = opts.cacheDir;
    this.packageDir = opts.packageDir;
    this.rootDir = opts.rootDir;
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

    if (!this.updateMaster) {
      await this.pullMasterBuild();
    }
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
      timestamp: Date.now(),
      screenshots: screenshots
    };

    await fs.emptyDir(this.currentBuildDir);
    await fs.rmDir(this.currentBuildDir);

    return build;
  }

  async publishBuild(build: d.ScreenshotBuild) {
    let masterBuild = await this.getMasterBuild();

    if (this.updateMaster || !masterBuild) {
      masterBuild = {
        id: 'master',
        message: 'Master',
        timestamp: Date.now(),
        screenshots: []
      };
    }

    build.screenshots.forEach(currentScreenshot => {
      const masterHasScreenshot = masterBuild.screenshots.some(masterScreenshot => {
        return currentScreenshot.id === masterScreenshot.id;
      });

      if (!masterHasScreenshot) {
        masterBuild.screenshots.push(Object.assign({}, currentScreenshot));
      }
    });

    this.sortScreenshots(masterBuild.screenshots);

    await fs.writeFile(this.masterBuildFilePath, JSON.stringify(masterBuild, null, 2));

    for (let i = 0; i < build.screenshots.length; i++) {
      const screenshot = build.screenshots[i];
      const imageName = screenshot.image;
      const jsonpFileName = `screenshot_${imageName}.js`;
      const jsonFilePath = path.join(this.cacheDir, jsonpFileName);
      const jsonpExists = await fs.fileExists(jsonFilePath);
      if (jsonpExists) {
        continue;
      }

      const imageFilePath = path.join(this.imagesDir, imageName);
      const imageBuf = await fs.readFileBuffer(imageFilePath);
      const jsonpContent = `loadScreenshot("${imageName}","data:image/png;base64,${imageBuf.toString('base64')}",${screenshot.width},${screenshot.height},${screenshot.deviceScaleFactor},${screenshot.naturalWidth},${screenshot.naturalHeight});`;
      await fs.writeFile(jsonFilePath, jsonpContent);
    }

    const compareAppSourceDir = path.join(this.packageDir, 'screenshot', 'compare');
    const appSrcUrl = normalizePath(path.relative(this.screenshotDir, compareAppSourceDir));
    const imagesUrl = normalizePath(path.relative(this.screenshotDir, this.imagesDir));
    const jsonpUrl = normalizePath(path.relative(this.screenshotDir, this.cacheDir));

    const compareAppHtml = createLocalCompareApp(appSrcUrl, imagesUrl, jsonpUrl, masterBuild, build);

    const compareAppFileName = 'compare.html';
    const compareAppFilePath = path.join(this.screenshotDir, compareAppFileName);
    await fs.writeFile(compareAppFilePath, compareAppHtml);

    const gitIgnorePath = path.join(this.screenshotDir, '.gitignore');
    const gitIgnoreExists = await fs.fileExists(gitIgnorePath);
    if (!gitIgnoreExists) {
      const content: string[] = [
        this.imagesDirName,
        this.buildsDirName,
        compareAppFileName
      ];
      await fs.writeFile(gitIgnorePath, content.join('\n'));
    }

    const url = new URL(`file://${compareAppFilePath}`);

    const results: d.PublishBuildResults = {
      compareUrl: url.href,
      screenshotsCompared: build.screenshots.length,
      masterBuild: masterBuild,
      currentBuild: build
    };

    return results;
  }

  async toJson() {
    const masterScreenshots: {[screenshotId: string]: string} = {};
    const masterBuild = await this.getMasterBuild();
    if (masterBuild) {
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
    screenshots.sort((a, b) => {
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

    return screenshots;
  }

}



function createLocalCompareApp(appSrcUrl: string, imagesUrl: string, jsonpUrl: string, masterBuild: d.ScreenshotBuild, currentBuild: d.ScreenshotBuild) {
  return `<!doctype html>
<html dir="ltr" lang="en">
<head>
  <meta charset="utf-8">
  <title>Stencil Screenshot Visual Diff</title>
  <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="x-ua-compatible" content="IE=Edge">
  <link href="${appSrcUrl}/build/app.css" rel="stylesheet">
  <script src="${appSrcUrl}/build/app.js"></script>
  <link rel="icon" type="image/x-icon" href="${appSrcUrl}/assets/favicon.ico">
</head>
<body>
  <script>
    (function() {
      var compare = document.createElement('local-compare');
      compare.appSrcUrl = '${appSrcUrl}';
      compare.imagesUrl = '${imagesUrl}/';
      compare.jsonpUrl = '${jsonpUrl}/';
      compare.a = ${JSON.stringify(masterBuild)};
      compare.b = ${JSON.stringify(currentBuild)};
      document.body.appendChild(compare);
    })();
  </script>
</body>
</html>`;
}
