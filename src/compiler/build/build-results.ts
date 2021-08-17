import type * as d from '../../declarations';
import { generateHmr } from './build-hmr';
import { getBuildTimestamp } from './build-ctx';
import { hasError, isString, normalizeDiagnostics, fromEntries, getStencilCompilerContext } from '@utils';

export const generateBuildResults = (config: d.Config, buildCtx: d.BuildCtx) => {
  const componentGraph = buildCtx.componentGraph ? fromEntries(buildCtx.componentGraph.entries()) : undefined;

  const buildResults: d.CompilerBuildResults = {
    buildId: buildCtx.buildId,
    diagnostics: normalizeDiagnostics(buildCtx.diagnostics),
    dirsAdded: buildCtx.dirsAdded.slice().sort(),
    dirsDeleted: buildCtx.dirsDeleted.slice().sort(),
    duration: Date.now() - buildCtx.startTime,
    filesAdded: buildCtx.filesAdded.slice().sort(),
    filesChanged: buildCtx.filesChanged.slice().sort(),
    filesDeleted: buildCtx.filesDeleted.slice().sort(),
    filesUpdated: buildCtx.filesUpdated.slice().sort(),
    hasError: hasError(buildCtx.diagnostics),
    hasSuccessfulBuild: getStencilCompilerContext().hasSuccessfulBuild,
    isRebuild: buildCtx.isRebuild,
    namespace: config.namespace,
    outputs: getStencilCompilerContext().fs.getBuildOutputs(),
    rootDir: config.rootDir,
    srcDir: config.srcDir,
    timestamp: getBuildTimestamp(),
    componentGraph,
  };

  const hmr = generateHmr(config, buildCtx);
  if (hmr != null) {
    buildResults.hmr = hmr;
  }

  if (isString(buildCtx.hydrateAppFilePath)) {
    buildResults.hydrateAppFilePath = buildCtx.hydrateAppFilePath;
  }

  getStencilCompilerContext().lastBuildResults = Object.assign({}, buildResults as any);

  return buildResults;
};
