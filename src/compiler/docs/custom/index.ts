import type * as d from '../../../declarations';
import { isOutputTargetDocsCustom } from '../../output-targets/output-utils';

export const generateCustomDocs = async (config: d.Config, docsData: d.JsonDocs, outputTargets: d.OutputTarget[]) => {
  const customOutputTargets = outputTargets.filter(isOutputTargetDocsCustom);
  if (customOutputTargets.length === 0) {
    return;
  }
  await Promise.all(
    customOutputTargets.map(async customOutput => {
      try {
        await customOutput.generator(docsData, config);
      } catch (e) {
        config.logger.error(`uncaught custom docs error: ${e}`);
      }
    }),
  );
};
