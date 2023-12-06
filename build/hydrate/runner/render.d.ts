import type { HydrateDocumentOptions, HydrateFactoryOptions, HydrateResults, SerializeDocumentOptions } from '../../declarations';
export declare function renderToString(html: string | any, options?: SerializeDocumentOptions): Promise<HydrateResults>;
export declare function hydrateDocument(doc: any | string, options?: HydrateDocumentOptions): Promise<HydrateResults>;
export declare function serializeDocumentToString(doc: any, opts: HydrateFactoryOptions): string;
