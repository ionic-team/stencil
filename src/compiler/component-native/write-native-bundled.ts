import * as d from '@declarations';
import { DEFAULT_STYLE_MODE } from '@utils';
import { getAllModes } from '../app-core/register-app-styles';
import { sys } from '@sys';


export function writeNativeBundled(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetWebComponent[], cmps: d.ComponentCompilerMeta[], rollupResults: d.RollupResult[]) {
  const allModes = getAllModes(cmps);

  const promises: Promise<any>[] = [];

  allModes.forEach(modeName => {
    rollupResults.forEach(rollupResult => {
      outputTargets.map(outputTarget => {
        promises.push(
          writeBundledWebComponentOutputMode(config, compilerCtx, outputTarget, rollupResult, modeName)
        );
      });
    });
  });

  return Promise.all(promises);
}


function writeBundledWebComponentOutputMode(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWebComponent, rollupResult: d.RollupResult, modeName: string) {
  let fileName = config.fsNamespace;
  if (modeName !== DEFAULT_STYLE_MODE) {
    fileName += `.${modeName.toLowerCase()}`;
  }
  fileName += `.js`;

  const filePath = sys.path.join(outputTarget.buildDir, fileName);

  return compilerCtx.fs.writeFile(filePath, rollupResult.code);
}
