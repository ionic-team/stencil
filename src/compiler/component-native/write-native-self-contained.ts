import * as d from '@declarations';
import { DEFAULT_STYLE_MODE } from '@utils';
import { getAllModes, replaceStylePlaceholders } from '../app-core/register-app-styles';
import { sys } from '@sys';


export function writeNativeSelfContained(compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetWebComponent[], cmps: d.ComponentCompilerMeta[], outputText: string) {
  const promises: Promise<any>[] = [];

  const allModes = getAllModes(cmps);

  allModes.forEach(modeName => {
    const modeOutputText = replaceStylePlaceholders(cmps, modeName, outputText);

    cmps.forEach(cmp => {
      outputTargets.forEach(outputTarget => {
        promises.push(
          writeNativeSelfContainedModeOutput(compilerCtx, outputTarget, cmp, modeOutputText, modeName)
        );
      });
    });
  });

  return Promise.all(promises);
}


function writeNativeSelfContainedModeOutput(compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWebComponent, cmpMeta: d.ComponentCompilerMeta, modeOutputText: string, modeName: string) {
  let fileName = `${cmpMeta.tagName}`;
  if (modeName !== DEFAULT_STYLE_MODE) {
    fileName += `.${modeName}`;
  }
  fileName += `.js`;

  const filePath = sys.path.join(outputTarget.dir, fileName);

  return compilerCtx.fs.writeFile(filePath, modeOutputText);
}
