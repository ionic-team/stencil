export declare const minifyCss: (input: {
    css: string;
    resolveUrl?: (url: string) => Promise<string> | string;
}) => Promise<string>;
