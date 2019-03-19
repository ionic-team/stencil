import * as d from '../../declarations';
import { writeLazyModule } from './write-lazy-entry-module';
import { DEFAULT_STYLE_MODE, sortBy } from '@utils';
import { optimizeModule } from '../app-core/optimize-module';
import { transpileToEs5Main } from '../transpile/transpile-to-es5-main';
import { formatComponentRuntimeMeta, stringifyRuntimeData } from '../app-core/format-component-runtime-meta';


export async function generateLazyModules(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, destinations: string[], rollupResults: d.RollupResult[], sourceTarget: d.SourceTarget, sufix: string, webpackBuild: boolean) {
  if (destinations.length === 0) {
    return;
  }
  const entryComponetsResults = rollupResults.filter(rollupResult => rollupResult.isComponent);
  const chunkResults = rollupResults.filter(rollupResult => !rollupResult.isComponent && !rollupResult.isAppCore);

  const [bundleModules] = await Promise.all([
    Promise.all(entryComponetsResults.map(rollupResult => {
      return generateLazyEntryModule(config, compilerCtx, buildCtx, destinations, rollupResult, sourceTarget, webpackBuild, sufix);
    })),
    Promise.all(chunkResults.map(rollupResult => {
      return writeLazyChunk(config, compilerCtx, buildCtx, destinations, sourceTarget, webpackBuild, rollupResult.code, rollupResult.fileName);
    }))
  ]);

  const coreResults = rollupResults.filter(rollupResult => rollupResult.isAppCore);
  await Promise.all(
    coreResults.map(rollupResult => {
      return writeLazyCore(config, compilerCtx, buildCtx, destinations, sourceTarget, rollupResult.code, rollupResult.fileName, bundleModules, webpackBuild);
    })
  );
}


async function generateLazyEntryModule(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, destinations: string[], rollupResult: d.RollupResult, sourceTarget: d.SourceTarget, webpackBuild: boolean, sufix: string): Promise<d.BundleModule> {
  const entryModule = buildCtx.entryModules.find(entryModule => entryModule.entryKey === rollupResult.entryKey);
  const code = await convertChunk(config, compilerCtx, buildCtx, sourceTarget, webpackBuild, rollupResult.code);
  const outputs = await Promise.all(
    entryModule.modeNames.map(modeName =>
      writeLazyModule(config, compilerCtx, destinations, entryModule, code, modeName, sufix)
    )
  );

  return {
    entryKey: rollupResult.entryKey,
    modeNames: entryModule.modeNames.slice(),
    cmps: entryModule.cmps,
    outputs: sortBy(outputs, o => o.modeName)
  };
}

export async function writeLazyChunk(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, destinations: string[], sourceTarget: d.SourceTarget, webpackBuild: boolean, code: string, filename: string) {
  code = await convertChunk(config, compilerCtx, buildCtx, sourceTarget, webpackBuild, code);

  return Promise.all(destinations.map(dst => {
    const filePath = config.sys.path.join(dst, filename);
    return compilerCtx.fs.writeFile(filePath, code);
  }));
}

export async function convertChunk(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, sourceTarget: d.SourceTarget, webpackBuild: boolean, code: string) {
  if (sourceTarget === 'es5') {
    const transpileResults = await transpileToEs5Main(config, compilerCtx, code, true);
    buildCtx.diagnostics.push(...transpileResults.diagnostics);
    if (transpileResults.diagnostics.length === 0) {
      code = transpileResults.code;
    }
  }

  if (config.minifyJs) {
    const optimizeResults = await optimizeModule(config, compilerCtx, sourceTarget, webpackBuild, code);
    buildCtx.diagnostics.push(...optimizeResults.diagnostics);

    if (optimizeResults.diagnostics.length === 0 && typeof optimizeResults.output === 'string') {
      code = optimizeResults.output;
    }
  }
  return code;
}

export async function writeLazyCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, destinations: string[], sourceTarget: d.SourceTarget, code: string, filename: string, bundleModules: d.BundleModule[], webpackBuild: boolean) {
  const lazyRuntimeData = formatLazyBundlesRuntimeMeta(bundleModules);
  code = code.replace(
    `[/*!__STENCIL_LAZY_DATA__*/]`,
    `${lazyRuntimeData}`
  );
  if (webpackBuild) {
    code = code.replace(/import\.meta\.url/g, '""');
  }
  return writeLazyChunk(config, compilerCtx, buildCtx, destinations, sourceTarget, webpackBuild, code, filename);
}

function formatLazyBundlesRuntimeMeta(bundleModules: d.BundleModule[]) {
  // [[{ios: 'abc12345', md: 'dec65432'}, {cmpTag: 'ion-icon', cmpMembers: []}]]

  const lazyBundles = bundleModules.map(formatLazyRuntimeBundle);
  return stringifyRuntimeData(lazyBundles);
}


function formatLazyRuntimeBundle(bundleModule: d.BundleModule): d.LazyBundleRuntimeData {
  let bundleId: any;
  if (bundleModule.outputs.length === 0) {
    throw new Error('bundleModule.output must be at least one');
  }

  if (bundleModule.outputs[0].modeName !== DEFAULT_STYLE_MODE) {
    // more than one mode, object of bundleIds with the mode as a key
    bundleId = {};
    bundleModule.outputs.forEach(output => {
      bundleId[output.modeName] = output.bundleId;
    });

  } else {
    // only one default mode, bundleId is a string
    bundleId = bundleModule.outputs[0].bundleId;
  }

  return [
    bundleId,
    bundleModule.cmps.map(cmp => formatComponentRuntimeMeta(cmp, true, true))
  ];
}
