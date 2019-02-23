import * as d from '@declarations';
import { normalizePath } from '@utils';

export async function generateWebComponentsJson(compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetDocsVscode[], docsData: d.JsonDocs) {
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

function serializeAttribute(prop: d.JsonDocsProp) {
  const attribute: any = {
    'name': prop.attr,
    'description': prop.docs,
  };
  const unions = prop.type.split('|').map(u => u.trim()).filter(u => u !== 'undefined' && u !== 'null');
  const includeValues = unions.every(u => /^("|').+("|')$/gm.test(u));
  if (includeValues) {
    attribute.values = unions.map(u => ({
      name: u.slice(1, -1)
    }));
  }
}
