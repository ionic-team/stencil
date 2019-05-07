import * as d from '../../declarations';
import { bundleApp, generateRollupOutput } from '../app-core/bundle-app-core';
import { isOutputTargetDistModule } from './output-utils';
import { buildWarn, dashToPascalCase } from '@utils';
import { formatComponentRuntimeMeta, stringifyRuntimeData } from '../app-core/format-component-runtime-meta';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { optimizeModule } from '../app-core/optimize-module';

export async function outputModule(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (config.devMode) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDistModule);
  if (outputTargets.length === 0) {
    return;
  }
  const timespan = buildCtx.createTimeSpan(`generate webcomponents module started`);
  await generateModuleWebComponents(config, compilerCtx, buildCtx, outputTargets);
  timespan.finish(`generate webcomponents module finished`);
}

export async function generateModuleWebComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistModule[]) {
  const timespan = buildCtx.createTimeSpan(`generate module web components started`, true);

  await buildCtx.stylesPromise;

  await Promise.all([
    bundleRawComponents(config, compilerCtx, buildCtx, outputTargets.filter(o => o.externalRuntime), true),
    bundleRawComponents(config, compilerCtx, buildCtx, outputTargets.filter(o => !o.externalRuntime), false),
  ]);

  timespan.finish(`generate module web components finished`);
}

async function bundleRawComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistModule[], externalRuntime: boolean) {
  const cmps = buildCtx.components;
  const build = getBuildConditionals(config, cmps);

  if (build.mode) {
    const warn = buildWarn(buildCtx.diagnostics);
    warn.messageText = 'Multiple modes is not fully supported by "dist-module" output target';
  }
  const rollupResults = await bundleNativeModule(config, compilerCtx, buildCtx, build, externalRuntime);

  if (Array.isArray(rollupResults) && !buildCtx.hasError) {
    await Promise.all(
      rollupResults.map(async result => {
        let code = result.code;

        if (!externalRuntime && config.minifyJs) {
          const optimizeResults = await optimizeModule(config, compilerCtx, 'es2017', true, false, code);
          buildCtx.diagnostics.push(...optimizeResults.diagnostics);

          if (optimizeResults.diagnostics.length === 0 && typeof optimizeResults.output === 'string') {
            code = optimizeResults.output;
          }
        }

        await Promise.all(outputTargets.map(async outputTarget => {
          const filePath = config.sys.path.join(outputTarget.dir, result.fileName);
          await compilerCtx.fs.writeFile(filePath, code);
        }));
      })
    );
  }
}


function getBuildConditionals(config: d.Config, cmps: d.ComponentCompilerMeta[]) {
  const build = getBuildFeatures(cmps) as d.Build;

  build.lazyLoad = false;
  build.hydrateClientSide = false;
  build.hydrateServerSide = false;

  updateBuildConditionals(config, build);

  return build;
}

export async function bundleNativeModule(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, externalRuntime: boolean) {
  const bundleAppOptions: d.BundleAppOptions = {
    inputs: {
      'index': '@core-entrypoint'
    },
    loader: {
      '@core-entrypoint': generateEntryPoint(buildCtx.entryModules)
    },
    cache: compilerCtx.rollupCacheNative,
    externalRuntime: externalRuntime ? '@stencil/core/runtime' : undefined,
    skipDeps: true
  };

  const rollupBuild = await bundleApp(config, compilerCtx, buildCtx, build, bundleAppOptions);
  if (rollupBuild != null) {
    compilerCtx.rollupCacheNative = rollupBuild.cache;
  } else {
    compilerCtx.rollupCacheNative = null;
  }

  return generateRollupOutput(rollupBuild, { format: 'esm' }, config, buildCtx.entryModules);
}

function generateEntryPoint(entryModules: d.EntryModule[]) {
  let count = 0;
  const result: string[] = [
    `import { proxyNative, globals } from '@stencil/core';`,
    `globals()`
  ];
  entryModules.forEach(entry => entry.cmps.forEach(cmp => {
    if (cmp.isPlain) {
      result.push(
        `export { ${dashToPascalCase(cmp.tagName)} } from '${entry.entryKey}';`,
      );
    } else {
      const meta = stringifyRuntimeData(formatComponentRuntimeMeta(cmp, false));
      const exportName = dashToPascalCase(cmp.tagName);
      result.push(
        `import { ${exportName} as $Cmp${count} } from '${entry.entryKey}';`,
        `export const ${exportName} = /*@__PURE__*/proxyNative($Cmp${count}, ${meta});`
      );
      count++;
    }
  }));
  return result.join('\n');
}
