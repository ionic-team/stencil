import * as d from '../../declarations';
import { generateAngularProxies } from './output-angular';
import { generateCollections } from './output-collection';
import { generateCommonJsIndexes } from './output-commonjs';
import { generateEsmIndexes } from './output-esm';
import { generateIndexHtmls } from './generate-index-html';
import { generateLazyLoads } from './output-lazy-load';
import { generateStyles } from '../style/generate-styles';
import { generateWebComponents } from './output-webcomponent';


export async function generateOutputTargets(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[]) {
  if (buildCtx.shouldAbort) {
    return;
  }

  const stylesPromise = generateStyles(config, compilerCtx, buildCtx);

  if (buildCtx.shouldAbort) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate app files started`);

  const generateOutputs = [
    generateAngularProxies(config, compilerCtx, buildCtx),
    generateCollections(config, compilerCtx, buildCtx),
    generateCommonJsIndexes(config, compilerCtx, buildCtx),
    generateEsmIndexes(config, compilerCtx, buildCtx),
    generateIndexHtmls(config, compilerCtx, buildCtx),
    generateLazyLoads(config, compilerCtx, buildCtx, entryModules, stylesPromise),
    generateWebComponents(config, compilerCtx, buildCtx, stylesPromise),
    stylesPromise
  ];

  await Promise.all(generateOutputs);

  timespan.finish(`generate app files finished`);
}
