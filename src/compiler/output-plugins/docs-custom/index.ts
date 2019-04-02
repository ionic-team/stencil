import * as d from '../../../declarations';

export const plugin: d.Plugin<d.OutputTargetDocsCustom> = {
  name: 'docs-custom',
  validate(outputTarget) {
    if (typeof outputTarget.generator !== 'function') {
      throw new Error(`docs-custom outputTarget missing the "generator" option`);
    }
    return outputTarget;
  },
  async createOutput(outputTargets, config, _compilerCtx, _buildCtx, docsData) {
    await Promise.all(outputTargets.map(async customOutput => {
      try {
        await customOutput.generator(docsData);
      } catch (e) {
        config.logger.error(`uncaught custom docs error: ${e}`);
      }
    }));
  }
};
