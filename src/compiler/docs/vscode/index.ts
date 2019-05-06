import * as d from '../../../declarations';
import { isOutputTargetDocsVscode } from '../../output-targets/output-utils';

export async function generateVscodeDocs(compilerCtx: d.CompilerCtx, docsData: d.JsonDocs, outputTargets: d.OutputTarget[]) {
  const vsCodeOutputTargets = outputTargets.filter(isOutputTargetDocsVscode);
  if (vsCodeOutputTargets.length === 0) {
    return;
  }

  const json = {
    'tags': docsData.components.map(cmp => ({
      'name': cmp.tag,
      'description': cmp.docs,
      'attributes': cmp.props.filter(p => p.attr).map(serializeAttribute)
    }))
  };
  const jsonContent = JSON.stringify(json, null, 2);

  await Promise.all(vsCodeOutputTargets.map(async outputTarget => {
    await compilerCtx.fs.writeFile(outputTarget.file, jsonContent);
  }));
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
