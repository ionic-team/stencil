import type * as d from '../../declarations';
export interface PrerenderContext {
    buildId: string;
    componentGraph: Map<string, string[]>;
    prerenderConfig: d.PrerenderConfig;
    ensuredDirs: Set<string>;
    templateHtml: string;
    hashedFile: Set<string>;
}
export declare const getPrerenderCtx: (prerenderRequest: d.PrerenderUrlRequest) => PrerenderContext;
