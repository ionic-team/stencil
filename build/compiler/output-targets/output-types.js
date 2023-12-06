import { isOutputTargetDistTypes } from '@utils';
import { generateTypes } from '../types/generate-types';
/**
 * Entrypoint for generating types for all output targets
 * @param config the Stencil configuration associated with the project being compiled
 * @param compilerCtx the current compiler context
 * @param buildCtx the context associated with the current build
 */
export const outputTypes = async (config, compilerCtx, buildCtx) => {
    const outputTargets = config.outputTargets.filter(isOutputTargetDistTypes);
    if (outputTargets.length === 0) {
        return;
    }
    const timespan = buildCtx.createTimeSpan(`generate types started`, true);
    await Promise.all(outputTargets.map((outputsTarget) => generateTypes(config, compilerCtx, buildCtx, outputsTarget)));
    timespan.finish(`generate types finished`);
};
//# sourceMappingURL=output-types.js.map