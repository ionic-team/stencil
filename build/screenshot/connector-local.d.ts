import type * as d from '@stencil/core/internal';
import { ScreenshotConnector } from './connector-base';
export declare class ScreenshotLocalConnector extends ScreenshotConnector {
    publishBuild(results: d.ScreenshotBuildResults): Promise<d.ScreenshotBuildResults>;
    getScreenshotCache(): Promise<d.ScreenshotCache>;
    updateScreenshotCache(cache: d.ScreenshotCache, buildResults: d.ScreenshotBuildResults): Promise<d.ScreenshotCache>;
}
