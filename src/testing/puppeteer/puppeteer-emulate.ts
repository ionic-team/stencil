import * as d from '../../declarations';
import * as puppeteer from 'puppeteer';


export async function setScreenshotEmulateData(userEmulateConfig: d.EmulateConfig, env: d.E2EProcessEnv) {
  const screenshotEmulate: d.EmulateConfig = {
    width: 800,
    height: 600,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    isLandscape: false
  };

  if (typeof userEmulateConfig.device === 'string') {
    try {
      const deviceDescriptors = require(env.__STENCIL_PUPPETEER_MODULE__ + '/DeviceDescriptors');

      const puppeteerEmulateOpts = deviceDescriptors[userEmulateConfig.device] as puppeteer.EmulateOptions;
      if (!puppeteerEmulateOpts) {
        console.error(`invalid emulate device: ${userEmulateConfig.device}`);
        return;
      }

      screenshotEmulate.device = userEmulateConfig.device;
      screenshotEmulate.width = puppeteerEmulateOpts.viewport.width;
      screenshotEmulate.height = puppeteerEmulateOpts.viewport.height;
      screenshotEmulate.deviceScaleFactor = puppeteerEmulateOpts.viewport.deviceScaleFactor;
      screenshotEmulate.isMobile = puppeteerEmulateOpts.viewport.isMobile;
      screenshotEmulate.hasTouch = puppeteerEmulateOpts.viewport.hasTouch;
      screenshotEmulate.isLandscape = puppeteerEmulateOpts.viewport.isLandscape;
      screenshotEmulate.userAgent = puppeteerEmulateOpts.userAgent;

    } catch (e) {
      console.error('error loading puppeteer DeviceDescriptors', e);
      return;
    }
  }

  if (typeof userEmulateConfig.width === 'number') {
    screenshotEmulate.width = userEmulateConfig.width;
  }

  if (typeof userEmulateConfig.height === 'number') {
    screenshotEmulate.height = userEmulateConfig.height;
  }

  if (typeof userEmulateConfig.hasTouch === 'boolean') {
    screenshotEmulate.hasTouch = userEmulateConfig.hasTouch;
  }

  if (typeof userEmulateConfig.isLandscape === 'boolean') {
    screenshotEmulate.isLandscape = userEmulateConfig.isLandscape;
  }

  if (typeof userEmulateConfig.isMobile === 'boolean') {
    screenshotEmulate.isMobile = userEmulateConfig.isMobile;
  }

  if (typeof userEmulateConfig.userAgent === 'string') {
    screenshotEmulate.userAgent = userEmulateConfig.userAgent;
  }

  env.__STENCIL_EMULATE__ = JSON.stringify(screenshotEmulate);
}
