import { buildError, relative } from '@utils';
export const validateTranspiledComponents = (config, buildCtx) => {
    for (const cmp of buildCtx.components) {
        validateUniqueTagNames(config, buildCtx, cmp);
    }
};
const validateUniqueTagNames = (config, buildCtx, cmp) => {
    const tagName = cmp.tagName;
    const cmpsWithTagName = buildCtx.components.filter((c) => c.tagName === tagName);
    if (cmpsWithTagName.length > 1) {
        const err = buildError(buildCtx.diagnostics);
        err.header = `Component Tag Name "${tagName}" Must Be Unique`;
        err.messageText = `Please update the components so "${tagName}" is only used once: ${cmpsWithTagName
            .map((c) => relative(config.rootDir, c.sourceFilePath))
            .join(' ')}`;
    }
};
//# sourceMappingURL=validate-components.js.map