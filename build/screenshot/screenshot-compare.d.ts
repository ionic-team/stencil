/// <reference types="node" />
import type * as d from '@stencil/core/internal';
export declare function compareScreenshot(emulateConfig: d.EmulateConfig, screenshotBuildData: d.ScreenshotBuildData, currentScreenshotBuf: Buffer, desc: string, width: number, height: number, testPath: string, pixelmatchThreshold: number): Promise<{
    id: string;
    desc: string;
    imageA: string;
    imageB: string;
    mismatchedPixels: number;
    device: string;
    userAgent: string;
    width: number;
    height: number;
    deviceScaleFactor: number;
    hasTouch: boolean;
    isLandscape: boolean;
    isMobile: boolean;
    allowableMismatchedPixels: number;
    allowableMismatchedRatio: number;
    testPath: string;
    cacheKey: string;
}>;
