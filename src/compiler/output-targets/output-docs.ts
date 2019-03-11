import * as d from '@declarations';
import { generateDocData } from '../docs/generate-doc-data';
import { strickCheckDocs } from '../docs/strict-check';
import { generateReadmeDocs } from '../docs/generate-readme-docs';
import { generateJsonDocs } from '../docs/generate-json-docs';
import { generateCustomDocs } from '../docs/generate-custom-docs';
import { generateWebComponentsJson } from '../docs/generate-vscode-docs';
import { isOutputTargetDocs, isOutputTargetDocsCustom, isOutputTargetDocsJson, isOutputTargetDocsVscode } from './output-utils';

export async function outputDocs(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!config.buildDocs) {
    return;
  }

  const readmeTargets = config.outputTargets.filter(isOutputTargetDocs);
  const vscodeTargets = config.outputTargets.filter(isOutputTargetDocsVscode);
  const jsonTargets = config.outputTargets.filter(isOutputTargetDocsJson);
  const customTargets = config.outputTargets.filter(isOutputTargetDocsCustom);

  if (readmeTargets.length + vscodeTargets.length + jsonTargets.length + customTargets.length === 0) {
    return;
  }

  // ensure all the styles are built first, which parses all the css docs
  await buildCtx.stylesPromise;

  const docsData = await generateDocData(config, compilerCtx, buildCtx);

  // generate READMEs docs
  const strictCheck = readmeTargets.some(o => !!o.strict);
  if (strictCheck) {
    strickCheckDocs(config, docsData);
  }

  if (readmeTargets.length > 0) {
    await generateReadmeDocs(config, compilerCtx, readmeTargets, docsData);
  }

  // generate vscode docs
  if (vscodeTargets.length > 0) {
    await generateWebComponentsJson(compilerCtx, vscodeTargets, docsData);
  }

  // generate json docs
  if (jsonTargets.length > 0) {
    await generateJsonDocs(compilerCtx, jsonTargets, docsData);
  }

  // generate custom docs
  if (customTargets.length > 0) {
    await generateCustomDocs(config, customTargets, docsData);
  }
}
