import { byteSize } from '@utils';
import { BuildCtx, BundleModule, CompilerBuildStats, Config, OutputTargetStats } from '../../declarations';

/**
 *
 * @param config
 * @param compilerCtx
 * @param buildCtx
 * @returns
 */
export function generateBuildStats(config: Config, buildCtx: BuildCtx) {
  const buildResults = buildCtx.buildResults;
  let jsonData: any;

  if (buildResults.hasError) {
    jsonData = {
      diagnostics: buildResults.diagnostics,
    };
  } else {
    try {
      // @ts-ignore
      const stats: CompilerBuildStats = {
        timestamp: buildResults.timestamp,
        compiler: {
          name: config.sys.name,
          version: config.sys.version,
        },
        app: {
          namespace: config.namespace,
          fsNamespace: config.fsNamespace,
          outputs: buildResults.outputs.map((output) => {
            return {
              name: output.type,
              files: output.files.length,
              generatedFiles: output.files.map((file) => {
                return config.sys.normalizePath(file);
              }),
            };
          }),

          components: Object.keys(buildResults.componentGraph).length,
          entries: Object.keys(buildResults.componentGraph).length,
          bundles: buildResults.outputs.reduce((total, en) => {
            total += en.files.length;
            return total;
          }, 0),
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
        components: buildCtx.components.map((component) => {
          return {
            tag: component.tagName,
            path: component.jsFilePath,
            source: component.sourceFilePath,
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
        }),
        // entries: buildCtx.entryModules as any,
        // sourceGraph: buildResults.componentGraph,
        // collections: buildCtx.collections
        //   .map((c) => {
        //     return {
        //       name: c.collectionName,
        //       source: config.sys.normalizePath(config.sys.platformPath.relative(config.rootDir, c.moduleDir)),
        //       tags: c.moduleFiles.map((m) => m.cmpMeta.tagNameMeta).sort(),
        //     };
        //   })
        //   .sort((a, b) => {
        //     if (a.name < b.name) return -1;
        //     if (a.name > b.name) return 1;
        //     return 0;
        //   }),
      };

      // buildCtx.moduleGraphs
      //   .sort((a, b) => {
      //     if (a.filePath < b.filePath) return -1;
      //     if (a.filePath > b.filePath) return 1;
      //     return 0;
      //   })
      //   .forEach((mg) => {
      //     const key = config.sys.normalizePath(config.sys.platformPath.relative(config.rootDir, mg.filePath));
      //     stats.sourceGraph[key] = mg.importPaths
      //       .map((importPath) => {
      //         return config.sys.normalizePath(config.sys.path.relative(config.rootDir, importPath));
      //       })
      //       .sort();
      //   });

      jsonData = stats;
    } catch (e) {
      console.log(e);
    }
  }

  writeBuildStats(config, jsonData);

  return jsonData;
}

/**
 *
 * @param config
 * @param buildCtx
 * @returns
 */
export async function writeBuildStats(config: Config, data: CompilerBuildStats) {
  const statsTargets = config.outputTargets.filter((o) => o.type === 'stats') as OutputTargetStats[];

  await Promise.all(
    statsTargets.map((outputTarget) => {
      config.sys.writeFile(outputTarget.file, JSON.stringify(data, null, 2));
    })
  );
}

function sanitizeBundlesForStats(bundleArray: BundleModule[]): any[] {
  return (
    !!bundleArray &&
    bundleArray.map((bundle) => {
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
    })
  );
}
