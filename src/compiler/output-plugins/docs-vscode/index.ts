import * as d from '../../../declarations';
import { normalizePath } from '@utils';
import { isOutputTargetDist } from '../../output-targets/output-utils';

export const plugin: d.Plugin<d.OutputTargetDocsVscode> = {
  name: 'docs-vscode',
  validate(outputTarget, config) {
    let outputDir = config.rootDir;
    const distOutputTarget = config.outputTargets.find(isOutputTargetDist);
    if (distOutputTarget && distOutputTarget.buildDir) {
      outputDir = distOutputTarget.buildDir;
    }

    return normalizeOutputTarget(config, outputTarget, outputDir);
  },
  async createOutput(outputTargets, _config, compilerCtx, _buildCtx, docsData) {
    const json = {
      'tags': docsData.components.map(cmp => ({
        'name': cmp.tag,
        'description': cmp.docs,
        'attributes': cmp.props.filter(p => p.attr).map(serializeAttribute)
      }))
    };
    const jsonContent = JSON.stringify(json, null, 2);

    await Promise.all(outputTargets.map(async outputTarget => {
      const filePath = normalizePath(outputTarget.file);
      await compilerCtx.fs.writeFile(filePath, jsonContent);
    }));
  }
};

function normalizeOutputTarget(config: d.Config, outputTarget: any, outputDir: string) {
  const path = config.sys.path;
  let file: string = (outputTarget.file != null && typeof outputTarget.file === 'string') ?
    outputTarget.file :
    path.join(outputDir, WEB_COMPONENTS_JSON_FILE_NAME);

  if (!path.isAbsolute(file)) {
    file = path.join(config.rootDir, file);
  }

  const results: d.OutputTargetDocsVscode = {
    type: 'docs-vscode',
    file
  };

  return results;
}

function serializeAttribute(prop: d.JsonDocsProp) {
  const attribute: any = {
    'name': prop.attr,
    'description': prop.docs,
  };
  if (typeof prop.type === 'string') {
    const unions = prop.type.split('|').map(u => u.trim()).filter(u => u !== 'undefined' && u !== 'null');
    const includeValues = unions.every(u => /^("|').+("|')$/gm.test(u));
    if (includeValues) {
      attribute.values = unions.map(u => ({
        name: u.slice(1, -1)
      }));
    }
  }
}

export const WEB_COMPONENTS_JSON_FILE_NAME = 'web-components.json';
