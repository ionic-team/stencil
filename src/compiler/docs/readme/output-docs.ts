import * as d from '../../../declarations';
import { propsToMarkdown } from './markdown-props';
import { eventsToMarkdown } from './markdown-events';
import { methodsToMarkdown } from './markdown-methods';
import { usageToMarkdown } from './markdown-usage';
import { stylesToMarkdown } from './markdown-css-props';
import { slotsToMarkdown } from './markdown-slots';
import { depsToMarkdown } from './markdown-dependencies';
import { AUTO_GENERATE_COMMENT } from '../../docs/constants';

export async function generateReadme(config: d.Config, compilerCtx: d.CompilerCtx, readmeOutputs: d.OutputTargetDocsReadme[], docsData: d.JsonDocsComponent, cmps: d.JsonDocsComponent[]) {
  const isUpdate = !!docsData.readme;
  const userContent = isUpdate ? docsData.readme : getDefaultReadme(docsData);

  await Promise.all(readmeOutputs.map(async readmeOutput => {
    if (readmeOutput.dir) {
      const readmeContent = generateMarkdown(config, userContent, docsData, cmps, readmeOutput.footer);
      const relPath = config.sys.path.relative(config.srcDir, docsData.readmePath);
      const absPath = config.sys.path.join(readmeOutput.dir, relPath);
      const results = await compilerCtx.fs.writeFile(absPath, readmeContent);
      if (results.changedContent) {
        if (isUpdate) {
          config.logger.info(`updated readme docs: ${docsData.tag}`);
        } else {
          config.logger.info(`created readme docs: ${docsData.tag}`);
        }
      }
    }
  }));
}

export function generateMarkdown(config: d.Config, userContent: string, cmp: d.JsonDocsComponent, cmps: d.JsonDocsComponent[], footer: string) {
  return [
    userContent,
    AUTO_GENERATE_COMMENT,
    '',
    '',
    ...getDeprecation(cmp),
    ...usageToMarkdown(cmp.usage),
    ...propsToMarkdown(cmp.props),
    ...eventsToMarkdown(cmp.events),
    ...methodsToMarkdown(cmp.methods),
    ...slotsToMarkdown(cmp.slots),
    ...stylesToMarkdown(cmp.styles),
    ...depsToMarkdown(config, cmp, cmps),
    `----------------------------------------------`,
    '',
    footer,
    ''
  ].join('\n');
}

function getDeprecation(cmp: d.JsonDocsComponent) {
  if (cmp.deprecation !== undefined) {
    return [
      `> **[DEPRECATED]** ${cmp.deprecation}`,
      ''
    ];
  }
  return [];
}

function getDefaultReadme(docsData: d.JsonDocsComponent) {
  return [
    `# ${docsData.tag}`,
    '',
    '',
    ''
  ].join('\n');
}
