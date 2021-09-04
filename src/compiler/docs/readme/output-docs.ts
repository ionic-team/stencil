import type * as d from '../../../declarations';
import { propsToMarkdown } from './markdown-props';
import { eventsToMarkdown } from './markdown-events';
import { join, relative } from 'path';
import { methodsToMarkdown } from './markdown-methods';
import { usageToMarkdown } from './markdown-usage';
import { stylesToMarkdown } from './markdown-css-props';
import { slotsToMarkdown } from './markdown-slots';
import { partsToMarkdown } from './markdown-parts';
import { depsToMarkdown } from './markdown-dependencies';
import { AUTO_GENERATE_COMMENT } from '../constants';

export const generateReadme = async (
  config: d.Config,
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
