import * as d from '@declarations';
import { bundleAppCore } from '../app-core/bundle-app-core';
import { getBuildFeatures, updateBuildConditionals } from '../app-core/build-conditionals';
import { sys } from '@sys';
import { updateToHydrateComponents } from './update-to-hydrate-components';
import { DEFAULT_STYLE_MODE } from '@utils';


export async function generateHydrateApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTarget[]) {
  const timespan = buildCtx.createTimeSpan(`generate hydrate app started`, true);

  const cmps = buildCtx.moduleFiles.reduce((cmps, m) => {
    cmps.push(...m.cmps);
    return cmps;
  }, [] as d.ComponentCompilerMeta[]);

  const build = getBuildFeatures(cmps) as d.Build;

  build.lazyLoad = false;
  build.es5 = false;
  build.polyfills = false;
  build.prerenderClientSide = false;
  build.prerenderServerSide = true;

  updateBuildConditionals(config, build);

  const appCoreEntryFilePath = await generateHydrateAppCoreEntry(config, compilerCtx, buildCtx, cmps, build);

  const rollupResults = await bundleAppCore(config, compilerCtx, buildCtx, build, buildCtx.entryModules, 'server', appCoreEntryFilePath, {});

  if (Array.isArray(rollupResults) && !buildCtx.shouldAbort) {
    const rollupResult = rollupResults.find(r => !r.isEntry);
    if (rollupResult != null) {
      await writeHydrateApp(config, compilerCtx, outputTargets, rollupResult);
    }
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
    coreText.push(`import { ${cmpData.componentClassName} } from '${cmpData.filePath}';`);
  });

  coreText.push(`const cmps = [`);
  hydrateCmps.forEach(cmpData => {
    coreText.push(`  ${cmpData.componentClassName},`);
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
    'registerHost',
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


async function writeHydrateApp(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTarget[], rollupResult: d.RollupResult) {
  const distDir = getRendererDistDir(config, outputTargets);
  const rendererDistFilePath = sys.path.join(distDir, SERVER_DIR, SERVER_INDEX);

  await compilerCtx.fs.writeFile(rendererDistFilePath, rollupResult.code);

  const distOutputTargets = (outputTargets as d.OutputTargetDist[]).filter(o => {
    return (o.type === 'dist');
  });

  return Promise.all(distOutputTargets.map(distOutputTarget => {
    const filePath = sys.path.join(distOutputTarget.buildDir, SERVER_DIR, SERVER_INDEX);
    return compilerCtx.fs.writeFile(filePath, rollupResult.code);
  }));
}


function getRendererDistDir(config: d.Config, outputTargets: d.OutputTarget[]) {
  const distOutputTarget = (outputTargets as d.OutputTargetDist[]).find(o => {
    return (o.type === 'dist');
  });

  if (distOutputTarget != null) {
    return distOutputTarget.buildDir;
  }

  return sys.path.join(config.rootDir, 'dist');
}


const SERVER_DIR = `server`;
const SERVER_INDEX = `index.js`;
