import * as d from '../declarations';
import * as fs from './screenshot-fs';
import * as path from 'path';
import { normalizePath } from '../compiler/util';
import { URL } from 'url';


export class ScreenshotConnector implements d.ScreenshotConnector {
  rootDir: string;
  cacheDir: string;
  screenshotDirName = 'screenshot';
  imagesDirName = 'images';
  buildsDirName = 'builds';
  currentBuildDirName = 'current';
  compareAppFileName = 'compare.html';
  masterFileName = 'master.json';
  localFileName = 'local.json';
  logger: d.Logger;
  buildId: string;
  buildMessage: string;
  compareAppDir: string;
  screenshotDir: string;
  imagesDir: string;
  buildsDir: string;
  currentBuildDir: string;
  updateMaster: boolean;
  compareUrl: string;
  build: d.ScreenshotBuild;
  allowableMismatchedRatio: number;
  allowableMismatchedPixels: number;
  pixelmatchThreshold: number;

  async initBuild(opts: d.ScreenshotConnectorOptions) {
    this.logger = opts.logger;

    this.buildId = opts.buildId;
    this.buildMessage = opts.buildMessage;
    this.cacheDir = opts.cacheDir;
    this.rootDir = opts.rootDir;
    this.compareAppDir = opts.compareAppDir;
    this.updateMaster = !!opts.updateMaster;
    this.allowableMismatchedPixels = opts.allowableMismatchedPixels;
    this.allowableMismatchedRatio = opts.allowableMismatchedRatio;
    this.pixelmatchThreshold = opts.pixelmatchThreshold;

    this.logger.debug(`screenshot build: ${this.buildId}, ${this.buildMessage}, updateMaster: ${this.updateMaster}`);
    this.logger.debug(`screenshot, allowableMismatchedPixels: ${this.allowableMismatchedPixels}, allowableMismatchedRatio: ${this.allowableMismatchedRatio}, pixelmatchThreshold: ${this.pixelmatchThreshold}`);

    if (typeof opts.compareAppFileName === 'string') {
      this.compareAppFileName = opts.compareAppFileName;
    }

    if (typeof opts.screenshotDirName === 'string') {
      this.screenshotDirName = opts.screenshotDirName;
    }

    if (typeof opts.imagesDirName === 'string') {
      this.imagesDirName = opts.imagesDirName;
    }

    if (typeof opts.buildsDirName === 'string') {
      this.buildsDirName = opts.buildsDirName;
    }

    if (typeof opts.currentBuildDirName === 'string') {
      this.currentBuildDirName = opts.currentBuildDirName;
    }

    this.screenshotDir = path.join(this.rootDir, this.screenshotDirName);
    this.imagesDir = path.join(this.screenshotDir, this.imagesDirName);
    this.buildsDir = path.join(this.screenshotDir, this.buildsDirName);
    this.currentBuildDir = path.join(this.buildsDir, this.currentBuildDirName);

    this.logger.debug(`screenshotDirPath: ${this.screenshotDir}`);
    this.logger.debug(`imagesDirPath: ${this.imagesDir}`);
    this.logger.debug(`buildsDirPath: ${this.buildsDir}`);

    await fs.mkDir(this.screenshotDir);

    await Promise.all([
      fs.mkDir(this.imagesDir),
      fs.mkDir(this.buildsDir),
    ]);

    await fs.mkDir(this.currentBuildDir);

    const fsTasks: Promise<any>[] = [];

    if (!this.updateMaster) {
      await this.pullMasterBuild();
    }

    const gitIgnorePath = path.join(this.screenshotDir, '.gitignore');
    const gitIgnoreExists = await fs.fileExists(gitIgnorePath);
    if (!gitIgnoreExists) {
      const content: string[] = [];

      if (opts.gitIgnoreImages !== false) {
        content.push(this.imagesDirName);
      }
      if (opts.gitIgnoreLocal !== false) {
        content.push(this.buildsDirName);
      }
      if (opts.gitIgnoreCompareApp !== false) {
        content.push(this.compareAppFileName);
      }

      if (content.length) {
        fsTasks.push(fs.writeFile(gitIgnorePath, content.join('\n')));
      }
    }

    const compareAppFilePath = path.join(this.screenshotDir, this.compareAppFileName);
    const url = new URL(`file://${compareAppFilePath}`);
    this.compareUrl = url.href;

    this.logger.debug(`compareUrl: ${this.compareUrl}`);

    await Promise.all(fsTasks);
  }

  async pullMasterBuild() {/**/}

