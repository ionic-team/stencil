import type {
  E2EProcessEnv,
  EmulateConfig,
  JestEnvironmentGlobal,
  ScreenshotBuildData,
  ScreenshotDiff,
  ScreenshotOptions,
} from '@stencil/core/internal';
import { compareScreenshot } from '../../screenshot/screenshot-compare';
import type * as pd from './puppeteer-declarations';
import type * as puppeteer from 'puppeteer';

export function initPageScreenshot(page: pd.E2EPageInternal) {
  const env = process.env as E2EProcessEnv;

  if (env.__STENCIL_SCREENSHOT__ === 'true') {
    page.compareScreenshot = (a?: any, b?: any) => {
      const jestEnv: JestEnvironmentGlobal = global as any;

      let desc = '';
      let testPath = '';

      if (jestEnv.currentSpec) {
        if (typeof jestEnv.currentSpec.fullName === 'string') {
          desc = jestEnv.currentSpec.fullName;
        }
        if (typeof jestEnv.currentSpec.testPath === 'string') {
          testPath = jestEnv.currentSpec.testPath;
        }
      }
      let opts: ScreenshotOptions;

      if (typeof a === 'string') {
        if (desc.length > 0) {
          desc += ', ' + a;
        } else {
          desc = a;
        }

        if (typeof b === 'object') {
          opts = b;
        }
      } else if (typeof a === 'object') {
        opts = a;
      }

      desc = desc.trim();
      opts = opts || {};

      if (!desc) {
        throw new Error(`Invalid screenshot description in "${testPath}"`);
      }

      if (jestEnv.screenshotDescriptions.has(desc)) {
        throw new Error(
          `Screenshot description "${desc}" found in "${testPath}" cannot be used for multiple screenshots and must be unique. To make screenshot descriptions unique within the same test, use the first argument to "compareScreenshot", such as "compareScreenshot('more to the description')".`
        );
      }
      jestEnv.screenshotDescriptions.add(desc);

      return pageCompareScreenshot(page, env, desc, testPath, opts);
    };
  } else {
    // screen shot not enabled, so just skip over all the logic
    page.compareScreenshot = async () => {
      const diff: ScreenshotDiff = {
        mismatchedPixels: 0,
        allowableMismatchedPixels: 1,
        allowableMismatchedRatio: 1,
        desc: '',
        width: 1,
        height: 1,
        deviceScaleFactor: 1,
      };
      return diff;
    };
  }
}

export async function pageCompareScreenshot(
  page: pd.E2EPageInternal,
  env: E2EProcessEnv,
  desc: string,
  testPath: string,
  opts: ScreenshotOptions
) {
  if (typeof env.__STENCIL_EMULATE__ !== 'string') {
    throw new Error(`compareScreenshot, missing screenshot emulate env var`);
  }

  if (typeof env.__STENCIL_SCREENSHOT_BUILD__ !== 'string') {
    throw new Error(`compareScreenshot, missing screen build env var`);
  }

  const emulateConfig = JSON.parse(env.__STENCIL_EMULATE__) as EmulateConfig;
  const screenshotBuildData = JSON.parse(env.__STENCIL_SCREENSHOT_BUILD__) as ScreenshotBuildData;

  await wait(screenshotBuildData.timeoutBeforeScreenshot);
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => {
        resolve();
      });
    });
  });

  const screenshotOpts = createPuppeteerScreenshopOptions(opts);
  const screenshotBuf = await page.screenshot(screenshotOpts);
  const pixelmatchThreshold =
    typeof opts.pixelmatchThreshold === 'number' ? opts.pixelmatchThreshold : screenshotBuildData.pixelmatchThreshold;

  let width = emulateConfig.viewport.width;
  let height = emulateConfig.viewport.height;

  if (opts && opts.clip) {
    if (typeof opts.clip.width === 'number') {
      width = opts.clip.width;
    }
    if (typeof opts.clip.height === 'number') {
      height = opts.clip.height;
    }
  }

  const results = await compareScreenshot(
    emulateConfig,
    screenshotBuildData,
    screenshotBuf,
    desc,
    width,
    height,
    testPath,
    pixelmatchThreshold
  );

  return results;
}

function createPuppeteerScreenshopOptions(opts: ScreenshotOptions) {
  const puppeteerOpts: puppeteer.ScreenshotOptions = {
    type: 'png',
    fullPage: opts.fullPage,
    omitBackground: opts.omitBackground,
    encoding: 'binary',
  };

  if (opts.clip) {
    puppeteerOpts.clip = {
      x: opts.clip.x,
      y: opts.clip.y,
      width: opts.clip.width,
      height: opts.clip.height,
    };
  }

  return puppeteerOpts;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
