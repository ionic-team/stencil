import * as d from '@declarations';
import { DEFAULT_STYLE_MODE } from '@utils';
import { getAllModes, replaceStylePlaceholders } from '../app-core/register-app-styles';
import { sys } from '@sys';


export function writeNativeSelfContained(compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetWebComponent[], cmps: d.ComponentCompilerMeta[], outputText: string) {
  const allModes = getAllModes(cmps);

  return Promise.all(allModes.map(async modeName => {
    const modeOutputText = await writeNativeSelfContainedMode(cmps, modeName, outputText);

    return Promise.all(cmps.map(cmp => {
      return Promise.all(outputTargets.map(outputTarget => {
        return writeNativeSelfContainedModeOutput(compilerCtx, outputTarget, cmp, modeOutputText, modeName);
      }));
    }));
  }));
}


async function writeNativeSelfContainedMode(cmps: d.ComponentCompilerMeta[], modeName: string, inputText: string) {
  const outputText = replaceStylePlaceholders(cmps, modeName, inputText);

  // TODO MINIFY

  return outputText;
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
