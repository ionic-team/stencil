import * as d from '../../declarations';
import { writeE2EScreenshot } from '../../screenshot/data-generator';
import * as pd from './puppeteer-declarations';
import * as puppeteer from 'puppeteer';


export function initE2EPageScreenshot(page: pd.E2EPageInternal) {
  page._screenshot = (page as any).screenshot;

  if ((process.env as d.E2EProcessEnv).__STENCIL_SCREENSHOTS__ === 'true') {
    page.screenshot = screenshot.bind(page, page);

  } else {
    // screen shot not enabled, so don't bother creating all this
    (page as any).screenshot = () => Promise.resolve();
  }
}


export async function screenshot(page: pd.E2EPageInternal, uniqueDescription: string, opts: d.E2EScreenshotOptions = {}) {
  const screenshot = await page._screenshot(createPuppeteerScreenshopOptions(opts));

  await writeE2EScreenshot(screenshot, uniqueDescription);
}


function createPuppeteerScreenshopOptions(opts: d.E2EScreenshotOptions) {
  const puppeteerOpts: puppeteer.ScreenshotOptions = {
    type: 'png',
    fullPage: opts.fullPage,
    omitBackground: opts.omitBackground
  };

  if (opts.clip) {
    puppeteerOpts.clip = {
      x: opts.clip.x,
      y: opts.clip.y,
      width: opts.clip.width,
      height: opts.clip.height
    };
  }
  (puppeteerOpts as any).encoding = 'binary';

  return puppeteerOpts;
}
