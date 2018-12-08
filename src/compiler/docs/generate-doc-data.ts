import * as d from '../../declarations';
import { buildWarn, normalizePath } from '../util';
import { MEMBER_TYPE, PROP_TYPE } from '../../util/constants';
import { getEventDetailType, getMemberDocumentation, getMemberType, getMethodParameters, getMethodReturns } from './docs-util';
import { AUTO_GENERATE_COMMENT } from './constants';
import { getBuildTimestamp } from '../build/build-ctx';


export async function generateDocData(config: d.Config, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[]): Promise<d.JsonDocs> {
  return {
    timestamp: getBuildTimestamp(),
    compiler: {
      name: config.sys.compiler.name,
      version: config.sys.compiler.version,
      typescriptVersion: config.sys.compiler.typescriptVersion
    },
    components: await getComponents(config, compilerCtx, diagnostics)
  };
}

async function getComponents(config: d.Config, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[]): Promise<d.JsonDocsComponent[]> {
  const cmpDirectories: Set<string> = new Set();
  const promises = Object.keys(compilerCtx.moduleFiles)
    .sort()
    .filter(filePath => {
      const moduleFile = compilerCtx.moduleFiles[filePath];
      if (!moduleFile.cmpMeta || moduleFile.isCollectionDependency) {
        return false;
      }
      const dirPath = normalizePath(config.sys.path.dirname(filePath));
      if (cmpDirectories.has(dirPath)) {
        const warn = buildWarn(diagnostics);
        warn.relFilePath = dirPath;
        warn.messageText = `multiple components found in: ${dirPath}`;
        return false;
      }
      cmpDirectories.add(dirPath);
      return true;
    })
    .map(async filePath => {
      const moduleFile = compilerCtx.moduleFiles[filePath];
      const dirPath = normalizePath(config.sys.path.dirname(filePath));
      const readmePath = normalizePath(config.sys.path.join(dirPath, 'readme.md'));
      const usagesDir = normalizePath(config.sys.path.join(dirPath, 'usage'));

      const membersMeta = Object.keys(moduleFile.cmpMeta.membersMeta)
        .sort()
        .map(memberName => [memberName, moduleFile.cmpMeta.membersMeta[memberName]] as [string, d.MemberMeta])
        .filter(([_, member]) => isPublic(member.jsdoc));

      const readme = await getUserReadmeContent(compilerCtx, readmePath);

      return {
        dirPath,
        filePath,
        fileName: config.sys.path.basename(filePath),
        readmePath,
        usagesDir,
        tag: moduleFile.cmpMeta.tagNameMeta,
        readme,
        docs: generateDocs(readme, moduleFile.cmpMeta.jsdoc),
        usage: await generateUsages(config, compilerCtx, usagesDir),

        props: getProperties(membersMeta),
        methods: getMethods(membersMeta),
        events: getEvents(moduleFile.cmpMeta),
        styles: getStyles(moduleFile.cmpMeta)
      };
    });
  return Promise.all(promises);
}

function getProperties(members: [string, d.MemberMeta][]): d.JsonDocsProp[] {
  return members
    .filter(([_, member]) => member.memberType & (MEMBER_TYPE.Prop | MEMBER_TYPE.PropMutable))
    .map(([memberName, member]) => {
      return {
        name: memberName,
        type: member.jsdoc.type,
        mutable: member.memberType === MEMBER_TYPE.PropMutable,
        attr: getAttrName(member),
        reflectToAttr: !!member.reflectToAttrib,
        docs: getMemberDocumentation(member.jsdoc),
        default: member.jsdoc.default,

        optional: true,
        required: false,
      };
    });
}

function getMethods(members: [string, d.MemberMeta][]): d.JsonDocsMethod[] {
  return members
    .filter(([_, member]) => member.memberType & (MEMBER_TYPE.Method))
    .map(([memberName, member]) => {
      return {
        name: memberName,
        returns: getMethodReturns(member.jsdoc),
        signature: getMethodSignature(memberName, member.jsdoc),
        parameters: getMethodParameters(member.jsdoc),
        docs: getMemberDocumentation(member.jsdoc)
      };
    });
}

function getEvents(cmpMeta: d.ComponentMeta): d.JsonDocsEvent[] {
  if (!Array.isArray(cmpMeta.eventsMeta)) {
    return [];
  }

  return cmpMeta.eventsMeta.sort((a, b) => {
    if (a.eventName.toLowerCase() < b.eventName.toLowerCase()) return -1;
    if (a.eventName.toLowerCase() > b.eventName.toLowerCase()) return 1;
    return 0;
  })
  .filter(eventMeta => isPublic(eventMeta.jsdoc))
  .map(eventMeta => {
    return {
      event: eventMeta.eventName,
      detail: getEventDetailType(eventMeta.eventType),
      bubbles: !!eventMeta.eventBubbles,
      cancelable: !!eventMeta.eventCancelable,
      composed: !!eventMeta.eventComposed,
      docs: getMemberDocumentation(eventMeta.jsdoc),
    };
  });
}

function getMethodSignature(memberName: string, jsdoc: d.JsDoc) {
  return memberName + getMemberType(jsdoc);
}

function getStyles(cmpMeta: d.ComponentMeta): d.JsonDocsStyle[] {
  if (!cmpMeta.styleDocs) {
    return [];
  }

  return cmpMeta.styleDocs.sort((a, b) => {
    if (a.annotation < b.annotation) return -1;
    if (a.annotation > b.annotation) return 1;
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return 0;

  }).map(styleDoc => {
    return {
      name: styleDoc.name,
      annotation: styleDoc.annotation || '',
      docs: styleDoc.docs || ''
    };
  });
}


function getAttrName(memberMeta: d.MemberMeta) {
  if (memberMeta.attribName) {
    const propType = memberMeta.propType;

    if (propType !== PROP_TYPE.Unknown) {
      return memberMeta.attribName;
    }
  }
  return undefined;
}

async function getUserReadmeContent(compilerCtx: d.CompilerCtx, readmePath: string) {
  try {
    const existingContent = await compilerCtx.fs.readFile(readmePath);
    const userContentIndex = existingContent.indexOf(AUTO_GENERATE_COMMENT) - 1;
    if (userContentIndex >= 0) {
      return existingContent.substring(0, userContentIndex);
    }
  } catch (e) {}
  return undefined;
}


function generateDocs(readme: string, jsdoc: d.JsDoc) {
  const docs = getMemberDocumentation(jsdoc);
  if (docs !== '' || !readme) {
    return docs;
  }

  let isContent = false;
  const lines = readme.split('\n');
  const contentLines = [];
  for (const line of lines) {
    const isHeader = line.startsWith('#');
    if (isHeader && isContent) {
      break;
    }
    if (!isHeader && !isContent) {
      isContent = true;
    }
    if (isContent) {
      contentLines.push(line);
    }
  }
  return contentLines.join('\n').trim();
}


async function generateUsages(config: d.Config, compilerCtx: d.CompilerCtx, usagesDir: string) {
  const rtn: d.JsonDocsUsage = {};

  try {
    const usageFilePaths = await compilerCtx.fs.readdir(usagesDir);

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

function isPublic(jsDocs: d.JsDoc | undefined) {
  return !!(jsDocs && !jsDocs.tags.some((s) => s.name === 'internal'));
}
