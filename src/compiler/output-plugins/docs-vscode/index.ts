import * as d from '../../../declarations';
import { normalizePath } from '@utils';

export const plugin: d.Plugin<d.OutputTargetDocsVscode> = {
  name: 'docs-vscode',
  validate(outputTarget, config) {
    return normalizeOutputTarget(config, outputTarget);
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

function normalizeOutputTarget(config: d.Config, outputTarget: any) {
  const path = config.sys.path;

  if (typeof outputTarget.file !== 'string') {
    throw new Error(`docs-json outputTarget missing the "file" option`);
  }

  const results: d.OutputTargetDocsVscode = {
    type: 'docs-vscode',
    file: path.join(config.rootDir, outputTarget.file),
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
