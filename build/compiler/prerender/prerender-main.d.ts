import type * as d from '../../declarations';
export declare const createPrerenderer: (config: d.ValidatedConfig) => Promise<{
    start: (opts: d.PrerenderStartOptions) => Promise<d.PrerenderResults>;
}>;
