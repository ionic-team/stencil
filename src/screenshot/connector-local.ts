import * as d from '../declarations';
import * as fs from './screenshot-fs';
import * as path from 'path';
import { normalizePath } from '../compiler/util';
import { ScreenshotConnector } from './connector-base';
import { URL } from 'url';


export class ScreenshotLocalConnector extends ScreenshotConnector {

  async publishBuild(build: d.ScreenshotBuild) {
    let masterBuild = await this.getMasterBuild();

    if (this.updateMaster || !masterBuild) {
      masterBuild = {
        id: 'master',
        message: 'Master',
        author: '',
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

    await this.generateJsonpDataUris(build);

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
      var compare = document.createElement('screenshot-compare');
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
