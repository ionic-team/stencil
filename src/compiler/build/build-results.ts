import { BuildBundle, BuildComponent, BuildCtx, BuildEntry, BuildResults, BuildStats, CompilerCtx, Config } from '../../declarations';
import { cleanDiagnostics } from '../../util/logger/logger-util';
import { DEFAULT_STYLE_MODE, ENCAPSULATION } from '../../util/constants';
import { hasError, pathJoin } from '../util';


export function generateBuildResults(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  // create the build results that get returned
  const buildResults: BuildResults = {
    buildId: buildCtx.buildId,
    diagnostics: cleanDiagnostics(buildCtx.diagnostics),
    hasError: hasError(buildCtx.diagnostics),
    aborted: buildCtx.aborted,
    duration: Date.now() - buildCtx.startTime,
    isRebuild: compilerCtx.isRebuild,
    transpileBuildCount: buildCtx.transpileBuildCount,
    bundleBuildCount: buildCtx.bundleBuildCount,
    hasChangedJsText: buildCtx.hasChangedJsText,
    filesWritten: buildCtx.filesWritten.sort(),
    filesChanged: buildCtx.filesChanged.slice().sort(),
    filesUpdated: buildCtx.filesUpdated.slice().sort(),
    filesAdded: buildCtx.filesAdded.slice().sort(),
    filesDeleted: buildCtx.filesDeleted.slice().sort(),
    dirsAdded: buildCtx.dirsAdded.slice().sort(),
    dirsDeleted: buildCtx.dirsDeleted.slice().sort(),

    components: [],

    entries: buildCtx.entryModules.map(en => {
      en.modeNames = en.modeNames || [];
      en.entryBundles = en.entryBundles || [];
      en.moduleFiles = en.moduleFiles || [];

      const buildEntry: BuildEntry = {
        entryId: en.entryKey,

        components: en.moduleFiles.map(m => {
          const buildCmp: BuildComponent = {
            tag: m.cmpMeta.tagNameMeta,
            dependencies: m.cmpMeta.dependencies.slice(),
            dependencyOf: en.moduleFiles.reduce((dependencyOf, otherModule) => {
              if (otherModule.cmpMeta.dependencies.includes(m.cmpMeta.tagNameMeta)) {
                dependencyOf.push(otherModule.cmpMeta.tagNameMeta);
              }
              return dependencyOf;
            }, [] as string[]).sort()
          };
          return buildCmp;
        }),

        bundles: en.entryBundles.map(entryBundle => {
          const buildBundle: BuildBundle = {
            fileName: entryBundle.fileName,
            size: entryBundle.text.length,
            outputs: entryBundle.outputs.map(filePath => {
              return pathJoin(config, config.sys.path.relative(config.rootDir, filePath));
            })
          };
          if (typeof entryBundle.sourceTarget === 'string') {
            buildBundle.target = entryBundle.sourceTarget;
          }
          if (entryBundle.modeName !== DEFAULT_STYLE_MODE) {
            buildBundle.mode = entryBundle.modeName;
          }
          if (entryBundle.isScopedStyles) {
            buildBundle.scopedStyles = entryBundle.isScopedStyles;
          }
          return buildBundle;
        }),

        input: en.moduleFiles.map(m => {
          return {
            filePath: pathJoin(config, config.sys.path.relative(config.rootDir, m.jsFilePath))
          };
        }).sort((a, b) => {
          if (a.filePath < b.filePath) return -1;
          if (a.filePath > b.filePath) return 1;
          return 0;
        }),

        encapsulations: []
      };

      const modes = en.modeNames.slice();
      if (modes.length > 1 || (modes.length === 1 && modes[0] !== DEFAULT_STYLE_MODE)) {
        buildEntry.modes = modes.sort();
      }

      en.moduleFiles.forEach(m => {
        const encap = m.cmpMeta.encapsulation === ENCAPSULATION.ScopedCss ? 'scoped' : m.cmpMeta.encapsulation === ENCAPSULATION.ShadowDom ? 'shadow' : 'none';
        if (!buildEntry.encapsulations.includes(encap)) {
          buildEntry.encapsulations.push(encap);
        }
      });
      buildEntry.encapsulations.sort();

      return buildEntry;
    })
  };

  buildResults.entries.forEach(en => {
    buildResults.components.push(...en.components);
  });

  return buildResults;
}


export async function generateBuildStats(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, buildResults: BuildResults) {
  if (!config.writeStats || buildCtx.aborted) {
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
          generateWWW: config.generateWWW,
          generateDistribution: config.generateDistribution,
          minifyJs: config.minifyJs,
          minifyCss: config.minifyCss,
          hashFileNames: config.hashFileNames,
          hashedFileNameLength: config.hashedFileNameLength,
          buildEs5: config.buildEs5
        },
        components: buildResults.components,
        entries: buildResults.entries
      };

      jsonData = stats;
    }

    await compilerCtx.fs.writeFile(config.buildStatsFilePath, JSON.stringify(jsonData, null, 2));
    await compilerCtx.fs.commit();

  } catch (e) {}
}