  async completeBuild() {
    const localFilePaths = (await fs.readDir(this.currentBuildDir)).map(f => path.join(this.currentBuildDir, f)).filter(f => f.endsWith('.json'));
    const localScreenshots = await Promise.all(localFilePaths.map(async f => JSON.parse(await fs.readFile(f)) as d.ScreenshotData));

    sortScreenshots(localScreenshots);

    this.build = {
      id: this.buildId,
      message: this.buildMessage,
      screenshots: localScreenshots
    };

    await fs.emptyDir(this.currentBuildDir);
    await fs.rmDir(this.currentBuildDir);

    const localBuildPath = path.join(this.buildsDir, this.localFileName);
    const masterBuildPath = path.join(this.buildsDir, this.masterFileName);
    const serializedLocalBuild = JSON.stringify(this.build, null, 2);

    await fs.writeFile(localBuildPath, serializedLocalBuild);

    if (this.updateMaster || !(await fs.fileExists(masterBuildPath))) {
      await fs.writeFile(masterBuildPath, serializedLocalBuild);
    }

    const masterBuiltContent = await fs.readFile(masterBuildPath);
    const masterBuild = JSON.parse(masterBuiltContent) as d.ScreenshotBuild;

    masterBuild.id = 'master';
    masterBuild.message = `Master`;

    this.build.screenshots.forEach(localScreenshot => {
      const masterHasScreenshot = masterBuild.screenshots.some(masterScreenshot => {
        return localScreenshot.id === masterScreenshot.id;
      });

      if (!masterHasScreenshot) {
        masterBuild.screenshots.push(Object.assign({}, localScreenshot));
      }
    });

    sortScreenshots(masterBuild.screenshots);
    const serializedMasterBuild = JSON.stringify(masterBuild, null, 2);
    await fs.writeFile(masterBuildPath, serializedMasterBuild);

    for (let i = 0; i < localScreenshots.length; i++) {
      const screenshot = localScreenshots[i];
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

    await createLocalCompareApp(this.screenshotDir, this.compareAppDir, this.compareAppFileName, this.imagesDir, this.cacheDir, masterBuild, this.build);
  }

  async publishBuild() {/**/}

  getComparisonSummaryUrl() {
    return this.compareUrl;
  }

  getTotalScreenshotImages() {
    return this.build.screenshots.length;
  }

  toJson() {
    const screenshotBuild: d.ScreenshotBuildData = {
      id: this.buildId,
      rootDir: this.rootDir,
      cacheDir: this.cacheDir,
      screenshotDirPath: this.screenshotDir,
      imagesDirPath: this.imagesDir,
      buildsDirPath: this.buildsDir,
      currentBuildDirPath: this.currentBuildDir,
      updateMaster: this.updateMaster,
      compareUrlTemplate: this.compareUrl,
      allowableMismatchedPixels: this.allowableMismatchedPixels,
      allowableMismatchedRatio: this.allowableMismatchedRatio,
      pixelmatchThreshold: this.pixelmatchThreshold
    };

    return JSON.stringify(screenshotBuild);
  }

}


function sortScreenshots(screenshots: d.ScreenshotData[]) {
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
}


export async function createLocalCompareApp(screenshotDir: string, compareAppDir: string, compareAppFileName: string, imagesDir: string, cacheDir: string, masterBuild: d.ScreenshotBuild, localBuild: d.ScreenshotBuild) {
  const appUrl = normalizePath(path.relative(screenshotDir, compareAppDir));
  const imagesUrl = normalizePath(path.relative(screenshotDir, imagesDir));
  const jsonpUrl = normalizePath(path.relative(screenshotDir, cacheDir));

  const html = createAppIndex(appUrl, imagesUrl, jsonpUrl, masterBuild, localBuild);

  const compareAppPath = path.join(screenshotDir, compareAppFileName);
  await fs.writeFile(compareAppPath, html);
}


function createAppIndex(appUrl: string, imagesUrl: string, jsonpUrl: string, masterBuild: d.ScreenshotBuild, localBuild: d.ScreenshotBuild) {
  return `<!doctype html>
<html dir="ltr" lang="en">
<head>
  <meta charset="utf-8">
  <title>Stencil Screenshot Visual Diff</title>
  <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="x-ua-compatible" content="IE=Edge">
  <link href="${appUrl}/build/app.css" rel="stylesheet">
  <script src="${appUrl}/build/app.js"></script>
  <link rel="icon" type="image/x-icon" href="${appUrl}/assets/favicon.ico">
</head>
<body>
  <ion-app></ion-app>
  <script>
    (function() {
      var compare = document.createElement('local-compare');
      compare.imagesUrl = '${imagesUrl}/';
      compare.jsonpUrl = '${jsonpUrl}/';
      compare.buildA = ${JSON.stringify(masterBuild)};
      compare.buildB = ${JSON.stringify(localBuild)};
      compare.className = 'ion-page';
      document.querySelector('ion-app').appendChild(compare);
    })();
  </script>
</body>
</html>`;
}
