import * as d from '../../declarations';
import { isOutputTargetDistLazy } from './output-utils';
import { generateLazyLoadedApp } from '../component-lazy/generate-lazy-app';
import { dashToPascalCase } from '@utils';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { RollupOptions } from 'rollup';
import { loaderPlugin } from '../rollup-plugins/loader';


export async function outputApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, _webComponentsModule: string) {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistLazy);
  if (outputTargets.length === 0) {
    return;
  }

  await generateLazyLoadedApp(config, compilerCtx, buildCtx, outputTargets);
}

export async function generateNativeApp(config: d.Config, compilerCtx: d.CompilerCtx, cmps: d.ComponentCompilerMeta[]) {
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
      inMemoryFsRead(config, compilerCtx),
    ]
  };

  const results = await config.sys.rollup.rollup(rollupOptions);
  await results.generate({
    format: 'esm',
    file: 'app.esm.js'
  });
}

export const MIN_FOR_LAZY_LOAD = 6;
