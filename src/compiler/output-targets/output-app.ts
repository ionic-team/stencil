import * as d from '@declarations';
import { generateLazyLoadedApp } from '../component-lazy/generate-lazy-app';
import { getComponentsFromModules, isOutputTargetBuild } from './output-utils';
import { sys } from '@sys';
import { RollupOptions } from 'rollup';
import { dashToPascalCase } from '@utils';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { stencilClientEntryPointPlugin } from '../rollup-plugins/stencil-client-entrypoint';


export async function outputApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetBuild);
  if (outputTargets.length === 0) {
    return;
  }

  const cmps = getComponentsFromModules(buildCtx.moduleFiles);
  // if (cmps.length > MIN_FOR_LAZY_LOAD) {
  //   return generateLazyLoadedApp(config, compilerCtx, buildCtx, outputTargets, cmps);
  // } else {
  //   // we need raw web components
  //   return generateNativeApp(compilerCtx, buildCtx, cmps);
  // }
  return generateLazyLoadedApp(config, compilerCtx, buildCtx, outputTargets, cmps);
}


export async function generateNativeApp(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmps: d.ComponentCompilerMeta[]) {
  const entryPoint = `
import * as c from 'modules';
[
  ${cmps.map(cmp => `c.${dashToPascalCase(cmp.tagName)}`).join(', ')}
].forEach(Cmp => customElements.define(Cmp.is, Cmp));
`;

  const rollupOptions: RollupOptions = {
    input: '@core-entrypoint',
    plugins: [
      stencilClientEntryPointPlugin(entryPoint),
      inMemoryFsRead(compilerCtx, buildCtx),
    ]
  };

  const results = await sys.rollup.rollup(rollupOptions);
  await results.generate({
    format: 'esm',
    file: 'app.mjs.js'
  });
}

export const MIN_FOR_LAZY_LOAD = 6;
