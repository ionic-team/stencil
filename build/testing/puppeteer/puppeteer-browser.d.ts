import type { ValidatedConfig } from '@stencil/core/internal';
import type * as puppeteer from 'puppeteer';
export declare function startPuppeteerBrowser(config: ValidatedConfig): Promise<puppeteer.Browser>;
export declare function connectBrowser(): Promise<any>;
export declare function disconnectBrowser(browser: puppeteer.Browser): Promise<void>;
export declare function newBrowserPage(browser: puppeteer.Browser): Promise<puppeteer.Page>;
