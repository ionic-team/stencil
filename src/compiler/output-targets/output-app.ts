import * as d from '../../declarations';
import { isOutputTargetDistLazy } from './output-utils';
import { generateLazyLoadedApp } from '../component-lazy/generate-lazy-app';
import { getComponentAssetsCopyTasks } from '../copy/assets-copy-tasks';
import { dashToPascalCase, flatOne } from '@utils';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { performCopyTasks } from '../copy/copy-tasks';
import { processCopyTasks } from '../copy/local-copy-tasks';
import { RollupOptions } from 'rollup';
import { loaderPlugin } from '../rollup-plugins/loader';


export async function outputApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, _webComponentsModule: string) {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistLazy);
  if (outputTargets.length === 0) {
    return undefined;
  }

  copyAssets(config, compilerCtx, buildCtx, outputTargets);

  return generateLazyLoadedApp(config, compilerCtx, buildCtx, outputTargets);
}

async function copyAssets(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistLazy[]) {
  const allCopyTasks = flatOne(
    await Promise.all(
      outputTargets.map(async o => [
        ...getComponentAssetsCopyTasks(config, buildCtx, o.copyDir, false),
        ...await processCopyTasks(config, o.copyDir, o.copy)
      ])
    )
  );
  return performCopyTasks(config, compilerCtx, buildCtx, allCopyTasks);
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
      loaderPlugin({
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
