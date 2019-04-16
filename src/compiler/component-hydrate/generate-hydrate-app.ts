import * as d from '../../declarations';
import { DEFAULT_STYLE_MODE, catchError } from '@utils';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { updateToHydrateComponents } from './update-to-hydrate-components';
import { writeHydrateOutputs } from './write-hydrate-outputs';
import { bundleApp } from '../app-core/bundle-app-core';


export async function generateHydrateApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetHydrate[]) {
  try {
    const cmps = buildCtx.components;
    const build = getBuildConditionals(config, cmps);
    const rollupBuild = await bundleHydrateApp(config, compilerCtx, buildCtx, build);
    if (rollupBuild) {
      const { output } = await rollupBuild.generate({ format: 'cjs' });
      const code = output[0].code;

      if (!buildCtx.shouldAbort && typeof code === 'string') {
        await writeHydrateOutputs(config, compilerCtx, buildCtx, outputTargets, code);
      }
    }

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
}

function getBuildConditionals(config: d.Config, cmps: d.ComponentCompilerMeta[]) {
  const build = getBuildFeatures(cmps) as d.Build;

  build.lazyLoad = false;
  build.es5 = false;
  build.polyfills = false;
  build.hydrateClientSide = false;
  build.hydrateServerSide = true;

  updateBuildConditionals(config, build);
  build.lifecycleDOMEvents = false;
  build.hotModuleReplacement = false;
  build.slotRelocation = true;
  return build;
}

async function bundleHydrateApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build) {
  const coreSource = await generateHydrateAppCore(config, compilerCtx, buildCtx, build);

  const bundleAppOptions: d.BundleAppOptions = {
    loader: {
      '@stencil/core': coreSource,
      '@core-entrypoint': SERVER_ENTRY,
    },
    inputs: {
      [config.fsNamespace]: '@core-entrypoint',
    },
    isServer: true
  };
  const rollupBuild = await bundleApp(config, compilerCtx, buildCtx, build, bundleAppOptions);
  return rollupBuild;
}

async function generateHydrateAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build) {
  const cmps = buildCtx.components;
  const coreText: string[] = [];
  const hydrateCmps = await updateToHydrateComponents(config, compilerCtx, buildCtx, build, cmps);

  coreText.push(`import { registerComponents, styles } from '@stencil/core/platform';`);

  hydrateCmps.forEach(cmpData => coreText.push(cmpData.importLine));

  coreText.push(`const cmps = [`);
  hydrateCmps.forEach(cmpData => {
    coreText.push(`  ${cmpData.uniqueComponentClassName},`);
  });
  coreText.push(`];`);
  coreText.push(`registerComponents(cmps);`);

  await buildCtx.stylesPromise;

  hydrateCmps.forEach(cmpData => {
    cmpData.cmp.styles.forEach(style => {
      let styleId = 'sc-' + cmpData.cmp.tagName;
      if (style.modeName !== DEFAULT_STYLE_MODE) {
        styleId += `-${style.modeName}`;
      }

      if (typeof style.compiledStyleTextScopedCommented === 'string') {
        coreText.push(`styles.set('${styleId}','${style.compiledStyleTextScopedCommented}');`);
      } else {
        coreText.push(`styles.set('${styleId}','${style.compiledStyleTextScoped}');`);
      }
    });
  });

  coreText.push(`export * from '@stencil/core/platform';`);
  return coreText.join('\n');
}

const SERVER_ENTRY = `
import { patchNodeGlobal } from '@stencil/core/platform';
patchNodeGlobal(global);

export { hydrateDocument, renderToString } from '@stencil/core';
`;
