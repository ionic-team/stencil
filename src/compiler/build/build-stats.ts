import { byteSize } from '@utils';
import type * as d from '../../declarations';

/**
 *
 * @param config
 * @param compilerCtx
 * @param buildCtx
 * @returns
 */
export function generateBuildStats(config: d.Config, buildCtx: d.BuildCtx) {
  const buildResults = buildCtx.buildResults;
  let jsonData: any;

  if (buildResults.hasError) {
    jsonData = {
      diagnostics: buildResults.diagnostics,
    };
  } else {
    try {
      const stats: d.CompilerBuildStats = {
        timestamp: buildResults.timestamp,
        compiler: {
          name: config.sys.name,
          version: config.sys.version,
        },
        app: {
          namespace: config.namespace,
          fsNamespace: config.fsNamespace,
          components: Object.keys(buildResults.componentGraph).length,
          entries: Object.keys(buildResults.componentGraph).length,
          bundles: buildResults.outputs.reduce((total, en) => (total += en.files.length), 0),
          outputs: getAppOutputs(config, buildResults),
        },
        options: {
          minifyJs: config.minifyJs,
          minifyCss: config.minifyCss,
          hashFileNames: config.hashFileNames,
          hashedFileNameLength: config.hashedFileNameLength,
          buildEs5: config.buildEs5,
        },
        esmBrowser: sanitizeBundlesForStats(buildCtx.esmBrowserComponentBundle),
        esm: sanitizeBundlesForStats(buildCtx.esmComponentBundle),
        es5: sanitizeBundlesForStats(buildCtx.es5ComponentBundle),
        system: sanitizeBundlesForStats(buildCtx.systemComponentBundle),
        commonjs: sanitizeBundlesForStats(buildCtx.commonJsComponentBundle),
        components: getComponentsFileMap(config, buildCtx),
        entries: buildCtx.entryModules,
        sourceGraph: buildResults.componentGraph,
        rollupResults: buildCtx.rollupResults,
        collections: getCollections(config, buildCtx),
      };

      jsonData = stats;
    } catch (e) {
      console.log(e);
    }
  }

  return jsonData;
}

/**
 *
 * @param config
 * @param buildCtx
 * @returns
 */
export async function writeBuildStats(config: d.Config, data: d.CompilerBuildStats) {
  const statsTargets = config.outputTargets.filter((o) => o.type === 'stats') as d.OutputTargetStats[];

  await Promise.all(
    statsTargets.map((outputTarget) => {
      config.sys.writeFile(outputTarget.file, JSON.stringify(data, null, 2));
    })
  );
}

function sanitizeBundlesForStats(bundleArray: d.BundleModule[]): d.CompilerBuildStatBundle[] {
  if (!bundleArray) {
    return [];
  }

  return bundleArray.map((bundle) => {
    return {
      // Should probably get the file size too.
      key: bundle.entryKey,
      components: bundle.cmps.map((c) => c.tagName),
      bundleId: bundle.output.bundleId,
      fileName: bundle.output.fileName,
      imports: bundle.rollupResult.imports,
      // code: bundle.rollupResult.code, // (use this to debug)
      // Currently, this number is inaccurate vs what seems to be on disk.
      byteSize: byteSize(bundle.rollupResult.code),
    };
  });
}

function getAppOutputs(config: d.Config, buildResults: d.CompilerBuildResults) {
  return buildResults.outputs.map((output) => {
    return {
      name: output.type,
      files: output.files.length,
      generatedFiles: output.files.map((file) => relativePath(config, file)),
    };
  });
}

function getComponentsFileMap(config: d.Config, buildCtx: d.BuildCtx) {
  return buildCtx.components.map((component) => {
    return {
      tag: component.tagName,
      path: relativePath(config, component.jsFilePath),
      source: relativePath(config, component.sourceFilePath),
      elementRef: component.elementRef,
      componentClassName: component.componentClassName,
      assetsDirs: component.assetsDirs,
      dependencies: component.dependencies,
      dependents: component.dependents,
      directDependencies: component.directDependencies,
      directDependents: component.directDependents,
      docs: component.docs,
      encapsulation: component.encapsulation,
      excludeFromCollection: component.excludeFromCollection,
      events: component.events,
      internal: component.internal,
      legacyConnect: component.legacyConnect,
      legacyContext: component.legacyContext,
      listeners: component.listeners,
      methods: component.methods,
      potentialCmpRefs: component.potentialCmpRefs,
      properties: component.properties,
      shadowDelegatesFocus: component.shadowDelegatesFocus,
      states: component.states,
    };
  });
}

function getCollections(config: d.Config, buildCtx: d.BuildCtx) {
  return buildCtx.collections
    .map((c) => {
      return {
        name: c.collectionName,
        source: relativePath(config, c.moduleDir),
        tags: c.moduleFiles.map((m) => m.cmps.map((cmp: d.ComponentCompilerMeta) => cmp.tagName)).sort(),
      };
    })
    .sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
}

function relativePath(config: d.Config, file: string) {
  return config.sys.normalizePath(config.sys.platformPath.relative(config.rootDir, file));
}
