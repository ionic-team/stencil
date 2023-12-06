const prerenderCtx = {
    buildId: null,
    componentGraph: null,
    prerenderConfig: null,
    ensuredDirs: null,
    templateHtml: null,
    hashedFile: null,
};
export const getPrerenderCtx = (prerenderRequest) => {
    if (prerenderRequest.buildId !== prerenderCtx.buildId) {
        prerenderCtx.buildId = prerenderRequest.buildId;
        prerenderCtx.componentGraph = null;
        prerenderCtx.prerenderConfig = null;
        prerenderCtx.ensuredDirs = new Set();
        prerenderCtx.templateHtml = null;
        prerenderCtx.hashedFile = new Set();
    }
    return prerenderCtx;
};
//# sourceMappingURL=prerender-worker-ctx.js.map