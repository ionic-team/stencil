import * as d from '../../../declarations';
import { getNameText } from '../generate-doc-data';
import { isOutputTargetDocsVscode } from '../../output-targets/output-utils';

export async function generateVscodeDocs(compilerCtx: d.CompilerCtx, docsData: d.JsonDocs, outputTargets: d.OutputTarget[]) {
  const vsCodeOutputTargets = outputTargets.filter(isOutputTargetDocsVscode);
  if (vsCodeOutputTargets.length === 0) {
    return;
  }

  await Promise.all(vsCodeOutputTargets.map(async outputTarget => {
    const json = {
      'version': 1.1,
      'tags': docsData.components.map(cmp => ({
        'name': cmp.tag,
        'description': {
          'kind': 'markdown',
          'value': cmp.docs,
        },
        'attributes': cmp.props.filter(p => p.attr).map(serializeAttribute),
        'references': getReferences(cmp, outputTarget.sourceCodeBaseUrl)
      }))
    };
    const jsonContent = JSON.stringify(json, null, 2);
    await compilerCtx.fs.writeFile(outputTarget.file, jsonContent);
  }));
}

function getReferences(cmp: d.JsonDocsComponent, repoBaseUrl: string) {
  const references = getNameText('reference', cmp.docsTags)
    .map(([name, url]) => ({ name, url }));
  if (repoBaseUrl) {
    references.push({
      name: 'Source code',
      url: repoBaseUrl + cmp.filePath
    });
  }
  if (references.length > 0) {
    return references;
  }
  return undefined;
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
  return attribute;
}
