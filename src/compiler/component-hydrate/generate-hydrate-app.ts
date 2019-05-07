import * as d from '../../declarations';
import { bundleHydrateApp } from './bundle-hydrate-app';
import { DEFAULT_STYLE_MODE, catchError } from '@utils';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { updateToHydrateComponents } from './update-to-hydrate-components';
import { writeHydrateOutputs } from './write-hydrate-outputs';


export async function generateHydrateApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetHydrate[]) {
  try {
    const cmps = buildCtx.components;
    const build = getBuildConditionals(config, cmps);

    const appEntryCode = await generateHydrateAppCore(config, compilerCtx, buildCtx);

    const rollupAppBuild = await bundleHydrateApp(config, compilerCtx, buildCtx, build, appEntryCode);
    if (rollupAppBuild != null) {
      const rollupOutput = await rollupAppBuild.generate({
        format: 'cjs',
        file: 'app.js',
        chunkFileNames: '[name].js',
      });

      if (!buildCtx.hasError && rollupOutput != null && Array.isArray(rollupOutput.output)) {
        await writeHydrateOutputs(config, compilerCtx, buildCtx, outputTargets, rollupOutput);
      }
    }

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
}


async function generateHydrateAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const cmps = buildCtx.components;
  const coreText: string[] = [];
  const hydrateCmps = await updateToHydrateComponents(config, compilerCtx, buildCtx, cmps);

  coreText.push(`import { bootstrapHydrate, registerComponents, styles } from '@stencil/core/platform';`);
  coreText.push(`import globals from '@stencil/core/global-scripts';`);

  hydrateCmps.forEach(cmpData => coreText.push(cmpData.importLine));

  coreText.push(`globals();`);

  coreText.push(`const cmps = [`);
  hydrateCmps.forEach(cmpData => {
    coreText.push(`  ${cmpData.uniqueComponentClassName},`);
  });
  coreText.push(`];`);
  coreText.push(`registerComponents(cmps);`);

  await buildCtx.stylesPromise;

  hydrateCmps.forEach(cmpData => {
    cmpData.cmp.styles.forEach(style => {
      let scopeId = 'sc-' + cmpData.cmp.tagName;
      if (style.modeName !== DEFAULT_STYLE_MODE) {
        scopeId += `-${style.modeName}`;
      }

      if (typeof style.compiledStyleTextScopedCommented === 'string') {
        coreText.push(`styles.set('${scopeId}','${style.compiledStyleTextScopedCommented}');`);
      } else {
        coreText.push(`styles.set('${scopeId}','${style.compiledStyleTextScoped}');`);
      }
    });
  });

  coreText.push(`export { bootstrapHydrate }`);

  return coreText.join('\n');
}


function getBuildConditionals(config: d.Config, cmps: d.ComponentCompilerMeta[]) {
  const build = getBuildFeatures(cmps) as d.Build;

  build.lazyLoad = false;
  build.hydrateClientSide = false;
  build.hydrateServerSide = true;

  updateBuildConditionals(config, build);
  build.lifecycleDOMEvents = false;
  build.hotModuleReplacement = false;

  return build;
}

