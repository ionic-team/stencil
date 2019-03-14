import * as d from '../../declarations';
import { bundleHydrateCore } from './bundle-hydrate-app';
import { DEFAULT_STYLE_MODE, catchError } from '@utils';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { getComponentsFromModules } from '../output-targets/output-utils';
import { updateToHydrateComponents } from './update-to-hydrate-components';
import { writeHydrateOutputs } from './write-hydrate-outputs';


export async function generateHydrateApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetHydrate[]) {
  try {
    const cmps = getComponentsFromModules(buildCtx.moduleFiles);
    const build = getBuildConditionals(config, cmps);
    const coreSource = await generateHydrateAppCoreEntry(config, compilerCtx, buildCtx, cmps, build);
    const code = await bundleHydrateCore(config, compilerCtx, buildCtx, build, buildCtx.entryModules, coreSource);

    if (!buildCtx.shouldAbort && typeof code === 'string') {
      await writeHydrateOutputs(config, compilerCtx, buildCtx, outputTargets, code);
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

async function generateHydrateAppCoreEntry(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmps: d.ComponentCompilerMeta[], build: d.Build) {
  const coreText: string[] = [];
  const hydrateCmps = await updateToHydrateComponents(config, compilerCtx, buildCtx, build, cmps);

  coreText.push(`import { registerComponents, styles } from '@stencil/core/platform';`);

  hydrateCmps.forEach(cmpData => {
    coreText.push(`import { ${cmpData.cmp.componentClassName} } from '${cmpData.filePath}';`);
  });

  coreText.push(`const cmps = [`);
  hydrateCmps.forEach(cmpData => {
    coreText.push(`  ${cmpData.cmp.componentClassName},`);
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
