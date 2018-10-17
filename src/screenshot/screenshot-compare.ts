import * as d from '../declarations';
import { getMismatchedPixels } from './pixel-match';
import { normalizePath } from '../compiler/util';
import { writeScreenshotData, writeScreenshotImage } from './screenshot-fs';
import { createHash } from 'crypto';
import { join, relative } from 'path';


export async function compareScreenshot(emulateConfig: d.EmulateConfig, screenshotBuildData: d.ScreenshotBuildData, currentScreenshotBuf: Buffer, desc: string, testPath: string, pixelmatchThreshold: number) {
  const currentImageHash = createHash('md5').update(currentScreenshotBuf).digest('hex');
  const currentImageName = `${currentImageHash}.png`;
  const currentImagePath = join(screenshotBuildData.imagesDir, currentImageName);

  if (testPath) {
    testPath = normalizePath(relative(screenshotBuildData.rootDir, testPath));
  }

  // create the data we'll be saving as json
  // the "id" is what we use as a key to compare to sets of data
  // the "image" is a hash of the image file name
  // and what we can use to quickly see if they're identical or not
  const screenshotId = getScreenshotId(emulateConfig, desc);

  const screenshot: d.Screenshot = {
    id: screenshotId,
    image: currentImageName,
    device: emulateConfig.device,
    userAgent: emulateConfig.userAgent,
    desc: desc,
    testPath: testPath,
    width: emulateConfig.viewport.width,
    height: emulateConfig.viewport.height,
    deviceScaleFactor: emulateConfig.viewport.deviceScaleFactor,
    hasTouch: emulateConfig.viewport.hasTouch,
    isLandscape: emulateConfig.viewport.isLandscape,
    isMobile: emulateConfig.viewport.isMobile,
    diff: {
      id: screenshotId,
      desc: desc,
      imageA: currentImageName,
      imageB: currentImageName,
      mismatchedPixels: 0,
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
    }
  };

  if (screenshotBuildData.updateMaster) {
    // this data is going to become the master data
    // so no need to compare with previous versions

    await writeScreenshotImage(currentImagePath, currentScreenshotBuf);
    currentScreenshotBuf = null;

    await writeScreenshotData(screenshotBuildData.currentBuildDir, screenshot);

    return screenshot.diff;
  }

  const masterScreenshotImage = screenshotBuildData.masterScreenshots[screenshot.id];

  if (!masterScreenshotImage) {
    // didn't find a master screenshot to compare it to

    // write the build data
    await writeScreenshotImage(currentImagePath, currentScreenshotBuf);
    currentScreenshotBuf = null;

    await writeScreenshotData(screenshotBuildData.currentBuildDir, screenshot);

    return screenshot.diff;
  }

  // set that the master data image as the image we're going to compare the current image to
  // imageB is already set as the current image
  screenshot.diff.imageA = masterScreenshotImage;

  // compare only if the image hashes are different
  if (screenshot.diff.imageA !== screenshot.diff.imageB) {
    // we know the images are not identical since they have different hashes

    // create a cache key from the two hashes
    screenshot.diff.cacheKey = getCacheKey(screenshot.diff.imageA, screenshot.diff.imageB, pixelmatchThreshold);

    // let's see if we've already calculated the mismatched pixels already
    const cachedMismatchedPixels = screenshotBuildData.cache[screenshot.diff.cacheKey];
    if (typeof cachedMismatchedPixels === 'number' && !isNaN(cachedMismatchedPixels)) {
      // awesome, we've got cached data so we
      // can skip having to do the heavy pixelmatch comparison
      screenshot.diff.mismatchedPixels = cachedMismatchedPixels;
      console.log('cachehit', screenshot.diff.cacheKey, screenshot.diff.mismatchedPixels)

    } else {
      // images are not identical
      // and we don't have any cached data so let's
      // compare the two images pixel by pixel to
      // figure out a mismatch value

      // figure out the actual width and height of the screenshot
      const naturalWidth = Math.round(emulateConfig.viewport.width * emulateConfig.viewport.deviceScaleFactor);
      const naturalHeight = Math.round(emulateConfig.viewport.height * emulateConfig.viewport.deviceScaleFactor);

      screenshot.diff.mismatchedPixels = await getMismatchedPixels(
        screenshotBuildData.imagesDir,
        screenshot.diff.imageA,
        currentScreenshotBuf,
        naturalWidth,
        naturalHeight,
        pixelmatchThreshold
      );
    }
  }

  await writeScreenshotImage(currentImagePath, currentScreenshotBuf);
  currentScreenshotBuf = null;

  await writeScreenshotData(screenshotBuildData.currentBuildDir, screenshot);

  return screenshot.diff;
}


function getCacheKey(imageA: string, imageB: string, pixelmatchThreshold: number) {
  const hash = createHash('md5');
  hash.update(`${imageA}:${imageB}:${pixelmatchThreshold}`);
  return hash.digest('hex').substr(0, 10);
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
