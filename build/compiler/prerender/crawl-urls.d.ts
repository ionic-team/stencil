import type * as d from '../../declarations';
export declare const crawlAnchorsForNextUrls: (prerenderConfig: d.PrerenderConfig, diagnostics: d.Diagnostic[], baseUrl: URL, currentUrl: URL, parsedAnchors: d.HydrateAnchorElement[]) => string[];
export declare const standardNormalizeHref: (prerenderConfig: d.PrerenderConfig, diagnostics: d.Diagnostic[], url: URL) => string;
