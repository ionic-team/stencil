import * as d from '@declarations';
import { generateStyles } from '../style/generate-styles';
import { outputAngularProxies } from './output-angular';
import { outputApp } from './output-app';
import { outputCollections } from './output-collection';
import { outputCommonJsIndexes } from './output-commonjs';
import { outputEsmIndexes } from './output-esm';
import { outputIndexHtmls } from './output-index-html';
import { outputModuleWebComponents } from './output-module-web-components';
import { outputSelfContainedWebComponents } from './output-self-contained-web-components';
import { outputTypes } from './output-types';


export async function generateOutputTargets(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (buildCtx.shouldAbort) {
    return;
  }

  buildCtx.stylesPromise = generateStyles(config, compilerCtx, buildCtx);

  if (buildCtx.shouldAbort) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate app files started`);

  const generateOutputs = [
    outputAngularProxies(config, compilerCtx, buildCtx),
    outputApp(config, compilerCtx, buildCtx),
    outputCollections(config, compilerCtx, buildCtx),
    outputCommonJsIndexes(config, compilerCtx, buildCtx),
    outputEsmIndexes(config, compilerCtx, buildCtx),
    outputIndexHtmls(config, compilerCtx, buildCtx),
    outputModuleWebComponents(config, compilerCtx, buildCtx),
    outputSelfContainedWebComponents(config, compilerCtx, buildCtx),
    outputTypes(config, compilerCtx, buildCtx),
    buildCtx.stylesPromise
  ];

  await Promise.all(generateOutputs);

  timespan.finish(`generate app files finished`);
}
