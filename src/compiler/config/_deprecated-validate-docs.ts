import * as d from '@declarations';
import { logger } from '@sys';

/**
 * DEPRECATED "docs"
 * since 0.16.0, 2018-11-16
 */
export function _deprecatedDocsConfig(config: d.Config) {
  if (!config.outputTargets) {
    return;
  }

  let jsonFile: string = null;


  config.outputTargets = config.outputTargets.filter((outputTarget: any) => {
    if (outputTarget.type === 'docs') {

      if (typeof outputTarget.jsonFile === 'string') {
        jsonFile = outputTarget.jsonFile;
        delete outputTarget.jsonFile;
        logger.warn(`Stencil config docs outputTarget using the "jsonFile" property has been refactored as a new outputTarget type "docs-json". Please see the stencil docs for more information.`);
        return false;
      }

      if (typeof outputTarget.readmeDir === 'string') {
        (outputTarget as d.OutputTargetDocsReadme).dir = outputTarget.readmeDir;
        delete outputTarget.readmeDir;
        logger.warn(`Stencil config docs outputTarget using the "readmeDir" property has been rename to "dir". Please see the stencil docs for more information.`);
      }
    }
    return true;
  });

  if (typeof jsonFile === 'string' && jsonFile) {
    (config.outputTargets as d.OutputTargetDocsJson[]).push({
      type: 'docs-json',
      file: jsonFile
    });
  }
}
