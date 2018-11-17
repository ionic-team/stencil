import * as d from '../../declarations';
import { AUTO_GENERATE_COMMENT } from './constants';
import { getBuildTimestamp } from '../build/build-ctx';
import { getEventDetailType, getMemberDocumentation, getMethodParameters, getMethodReturns } from './docs-util';
import { MEMBER_TYPE } from '../../util/constants';


export async function generateJsonDocs(config: d.Config, compilerCtx: d.CompilerCtx, jsonOutputs: d.OutputTargetDocsJson[], docsData: d.DocsData) {
  const jsonDocs: d.JsonDocs = {
    components: [],
    timestamp: getBuildTimestamp(),
    compiler: {
      name: config.sys.compiler.name,
      version: config.sys.compiler.version,
      typescriptVersion: config.sys.compiler.typescriptVersion
    }
  };

  await Promise.all(docsData.components.map(async cmpData => {
    const jsonCmp = await generateJsonDocComponent(config, compilerCtx, cmpData);
    jsonDocs.components.push(jsonCmp);
  }));

  jsonDocs.components = jsonDocs.components.sort((a, b) => {
    if (a.tag < b.tag) return -1;
    if (a.tag > b.tag) return 1;
    return 0;
  });

  const jsonContent = JSON.stringify(jsonDocs, null, 2);

  await Promise.all(jsonOutputs.map(async jsonOutput => {
    await compilerCtx.fs.writeFile(jsonOutput.file, jsonContent);
  }));
}


export async function generateJsonDocComponent(config: d.Config, compilerCtx: d.CompilerCtx, cmpData: d.DocsDataComponent) {
  const jsonCmp: d.JsonDocsComponent = {
    tag: cmpData.cmpMeta.tagNameMeta,
    docs: getMemberDocumentation(cmpData.cmpMeta.jsdoc),
    readme: await getUserReadmeContent(compilerCtx, cmpData),
    usage: await generateJsDocsUsages(config, compilerCtx, cmpData),
    props: [],
    methods: [],
    events: [],
    styles: []
  };

  generateJsDocMembers(cmpData.cmpMeta, jsonCmp);
  generateJsDocEvents(cmpData.cmpMeta, jsonCmp);
  generateJsDocCssProps(cmpData.cmpMeta, jsonCmp);

  return jsonCmp;
}


async function getUserReadmeContent(compilerCtx: d.CompilerCtx, cmpData: d.DocsDataComponent) {
  const userContent: string[] = [];

  try {
    const existingContent = await compilerCtx.fs.readFile(cmpData.readmePath);

    const existingLines = existingContent.split('\n');

    for (let i = 0; i < existingLines.length; i++) {
      if (existingLines[i].trim() === AUTO_GENERATE_COMMENT) {
        break;
      }
      userContent.push(existingLines[i]);
    }

  } catch (e) {}

  return userContent.join('\n').trim();
}


async function generateJsDocsUsages(config: d.Config, compilerCtx: d.CompilerCtx, cmpData: d.DocsDataComponent) {
  const rtn: d.JsonDocsUsage = {};

  try {
    const usageFilePaths = await compilerCtx.fs.readdir(cmpData.usagesDir);

    const usages: d.JsonDocsUsage = {};

    await Promise.all(usageFilePaths.map(async f => {
      if (!f.isFile) {
        return;
      }

      const fileName = config.sys.path.basename(f.relPath);
      if (!fileName.toLowerCase().endsWith('.md')) {
        return;
      }

      const parts = fileName.split('.');
      parts.pop();
      const key = parts.join('.');

      usages[key] = await compilerCtx.fs.readFile(f.absPath);
    }));

    Object.keys(usages).sort().forEach(key => {
      rtn[key] = usages[key];
    });

  } catch (e) {}

  return rtn;
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
        name: memberName,
        type: memberMeta.jsdoc.type
      };

      if (typeof memberMeta.attribName === 'string') {
        propData.attr = memberMeta.attribName;
      }

      if (memberMeta.memberType === MEMBER_TYPE.PropMutable) {
        propData.mutable = true;
      }

      propData.docs = getMemberDocumentation(memberMeta.jsdoc);
      jsonCmp.props.push(propData);

    } else if (memberMeta.memberType === MEMBER_TYPE.Method) {
      jsonCmp.methods.push({
        name: memberName,
        parameters: getMethodParameters(memberMeta.jsdoc),
        returns: getMethodReturns(memberMeta.jsdoc),
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
      detail: getEventDetailType(eventMeta.eventType),
      bubbles: !!eventMeta.eventBubbles,
      cancelable: !!eventMeta.eventCancelable,
      composed: !!eventMeta.eventComposed,
      docs: getMemberDocumentation(eventMeta.jsdoc),
    };

    jsonCmp.events.push(eventData);
  });
}


function generateJsDocCssProps(cmpMeta: d.ComponentMeta, jsonCmp: d.JsonDocsComponent) {
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
    const cssPropData: d.JsonDocsStyle = {
      annotation: styleDoc.annotation || '',
      name: styleDoc.name,
      docs: styleDoc.docs || ''
    };
    jsonCmp.styles.push(cssPropData);
  });
}
