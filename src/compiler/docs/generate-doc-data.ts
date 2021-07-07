import type * as d from '../../declarations';
import { AUTO_GENERATE_COMMENT } from './constants';
import { basename, dirname, join, relative } from 'path';
import { flatOne, normalizePath, sortBy, unique } from '@utils';
import { getBuildTimestamp } from '../build/build-ctx';
import { JsonDocsValue } from '../../declarations';
import { typescriptVersion, version } from '../../version';

export const generateDocData = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
): Promise<d.JsonDocs> => {
  return {
    timestamp: getBuildTimestamp(),
    compiler: {
      name: '@stencil/core',
      version,
      typescriptVersion,
    },
    components: await getDocsComponents(config, compilerCtx, buildCtx),
  };
};

const getDocsComponents = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
): Promise<d.JsonDocsComponent[]> => {
  const results = await Promise.all(
    buildCtx.moduleFiles.map(async moduleFile => {
      const filePath = moduleFile.sourceFilePath;
      const dirPath = normalizePath(dirname(filePath));
      const readmePath = normalizePath(join(dirPath, 'readme.md'));
      const usagesDir = normalizePath(join(dirPath, 'usage'));
      const readme = await getUserReadmeContent(compilerCtx, readmePath);
      const usage = await generateUsages(compilerCtx, usagesDir);
      return moduleFile.cmps
        .filter(cmp => !cmp.internal && !cmp.isCollectionDependency)
        .map(cmp => ({
          dirPath,
          filePath: relative(config.rootDir, filePath),
          fileName: basename(filePath),
          readmePath,
          usagesDir,
          tag: cmp.tagName,
          readme,
          usage,
          docs: generateDocs(readme, cmp.docs),
          docsTags: cmp.docs.tags,
          encapsulation: getDocsEncapsulation(cmp),
          dependents: cmp.directDependents,
          dependencies: cmp.directDependencies,
          dependencyGraph: buildDocsDepGraph(cmp, buildCtx.components),
          deprecation: getDocsDeprecationText(cmp.docs.tags),

          props: getDocsProperties(cmp),
          methods: getDocsMethods(cmp.methods),
          events: getDocsEvents(cmp.events),
          styles: getDocsStyles(cmp),
          slots: getDocsSlots(cmp.docs.tags),
          parts: getDocsParts(cmp.htmlParts, cmp.docs.tags),
          listeners: getDocsListeners(cmp.listeners),
        }));
    }),
  );

  return sortBy(flatOne(results), cmp => cmp.tag);
};

const buildDocsDepGraph = (cmp: d.ComponentCompilerMeta, cmps: d.ComponentCompilerMeta[]) => {
  const dependencies: d.JsonDocsDependencyGraph = {};
  function walk(tagName: string) {
    if (!dependencies[tagName]) {
      const cmp = cmps.find(c => c.tagName === tagName);
      const deps = cmp.directDependencies;
      if (deps.length > 0) {
        dependencies[tagName] = deps;
        deps.forEach(walk);
      }
    }
  }
  walk(cmp.tagName);

  // load dependents
  cmp.directDependents.forEach(tagName => {
    if (dependencies[tagName] && !dependencies[tagName].includes(cmp.tagName)) {
      dependencies[tagName].push(cmp.tagName);
    } else {
      dependencies[tagName] = [cmp.tagName];
    }
  });
  return dependencies;
};

const getDocsEncapsulation = (cmp: d.ComponentCompilerMeta): 'shadow' | 'scoped' | 'none' => {
  if (cmp.encapsulation === 'shadow') {
    return 'shadow';
  } else if (cmp.encapsulation === 'scoped') {
    return 'scoped';
  } else {
    return 'none';
  }
};

const getDocsProperties = (cmpMeta: d.ComponentCompilerMeta): d.JsonDocsProp[] => {
  return sortBy(
    [...getRealProperties(cmpMeta.properties), ...getVirtualProperties(cmpMeta.virtualProperties)],
    p => p.name,
  );
};

const getRealProperties = (properties: d.ComponentCompilerProperty[]): d.JsonDocsProp[] => {
  return properties
    .filter(member => !member.internal)
    .map(member => ({
      name: member.name,
      type: member.complexType.resolved,
      mutable: member.mutable,
      attr: member.attribute,
      reflectToAttr: !!member.reflect,
      docs: member.docs.text,
      docsTags: member.docs.tags,
      default: member.defaultValue,
      deprecation: getDocsDeprecationText(member.docs.tags),
      values: parseTypeIntoValues(member.complexType.resolved),

      optional: member.optional,
      required: member.required,
    }));
};

const getVirtualProperties = (virtualProps: d.ComponentCompilerVirtualProperty[]): d.JsonDocsProp[] => {
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
    values: parseTypeIntoValues(member.type),

    optional: true,
    required: false,
  }));
};

