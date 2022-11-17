import { join, relative } from 'path';

import type * as d from '../../../declarations';
import { AUTO_GENERATE_COMMENT } from '../constants';
import { stylesToMarkdown } from './markdown-css-props';
import { depsToMarkdown } from './markdown-dependencies';
import { eventsToMarkdown } from './markdown-events';
import { methodsToMarkdown } from './markdown-methods';
import { overviewToMarkdown } from './markdown-overview';
import { partsToMarkdown } from './markdown-parts';
import { propsToMarkdown } from './markdown-props';
import { slotsToMarkdown } from './markdown-slots';
import { usageToMarkdown } from './markdown-usage';

export const generateReadme = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  readmeOutputs: d.OutputTargetDocsReadme[],
  docsData: d.JsonDocsComponent,
  cmps: d.JsonDocsComponent[]
) => {
  const isUpdate = !!docsData.readme;
  const userContent = isUpdate ? docsData.readme : getDefaultReadme(docsData);

  await Promise.all(
    readmeOutputs.map(async (readmeOutput) => {
      if (readmeOutput.dir) {
        const readmeContent = generateMarkdown(userContent, docsData, cmps, readmeOutput);
        const relPath = relative(config.srcDir, docsData.readmePath);
        const absPath = join(readmeOutput.dir, relPath);
        const results = await compilerCtx.fs.writeFile(absPath, readmeContent);
        if (results.changedContent) {
          if (isUpdate) {
            config.logger.info(`updated readme docs: ${docsData.tag}`);
          } else {
            config.logger.info(`created readme docs: ${docsData.tag}`);
          }
        }
      }
    })
  );
};

export const generateMarkdown = (
  userContent: string,
  cmp: d.JsonDocsComponent,
  cmps: d.JsonDocsComponent[],
  readmeOutput: d.OutputTargetDocsReadme
) => {
  //If the readmeOutput.dependencies is true or undefined the dependencies will be generated.
  const dependencies = readmeOutput.dependencies !== false ? depsToMarkdown(cmp, cmps) : [];
  return [
    userContent,
    AUTO_GENERATE_COMMENT,
    '',
    '',
    ...getDocsDeprecation(cmp),
    ...overviewToMarkdown(cmp.overview),
    ...usageToMarkdown(cmp.usage),
    ...propsToMarkdown(cmp.props),
    ...eventsToMarkdown(cmp.events),
    ...methodsToMarkdown(cmp.methods),
    ...slotsToMarkdown(cmp.slots),
    ...partsToMarkdown(cmp.parts),
    ...stylesToMarkdown(cmp.styles),
    ...dependencies,
    `----------------------------------------------`,
    '',
    readmeOutput.footer,
    '',
  ].join('\n');
};

const getDocsDeprecation = (cmp: d.JsonDocsComponent) => {
  if (cmp.deprecation !== undefined) {
    return [`> **[DEPRECATED]** ${cmp.deprecation}`, ''];
  }
  return [];
};

const getDefaultReadme = (docsData: d.JsonDocsComponent) => {
  return [`# ${docsData.tag}`, '', '', ''].join('\n');
};
