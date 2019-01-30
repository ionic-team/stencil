import * as d from '@declarations';
import { WEB_COMPONENTS_JSON_FILE_NAME, normalizePath } from '@utils';
import { sys } from '@sys';


export async function generateWebComponentsJson(compilerCtx: d.CompilerCtx, distOutputs: d.OutputTargetDist[], docsData: d.JsonDocs) {
  const json = {
    'tags': docsData.components.map(cmp => ({
      'label': cmp.tag,
      'description': cmp.docs,
      'attributes': (cmp.props || []).filter(p => p.attr).map(p => ({
        'label': p.attr,
        'description': p.docs,
        'required': p.required
      }))
    }))
  };
  const jsonContent = JSON.stringify(json, null, 2);
  await Promise.all(distOutputs.map(async distOutput => {
    const filePath = normalizePath(sys.path.join(distOutput.buildDir, WEB_COMPONENTS_JSON_FILE_NAME));
    await compilerCtx.fs.writeFile(filePath, jsonContent);
  }));
}