const parseTypeIntoValues = (type: string) => {
  if (typeof type === 'string') {
    const unions = type.split('|').map(u => u.trim());
    const parsedUnions: JsonDocsValue[] = [];
    unions.forEach(u => {
      if (u === 'true') {
        parsedUnions.push({
          value: 'true',
          type: 'boolean',
        });
        return;
      }
      if (u === 'false') {
        parsedUnions.push({
          value: 'false',
          type: 'boolean',
        });
        return;
      }
      if (!Number.isNaN(parseFloat(u))) {
        // union is a number
        parsedUnions.push({
          value: u,
          type: 'number',
        });
        return;
      }
      if (/^("|').+("|')$/gm.test(u)) {
        // ionic is a string
        parsedUnions.push({
          value: u.slice(1, -1),
          type: 'string',
        });
        return;
      }
      parsedUnions.push({
        type: u,
      });
    });
    return parsedUnions;
  }
  return [];
};

const getDocsMethods = (methods: d.ComponentCompilerMethod[]): d.JsonDocsMethod[] => {
  return sortBy(methods, member => member.name)
    .filter(member => !member.internal)
    .map(member => ({
      name: member.name,
      returns: {
        type: member.complexType.return,
        docs: member.docs.tags.filter(t => t.name === 'return').join('\n'),
      },
      signature: `${member.name}${member.complexType.signature}`,
      parameters: [], // TODO
      docs: member.docs.text,
      docsTags: member.docs.tags,
      deprecation: getDocsDeprecationText(member.docs.tags),
    }));
};

const getDocsEvents = (events: d.ComponentCompilerEvent[]): d.JsonDocsEvent[] => {
  return sortBy(events, eventMeta => eventMeta.name.toLowerCase())
    .filter(eventMeta => !eventMeta.internal)
    .map(eventMeta => ({
      event: eventMeta.name,
      detail: eventMeta.complexType.resolved,
      bubbles: eventMeta.bubbles,
      cancelable: eventMeta.cancelable,
      composed: eventMeta.composed,
      docs: eventMeta.docs.text,
      docsTags: eventMeta.docs.tags,
      deprecation: getDocsDeprecationText(eventMeta.docs.tags),
    }));
};

const getDocsStyles = (cmpMeta: d.ComponentCompilerMeta): d.JsonDocsStyle[] => {
  if (!cmpMeta.styleDocs) {
    return [];
  }

  return sortBy(cmpMeta.styleDocs, o => o.name.toLowerCase()).map(styleDoc => {
    return {
      name: styleDoc.name,
      annotation: styleDoc.annotation || '',
      docs: styleDoc.docs || '',
    };
  });
};

const getDocsListeners = (listeners: d.ComponentCompilerListener[]): d.JsonDocsListener[] => {
  return listeners.map(listener => ({
    event: listener.name,
    target: listener.target,
    capture: listener.capture,
    passive: listener.passive,
  }));
};

const getDocsDeprecationText = (tags: d.JsonDocsTag[]) => {
  const deprecation = tags.find(t => t.name === 'deprecated');
  if (deprecation) {
    return deprecation.text || '';
  }
  return undefined;
};

const getDocsSlots = (tags: d.JsonDocsTag[]): d.JsonDocsSlot[] => {
  return sortBy(
    getNameText('slot', tags).map(([name, docs]) => ({ name, docs })),
    a => a.name,
  );
};

const getDocsParts = (vdom: string[], tags: d.JsonDocsTag[]): d.JsonDocsSlot[] => {
  const docsParts = getNameText('part', tags).map(([name, docs]) => ({ name, docs }));
  const vdomParts = vdom.map(name => ({ name, docs: '' }));
  return sortBy(
    unique([...docsParts, ...vdomParts], p => p.name),
    p => p.name,
  );
};

export const getNameText = (name: string, tags: d.JsonDocsTag[]) => {
  return tags
    .filter(tag => tag.name === name && tag.text)
    .map(({ text }) => {
      const [namePart, ...rest] = (' ' + text).split(' - ');
      return [namePart.trim(), rest.join(' - ').trim()];
    });
};

const getUserReadmeContent = async (compilerCtx: d.CompilerCtx, readmePath: string) => {
  try {
    const existingContent = await compilerCtx.fs.readFile(readmePath);
    const userContentIndex = existingContent.indexOf(AUTO_GENERATE_COMMENT) - 1;
    if (userContentIndex >= 0) {
      return existingContent.substring(0, userContentIndex);
    }
  } catch (e) {}
  return undefined;
};

const generateDocs = (readme: string, jsdoc: d.CompilerJsDoc) => {
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
};

const generateUsages = async (compilerCtx: d.CompilerCtx, usagesDir: string) => {
  const rtn: d.JsonDocsUsage = {};

  try {
    const usageFilePaths = await compilerCtx.fs.readdir(usagesDir);

    const usages: d.JsonDocsUsage = {};

    await Promise.all(
      usageFilePaths.map(async f => {
        if (!f.isFile) {
          return;
        }

        const fileName = basename(f.relPath);
        if (!fileName.toLowerCase().endsWith('.md')) {
          return;
        }

        const parts = fileName.split('.');
        parts.pop();
        const key = parts.join('.');

        usages[key] = await compilerCtx.fs.readFile(f.absPath);
      }),
    );

    Object.keys(usages)
      .sort()
      .forEach(key => {
        rtn[key] = usages[key];
      });
  } catch (e) {}

  return rtn;
};
