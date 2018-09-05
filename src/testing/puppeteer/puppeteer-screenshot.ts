import * as pd from './puppeteer-declarations';


export function initE2EPageScreenshot(page: pd.E2EPageInternal) {
  page._screenshot = (page as any).screenshot;

  (page as any).screenshot = () => Promise.resolve();
}
