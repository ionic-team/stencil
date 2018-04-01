import { BuildBundle, BuildComponent, BuildCtx, BuildEntry, BuildResults, CompilerCtx, Config, EntryComponent } from '../../declarations';
import { cleanDiagnostics } from '../../util/logger/logger-util';
import { DEFAULT_STYLE_MODE, ENCAPSULATION } from '../../util/constants';
import { hasError, normalizePath } from '../util';


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
    hasSlot: !!buildCtx.hasSlot,
    hasSvg: !!buildCtx.hasSvg,

    components: [],

    entries: buildCtx.entryModules.map(en => {
      en.modeNames = en.modeNames || [];
      en.entryBundles = en.entryBundles || [];
      en.moduleFiles = en.moduleFiles || [];

      const entryCmps: EntryComponent[] = [];
      buildCtx.entryPoints.forEach(ep => {
        entryCmps.push(...ep);
      });

      const buildEntry: BuildEntry = {
        entryId: en.entryKey,

        components: en.moduleFiles.map(m => {
          const entryCmp = entryCmps.find(ec => {
            return ec.tag === m.cmpMeta.tagNameMeta;
          });
          const dependencyOf = ((entryCmp && entryCmp.dependencyOf) || []).slice().sort();

          const buildCmp: BuildComponent = {
            tag: m.cmpMeta.tagNameMeta,
            dependencies: m.cmpMeta.dependencies.slice(),
            dependencyOf: dependencyOf
          };
          return buildCmp;
        }),

        bundles: en.entryBundles.map(entryBundle => {
          const buildBundle: BuildBundle = {
            fileName: entryBundle.fileName,
            size: entryBundle.text.length,
            outputs: entryBundle.outputs.map(filePath => {
              return normalizePath(config.sys.path.relative(config.rootDir, filePath));
            }).sort()
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

        inputs: en.moduleFiles.map(m => {
          return normalizePath(config.sys.path.relative(config.rootDir, m.jsFilePath));
        }).sort(),

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
