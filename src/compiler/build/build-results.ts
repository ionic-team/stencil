import * as d from '../../declarations';
import { cleanDiagnostics } from '../../util/logger/logger-util';
import { DEFAULT_STYLE_MODE, ENCAPSULATION } from '../../util/constants';
import { genereateHmr } from './build-hmr';
import { hasError, normalizePath } from '../util';


export async function generateBuildResults(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  // create the build results that get returned
  const getGzipSize = config.outputTargets.some(o => o.type === 'stats');

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

    entries: await Promise.all(buildCtx.entryModules.map(en => {
      return getEntryModule(config, buildCtx, getGzipSize, en);
    }))
  };

  const hmr = genereateHmr(config, compilerCtx, buildCtx);
  if (hmr) {
    buildResults.hmr = hmr;
  }

  buildResults.entries.forEach(en => {
    buildResults.components.push(...en.components);
  });

  return buildResults;
}


async function getEntryModule(config: d.Config, buildCtx: d.BuildCtx, getGzipSize: boolean, en: d.EntryModule) {
  en.modeNames = en.modeNames || [];
  en.entryBundles = en.entryBundles || [];
  en.moduleFiles = en.moduleFiles || [];

  const entryCmps: d.EntryComponent[] = [];

  buildCtx.entryPoints.forEach(ep => {
    entryCmps.push(...ep);
  });

  const buildEntry = await getBuildEntry(config, getGzipSize, entryCmps, en);

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
}


async function getBuildEntry(config: d.Config, getGzipSize: boolean, entryCmps: d.EntryComponent[], en: d.EntryModule) {
  const buildEntry: d.BuildEntry = {
    entryId: en.entryKey,

    components: en.moduleFiles.map(m => {
      const entryCmp = entryCmps.find(ec => {
        return ec.tag === m.cmpMeta.tagNameMeta;
      });
      const dependencyOf = ((entryCmp && entryCmp.dependencyOf) || []).slice().sort();

      const buildCmp: d.BuildComponent = {
        tag: m.cmpMeta.tagNameMeta,
        dependencies: m.cmpMeta.dependencies.slice(),
        dependencyOf: dependencyOf
      };
      return buildCmp;
    }),

    bundles: await Promise.all(en.entryBundles.map(entryBundle => {
      return getBuildBundle(config, entryBundle, getGzipSize);
    })),

    inputs: en.moduleFiles.map(m => {
      return normalizePath(config.sys.path.relative(config.rootDir, m.jsFilePath));
    }).sort(),

    encapsulations: []
  };

  return buildEntry;
}


async function getBuildBundle(config: d.Config, entryBundle: d.EntryBundle, getGzipSize: boolean) {
  const buildBundle: d.BuildBundle = {
    fileName: entryBundle.fileName,
    outputs: entryBundle.outputs.map(filePath => {
      return normalizePath(config.sys.path.relative(config.rootDir, filePath));
    }).sort()
  };

  buildBundle.size = entryBundle.text.length;

  if (getGzipSize) {
    buildBundle.gzip = await config.sys.gzipSize(entryBundle.text);
  }

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
