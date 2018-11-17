import * as d from '../../declarations';
import { getEventDetailType, getMethodParameters, getMethodReturns } from './docs-util';
import { MEMBER_TYPE } from '../../util/constants';


export async function generateApiDocs(compilerCtx: d.CompilerCtx, apiOutputs: d.OutputTargetDocsApi[], docsData: d.DocsData) {
  const apiDocs: d.ApiDocs = {
    components: docsData.components.map(cmpData => {
      return generateApiDocComponent(cmpData);
    })
  };

  apiDocs.components.sort((a, b) => {
    if (a.tag < b.tag) return -1;
    if (a.tag > b.tag) return 1;
    return 0;
  });

  const content = JSON.stringify(apiDocs, null, 2);

  await Promise.all(apiOutputs.map(async apiOutput => {
    await compilerCtx.fs.writeFile(apiOutput.file, content);
  }));
}


export function generateApiDocComponent(cmpData: d.DocsDataComponent) {
  const apiCmp: d.ApiDocsComponent = {
    tag: cmpData.cmpMeta.tagNameMeta,
    props: [],
    methods: [],
    events: [],
    styles: []
  };

  generateApiDocMembers(cmpData.cmpMeta, apiCmp);
  generateApiDocEvents(cmpData.cmpMeta, apiCmp);
  generateApiDocCssProps(cmpData.cmpMeta, apiCmp);

  return apiCmp;
}


function generateApiDocMembers(cmpMeta: d.ComponentMeta, apiCmp: d.ApiDocsComponent) {
  if (!cmpMeta.membersMeta) return;
  Object.keys(cmpMeta.membersMeta).sort((a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    if (a.toLowerCase() > b.toLowerCase()) return 1;
    return 0;

  }).forEach(memberName => {
    const memberMeta = cmpMeta.membersMeta[memberName];

    if (memberMeta.memberType === MEMBER_TYPE.Prop || memberMeta.memberType === MEMBER_TYPE.PropMutable) {
      const propData: d.ApiDocsProp = {
        name: memberName,
        type: memberMeta.jsdoc.type
      };

      if (typeof memberMeta.attribName === 'string') {
        propData.attr = memberMeta.attribName;
      }

      if (memberMeta.memberType === MEMBER_TYPE.PropMutable) {
        propData.mutable = true;
      }

      apiCmp.props.push(propData);

    } else if (memberMeta.memberType === MEMBER_TYPE.Method) {
      apiCmp.methods.push({
        name: memberName,
        parameters: getMethodParameters(memberMeta.jsdoc),
        returns: getMethodReturns(memberMeta.jsdoc)
      });
    }
  });
}


function generateApiDocEvents(cmpMeta: d.ComponentMeta, apiCmp: d.ApiDocsComponent) {
  if (!Array.isArray(cmpMeta.eventsMeta)) {
    return;
  }

  cmpMeta.eventsMeta.sort((a, b) => {
    if (a.eventName.toLowerCase() < b.eventName.toLowerCase()) return -1;
    if (a.eventName.toLowerCase() > b.eventName.toLowerCase()) return 1;
    return 0;

  }).forEach(eventMeta => {
    const eventData: d.ApiDocsEvent = {
      event: eventMeta.eventName,
      detail: getEventDetailType(eventMeta.eventType),
      bubbles: !!eventMeta.eventBubbles,
      cancelable: !!eventMeta.eventCancelable,
      composed: !!eventMeta.eventComposed
    };

    apiCmp.events.push(eventData);
  });
}


function generateApiDocCssProps(cmpMeta: d.ComponentMeta, jsonCmp: d.ApiDocsComponent) {
  if (!cmpMeta.styleDocs) {
    return;
  }

  cmpMeta.styleDocs.sort((a, b) => {
    if (a.annotation < b.annotation) return -1;
    if (a.annotation > b.annotation) return 1;
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return 0;

  }).forEach(styleDoc => {
    const cssPropData: d.ApiDocsStyle = {
      annotation: styleDoc.annotation || '',
      name: styleDoc.name
    };
    jsonCmp.styles.push(cssPropData);
  });
}
