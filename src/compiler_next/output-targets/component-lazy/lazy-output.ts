import { generateEntryModules } from '../../..//compiler/entries/entry-modules';
import * as d from '../../../declarations';
import { bundleOutput } from '../../bundle/bundle-output';
import { catchError } from '@utils';
import { getBuildFeatures, updateBuildConditionals } from '../../build/app-data';
import { BundleOptions } from '../../bundle/bundle-interface';
import { LAZY_BROWSER_ENTRY_ID, LAZY_EXTERNAL_ENTRY_ID, STENCIL_INTERNAL_CLIENT_ID, USER_INDEX_ENTRY_ID } from '../../bundle/entry-alias-ids';
import { isOutputTargetDistLazy, isOutputTargetHydrate } from '../../../compiler/output-targets/output-utils';
import { lazyComponentTransform } from '../../transformers/component-lazy/transform-lazy-component';
import { updateStencilCoreImports } from '../../../compiler/transformers/update-stencil-core-import';
import { generateEsmBrowser } from '../../../compiler/component-lazy/generate-esm-browser';
import { generateEsm } from './generate-esm';
import { generateSystem } from './generate-system';
import { generateCjs } from './generate-cjs';
import { generateModuleGraph } from '../../../compiler/entries/component-graph';


export const lazyOutput = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistLazy);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate lazy started`, true);

  try {

    // const criticalBundles = getCriticalPath(buildCtx);

    const bundleOpts: BundleOptions = {
      id: 'lazy',
      platform: 'client',
      conditionals: getBuildConditionals(config, buildCtx.components),
      customTransformers: getCustomTransformer(compilerCtx),
      inputs: {
        [config.fsNamespace]: LAZY_BROWSER_ENTRY_ID,
        'loader': LAZY_EXTERNAL_ENTRY_ID,
        'index': USER_INDEX_ENTRY_ID
      },
      loader: {
        [LAZY_EXTERNAL_ENTRY_ID]: LAZY_EXTERNAL_ENTRY,
        [LAZY_BROWSER_ENTRY_ID]: LAZY_BROWSER_ENTRY
      }
    };

    // we've got the compiler context filled with app modules and collection dependency modules
    // figure out how all these components should be connected
    generateEntryModules(config, buildCtx);
    buildCtx.entryModules.forEach(entryModule => {
      bundleOpts.inputs[entryModule.entryKey] = entryModule.entryKey;
    });

    const rollupBuild = await bundleOutput(config, compilerCtx, buildCtx, bundleOpts);

    const [componentBundle] = await Promise.all([
      generateEsmBrowser(config, compilerCtx, buildCtx, rollupBuild, outputTargets),
      generateEsm(config, compilerCtx, buildCtx, rollupBuild, outputTargets),
      generateSystem(config, compilerCtx, buildCtx, rollupBuild, outputTargets),
      generateCjs(config, compilerCtx, buildCtx, rollupBuild, outputTargets),
    ]);

    await generateLegacyLoader(config, compilerCtx, outputTargets);
    buildCtx.componentGraph = generateModuleGraph(buildCtx.components, componentBundle);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timespan.finish(`generate lazy finished`);
};


const getBuildConditionals = (config: d.Config, cmps: d.ComponentCompilerMeta[]) => {
  const build = getBuildFeatures(cmps) as d.BuildConditionals;

  build.lazyLoad = true;
  build.hydrateServerSide = false;
  build.cssVarShim = true;

  const hasHydrateOutputTargets = config.outputTargets.some(isOutputTargetHydrate);
  build.hydrateClientSide = hasHydrateOutputTargets;

  updateBuildConditionals(config, build);

  return build;
};

// function getCriticalPath(buildCtx: d.BuildCtx) {
//   const componentGraph = buildCtx.componentGraph;
//   if (!buildCtx.indexDoc || !componentGraph) {
//     return [];
//   }
//   return unique(
//     flatOne(
//       getUsedComponents(buildCtx.indexDoc, buildCtx.components)
//         .map(tagName => getScopeId(tagName))
//         .map(scopeId => buildCtx.componentGraph.get(scopeId) || [])
//     )
//   ).sort();
// }


const getCustomTransformer = (compilerCtx: d.CompilerCtx) => {
  const transformOpts: d.TransformOptions = {
    coreImportPath: STENCIL_INTERNAL_CLIENT_ID,
    componentExport: 'lazy',
    componentMetadata: null,
    proxy: null,
    style: 'static'
  };
  return [
    updateStencilCoreImports(transformOpts.coreImportPath),
    lazyComponentTransform(compilerCtx, transformOpts)
  ];
};


const LAZY_BROWSER_ENTRY = `
import { bootstrapLazy, globalScripts, patchBrowser } from '${STENCIL_INTERNAL_CLIENT_ID}';

patchBrowser().then(options => {
  globalScripts();
  return bootstrapLazy([/*!__STENCIL_LAZY_DATA__*/], options);
});
`;

const LAZY_EXTERNAL_ENTRY = `
import { bootstrapLazy, globalScripts, patchEsm } from '${STENCIL_INTERNAL_CLIENT_ID}';

export const defineCustomElements = (win, options) => patchEsm().then(() => {
  globalScripts();
  bootstrapLazy([/*!__STENCIL_LAZY_DATA__*/], options);
});
`;

function generateLegacyLoader(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetDistLazy[]) {
  return Promise.all(
    outputTargets.map(async o => {
      if (o.legacyLoaderFile) {
        const loaderContent = getLegacyLoader(config);
        await compilerCtx.fs.writeFile(o.legacyLoaderFile, loaderContent);
      }
    })
  );
}


function getLegacyLoader(config: d.Config) {
  const namespace = config.fsNamespace;
  return `
(function(doc){
  var scriptElm = doc.scripts[doc.scripts.length - 1];
  var warn = ['[${namespace}] Deprecated script, please remove: ' + scriptElm.outerHTML];

  warn.push('To improve performance it is recommended to set the differential scripts in the head as follows:')

  var parts = scriptElm.src.split('/');
  parts.pop();
  parts.push('${namespace}');
  var url = parts.join('/');

  var scriptElm = doc.createElement('script');
  scriptElm.setAttribute('type', 'module');
  scriptElm.src = url + '/${namespace}.esm.js';
  warn.push(scriptElm.outerHTML);
  scriptElm.setAttribute('data-stencil-namespace', '${namespace}');
  doc.head.appendChild(scriptElm);

  scriptElm = doc.createElement('script');
  scriptElm.setAttribute('nomodule', '');
  scriptElm.src = url + '/${namespace}.js';
  warn.push(scriptElm.outerHTML);
  scriptElm.setAttribute('data-stencil-namespace', '${namespace}');
  doc.head.appendChild(scriptElm);

  console.warn(warn.join('\\n'));

})(document);`;
}
