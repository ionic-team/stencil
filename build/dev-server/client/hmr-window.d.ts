export declare const hmrWindow: (data: {
    window: Window;
    hmr: any;
}) => {
    updatedComponents: string[];
    updatedExternalStyles: string[];
    updatedInlineStyles: string[];
    updatedImages: string[];
    versionId: string;
};
