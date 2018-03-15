import * as d from '../../../declarations';
import { addAutoGenerate } from './auto-docs';
import { AUTO_GENERATE_COMMENT } from './constants';


export function generateReadmes(config: d.Config, ctx: d.CompilerCtx): Promise<any> {
  const cmpDirectories: string[] = [];
  const promises: Promise<any>[] = [];
  const warnings: string[] = [];

  const moduleFiles = Object.keys(ctx.moduleFiles).sort();

  const readmeOutputs = (config.outputTargets as d.OutputTargetDocs[]).filter(o => o.type === 'docs' && o.format === 'readme' && o.dir);

  moduleFiles.forEach(filePath => {
    const moduleFile = ctx.moduleFiles[filePath];

    if (!moduleFile.cmpMeta || moduleFile.isCollectionDependency) {
      return;
    }

    const dirPath = config.sys.path.dirname(filePath);

    if (cmpDirectories.includes(dirPath)) {
      if (!warnings.includes(dirPath)) {
        config.logger.warn(`multiple components found in: ${dirPath}`);
        warnings.push(dirPath);
      }

    } else {
      cmpDirectories.push(dirPath);

      promises.push(genereateReadme(config, ctx, readmeOutputs, moduleFile, dirPath));
    }
  });

  return Promise.all(promises);
}


async function genereateReadme(config: d.Config, ctx: d.CompilerCtx, readmeOutputs: d.OutputTargetDocs[], moduleFile: d.ModuleFile, dirPath: string) {
  const readMePath = config.sys.path.join(dirPath, 'readme.md');

  let existingContent: string = null;

  try {
    existingContent = await ctx.fs.readFile(readMePath);
  } catch (e) {}

  if (typeof existingContent === 'string' && existingContent.trim() !== '') {
    // update
    return updateReadme(config, ctx, readmeOutputs, moduleFile, readMePath, existingContent);

  } else {
    // create
    return createReadme(config, ctx, readmeOutputs, moduleFile, readMePath);
  }
}


async function createReadme(config: d.Config, ctx: d.CompilerCtx, readmeOutputs: d.OutputTargetDocs[], moduleFile: d.ModuleFile, readMePath: string) {
  const content: string[] = [];

  content.push(`# ${moduleFile.cmpMeta.tagNameMeta}`);
  content.push(``);
  content.push(``);
  content.push(``);
  addAutoGenerate(moduleFile.cmpMeta, content);

  const readmeContent = content.join('\n');

  const writeFiles: { [filePath: string]: string } = {};

  readmeOutputs.forEach(readmeOutput => {
    const relPath = config.sys.path.relative(config.srcDir, readMePath);
    const absPath = config.sys.path.join(readmeOutput.dir, relPath);
    writeFiles[absPath] = readmeContent;
  });

  writeFiles[readMePath] = readmeContent;

  config.logger.info(`created readme docs: ${moduleFile.cmpMeta.tagNameMeta}`);

  await ctx.fs.writeFiles(writeFiles);
}


async function updateReadme(config: d.Config, ctx: d.CompilerCtx, readmeOutputs: d.OutputTargetDocs[], moduleFile: d.ModuleFile, readMePath: string, existingContent: string) {
  if (typeof existingContent !== 'string' || existingContent.trim() === '') {
    throw new Error('missing existing content');
  }

  const content: string[] = [];

  const existingLines = existingContent.split(/(\r?\n)/);
  let foundAutoGenerate = false;

  for (var i = 0; i < existingLines.length; i++) {
    if (existingLines[i].trim() === AUTO_GENERATE_COMMENT) {
      foundAutoGenerate = true;
      break;
    }

    if (existingLines[i] !== '\n' && existingLines[i] !== '\r') {
      content.push(existingLines[i]);
    }
  }

  if (!foundAutoGenerate) {
    config.logger.warn(`Unable to find ${AUTO_GENERATE_COMMENT} comment for docs auto-generation updates: ${readMePath}`);
    return true;
  }

  addAutoGenerate(moduleFile.cmpMeta, content);

  const updatedContent = content.join('\n');

  const writeFiles: { [filePath: string]: string } = {};

  if (updatedContent.trim() !== existingContent.trim()) {
    writeFiles[readMePath] = updatedContent;
  }

  readmeOutputs.forEach(readmeOutput => {
    const relPath = config.sys.path.relative(config.srcDir, readMePath);
    const absPath = config.sys.path.join(readmeOutput.dir, relPath);
    writeFiles[absPath] = updatedContent;
  });

  config.logger.info(`updated readme docs: ${moduleFile.cmpMeta.tagNameMeta}`);

  await ctx.fs.writeFiles(writeFiles);

  return true;
}
