import * as d from '../../declarations';
import { writeLazyModule } from './write-lazy-entry-module';
import { DEFAULT_STYLE_MODE, hasDependency, sortBy } from '@utils';
import { optimizeModule } from '../app-core/optimize-module';
import { transpileToEs5Main } from '../transpile/transpile-to-es5-main';
import { formatComponentRuntimeMeta, stringifyRuntimeData } from '../app-core/format-component-runtime-meta';


export async function generateLazyModules(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, destinations: string[], rollupResults: d.RollupResult[], sourceTarget: d.SourceTarget, isBrowserBuild: boolean, sufix: string) {
  if (destinations.length === 0) {
    return [];
  }
  const shouldMinify = config.minifyJs && isBrowserBuild;
  const entryComponentsResults = rollupResults.filter(rollupResult => rollupResult.isComponent);
  const chunkResults = rollupResults.filter(rollupResult => !rollupResult.isComponent && !rollupResult.isEntry);

  const [bundleModules] = await Promise.all([
    Promise.all(entryComponentsResults.map(rollupResult => {
      return generateLazyEntryModule(config, compilerCtx, buildCtx, rollupResult, destinations, sourceTarget, shouldMinify, isBrowserBuild, sufix);
    })),
    Promise.all(chunkResults.map(rollupResult => {
      return writeLazyChunk(config, compilerCtx, buildCtx, rollupResult, destinations, sourceTarget, shouldMinify, isBrowserBuild);
    }))
  ]);

  const lazyRuntimeData = formatLazyBundlesRuntimeMeta(bundleModules);
  const entryResults = rollupResults.filter(rollupResult => !rollupResult.isComponent && rollupResult.isEntry);
  await Promise.all(
    entryResults.map(rollupResult => {
      return writeLazyEntry(config, compilerCtx, buildCtx, rollupResult, destinations, lazyRuntimeData, sourceTarget, isBrowserBuild);
    })
  );
  return bundleModules;
}


async function generateLazyEntryModule(
  config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx,
  rollupResult: d.RollupResult, destinations: string[],
  sourceTarget: d.SourceTarget,
  shouldMinify: boolean,
  isBrowserBuild: boolean,
  sufix: string
): Promise<d.BundleModule> {
  const entryModule = buildCtx.entryModules.find(entryModule => entryModule.entryKey === rollupResult.entryKey);
  const code = await convertChunk(config, compilerCtx, buildCtx, sourceTarget, shouldMinify, false, isBrowserBuild, rollupResult.code);
  const outputs = await Promise.all(
    entryModule.modeNames.map(modeName =>
      writeLazyModule(config, compilerCtx, destinations, entryModule, shouldMinify, code, modeName, sufix)
    )
  );

  return {
    rollupResult,
    entryKey: rollupResult.entryKey,
    modeNames: entryModule.modeNames.slice(),
    cmps: entryModule.cmps,
    outputs: sortBy(outputs, o => o.modeName)
  };
}

async function writeLazyChunk(
  config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx,
  rollupResult: d.RollupResult, destinations: string[],
  sourceTarget: d.SourceTarget,
  shouldMinify: boolean,
  isBrowserBuild: boolean
) {
  if (isBrowserBuild && ['index', 'loader'].includes(rollupResult.entryKey)) {
    return;
  }
  const code = await convertChunk(config, compilerCtx, buildCtx, sourceTarget, shouldMinify, rollupResult.isCore, isBrowserBuild, rollupResult.code);

  await Promise.all(destinations.map(dst => {
    const filePath = config.sys.path.join(dst, rollupResult.fileName);
    return compilerCtx.fs.writeFile(filePath, code);
  }));
}

async function writeLazyEntry(
  config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx,
  rollupResult: d.RollupResult, destinations: string[],
  lazyRuntimeData: string,
  sourceTarget: d.SourceTarget,
  isBrowserBuild: boolean,
) {
  let code = rollupResult.code.replace(
    `[/*!__STENCIL_LAZY_DATA__*/]`,
    `${lazyRuntimeData}`
  );
  code = await convertChunk(config, compilerCtx, buildCtx, sourceTarget, config.minifyJs, false, isBrowserBuild, code);

  await Promise.all(destinations.map(dst => {
    const filePath = config.sys.path.join(dst, rollupResult.fileName);
    return compilerCtx.fs.writeFile(filePath, code);
  }));
}

function formatLazyBundlesRuntimeMeta(bundleModules: d.BundleModule[]) {
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
    bundleModule.cmps.map(cmp => formatComponentRuntimeMeta(cmp, true))
  ];
}

async function convertChunk(
  config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx,
  sourceTarget: d.SourceTarget,
  shouldMinify: boolean,
  isCore: boolean,
  isBrowserBuild: boolean,
  code: string
) {
  if (sourceTarget === 'es5') {
    const inlineHelpers = isBrowserBuild || !hasDependency(buildCtx, 'tslib');
    const transpileResults = await transpileToEs5Main(config, compilerCtx, code, inlineHelpers);
    buildCtx.diagnostics.push(...transpileResults.diagnostics);
    if (transpileResults.diagnostics.length === 0) {
      code = transpileResults.code;
    }
  }
  if (shouldMinify) {
    const optimizeResults = await optimizeModule(config, compilerCtx, sourceTarget, isCore, isBrowserBuild, code);
    buildCtx.diagnostics.push(...optimizeResults.diagnostics);

    if (optimizeResults.diagnostics.length === 0 && typeof optimizeResults.output === 'string') {
      code = optimizeResults.output;
    }
  }
  return code;
}
