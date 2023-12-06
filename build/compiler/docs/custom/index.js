import { isOutputTargetDocsCustom } from '@utils';
export const generateCustomDocs = async (config, docsData, outputTargets) => {
    const customOutputTargets = outputTargets.filter(isOutputTargetDocsCustom);
    if (customOutputTargets.length === 0) {
        return;
    }
    await Promise.all(customOutputTargets.map(async (customOutput) => {
        try {
            await customOutput.generator(docsData, config);
        }
        catch (e) {
            config.logger.error(`uncaught custom docs error: ${e}`);
        }
    }));
};
//# sourceMappingURL=index.js.map