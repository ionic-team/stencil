import { AUTO_GENERATE_COMMENT, NOTE } from './constants';
import { ComponentMeta } from '../../util/interfaces';
import { MarkdownAttrs } from './markdown-attrs';
import { MarkdownEvents } from './markdown-events';
import { MarkdownMethods } from './markdown-methods';
import { MarkdownProps } from './markdown-props';
import { MEMBER_TYPE } from '../../util/constants';


export function addAutoGenerate(cmpMeta: ComponentMeta, content: string[]) {
  content.push(AUTO_GENERATE_COMMENT);
  content.push(``);
  content.push(``);

  content.push(...generateMemberMarkdown(cmpMeta));

  content.push(``);
  content.push(`----------------------------------------------`);
  content.push(``);
  content.push(NOTE);
  content.push(``);
}


function generateMemberMarkdown(cmpMeta: ComponentMeta) {
  const attrs = new MarkdownAttrs();
  const events = new MarkdownEvents();
  const methods = new MarkdownMethods();
  const props = new MarkdownProps();

  cmpMeta.membersMeta && Object.keys(cmpMeta.membersMeta).forEach(memberName => {
    const memberMeta = cmpMeta.membersMeta[memberName];

    if (memberMeta.memberType === MEMBER_TYPE.Prop || memberMeta.memberType === MEMBER_TYPE.PropMutable) {
      props.addRow(memberName, memberMeta);

      if (memberMeta.attribName) {
        attrs.addRow(memberMeta);
      }

    } else if (memberMeta.memberType === MEMBER_TYPE.Method) {
      methods.addRow(memberName, memberMeta);
    }
  });

  cmpMeta.eventsMeta && cmpMeta.eventsMeta.forEach(ev => {
    events.addRow(ev);
  });

  return [
    ...props.toMarkdown(),
    ...attrs.toMarkdown(),
    ...events.toMarkdown(),
    ...methods.toMarkdown()
  ];
}
