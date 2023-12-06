import { catchError, isOutputTargetCustom } from '@utils';
export const outputCustom = async (config, compilerCtx, buildCtx, docs, outputTargets) => {
    const customOutputTargets = outputTargets.filter(isOutputTargetCustom);
    if (customOutputTargets.length === 0) {
        return;
    }
    await Promise.all(customOutputTargets.map(async (o) => {
        const timespan = buildCtx.createTimeSpan(`generating ${o.name} started`);
        try {
            await o.generator(config, compilerCtx, buildCtx, docs);
        }
        catch (e) {
            catchError(buildCtx.diagnostics, e);
        }
        timespan.finish(`generate ${o.name} finished`);
    }));
};
//# sourceMappingURL=output-custom.js.map