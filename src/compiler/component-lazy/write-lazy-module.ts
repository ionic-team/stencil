import * as d from '@declarations';
import { DEFAULT_STYLE_MODE } from '@utils';
import { optimizeModule } from '../app-core/optimize-module';
import { replaceStylePlaceholders } from 'app-core/register-app-styles';
import { sys } from '@sys';


export async function writeLazyModule(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetBuild[], entryModule: d.EntryModule, code: string, modeName: string) {
  if (config.minifyJs) {
    const optimizeResults = await optimizeModule(config, compilerCtx, 'es2017', code);
    buildCtx.diagnostics.push(...optimizeResults.diagnostics);

    if (optimizeResults.diagnostics.length === 0 && typeof optimizeResults.output === 'string') {
      code = optimizeResults.output;
    }
  }

  code = replaceStylePlaceholders(entryModule.cmps, modeName, code);

  const bundleId = getBundleId(config, entryModule.entryKey, code, modeName);

  const output: d.BundleModuleOutput = {
    bundleId: bundleId,
    fileName: `${bundleId}.entry.js`,
    code: code,
    modeName: modeName,
  };

  const promises = outputTargets.map(outputTarget => {
    const filePath = sys.path.join(outputTarget.buildDir, output.fileName);
    return compilerCtx.fs.writeFile(filePath, output.code);
  });

  await Promise.all(promises);

  return output;
}


function getBundleId(config: d.Config, entryKey: string, code: string, modeName: string) {
  if (config.hashFileNames) {
    return sys.generateContentHash(code, config.hashedFileNameLength);
  }

  let bundleId = entryKey;
  if (modeName !== DEFAULT_STYLE_MODE) {
    bundleId += '-' + modeName;
  }

  return bundleId;
}
