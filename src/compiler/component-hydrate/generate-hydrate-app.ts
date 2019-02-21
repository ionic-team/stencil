import * as d from '@declarations';
import { bundleHydrateCore } from './bundle-hydrate-app';
import { DEFAULT_STYLE_MODE, catchError } from '@utils';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { sys } from '@sys';
import { updateToHydrateComponents } from './update-to-hydrate-components';
import { writeHydrateOutputs } from './write-hydrate-outputs';


export async function generateHydrateApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTarget[]) {
  const timespan = buildCtx.createTimeSpan(`generate hydrate app started`, true);

  try {
    const cmps = buildCtx.moduleFiles.reduce((cmps, m) => {
      cmps.push(...m.cmps);
      return cmps;
    }, [] as d.ComponentCompilerMeta[]);

    const build = getBuildFeatures(cmps) as d.Build;

    build.lazyLoad = false;
    build.es5 = false;
    build.polyfills = false;
    build.hydrateClientSide = false;
    build.hydrateServerSide = true;

    updateBuildConditionals(config, build);
    build.lifecycleDOMEvents = false;
    build.hotModuleReplacement = false;

    const appCoreEntryFilePath = await generateHydrateAppCoreEntry(config, compilerCtx, buildCtx, cmps, build);

    const code = await bundleHydrateCore(config, compilerCtx, buildCtx, build, buildCtx.entryModules, appCoreEntryFilePath);

    if (!buildCtx.shouldAbort && typeof code === 'string') {
      await writeHydrateOutputs(config, compilerCtx, buildCtx, outputTargets, code);
    }

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timespan.finish(`generate hydrate app finished`);
}


async function generateHydrateAppCoreEntry(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmps: d.ComponentCompilerMeta[], build: d.Build) {
  const appCoreEntryFileName = `${config.fsNamespace}-hydrate.mjs`;
  const appCoreEntryFilePath = sys.path.join(config.rootDir, appCoreEntryFileName);

  const coreText: string[] = [];
  const hydrateCmps = await updateToHydrateComponents(compilerCtx, buildCtx, build, cmps);

  const platformImports: string[] = [
    'registerComponents',
    'styles'
  ];

  coreText.push(`import { ${platformImports.join(', ')} } from '@stencil/core/platform';`);

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
      let styleId = cmpData.cmp.tagName;
      if (style.modeName !== DEFAULT_STYLE_MODE) {
        styleId += `#${style.modeName}`;
      }

      if (style.compiledStyleTextScoped)

      coreText.push(`styles.set('${styleId}', '${style.compiledStyleTextScoped}');`);
    });
  });

  const platformExports: string[] = [
    'registerInstance',
    'connectedCallback',
    'createEvent',
    'getConnect',
    'getContext',
    'getElement',
    'setMode',
    'getMode',
    'Build',
    'Host',
    'h',
  ];
  coreText.push(`export { ${platformExports.join(', ')} } from '@stencil/core/platform';`);

  await compilerCtx.fs.writeFile(appCoreEntryFilePath, coreText.join('\n'), { inMemoryOnly: true });

  return appCoreEntryFilePath;
}
