import * as d from '../../declarations';
import { DEFAULT_STYLE_MODE } from '@utils';
import { getAllModes, replaceStylePlaceholders } from '../app-core/component-styles';
import { optimizeAppCoreBundle } from '../app-core/optimize-app-core';


export function writeNativeBundled(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, outputTargets: d.OutputTargetWebComponent[], cmps: d.ComponentCompilerMeta[], rollupResults: d.RollupResult[]) {
  const allModes = getAllModes(cmps);

  return Promise.all(allModes.map(modeName => {
    return Promise.all(rollupResults.map(async rollupResult => {
      const modeOutputText = await writeNativeBundledMode(config, compilerCtx, buildCtx, build, cmps, modeName, rollupResult.code);

      return Promise.all(outputTargets.map(outputTarget => {
        return writeNativeBundledOutput(config, compilerCtx, outputTarget, modeOutputText, modeName);
      }));
    }));
  }));
}


async function writeNativeBundledMode(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmps: d.ComponentCompilerMeta[], modeName: string, code: string) {
  if (config.minifyJs) {
    const results = await optimizeAppCoreBundle(config, compilerCtx, build, code);
    buildCtx.diagnostics.push(...results.diagnostics);

    if (results.diagnostics.length === 0 && typeof results.output === 'string') {
      code = results.output;
    }
  }

  code = replaceStylePlaceholders(cmps, modeName, code);

  return code;
}


function writeNativeBundledOutput(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWebComponent, modeOutputText: string, modeName: string) {
  let fileName = config.fsNamespace;
  if (modeName !== DEFAULT_STYLE_MODE) {
    fileName += `.${modeName.toLowerCase()}`;
  }
  fileName += `.js`;

  const filePath = config.sys.path.join(outputTarget.buildDir, fileName);

  return compilerCtx.fs.writeFile(filePath, modeOutputText);
}
