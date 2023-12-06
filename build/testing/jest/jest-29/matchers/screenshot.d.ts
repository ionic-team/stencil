import type * as d from '@stencil/core/internal';
export declare function toMatchScreenshot(compare: d.ScreenshotDiff, opts?: d.MatchScreenshotOptions): {
    message: () => string;
    pass: boolean;
};
