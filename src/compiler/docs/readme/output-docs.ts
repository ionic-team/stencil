import { join, normalizePath, relative } from '@utils';

import type * as d from '../../../declarations';
import { AUTO_GENERATE_COMMENT } from '../constants';
import { getUserReadmeContent } from '../generate-doc-data';
import { stylesToMarkdown } from './markdown-css-props';
import { depsToMarkdown } from './markdown-dependencies';
import { eventsToMarkdown } from './markdown-events';
import { methodsToMarkdown } from './markdown-methods';
import { overviewToMarkdown } from './markdown-overview';
import { partsToMarkdown } from './markdown-parts';
import { propsToMarkdown } from './markdown-props';
import { slotsToMarkdown } from './markdown-slots';
import { usageToMarkdown } from './markdown-usage';

/**
 * Generate a README for a given component and write it to disk.
 *
 * Typically the README is going to be a 'sibling' to the component's source
 * code (i.e. written to the same directory) but the user may also configure a
 * custom output directory by setting {@link d.OutputTargetDocsReadme.dir}.
 *
 * Output readme files also include {@link AUTO_GENERATE_COMMENT}, and any
 * text located _above_ that comment is preserved when the new readme is written
 * to disk.
 *
 * @param config a validated Stencil config
 * @param compilerCtx the current compiler context
 * @param readmeOutputs docs-readme output targets
 * @param docsData documentation data for the component of interest
 * @param cmps metadata for all the components in the project
 */
export const generateReadme = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  readmeOutputs: d.OutputTargetDocsReadme[],
  docsData: d.JsonDocsComponent,
  cmps: d.JsonDocsComponent[],
) => {
  const isUpdate = !!docsData.readme;
  const userContent = isUpdate ? docsData.readme : getDefaultReadme(docsData);

  await Promise.all(
    readmeOutputs.map(async (readmeOutput) => {
      if (readmeOutput.dir) {
        const relativeReadmePath = relative(config.srcDir, docsData.readmePath);
        const readmeOutputPath = join(readmeOutput.dir, relativeReadmePath);

        const currentReadmeContent =
          normalizePath(readmeOutput.dir) !== normalizePath(config.srcDir)
            ? // The user set a custom `.dir` property, which is where we're going
              // to write the updated README. We need to read the non-automatically
              // generated content from that file and preserve that.
              await getUserReadmeContent(compilerCtx, readmeOutputPath)
            : userContent;

        const readmeContent = generateMarkdown(currentReadmeContent, docsData, cmps, readmeOutput, config);

        const results = await compilerCtx.fs.writeFile(readmeOutputPath, readmeContent);
        if (results.changedContent) {
          if (isUpdate) {
            config.logger.info(`updated readme docs: ${docsData.tag}`);
          } else {
            config.logger.info(`created readme docs: ${docsData.tag}`);
          }
        }
      }
    }),
  );
};

export const generateMarkdown = (
  userContent: string | undefined,
  cmp: d.JsonDocsComponent,
  cmps: d.JsonDocsComponent[],
  readmeOutput: d.OutputTargetDocsReadme,
  config?: d.ValidatedConfig,
) => {
  //If the readmeOutput.dependencies is true or undefined the dependencies will be generated.
  const dependencies = readmeOutput.dependencies !== false ? depsToMarkdown(cmp, cmps, config) : [];

  return [
    userContent || '',
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

/**
 * Get a minimal default README for a Stencil component
 *
 * @param docsData documentation data for the component of interest
 * @returns a minimal README template for that component
 */
const getDefaultReadme = (docsData: d.JsonDocsComponent) => {
  return [`# ${docsData.tag}`, '', '', ''].join('\n');
};
