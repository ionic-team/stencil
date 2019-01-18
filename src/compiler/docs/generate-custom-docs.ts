import * as d from '@declarations';
import { logger } from '@sys';


export async function generateCustomDocs(customOutputs: d.OutputTargetDocsCustom[], docsData: d.JsonDocs) {
  await Promise.all(customOutputs.map(async customOutput => {
    try {
      await customOutput.generator(docsData);
    } catch (e) {
      logger.error(`uncaught custom docs error: ${e}`);
    }
  }));
}
