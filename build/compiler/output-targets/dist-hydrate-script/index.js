import { isOutputTargetHydrate } from '@utils';
import { generateHydrateApp } from './generate-hydrate-app';
export const outputHydrateScript = async (config, compilerCtx, buildCtx) => {
    const hydrateOutputTargets = config.outputTargets.filter(isOutputTargetHydrate);
    if (hydrateOutputTargets.length > 0) {
        const timespan = buildCtx.createTimeSpan(`generate hydrate app started`);
        await generateHydrateApp(config, compilerCtx, buildCtx, hydrateOutputTargets);
        timespan.finish(`generate hydrate app finished`);
    }
};
//# sourceMappingURL=index.js.map