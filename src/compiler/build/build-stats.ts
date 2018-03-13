import { BuildCtx, BuildResults, BuildStats, CompilerCtx, Config, OutputTarget } from '../../declarations';
import { normalizePath } from '../util';


export async function generateBuildStats(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, buildResults: BuildResults) {
  const statsTargets = config.outputTargets.filter(o => o.type === 'stats');

  await Promise.all(statsTargets.map(outputTarget => {
    return generateStatsOutputTarget(config, compilerCtx, buildCtx, buildResults, outputTarget);
  }));
}


export async function generateStatsOutputTarget(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, buildResults: BuildResults, outputTarget: OutputTarget) {
  if (buildCtx.aborted) {
    return;
  }

  try {
    let jsonData: any;

    if (buildResults.hasError) {
      jsonData = {
        diagnostics: buildResults.diagnostics
      };

    } else {
      const stats: BuildStats = {
        compiler: {
          name: config.sys.compiler.name,
          version: config.sys.compiler.version
        },
        app: {
          namespace: config.namespace,
          fsNamespace: config.fsNamespace,
          components: buildResults.components.length,
          entries: buildResults.entries.length,
          bundles: buildResults.entries.reduce((total, en) => {
            total += en.bundles.length;
            return total;
          }, 0)
        },
        options: {
          minifyJs: config.minifyJs,
          minifyCss: config.minifyCss,
          hashFileNames: config.hashFileNames,
          hashedFileNameLength: config.hashedFileNameLength,
          buildEs5: config.buildEs5
        },
        components: buildResults.components,
        entries: buildResults.entries,
        sourceGraph: {},
        collections: buildCtx.collections.map(c => {
          return {
            name: c.collectionName,
            source: normalizePath(config.sys.path.relative(config.rootDir, c.moduleDir)),
            tags: c.moduleFiles.map(m => m.cmpMeta.tagNameMeta).sort()
          };
        }).sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        })
      };

      buildCtx.moduleGraphs
        .sort((a, b) => {
          if (a.filePath < b.filePath) return -1;
          if (a.filePath > b.filePath) return 1;
          return 0;

        }).forEach(mg => {
          const key = normalizePath(config.sys.path.relative(config.rootDir, mg.filePath));
          stats.sourceGraph[key] = mg.importPaths.map(importPath => {
            return normalizePath(config.sys.path.relative(config.rootDir, importPath));
          }).sort();
        });

      jsonData = stats;
    }

    await compilerCtx.fs.writeFile(outputTarget.file, JSON.stringify(jsonData, null, 2));
    await compilerCtx.fs.commit();

  } catch (e) {}
}
