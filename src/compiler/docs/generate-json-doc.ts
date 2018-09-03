import * as d from '../../declarations';
import {
  getMemberDocumentation,
  getMethodParameters,
  getMethodReturns,
  getPropType
} from './docs-util';
import { MEMBER_TYPE } from '../../util/constants';

export async function generateJsDocComponent(
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  jsonDocs: d.JsonDocs,
  cmpMeta: d.ComponentMeta,
  dirPath: string,
  readmeContent: string
) {
  const jsonCmp: d.JsonDocsComponent = {
    tag: cmpMeta.tagNameMeta,
    docs: getMemberDocumentation(cmpMeta.jsdoc),
    readme: readmeContent || '',
    usage: await generateJsDocsUsages(config, compilerCtx, dirPath),
    props: [],
    methods: [],
    events: [],
    styles: []
  };

  generateJsDocMembers(cmpMeta, jsonCmp);
  generateJsDocEvents(cmpMeta, jsonCmp);
  generateJsDocCssProps(cmpMeta, jsonCmp);

  jsonDocs.components.push(jsonCmp);
}

async function generateJsDocsUsages(
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  dirPath: string
) {
  const rtn: d.JsonDocsUsage = {};
  const usagesDir = config.sys.path.join(dirPath, 'usage');

  try {
    const usageFilePaths = await compilerCtx.fs.readdir(usagesDir);

    const usages: d.JsonDocsUsage = {};

    await Promise.all(
      usageFilePaths.map(async f => {
        if (!f.isFile) {
          return;
        }

        const fileName = config.sys.path.basename(f.relPath);
        if (!fileName.endsWith('.md')) {
          return;
        }

        const parts = fileName.split('.');
        parts.pop();
        const key = parts.join('.');

        usages[key] = await compilerCtx.fs.readFile(f.absPath);
      })
    );

    Object.keys(usages)
      .sort()
      .forEach(key => {
        rtn[key] = usages[key];
      });
  } catch (e) {}

  return rtn;
}

function generateJsDocMembers(
  cmpMeta: d.ComponentMeta,
  jsonCmp: d.JsonDocsComponent
) {
  if (!cmpMeta.membersMeta) return;

  Object.keys(cmpMeta.membersMeta)
    .sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) return -1;
      if (a.toLowerCase() > b.toLowerCase()) return 1;
      return 0;
    })
    .forEach(memberName => {
      const memberMeta = cmpMeta.membersMeta[memberName];

      if (
        memberMeta.memberType === MEMBER_TYPE.Prop ||
        memberMeta.memberType === MEMBER_TYPE.PropMutable
      ) {
        const propData: d.JsonDocsProp = {
          name: memberName
        };

        propData = getPropType(memberMeta);

        if (memberMeta.attribType.optional) {
          propData.optional = true;
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
          docs: getMemberDocumentation(memberMeta.jsdoc),
          returns: getMethodReturns(memberMeta.jsdoc),
          parameters: getMethodParameters(memberMeta.jsdoc)
        });
      }
    });
}

function generateJsDocEvents(
  cmpMeta: d.ComponentMeta,
  jsonCmp: d.JsonDocsComponent
) {
  if (!Array.isArray(cmpMeta.eventsMeta)) {
    return;
  }

  cmpMeta.eventsMeta
    .sort((a, b) => {
      if (a.eventName.toLowerCase() < b.eventName.toLowerCase()) return -1;
      if (a.eventName.toLowerCase() > b.eventName.toLowerCase()) return 1;
      return 0;
    })
    .forEach(eventMeta => {
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

function generateJsDocCssProps(
  cmpMeta: d.ComponentMeta,
  jsonCmp: d.JsonDocsComponent
) {
  if (!cmpMeta.styleDocs) {
    return;
  }

  cmpMeta.styleDocs
    .sort((a, b) => {
      if (a.annotation < b.annotation) return -1;
      if (a.annotation > b.annotation) return 1;
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    })
    .forEach(styleDoc => {
      const cssPropData: d.JsonDocsStyle = {
        annotation: styleDoc.annotation || '',
        name: styleDoc.name,
        docs: styleDoc.docs || ''
      };
      jsonCmp.styles.push(cssPropData);
    });
}
