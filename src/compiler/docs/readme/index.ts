import * as d from '../../../declarations';
import { generateReadme } from './output-docs';
import { isOutputTargetDocsReadme } from '../../output-targets/output-utils';

export async function generateReadmeDocs(config: d.Config, compilerCtx: d.CompilerCtx, docsData: d.JsonDocs, outputTargets: d.OutputTarget[]) {
  const readmeOutputTargets = outputTargets.filter(isOutputTargetDocsReadme);
  if (readmeOutputTargets.length === 0) {
    return;
  }
  const strictCheck = readmeOutputTargets.some(o => o.strict);
  if (strictCheck) {
    strickCheckDocs(config, docsData);
  }

  await Promise.all(docsData.components.map(cmpData => {
    return generateReadme(config, compilerCtx, readmeOutputTargets, cmpData, docsData.components);
  }));
}

export function strickCheckDocs(config: d.Config, docsData: d.JsonDocs) {
  docsData.components.forEach(component => {
    component.props.forEach(prop => {
      if (!prop.docs && prop.deprecation === undefined) {
        config.logger.warn(`Property "${prop.name}" of "${component.tag}" is not documented. ${component.filePath}`);
      }
    });
    component.methods.forEach(method => {
      if (!method.docs && method.deprecation === undefined) {
        config.logger.warn(`Method "${method.name}" of "${component.tag}" is not documented. ${component.filePath}`);
      }
    });
    component.events.forEach(ev => {
      if (!ev.docs && ev.deprecation === undefined) {
        config.logger.warn(`Event "${ev.event}" of "${component.tag}" is not documented. ${component.filePath}`);
      }
    });
  });
}
