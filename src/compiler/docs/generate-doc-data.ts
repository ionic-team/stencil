import * as d from '../../declarations';
import { AUTO_GENERATE_COMMENT } from './constants';
import { flatOne, isDocsPublic, normalizePath, sortBy } from '@utils';
import { getBuildTimestamp } from '../build/build-ctx';


export async function generateDocData(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Promise<d.JsonDocs> {
  return {
    timestamp: getBuildTimestamp(),
    compiler: {
      name: config.sys.compiler.name,
      version: config.sys.compiler.version,
      typescriptVersion: config.sys.compiler.typescriptVersion
    },
    components: await getComponents(config, compilerCtx, buildCtx)
  };
}

async function getComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Promise<d.JsonDocsComponent[]> {
  const results = await Promise.all(buildCtx.moduleFiles.map(async moduleFile => {
    const filePath = moduleFile.sourceFilePath;
    const dirPath = normalizePath(config.sys.path.dirname(filePath));
    const readmePath = normalizePath(config.sys.path.join(dirPath, 'readme.md'));
    const usagesDir = normalizePath(config.sys.path.join(dirPath, 'usage'));
    const readme = await getUserReadmeContent(compilerCtx, readmePath);
    const usage = await generateUsages(config, compilerCtx, usagesDir);
    return moduleFile.cmps
      .filter(cmp => isDocsPublic(cmp.docs) && !cmp.isCollectionDependency)
      .map(cmp => ({
        dirPath,
        filePath,
        fileName: config.sys.path.basename(filePath),
        readmePath,
        usagesDir,
        tag: cmp.tagName,
        readme,
        usage,
        docs: generateDocs(readme, cmp.docs),
        docsTags: cmp.docs.tags,
        encapsulation: getEncapsulation(cmp),
        dependencyGraph: buildDepGraph(cmp, buildCtx.components),

        props: getProperties(cmp),
        methods: getMethods(cmp.methods),
        events: getEvents(cmp.events),
        styles: getStyles(cmp),
        slots: getSlots(cmp.docs.tags)
      }));
    }));

  return sortBy(flatOne(results), cmp => cmp.tag);
}

function buildDepGraph(cmp: d.ComponentCompilerMeta, cmps: d.ComponentCompilerMeta[]) {
  const dependencies: d.JsonDocsDependencyGraph = {};
  function walk(tagName: string) {
    if (!dependencies[tagName]) {
      const cmp = cmps.find(c => c.tagName === tagName);
      const deps = cmp.potentialCmpRefs.filter(c => cmps.some(c2 => c2.tagName === c));
      if (deps.length > 0) {
        dependencies[tagName] = deps;
        deps.forEach(walk);
      }
    }
  }
  walk(cmp.tagName);
  return dependencies;
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

function getProperties(cmpMeta: d.ComponentCompilerMeta): d.JsonDocsProp[] {
  return sortBy([
    ...getRealProperties(cmpMeta.properties),
    ...getVirtualProperties(cmpMeta.virtualProperties)
  ], p => p.name);
}

function getRealProperties(properties: d.ComponentCompilerProperty[]): d.JsonDocsProp[] {
  return properties.filter(member => isDocsPublic(member.docs))
    .map(member => ({
      name: member.name,
      type: member.complexType.resolved,
      mutable: member.mutable,
      attr: member.attribute,
      reflectToAttr: !!member.reflect,
      docs: member.docs.text,
      docsTags: member.docs.tags,
      default: member.defaultValue,
      deprecation: getDeprecation(member.docs.tags),

      optional: member.optional,
      required: member.required,
    }));
}

function getVirtualProperties(virtualProps: d.ComponentCompilerVirtualProperty[]): d.JsonDocsProp[] {
  return virtualProps.map(member => ({
    name: member.name,
    type: member.type,
    mutable: false,
    attr: member.name,
    reflectToAttr: false,
    docs: member.docs,
    docsTags: [],
    default: undefined,
    deprecation: undefined,

    optional: true,
    required: false,
  }));
}

function getMethods(methods: d.ComponentCompilerMethod[]): d.JsonDocsMethod[] {
  return sortBy(methods, member => member.name)
    .filter(member => isDocsPublic(member.docs))
    .map(member => ({
      name: member.name,
      returns: {
        type: member.complexType.return,
        docs: '',
      },
      signature: `${member.name}${member.complexType.signature}`,
      parameters: member.docs.tags,
      docs: member.docs.text,
      docsTags: member.docs.tags,
      deprecation: getDeprecation(member.docs.tags)
    }));
}


function getEvents(events: d.ComponentCompilerEvent[]): d.JsonDocsEvent[] {
  return sortBy(events, eventMeta => eventMeta.name.toLowerCase())
    .filter(eventMeta => isDocsPublic(eventMeta.docs))
    .map(eventMeta => ({
      event: eventMeta.name,
      detail: eventMeta.complexType.resolved,
      bubbles: eventMeta.bubbles,
      cancelable: eventMeta.cancelable,
      composed: eventMeta.composed,
      docs: eventMeta.docs.text,
      docsTags: eventMeta.docs.tags,
      deprecation: getDeprecation(eventMeta.docs.tags)
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

function getDeprecation(tags: d.JsonDocsTag[]) {
  const deprecation = tags.find(t => t.name === 'deprecated');
  if (deprecation) {
    return deprecation.text || '';
  }
  return undefined;
}

function getSlots(tags: d.JsonDocsTag[]): d.JsonDocsSlot[] {
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
