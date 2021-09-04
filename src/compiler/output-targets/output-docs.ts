import type * as d from '../../declarations';
import { generateDocData } from '../docs/generate-doc-data';
import { generateCustomDocs } from '../docs/custom';
import { generateJsonDocs } from '../docs/json';
import { generateReadmeDocs } from '../docs/readme';
import { generateVscodeDocs } from '../docs/vscode';
import {
  isOutputTargetCustom,
  isOutputTargetDocsCustom,
  isOutputTargetDocsJson,
  isOutputTargetDocsReadme,
  isOutputTargetDocsVscode,
} from './output-utils';
import { outputCustom } from './output-custom';

export const outputDocs = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  if (!config.buildDocs) {
    return;
  }
  const docsOutputTargets = config.outputTargets.filter(
    (o) =>
      isOutputTargetCustom(o) ||
      isOutputTargetDocsReadme(o) ||
      isOutputTargetDocsJson(o) ||
      isOutputTargetDocsCustom(o) ||
      isOutputTargetDocsVscode(o)
  );

  if (docsOutputTargets.length === 0) {
    return;
  }

  // ensure all the styles are built first, which parses all the css docs
  await buildCtx.stylesPromise;

  const docsData = await generateDocData(config, compilerCtx, buildCtx);

  await Promise.all([
    generateReadmeDocs(config, compilerCtx, docsData, docsOutputTargets),
    generateJsonDocs(config, compilerCtx, docsData, docsOutputTargets),
    generateVscodeDocs(compilerCtx, docsData, docsOutputTargets),
    generateCustomDocs(config, docsData, docsOutputTargets),
    outputCustom(config, compilerCtx, buildCtx, docsData, docsOutputTargets),
  ]);
};
