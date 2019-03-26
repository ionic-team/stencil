import * as d from '../../../declarations';
import { generateReadme } from './output-docs';

export const plugin: d.Plugin<d.OutputTargetDocsReadme> = {
  name: 'docs',
  validate(outputTarget, config) {
    return normalizeOutputTarget(config, outputTarget);
  },
  async createOutput(outputTargets, config, compilerCtx, _buildCtx, docsData) {

    const strictCheck = outputTargets.some(o => !!o.strict);
    if (strictCheck) {
      strickCheckDocs(config, docsData);
    }

    await Promise.all(docsData.components.map(cmpData => {
      return generateReadme(config, compilerCtx, outputTargets, cmpData);
    }));
  }
};

function normalizeOutputTarget(config: d.Config, outputTarget: any) {
  const path = config.sys.path;

  const results: d.OutputTargetDocsReadme = {
    type: 'docs',
    strict: !!outputTarget.strict
  };

  if (outputTarget.dir == null || typeof outputTarget.dir !== 'string') {
    results.dir = config.srcDir;
  } else if (!path.isAbsolute(outputTarget.dir)) {
    results.dir = path.join(config.rootDir, outputTarget.dir);
  }

  return results;
}

export function strickCheckDocs(config: d.Config, docsData: d.JsonDocs) {
  docsData.components.forEach(component => {
    component.props.forEach(prop => {
      if (!prop.docs) {
        config.logger.warn(`Property "${prop.name}" of "${component.tag}" is not documented. ${component.filePath}`);
      }
    });
    component.methods.forEach(prop => {
      if (!prop.docs) {
        config.logger.warn(`Method "${prop.name}" of "${component.tag}" is not documented. ${component.filePath}`);
      }
    });
    component.events.forEach(prop => {
      if (!prop.docs) {
        config.logger.warn(`Event "${prop.event}" of "${component.tag}" is not documented. ${component.filePath}`);
      }
    });
  });
}
