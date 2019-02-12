import * as d from '@declarations';
import { AUTO_GENERATE_COMMENT } from './constants';
import { isDocsPublic, normalizePath, sortBy } from '@utils';
import { getBuildTimestamp } from '../build/build-ctx';
import { sys } from '@sys';


export async function generateDocData(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Promise<d.JsonDocs> {
  return {
    timestamp: getBuildTimestamp(),
    compiler: {
      name: sys.compiler.name,
      version: sys.compiler.version,
      typescriptVersion: sys.compiler.typescriptVersion
    },
    components: await getComponents(compilerCtx, buildCtx)
  };
}

async function getComponents(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Promise<d.JsonDocsComponent[]> {
  const components = await Promise.all(buildCtx.moduleFiles.map(async moduleFile => {
    const filePath = moduleFile.sourceFilePath;
    const dirPath = normalizePath(sys.path.dirname(filePath));
    const readmePath = normalizePath(sys.path.join(dirPath, 'readme.md'));
    const usagesDir = normalizePath(sys.path.join(dirPath, 'usage'));
    const readme = await getUserReadmeContent(compilerCtx, readmePath);
    const usage = await generateUsages(compilerCtx, usagesDir);
    return moduleFile.cmps
      .filter(cmp => isDocsPublic(cmp.docs))
      .map(cmp => ({
        dirPath,
        filePath,
        fileName: sys.path.basename(filePath),
        readmePath,
        usagesDir,
        tag: cmp.tagName,
        readme,
        usage,
        docs: generateDocs(readme, cmp.docs),
        docsTags: cmp.docs.tags,
        encapsulation: getEncapsulation(cmp),

        props: getProperties(cmp.properties),
        methods: getMethods(cmp.methods),
        events: getEvents(cmp.events),
        styles: getStyles(cmp),
        slots: getSlots(cmp.docs.tags)
      }));
    }));

  return components.flat();
}

function getEncapsulation(cmp: d.ComponentCompilerMeta): 'shadow' | 'scoped' | 'none' {
  if (cmp.encapsulation === 'shadow') {
    return 'shadow';
  } else if (cmp.encapsulation === 'scoped') {
    return 'scoped';
  } else {
    return 'none';
  }
}

function getProperties(properties: d.ComponentCompilerProperty[]): d.JsonDocsProp[] {
  return sortBy(properties, member => member.name)
    .filter(member => isDocsPublic(member.docs))
    .map(member => ({
      name: member.name,
      type: member.complexType.text,
      mutable: member.mutable,
      attr: member.attribute,
      reflectToAttr: !!member.reflect,
      docs: member.docs.text,
      docsTags: member.docs.tags,
      default: member.defaultValue,

      optional: member.optional,
      required: member.required,
    }));
}

function getMethods(methods: d.ComponentCompilerMethod[]): d.JsonDocsMethod[] {
  return sortBy(methods, member => member.name)
    .filter(member => isDocsPublic(member.docs))
    .map(member => ({
      name: member.name,
      returns: member.complexType.returns,
      signature: `${member.name}${member.complexType.signature}`,
      parameters: member.docs.tags,
      docs: member.docs.text,
      docsTags: member.docs.tags,
    }));
}


function getEvents(events: d.ComponentCompilerEvent[]): d.JsonDocsEvent[] {
  return sortBy(events, eventMeta => eventMeta.name.toLowerCase())
    .filter(eventMeta => isDocsPublic(eventMeta.docs))
    .map(eventMeta => ({
      event: eventMeta.name,
      detail: 'TODO',
      bubbles: eventMeta.bubbles,
      cancelable: eventMeta.cancelable,
      composed: eventMeta.composed,
      docs: eventMeta.docs.text,
      docsTags: eventMeta.docs.tags,
    }));
}


function getStyles(cmpMeta: d.ComponentCompilerMeta): d.JsonDocsStyle[] {
  if (!cmpMeta.styleDocs) {
    return [];
  }

  return sortBy(cmpMeta.styleDocs, o => o.name.toLowerCase()).map(styleDoc => {
    return {
      name: styleDoc.name,
      annotation: styleDoc.annotation || '',
      docs: styleDoc.docs || ''
    };
  });
}

function getSlots(tags: d.JsonDocsTags[]): d.JsonDocsSlot[] {
  return tags
    .filter(tag => tag.name === 'slot' && tag.text)
    .map(({text}) => {
      const [namePart, ...rest] = (' ' + text).split(' - ');
      return {
        name: namePart.trim(),
        docs: rest.join(' - ').trim()
      };
    })
    .sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    });
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


function generateDocs(readme: string, jsdoc: d.CompilerJsDoc) {
  const docs = jsdoc.text;
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

async function generateUsages(compilerCtx: d.CompilerCtx, usagesDir: string) {
  const rtn: d.JsonDocsUsage = {};

  try {
    const usageFilePaths = await compilerCtx.fs.readdir(usagesDir);

    const usages: d.JsonDocsUsage = {};

    await Promise.all(usageFilePaths.map(async f => {
      if (!f.isFile) {
        return;
      }

      const fileName = sys.path.basename(f.relPath);
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
