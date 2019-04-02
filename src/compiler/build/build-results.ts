import * as d from '../../declarations';
import { hasError, normalizeDiagnostics } from '@utils';
import { generateHmr } from './build-hmr';


export function generateBuildResults(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const timeSpan = buildCtx.createTimeSpan(`generateBuildResults started`, true);

  const buildResults: d.BuildResults = {
    buildId: buildCtx.buildId,
    bundleBuildCount: buildCtx.bundleBuildCount,
    diagnostics: normalizeDiagnostics(compilerCtx, buildCtx.diagnostics),
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
    entries: []
  };

  compilerCtx.lastBuildResults = Object.assign({}, buildResults);

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
