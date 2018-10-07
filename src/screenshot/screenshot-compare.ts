import * as d from '../declarations';
import { getMismatchedPixels } from './pixel-match';
import { normalizePath } from '../compiler/util';
import { writeScreenshotData, writeScreenshotImage } from './screenshot-fs';
import { createHash } from 'crypto';
import { join, relative } from 'path';


export async function compareScreenshot(emulateConfig: d.EmulateConfig, screenshotBuildData: d.ScreenshotBuildData, screenshotBuf: Buffer, desc: string, testPath: string, pixelmatchThreshold: number) {
  const hash = createHash('md5').update(screenshotBuf).digest('hex');
  const localImageName = `${hash}.png`;
  const imagePath = join(screenshotBuildData.imagesDir, localImageName);

  if (testPath) {
    testPath = normalizePath(relative(screenshotBuildData.rootDir, testPath));
  }

  // create the data we'll be saving as json
  // the "id" is what we use as a key to compare to sets of data
  // the "image" is a hash of the image file name
  // and what we can use to quickly see if they're identical or not
  const screenshot: d.Screenshot = {
    id: getScreenshotId(emulateConfig, desc),
    image: localImageName,
    device: emulateConfig.device,
    userAgent: emulateConfig.userAgent,
    desc: desc,
    testPath: testPath,
    width: emulateConfig.viewport.width,
    height: emulateConfig.viewport.height,
    deviceScaleFactor: emulateConfig.viewport.deviceScaleFactor,
    hasTouch: emulateConfig.viewport.hasTouch,
    isLandscape: emulateConfig.viewport.isLandscape,
    isMobile: emulateConfig.viewport.isMobile
  };

  // write the local build data
  await Promise.all([
    writeScreenshotData(screenshotBuildData.currentBuildDir, screenshot),
    writeScreenshotImage(imagePath, screenshotBuf)
  ]);

  // this is the data that'll get used by the jest matcher
  const compare: d.ScreenshotCompare = {
    id: screenshot.id,
    desc: screenshot.desc,
    expectedImage: screenshot.image,
    receivedImage: screenshot.image,
    mismatchedPixels: 0,
    mismatchedRatio: 0,
    device: emulateConfig.device,
    userAgent: emulateConfig.userAgent,
    width: emulateConfig.viewport.width,
    height: emulateConfig.viewport.height,
    deviceScaleFactor: emulateConfig.viewport.deviceScaleFactor,
    hasTouch: emulateConfig.viewport.hasTouch,
    isLandscape: emulateConfig.viewport.isLandscape,
    isMobile: emulateConfig.viewport.isMobile,
    allowableMismatchedPixels: screenshotBuildData.allowableMismatchedPixels,
    allowableMismatchedRatio: screenshotBuildData.allowableMismatchedRatio,
    testPath: testPath
  };

  if (screenshotBuildData.updateMaster) {
    // this data is going to become the master data
    // so no need to compare with previous versions
    return compare;
  }

  const masterScreenshotImage = screenshotBuildData.masterScreenshots[screenshot.id];

  if (!masterScreenshotImage) {
    // didn't find a master screenshot to compare it to
    return compare;
  }

  // set that the master data image is the image we're expecting
  compare.expectedImage = masterScreenshotImage;

  const naturalWidth = Math.round(emulateConfig.viewport.width * emulateConfig.viewport.deviceScaleFactor);
  const naturalHeight = Math.round(emulateConfig.viewport.height * emulateConfig.viewport.deviceScaleFactor);

  // compare only if the image hashes are different
  if (compare.expectedImage !== compare.receivedImage) {
    // compare the two images pixel by pixel to
    // figure out a mismatch value
    compare.mismatchedPixels = await getMismatchedPixels(
      screenshotBuildData.cacheDir,
      screenshotBuildData.imagesDir,
      compare.expectedImage,
      compare.receivedImage,
      naturalWidth,
      naturalHeight,
      pixelmatchThreshold
    );
  }

  compare.mismatchedRatio = (compare.mismatchedPixels / (naturalWidth * naturalHeight));

  return compare;
}


function getScreenshotId(emulateConfig: d.EmulateConfig, uniqueDescription: string) {
  if (typeof uniqueDescription !== 'string' || uniqueDescription.trim().length === 0) {
    throw new Error(`invalid test description`);
  }

  const hash = createHash('md5');

  hash.update(uniqueDescription + ':');
  hash.update(emulateConfig.userAgent + ':');
  hash.update(emulateConfig.viewport.width + ':');
  hash.update(emulateConfig.viewport.height + ':');
  hash.update(emulateConfig.viewport.deviceScaleFactor + ':');
  hash.update(emulateConfig.viewport.hasTouch + ':');
  hash.update(emulateConfig.viewport.isMobile + ':');

  return hash.digest('hex').substr(0, 8).toLowerCase();
}
