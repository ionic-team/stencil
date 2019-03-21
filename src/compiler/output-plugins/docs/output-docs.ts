import * as d from '../../../declarations';
import { propsToMarkdown } from './markdown-props';
import { eventsToMarkdown } from './markdown-events';
import { methodsToMarkdown } from './markdown-methods';
import { usageToMarkdown } from './markdown-usage';
import { stylesToMarkdown } from './markdown-css-props';
import { slotsToMarkdown } from './markdown-slots';
import { AUTO_GENERATE_COMMENT, NOTE } from '../../docs/constants';

export async function generateReadme(config: d.Config, compilerCtx: d.CompilerCtx, readmeOutputs: d.OutputTargetDocsReadme[], docsData: d.JsonDocsComponent) {
  const isUpdate = !!docsData.readme;
  const userContent = isUpdate ? docsData.readme : getDefaultReadme(docsData);
  const content = generateMarkdown(userContent, docsData);
  const readmeContent = content.join('\n');

  await Promise.all(readmeOutputs.map(async readmeOutput => {
    if (readmeOutput.dir) {
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

export function generateMarkdown(userContent: string, cmp: d.JsonDocsComponent) {
  return [
    userContent,
    AUTO_GENERATE_COMMENT,
    '',
    '',
    ...usageToMarkdown(cmp.usage),
    ...propsToMarkdown(cmp.props),
    ...eventsToMarkdown(cmp.events),
    ...methodsToMarkdown(cmp.methods),
    ...slotsToMarkdown(cmp.slots),
    ...stylesToMarkdown(cmp.styles),
    `----------------------------------------------`,
    '',
    NOTE,
    ''
  ];
}

function getDefaultReadme(docsData: d.JsonDocsComponent) {
  return [
    `# ${docsData.tag}`,
    '',
    '',
    ''
  ].join('\n');
}
