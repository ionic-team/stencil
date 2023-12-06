import type * as d from '../../declarations';
export declare const generateTemplateHtml: (config: d.ValidatedConfig, prerenderConfig: d.PrerenderConfig, diagnostics: d.Diagnostic[], isDebug: boolean, srcIndexHtmlPath: string, outputTarget: d.OutputTargetWww, hydrateOpts: d.PrerenderHydrateOptions, manager: d.PrerenderManager) => Promise<{
    html: string;
    staticSite: boolean;
}>;
