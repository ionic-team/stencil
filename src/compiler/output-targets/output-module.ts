import * as d from '@declarations';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { getComponentsFromModules, isOutputTargetDistModule } from './output-utils';
import { bundleApp } from '../app-core/bundle-app-core';
import { sys } from '@sys';
import { dashToPascalCase } from '@utils';
import { formatComponentRuntimeMeta, stringifyRuntimeData } from '../app-core/format-component-runtime-meta';
import { optimizeModule } from '../app-core/optimize-module';


export async function outputModule(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDistModule);
  if (outputTargets.length === 0) {
    return;
  }

  return generateModuleWebComponents(config, compilerCtx, buildCtx, outputTargets);
}

export async function generateModuleWebComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistModule[]) {
  await buildCtx.stylesPromise;

  const timespan = buildCtx.createTimeSpan(`generate module web components started`, true);

  const cmps = getComponentsFromModules(buildCtx.moduleFiles);
  const build = getBuildConditionals(config, cmps);
  const rollupResults = await bundleNativeModule(config, compilerCtx, buildCtx, build);

  if (Array.isArray(rollupResults) && !buildCtx.shouldAbort) {
    if (rollupResults.length !== 1) {
      console.error('not a single file');
    } else {
      let code = rollupResults[0].code;

      if (config.minifyJs) {
        const optimizeResults = await optimizeModule(config, compilerCtx, 'es2017', rollupResults[0].code);
        buildCtx.diagnostics.push(...optimizeResults.diagnostics);

        if (optimizeResults.diagnostics.length === 0 && typeof optimizeResults.output === 'string') {
          code = optimizeResults.output;
        }
      }

      await Promise.all(outputTargets.map(async outputTarget => {
        const filePath = sys.path.join(outputTarget.file);
        await compilerCtx.fs.writeFile(filePath, code);
      }));
    }
  }

  timespan.finish(`generate module web components finished`);
}


function getBuildConditionals(config: d.Config, cmps: d.ComponentCompilerMeta[]) {
  const build = getBuildFeatures(cmps) as d.Build;

  build.lazyLoad = false;
  build.es5 = false;
  build.polyfills = false;
  build.hydrateClientSide = false;
  build.hydrateServerSide = false;

  updateBuildConditionals(config, build);
  return build;
}

export async function bundleNativeModule(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build) {
  const bundleCoreOptions: d.BundleCoreOptions = {
    entryInputs: {},
    moduleFormats: ['esm'],
    loader: {
      '@core-entrypoint': generateEntryPoint(buildCtx.entryModules)
    }
  };
  return bundleApp(config, compilerCtx, buildCtx, build, bundleCoreOptions);
}

function generateEntryPoint(entryModules: d.EntryModule[]) {
  let count = 0;
  const result: string[] = [
    `import { proxyNative } from '@stencil/core/app';`
  ];
  entryModules.forEach(entry => entry.cmps.forEach(cmp => {
    if (cmp.isPlain) {
      result.push(
        `export { ${cmp.componentClassName} as ${dashToPascalCase(cmp.tagName)} } from '${entry.entryKey}';`,
      );
    } else {
      const meta = stringifyRuntimeData(formatComponentRuntimeMeta(cmp, true, false));
      result.push(
        `import { ${cmp.componentClassName} as $Cmp${count} } from '${entry.entryKey}';`,
        `export const ${dashToPascalCase(cmp.tagName)} = /*#__PURE__*/proxyNative($Cmp${count}, ${meta});`
      );
      count++;
    }
  }));
  return result.join('\n');
}
