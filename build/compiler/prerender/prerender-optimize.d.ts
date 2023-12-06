import type * as d from '../../declarations';
import { PrerenderContext } from './prerender-worker-ctx';
export declare const inlineExternalStyleSheets: (sys: d.CompilerSystem, appDir: string, doc: Document) => Promise<void>;
export declare const minifyScriptElements: (doc: Document, addMinifiedAttr: boolean) => Promise<void>;
export declare const minifyStyleElements: (sys: d.CompilerSystem, appDir: string, doc: Document, currentUrl: URL, addMinifiedAttr: boolean) => Promise<void>;
export declare const excludeStaticComponents: (doc: Document, hydrateOpts: d.PrerenderHydrateOptions, hydrateResults: d.HydrateResults) => void;
export declare const addModulePreloads: (doc: Document, hydrateOpts: d.PrerenderHydrateOptions, hydrateResults: d.HydrateResults, componentGraph: Map<string, string[]>) => boolean;
export declare const removeModulePreloads: (doc: Document) => void;
export declare const removeStencilScripts: (doc: Document) => void;
export declare const hasStencilScript: (doc: Document) => boolean;
export declare const hashAssets: (sys: d.CompilerSystem, prerenderCtx: PrerenderContext, diagnostics: d.Diagnostic[], hydrateOpts: d.PrerenderHydrateOptions, appDir: string, doc: Document, currentUrl: URL) => Promise<void>;
export declare const getAttrUrls: (attrName: string, attrValue: string) => {
    src: string;
    descriptor?: string;
}[];
export declare const setAttrUrls: (url: URL, descriptor: string) => string;
