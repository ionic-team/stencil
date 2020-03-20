import * as d from '../../../declarations';
import { writeLazyModule } from './write-lazy-entry-module';
import { DEFAULT_STYLE_MODE, formatComponentRuntimeMeta, stringifyRuntimeData, hasDependency, sortBy } from '@utils';
import { optimizeModule } from '../../optimize/optimize-module';
import { join } from 'path';

export const generateLazyModules = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTargetType: string,
  destinations: string[],
  results: d.RollupResult[],
  sourceTarget: d.SourceTarget,
  isBrowserBuild: boolean,
  sufix: string,
) => {
  if (!Array.isArray(destinations) || destinations.length === 0) {
    return [];
  }
  const shouldMinify = config.minifyJs && isBrowserBuild;
  const rollupResults = results.filter(r => r.type === 'chunk') as d.RollupChunkResult[];
  const entryComponentsResults = rollupResults.filter(rollupResult => rollupResult.isComponent);
  const chunkResults = rollupResults.filter(rollupResult => !rollupResult.isComponent && !rollupResult.isEntry);

  const [bundleModules] = await Promise.all([
    Promise.all(
      entryComponentsResults.map(rollupResult => {
        return generateLazyEntryModule(config, compilerCtx, buildCtx, rollupResult, outputTargetType, destinations, sourceTarget, shouldMinify, isBrowserBuild, sufix);
      }),
    ),
    Promise.all(
      chunkResults.map(rollupResult => {
        return writeLazyChunk(config, compilerCtx, buildCtx, rollupResult, outputTargetType, destinations, sourceTarget, shouldMinify, isBrowserBuild);
      }),
    ),
  ]);

  const lazyRuntimeData = formatLazyBundlesRuntimeMeta(bundleModules);
  config.logger.debug(`Upfront metadata is ${lazyRuntimeData.length} bytes`);
  const entryResults = rollupResults.filter(rollupResult => !rollupResult.isComponent && rollupResult.isEntry);
  await Promise.all(
    entryResults.map(rollupResult => {
      return writeLazyEntry(config, compilerCtx, buildCtx, rollupResult, outputTargetType, destinations, lazyRuntimeData, sourceTarget, shouldMinify, isBrowserBuild);
    }),
  );

  await writeAssets(compilerCtx, destinations, results);

  return bundleModules;
};

const writeAssets = (compilerCtx: d.CompilerCtx, destinations: string[], results: d.RollupResult[]) => {
  return results
    .filter(r => r.type === 'asset')
    .map((r: d.RollupAssetResult) => {
      return Promise.all(
        destinations.map(dest => {
          return compilerCtx.fs.writeFile(join(dest, r.fileName), r.content);
        }),
      );
    });
};

const generateLazyEntryModule = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  rollupResult: d.RollupChunkResult,
  outputTargetType: string,
  destinations: string[],
  sourceTarget: d.SourceTarget,
  shouldMinify: boolean,
  isBrowserBuild: boolean,
  sufix: string,
): Promise<d.BundleModule> => {
  const entryModule = buildCtx.entryModules.find(entryModule => entryModule.entryKey === rollupResult.entryKey);
  const shouldHash = config.hashFileNames && isBrowserBuild;
  const outputs = await Promise.all(
    entryModule.modeNames.map(async modeName => {
      const code = await convertChunk(config, compilerCtx, buildCtx, sourceTarget, shouldMinify, false, isBrowserBuild, rollupResult.code, modeName);
      return writeLazyModule(config, compilerCtx, outputTargetType, destinations, entryModule, shouldHash, code, modeName, sufix);
    }),
  );

  return {
    rollupResult,
    entryKey: rollupResult.entryKey,
    modeNames: entryModule.modeNames.slice(),
    cmps: entryModule.cmps,
    outputs: sortBy(outputs, o => o.modeName),
  };
};

const writeLazyChunk = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  rollupResult: d.RollupChunkResult,
  outputTargetType: string,
  destinations: string[],
  sourceTarget: d.SourceTarget,
  shouldMinify: boolean,
  isBrowserBuild: boolean,
) => {
  const code = await convertChunk(config, compilerCtx, buildCtx, sourceTarget, shouldMinify, rollupResult.isCore, isBrowserBuild, rollupResult.code);

  await Promise.all(
    destinations.map(dst => {
      const filePath = join(dst, rollupResult.fileName);
      return compilerCtx.fs.writeFile(filePath, code, { outputTargetType });
    }),
  );
};

const writeLazyEntry = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  rollupResult: d.RollupChunkResult,
  outputTargetType: string,
  destinations: string[],
  lazyRuntimeData: string,
  sourceTarget: d.SourceTarget,
  shouldMinify: boolean,
  isBrowserBuild: boolean,
) => {
  if (isBrowserBuild && ['loader'].includes(rollupResult.entryKey)) {
    return;
  }
  let code = rollupResult.code.replace(`[/*!__STENCIL_LAZY_DATA__*/]`, `${lazyRuntimeData}`);
  code = await convertChunk(config, compilerCtx, buildCtx, sourceTarget, shouldMinify, false, isBrowserBuild, code);

  await Promise.all(
    destinations.map(dst => {
      const filePath = join(dst, rollupResult.fileName);
      return compilerCtx.fs.writeFile(filePath, code, { outputTargetType });
    }),
  );
};

