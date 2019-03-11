import * as d from '../../declarations';


export async function generateCustomDocs(config: d.Config, customOutputs: d.OutputTargetDocsCustom[], docsData: d.JsonDocs) {
  await Promise.all(customOutputs.map(async customOutput => {
    try {
      await customOutput.generator(docsData);
    } catch (e) {
      config.logger.error(`uncaught custom docs error: ${e}`);
    }
  }));
}
