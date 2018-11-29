import * as d from '../../declarations';
import { WEB_COMPONENTS_JSON_FILE_NAME } from '../../util/constants';
import { normalizePath } from '../util';

export async function generateWebComponentsJson(config: d.Config, compilerCtx: d.CompilerCtx, distOutputs: d.OutputTargetDist[], docsData: d.JsonDocs) {
  const json = {
    'components': docsData.components.map(cmp => ({
      'name': cmp.tag,
      'description': cmp.readme,
      'attributes': cmp.props.filter(p => p.attr).map(p => ({
        'name': p.attr,
        'description': p.docs,
        'required': p.required
      }))
    }))
  };
  const jsonContent = JSON.stringify(json, null, 2);
  await Promise.all(distOutputs.map(async distOutput => {
    const filePath = normalizePath(config.sys.path.join(distOutput.buildDir, WEB_COMPONENTS_JSON_FILE_NAME));
    await compilerCtx.fs.writeFile(filePath, jsonContent);
  }));
}
