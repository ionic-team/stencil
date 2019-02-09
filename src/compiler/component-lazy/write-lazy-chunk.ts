import * as d from '@declarations';
import { optimizeModule } from '../app-core/optimize-module';
import { sys } from '@sys';


export async function writeLazyChunk(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetBuild[], rollupResult: d.RollupResult) {
  let code = rollupResult.code;

  if (config.minifyJs) {
    const optimizeResults = await optimizeModule(config, compilerCtx, 'es2017', code);
    buildCtx.diagnostics.push(...optimizeResults.diagnostics);

    if (optimizeResults.diagnostics.length === 0 && typeof optimizeResults.output === 'string') {
      code = optimizeResults.output;
    }
  }

  return Promise.all(outputTargets.map(outputTarget => {
    const filePath = sys.path.join(outputTarget.buildDir, rollupResult.fileName);
    return compilerCtx.fs.writeFile(filePath, code);
  }));
}
