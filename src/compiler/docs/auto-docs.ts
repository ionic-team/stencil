import * as d from '../../declarations';
import { AUTO_GENERATE_COMMENT, NOTE } from './constants';
import { propsToMarkdown } from './markdown-props';
import { eventsToMarkdown } from './markdown-events';
import { methodsToMarkdown } from './markdown-methods';
import { stylesToMarkdown } from './markdown-css-props';


export function addAutoGenerate(cmp: d.JsonDocsComponent, content: string[]) {
  content.push(AUTO_GENERATE_COMMENT);
  content.push(``);
  content.push(``);
  content.push(...[
    ...propsToMarkdown(cmp.props),
    ...eventsToMarkdown(cmp.events),
    ...methodsToMarkdown(cmp.methods),
    ...stylesToMarkdown(cmp.styles)
  ]);

  content.push(`----------------------------------------------`);
  content.push(``);
  content.push(NOTE);
  content.push(``);
}
