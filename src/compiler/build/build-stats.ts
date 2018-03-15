import * as d from '../../declarations';
import { normalizePath } from '../util';


export async function generateBuildStats(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, buildResults: d.BuildResults) {
  const statsTargets = (config.outputTargets as d.OutputTargetStats[]).filter(o => o.type === 'stats');

  await Promise.all(statsTargets.map(outputTarget => {
    return generateStatsOutputTarget(config, compilerCtx, buildCtx, buildResults, outputTarget);
  }));
}


export async function generateStatsOutputTarget(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, buildResults: d.BuildResults, outputTarget: d.OutputTargetStats) {
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
      const stats: d.BuildStats = {
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
