import * as d from '../../declarations';
import { hasError, normalizeDiagnostics } from '@utils';
import { generateHmr } from './build-hmr';


export const generateBuildResults = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  const timeSpan = buildCtx.createTimeSpan(`generateBuildResults started`, true);

  const buildResults: d.BuildResults = {
    buildId: buildCtx.buildId,
    buildConditionals: getBuildConditionals(buildCtx),
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
    hasSuccessfulBuild: compilerCtx.hasSuccessfulBuild,
    isRebuild: buildCtx.isRebuild,
    styleBuildCount: buildCtx.styleBuildCount,
    transpileBuildCount: buildCtx.transpileBuildCount,

    components: [],
    entries: []
  };

  compilerCtx.lastBuildResults = Object.assign({}, buildResults);

  const hmr = generateHmr(config, compilerCtx, buildCtx);
  if (hmr != null) {
    buildResults.hmr = hmr;
  }

  buildCtx.entryModules.forEach(en => {
    const buildEntry: d.BuildEntry = {
      entryId: en.entryKey,
      components: [],
      bundles: [],
      inputs: [],
      modes: en.modeNames.slice(),
      encapsulations: []
    };
    en.cmps.forEach(cmp => {
      if (!buildEntry.inputs.includes(cmp.sourceFilePath)) {
        buildEntry.inputs.push(cmp.sourceFilePath);
      }
      if (!buildEntry.encapsulations.includes(cmp.encapsulation)) {
        buildEntry.encapsulations.push(cmp.encapsulation);
      }
      const buildCmp: d.BuildComponent = {
        tag: cmp.tagName,
        dependencyOf: cmp.dependents.slice(),
        dependencies: cmp.dependencies.slice()
      };
      buildEntry.components.push(buildCmp);
    });
    buildResults.entries.push(buildEntry);
  });

  buildResults.entries.forEach(en => {
    buildResults.components.push(...en.components);
  });

  timeSpan.finish(`generateBuildResults finished`);

  return buildResults;
};

const getBuildConditionals = (buildCtx: d.BuildCtx) => {
  const b = {
    shadow: false,
    slot: false,
    svg: false,
    vdom: false
  };

  buildCtx.components.forEach(cmp => {
    b.shadow = b.shadow || (cmp.encapsulation === 'shadow');
    b.slot = b.slot || cmp.htmlTagNames.includes('slot');
    b.svg = b.svg || cmp.htmlTagNames.includes('svg');
    b.vdom = b.vdom || cmp.hasVdomRender;
  });

  return b;
};
