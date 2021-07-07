import type * as d from '../../../declarations';
import { generateDocData } from '../../../compiler/docs/generate-doc-data';
import {
  isOutputTargetCustom,
  isOutputTargetDocsCustom,
  isOutputTargetDocsJson,
  isOutputTargetDocsReadme,
  isOutputTargetDocsVscode,
} from '../../../compiler/output-targets/output-utils';
import { generateCustomDocs } from '../../../compiler/docs/custom';
import { generateReadmeDocs } from '../../../compiler/docs/readme';
import { generateJsonDocs } from '../../../compiler/docs/json';
import { generateVscodeDocs } from '../../../compiler/docs/vscode';
import { outputCustom } from '../../../compiler/output-targets/output-custom';

export async function outputDocs(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!config.buildDocs) {
    return;
  }
  const docsOutputTargets = config.outputTargets.filter(
    o =>
      isOutputTargetCustom(o) ||
      isOutputTargetDocsReadme(o) ||
      isOutputTargetDocsJson(o) ||
      isOutputTargetDocsCustom(o) ||
      isOutputTargetDocsVscode(o),
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
}