const formatLazyBundlesRuntimeMeta = (bundleModules: d.BundleModule[]) => {
  const sortedBundles = bundleModules.slice().sort(sortBundleModules);
  const lazyBundles = sortedBundles.map(formatLazyRuntimeBundle);
  return stringifyRuntimeData(lazyBundles);
};

const formatLazyRuntimeBundle = (bundleModule: d.BundleModule): d.LazyBundleRuntimeData => {
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

  const bundleCmps = bundleModule.cmps.slice().sort(sortBundleComponents);

  return [bundleId, bundleCmps.map(cmp => formatComponentRuntimeMeta(cmp, true))];
};

export const sortBundleModules = (a: d.BundleModule, b: d.BundleModule) => {
  const aDependents = a.cmps.reduce((dependents, cmp) => {
    dependents.push(...cmp.dependents);
    return dependents;
  }, [] as string[]);
  const bDependents = b.cmps.reduce((dependents, cmp) => {
    dependents.push(...cmp.dependents);
    return dependents;
  }, [] as string[]);

  if (a.cmps.some(cmp => bDependents.includes(cmp.tagName))) return 1;
  if (b.cmps.some(cmp => aDependents.includes(cmp.tagName))) return -1;

  const aDependencies = a.cmps.reduce((dependencies, cmp) => {
    dependencies.push(...cmp.dependencies);
    return dependencies;
  }, [] as string[]);
  const bDependencies = b.cmps.reduce((dependencies, cmp) => {
    dependencies.push(...cmp.dependencies);
    return dependencies;
  }, [] as string[]);

  if (a.cmps.some(cmp => bDependencies.includes(cmp.tagName))) return -1;
  if (b.cmps.some(cmp => aDependencies.includes(cmp.tagName))) return 1;

  if (aDependents.length < bDependents.length) return -1;
  if (aDependents.length > bDependents.length) return 1;

  if (aDependencies.length > bDependencies.length) return -1;
  if (aDependencies.length < bDependencies.length) return 1;

  const aTags = a.cmps.map(cmp => cmp.tagName);
  const bTags = b.cmps.map(cmp => cmp.tagName);

  if (aTags.length > bTags.length) return -1;
  if (aTags.length < bTags.length) return 1;

  const aTagsStr = aTags.sort().join('.');
  const bTagsStr = bTags.sort().join('.');

  if (aTagsStr < bTagsStr) return -1;
  if (aTagsStr > bTagsStr) return 1;

  return 0;
};

export const sortBundleComponents = (a: d.ComponentCompilerMeta, b: d.ComponentCompilerMeta) => {
  // <cmp-a>
  //   <cmp-b>
  //     <cmp-c></cmp-c>
  //   </cmp-b>
  // </cmp-a>

  // cmp-c is a dependency of cmp-a and cmp-b
  // cmp-c is a directDependency of cmp-b
  // cmp-a is a dependant of cmp-b and cmp-c
  // cmp-a is a directDependant of cmp-b

  if (a.directDependents.includes(b.tagName)) return 1;
  if (b.directDependents.includes(a.tagName)) return -1;

  if (a.directDependencies.includes(b.tagName)) return 1;
  if (b.directDependencies.includes(a.tagName)) return -1;

  if (a.dependents.includes(b.tagName)) return 1;
  if (b.dependents.includes(a.tagName)) return -1;

  if (a.dependencies.includes(b.tagName)) return 1;
  if (b.dependencies.includes(a.tagName)) return -1;

  if (a.dependents.length < b.dependents.length) return -1;
  if (a.dependents.length > b.dependents.length) return 1;

  if (a.dependencies.length > b.dependencies.length) return -1;
  if (a.dependencies.length < b.dependencies.length) return 1;

  if (a.tagName < b.tagName) return -1;
  if (a.tagName > b.tagName) return 1;

  return 0;
};

const convertChunk = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  sourceTarget: d.SourceTarget,
  shouldMinify: boolean,
  isCore: boolean,
  isBrowserBuild: boolean,
  code: string,
  modeName?: string,
) => {
  const inlineHelpers = isBrowserBuild || !hasDependency(buildCtx, 'tslib');
  const optimizeResults = await optimizeModule(config, compilerCtx, {
    input: code,
    isCore,
    sourceTarget,
    inlineHelpers,
    minify: shouldMinify,
    modeName,
  });
  buildCtx.diagnostics.push(...optimizeResults.diagnostics);
  if (optimizeResults.diagnostics.length === 0 && typeof optimizeResults.output === 'string') {
    code = optimizeResults.output;
  }
  return code;
};
