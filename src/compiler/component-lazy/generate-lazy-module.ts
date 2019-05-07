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
      return writeLazyEntry(config, compilerCtx, buildCtx, rollupResult, destinations, lazyRuntimeData, sourceTarget, shouldMinify, isBrowserBuild);
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
  shouldMinify: boolean,
  isBrowserBuild: boolean,
) {
  if (isBrowserBuild && ['index', 'loader'].includes(rollupResult.entryKey)) {
    return;
  }
  let code = rollupResult.code.replace(
    `[/*!__STENCIL_LAZY_DATA__*/]`,
    `${lazyRuntimeData}`
  );
  code = await convertChunk(config, compilerCtx, buildCtx, sourceTarget, shouldMinify, false, isBrowserBuild, code);

  await Promise.all(destinations.map(dst => {
    const filePath = config.sys.path.join(dst, rollupResult.fileName);
    return compilerCtx.fs.writeFile(filePath, code);
  }));
}

function formatLazyBundlesRuntimeMeta(bundleModules: d.BundleModule[]) {
  const sortedBundles = bundleModules.slice().sort(sortBundleModules);
  const lazyBundles = sortedBundles.map(formatLazyRuntimeBundle);
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

  const bundleCmps = bundleModule.cmps.slice().sort(sortBundleComponents);

  return [
    bundleId,
    bundleCmps.map(cmp => formatComponentRuntimeMeta(cmp, true))
  ];
}

export function sortBundleModules(a: d.BundleModule, b: d.BundleModule) {
  const aDependants = a.cmps.reduce((dependants, cmp) => {
    dependants.push(...cmp.dependants);
    return dependants;
  }, [] as string[]);
  const bDependants = b.cmps.reduce((dependants, cmp) => {
    dependants.push(...cmp.dependants);
    return dependants;
  }, [] as string[]);

  if (a.cmps.some(cmp => bDependants.includes(cmp.tagName))) return 1;
  if (b.cmps.some(cmp => aDependants.includes(cmp.tagName))) return -1;

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

  if (aDependants.length < bDependants.length) return -1;
  if (aDependants.length > bDependants.length) return 1;

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
}


export function sortBundleComponents(a: d.ComponentCompilerMeta, b: d.ComponentCompilerMeta) {
  // <cmp-a>
  //   <cmp-b>
  //     <cmp-c></cmp-c>
  //   </cmp-b>
  // </cmp-a>

  // cmp-c is a dependency of cmp-a and cmp-b
  // cmp-c is a directDependency of cmp-b
  // cmp-a is a dependant of cmp-b and cmp-c
  // cmp-a is a directDependant of cmp-b

  if (a.directDependants.includes(b.tagName)) return 1;
  if (b.directDependants.includes(a.tagName)) return -1;

  if (a.directDependencies.includes(b.tagName)) return 1;
  if (b.directDependencies.includes(a.tagName)) return -1;

  if (a.dependants.includes(b.tagName)) return 1;
  if (b.dependants.includes(a.tagName)) return -1;

  if (a.dependencies.includes(b.tagName)) return 1;
  if (b.dependencies.includes(a.tagName)) return -1;

  if (a.dependants.length < b.dependants.length) return -1;
  if (a.dependants.length > b.dependants.length) return 1;

  if (a.dependencies.length > b.dependencies.length) return -1;
  if (a.dependencies.length < b.dependencies.length) return 1;

  if (a.tagName < b.tagName) return -1;
  if (a.tagName > b.tagName) return 1;

  return 0;
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
