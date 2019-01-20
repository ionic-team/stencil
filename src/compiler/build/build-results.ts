import * as d from '@declarations';
import { DEFAULT_STYLE_MODE, cleanDiagnostics, hasError, normalizePath } from '@utils';
import { generateHmr } from './build-hmr';
import { sys } from '@sys';


export function generateBuildResults(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const timeSpan = buildCtx.createTimeSpan(`generateBuildResults started`, true);

  const buildResults: d.BuildResults = {
    buildId: buildCtx.buildId,
    bundleBuildCount: buildCtx.bundleBuildCount,
    diagnostics: cleanDiagnostics(buildCtx.diagnostics),
    dirsAdded: buildCtx.dirsAdded.slice().sort(),
    dirsDeleted: buildCtx.dirsDeleted.slice().sort(),
    duration: Date.now() - buildCtx.startTime,
    filesAdded: buildCtx.filesAdded.slice().sort(),
    filesChanged: buildCtx.filesChanged.slice().sort(),
    filesDeleted: buildCtx.filesDeleted.slice().sort(),
    filesUpdated: buildCtx.filesUpdated.slice().sort(),
    filesWritten: buildCtx.filesWritten.sort(),
    hasError: hasError(buildCtx.diagnostics),
    hasSlot: buildCtx.hasSlot,
    hasSuccessfulBuild: compilerCtx.hasSuccessfulBuild,
    hasSvg: buildCtx.hasSvg,
    isRebuild: buildCtx.isRebuild,
    styleBuildCount: buildCtx.styleBuildCount,
    transpileBuildCount: buildCtx.transpileBuildCount,

    components: [],
    entries: generateBuildResultsEntries(config, buildCtx)
  };

  const hmr = generateHmr(config, compilerCtx, buildCtx);
  if (hmr) {
    buildResults.hmr = hmr;
  }

  buildResults.entries.forEach(en => {
    buildResults.components.push(...en.components);
  });

  timeSpan.finish(`generateBuildResults finished`);

  return buildResults;
}

function generateBuildResultsEntries(config: d.Config, buildCtx: d.BuildCtx) {
  const entries = buildCtx.entryModules.map(en => {
    return getEntryModule(config, buildCtx, en);
  });

  return entries;
}

function getEntryModule(config: d.Config, buildCtx: d.BuildCtx, en: d.EntryModule) {
  en.modeNames = en.modeNames || [];
  en.entryBundles = en.entryBundles || [];
  en.cmps = en.cmps || [];

  const entryCmps: d.EntryComponent[] = [];

  buildCtx.entryPoints.forEach(ep => {
    entryCmps.push(...ep);
  });

  const buildEntry = getBuildEntry(config, entryCmps, en);

  const modes = en.modeNames.slice();
  if (modes.length > 1 || (modes.length === 1 && modes[0] !== DEFAULT_STYLE_MODE)) {
    buildEntry.modes = modes.sort();
  }

  en.cmps.forEach(cmp => {
    const encap = cmp.encapsulation;
    if (!buildEntry.encapsulations.includes(encap)) {
      buildEntry.encapsulations.push(encap);
    }
  });
  buildEntry.encapsulations.sort();

  return buildEntry;
}


function getBuildEntry(config: d.Config, entryCmps: d.EntryComponent[], en: d.EntryModule) {
  const buildEntry: d.BuildEntry = {
    entryId: en.entryKey,

    components: en.cmps.map(cmp => {
      const entryCmp = entryCmps.find(ec => {
        return ec.tag === cmp.tagName;
      });
      const dependencyOf = ((entryCmp && entryCmp.dependencyOf) || []).slice().sort();

      const buildCmp: d.BuildComponent = {
        tag: cmp.tagName,
        dependencies: cmp.dependencies.slice(),
        dependencyOf: dependencyOf
      };
      return buildCmp;
    }),

    bundles: en.entryBundles.map(entryBundle => {
      return getBuildBundle(config, entryBundle);
    }),

    inputs: en.cmps.reduce((cmps, cmp) => {
      const cmpPath = normalizePath(sys.path.relative(config.rootDir, cmp.jsFilePath));
      if (!cmps.includes(cmpPath)) {
        cmps.push(cmpPath);
      }
      return cmps;
    }, [] as string[]).sort(),

    encapsulations: []
  };

  return buildEntry;
}


function getBuildBundle(config: d.Config, entryBundle: d.EntryBundle) {
  const buildBundle: d.BuildBundle = {
    fileName: entryBundle.fileName,
    outputs: entryBundle.outputs.map(filePath => {
      return normalizePath(sys.path.relative(config.rootDir, filePath));
    }).sort()
  };

  buildBundle.size = entryBundle.text.length;

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
}
