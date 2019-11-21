import * as d from '../../../declarations';
import { BundleOptions } from '../../bundle/bundle-interface';
import { bundleOutput } from '../../bundle/bundle-output';
import { catchError } from '@utils';
import { generateEntryModules } from '../../../compiler/entries/entry-modules';
import { getBuildFeatures, updateBuildConditionals } from '../../build/app-data';
import { LAZY_BROWSER_ENTRY_ID, LAZY_EXTERNAL_ENTRY_ID, STENCIL_INTERNAL_CLIENT_ID, USER_INDEX_ENTRY_ID } from '../../bundle/entry-alias-ids';
import { isOutputTargetDistLazy, isOutputTargetHydrate } from '../../../compiler/output-targets/output-utils';
import { lazyComponentTransform } from '../../transformers/component-lazy/transform-lazy-component';
import { updateStencilCoreImports } from '../../../compiler/transformers/update-stencil-core-import';
import { generateCjs } from './generate-cjs';
import { generateEsmBrowser } from './generate-esm-browser';
import { generateEsm } from './generate-esm';
import { generateSystem } from './generate-system';
import { generateModuleGraph } from '../../../compiler/entries/component-graph';
import { getGlobalScriptPaths } from '../../bundle/app-data-plugin';
import MagicString from 'magic-string';


export const outputLazy = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistLazy);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate lazy started`);

  try {
    // const criticalBundles = getCriticalPath(buildCtx);
    const globalScriptPaths = getGlobalScriptPaths(config, compilerCtx);

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
        [LAZY_EXTERNAL_ENTRY_ID]: getLazyEntry(false, globalScriptPaths),
        [LAZY_BROWSER_ENTRY_ID]: getLazyEntry(true, globalScriptPaths),
      }
    };

    // we've got the compiler context filled with app modules and collection dependency modules
    // figure out how all these components should be connected
    generateEntryModules(config, buildCtx);
    buildCtx.entryModules.forEach(entryModule => {
      bundleOpts.inputs[entryModule.entryKey] = entryModule.entryKey;
    });

    const rollupBuild = await bundleOutput(config, compilerCtx, buildCtx, bundleOpts);
    if (rollupBuild != null) {
      const [componentBundle] = await Promise.all([
        generateEsmBrowser(config, compilerCtx, buildCtx, rollupBuild, outputTargets),
        generateEsm(config, compilerCtx, buildCtx, rollupBuild, outputTargets),
        generateSystem(config, compilerCtx, buildCtx, rollupBuild, outputTargets),
        generateCjs(config, compilerCtx, buildCtx, rollupBuild, outputTargets),
      ]);

      console.log(outputTargets);
      await generateLegacyLoader(config, compilerCtx, outputTargets);

      if (componentBundle != null) {
        buildCtx.componentGraph = generateModuleGraph(buildCtx.components, componentBundle);
      }
    }

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

const getLazyEntry = (isBrowser: boolean, globalScriptPaths: string[]) => {
  const hasGlobalScripts = (globalScriptPaths.length > 0);

  const s = new MagicString(``);
  s.append(`import { bootstrapLazy } from '${STENCIL_INTERNAL_CLIENT_ID}';\n`);

  if (hasGlobalScripts) {
    s.append(`import { globalScripts } from '${STENCIL_INTERNAL_CLIENT_ID}';\n`);
  }

  if (isBrowser) {
    s.append(`import { patchBrowser } from '${STENCIL_INTERNAL_CLIENT_ID}';\n`);
    s.append(`patchBrowser().then(options => {\n`);
    if (hasGlobalScripts) {
      s.append(`  globalScripts();\n`);
    }
    s.append(`  return bootstrapLazy([/*!__STENCIL_LAZY_DATA__*/], options);\n`);
    s.append(`});\n`);

  } else {
    s.append(`import { patchEsm } from '${STENCIL_INTERNAL_CLIENT_ID}';\n`);
    s.append(`export const defineCustomElements = (win, options) => patchEsm().then(() => {\n`);
    if (hasGlobalScripts) {
      s.append(`  globalScripts();\n`);
    }
    s.append(`  return bootstrapLazy([/*!__STENCIL_LAZY_DATA__*/], options);\n`);
    s.append(`});\n`);
  }

  return s.toString();
} ;

function generateLegacyLoader(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetDistLazy[]) {
  return Promise.all(
    outputTargets.map(async o => {
      if (o.legacyLoaderFile) {
        const loaderContent = getLegacyLoader(config);
        await compilerCtx.fs.writeFile(o.legacyLoaderFile, loaderContent, { outputTargetType: o.type });
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
