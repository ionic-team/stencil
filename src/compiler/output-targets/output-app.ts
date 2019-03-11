import * as d from '@declarations';
import { generateLazyLoadedApp } from '../component-lazy/generate-lazy-app';
import { getComponentAssetsCopyTasks } from '../copy/assets-copy-tasks';
import { getComponentsFromModules, isOutputTargetDistLazy } from './output-utils';
import { dashToPascalCase, flatOne } from '@utils';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { performCopyTasks } from '../copy/copy-tasks';
import { processCopyTasks } from '../copy/local-copy-tasks';
import { RollupOptions } from 'rollup';
import { stencilLoaderPlugin } from '../rollup-plugins/stencil-loader';


export async function outputApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, _webComponentsModule: string) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDistLazy);
  if (outputTargets.length === 0) {
    return;
  }

  copyAssets(config, compilerCtx, buildCtx, outputTargets);

  const cmps = getComponentsFromModules(buildCtx.moduleFiles);
  // if (cmps.length > MIN_FOR_LAZY_LOAD) {
  //   return generateLazyLoadedApp(config, compilerCtx, buildCtx, outputTargets, cmps);
  // } else {
  //   // we need raw web components
  //   return generateNativeApp(compilerCtx, buildCtx, cmps);
  // }
  return generateLazyLoadedApp(config, compilerCtx, buildCtx, outputTargets, cmps);
}

async function copyAssets(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistLazy[]) {
  const allCopyTasks = flatOne(
    await Promise.all(
      outputTargets.map(async o => [
        ...getComponentAssetsCopyTasks(buildCtx, o.copyDir, true),
        ...await processCopyTasks(config, o.copyDir, o.copy)
      ])
    )
  );
  return performCopyTasks(compilerCtx, buildCtx, allCopyTasks);
}

export async function generateNativeApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmps: d.ComponentCompilerMeta[]) {
  const entryPoint = `
import * as c from 'modules';
[
  ${cmps.map(cmp => `c.${dashToPascalCase(cmp.tagName)}`).join(', ')}
].forEach(Cmp => customElements.define(Cmp.is, Cmp));
`;

  const rollupOptions: RollupOptions = {
    input: '@core-entrypoint',
    plugins: [
      stencilLoaderPlugin({
        '@core-entrypoint': entryPoint
      }),
      inMemoryFsRead(config, compilerCtx, buildCtx),
    ]
  };

  const results = await config.sys.rollup.rollup(rollupOptions);
  await results.generate({
    format: 'esm',
    file: 'app.mjs.js'
  });
}

export const MIN_FOR_LAZY_LOAD = 6;
