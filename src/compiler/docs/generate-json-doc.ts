import * as d from '../../declarations';
import { MEMBER_TYPE, PROP_TYPE } from '../../util/constants';
import { getMemberDocumentation } from './docs-util';


export function generateJsDocComponent(jsonDocs: d.JsonDocs, cmpMeta: d.ComponentMeta, readmeContent: string) {
  const jsonCmp: d.JsonDocsComponent = {
    tag: cmpMeta.tagNameMeta,
    readme: readmeContent || '',
    props: [],
    methods: [],
    events: []
  };

  generateJsDocMembers(cmpMeta, jsonCmp);
  generateJsDocEvents(cmpMeta, jsonCmp);

  jsonDocs.components.push(jsonCmp);
}


function generateJsDocMembers(cmpMeta: d.ComponentMeta, jsonCmp: d.JsonDocsComponent) {
  if (!cmpMeta.membersMeta) return;

  Object.keys(cmpMeta.membersMeta).sort((a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    if (a.toLowerCase() > b.toLowerCase()) return 1;
    return 0;

  }).forEach(memberName => {
    const memberMeta = cmpMeta.membersMeta[memberName];

    if (memberMeta.memberType === MEMBER_TYPE.Prop || memberMeta.memberType === MEMBER_TYPE.PropMutable) {
      const propData: d.JsonDocsProp = {
        name: memberName
      };

      if (memberMeta.propType === PROP_TYPE.Boolean) {
        propData.type = 'boolean';

      } else if (memberMeta.propType === PROP_TYPE.Number) {
        propData.type = 'number';

      } else if (memberMeta.propType === PROP_TYPE.String) {
        propData.type = 'string';

      } else if (memberMeta.propType === PROP_TYPE.Any) {
        propData.type = 'any';
      }

      if (memberMeta.memberType === MEMBER_TYPE.PropMutable) {
        propData.mutable = true;
      }

      if (typeof memberMeta.attribName === 'string') {
        propData.attr = memberMeta.attribName;
      }

      propData.docs = getMemberDocumentation(memberMeta.jsdoc);
      jsonCmp.props.push(propData);

    } else if (memberMeta.memberType === MEMBER_TYPE.Method) {
      jsonCmp.methods.push({
        name: memberName,
        docs: getMemberDocumentation(memberMeta.jsdoc)
      });
    }
  });
}


function generateJsDocEvents(cmpMeta: d.ComponentMeta, jsonCmp: d.JsonDocsComponent) {
  if (!Array.isArray(cmpMeta.eventsMeta)) {
    return;
  }

  cmpMeta.eventsMeta.sort((a, b) => {
    if (a.eventName.toLowerCase() < b.eventName.toLowerCase()) return -1;
    if (a.eventName.toLowerCase() > b.eventName.toLowerCase()) return 1;
    return 0;

  }).forEach(eventMeta => {
    const eventData: d.JsonDocsEvent = {
      event: eventMeta.eventName,
      bubbles: !!eventMeta.eventBubbles,
      cancelable: !!eventMeta.eventCancelable,
      composed: !!eventMeta.eventComposed,
      docs: getMemberDocumentation(eventMeta.jsdoc)
    };

    jsonCmp.events.push(eventData);
  });
}
