import * as d from '../../declarations';
import { addAutoGenerate } from './auto-docs';
import { AUTO_GENERATE_COMMENT } from './constants';
import { generateJsDocComponent } from './generate-json-doc';


export async function generateReadmes(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetDocs[]) {
  const cmpDirectories: string[] = [];
  const promises: Promise<any>[] = [];
  const warnings: string[] = [];
  const jsonDocs: d.JsonDocs = { components: [] };

  const moduleFiles = Object.keys(compilerCtx.moduleFiles).sort();

  moduleFiles.forEach(filePath => {
    const moduleFile = compilerCtx.moduleFiles[filePath];

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

      promises.push(generateReadme(config, compilerCtx, outputTargets, jsonDocs, moduleFile, dirPath));
    }
  });

  await Promise.all(promises);

  await Promise.all(outputTargets.map(async outputTarget => {
    if (outputTarget.jsonFile) {
      jsonDocs.components = jsonDocs.components.sort((a, b) => {
        if (a.tag < b.tag) return -1;
        if (a.tag > b.tag) return 1;
        return 0;
      });

      const jsonContent = JSON.stringify(jsonDocs, null, 2);
      await compilerCtx.fs.writeFile(outputTarget.jsonFile, jsonContent);
    }
  }));
}


async function generateReadme(config: d.Config, compilerCtx: d.CompilerCtx, readmeOutputs: d.OutputTargetDocs[], jsonDocs: d.JsonDocs, moduleFile: d.ModuleFile, dirPath: string) {
  const readMePath = config.sys.path.join(dirPath, 'readme.md');

  let existingContent: string = null;

  try {
    existingContent = await compilerCtx.fs.readFile(readMePath);
  } catch (e) {}

  if (typeof existingContent === 'string' && existingContent.trim() !== '') {
    // update
    return updateReadme(config, compilerCtx, readmeOutputs, jsonDocs, moduleFile, dirPath, readMePath, existingContent);

  } else {
    // create
    return createReadme(config, compilerCtx, readmeOutputs, jsonDocs, moduleFile, dirPath, readMePath);
  }
}


async function createReadme(config: d.Config, compilerCtx: d.CompilerCtx, readmeOutputs: d.OutputTargetDocs[], jsonDocs: d.JsonDocs, moduleFile: d.ModuleFile, dirPath: string, readMePath: string) {
  const content: string[] = [];

  content.push(`# ${moduleFile.cmpMeta.tagNameMeta}`);
  content.push(``);
  content.push(``);
  content.push(``);
  addAutoGenerate(moduleFile.cmpMeta, content);

  const readmeContent = content.join('\n');

  const writeFiles: { [filePath: string]: string } = {};

  await Promise.all(readmeOutputs.map(async readmeOutput => {
    if (readmeOutput.readmeDir) {
      const relPath = config.sys.path.relative(config.srcDir, readMePath);
      const absPath = config.sys.path.join(readmeOutput.readmeDir, relPath);
      writeFiles[absPath] = readmeContent;
    }

    if (readmeOutput.jsonFile) {
      await generateJsDocComponent(config, compilerCtx, jsonDocs, moduleFile.cmpMeta, dirPath, '');
    }
  }));

  writeFiles[readMePath] = readmeContent;

  config.logger.info(`created readme docs: ${moduleFile.cmpMeta.tagNameMeta}`);

  await compilerCtx.fs.writeFiles(writeFiles);
}


async function updateReadme(config: d.Config, compilerCtx: d.CompilerCtx, readmeOutputs: d.OutputTargetDocs[], jsonDocs: d.JsonDocs, moduleFile: d.ModuleFile, dirPath: string, readMePath: string, existingContent: string) {
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

  const userContent = content.join('\n');

  addAutoGenerate(moduleFile.cmpMeta, content);

  const updatedContent = content.join('\n');

  const writeFiles: { [filePath: string]: string } = {};

  if (updatedContent.trim() !== existingContent.trim()) {
    writeFiles[readMePath] = updatedContent;
    config.logger.info(`updated readme docs: ${moduleFile.cmpMeta.tagNameMeta}`);
  }

  await Promise.all(readmeOutputs.map(async readmeOutput => {
    if (readmeOutput.readmeDir) {
      const relPath = config.sys.path.relative(config.srcDir, readMePath);
      const absPath = config.sys.path.join(readmeOutput.readmeDir, relPath);
      writeFiles[absPath] = updatedContent;
    }

    if (readmeOutput.jsonFile) {
      await generateJsDocComponent(config, compilerCtx, jsonDocs, moduleFile.cmpMeta, dirPath, userContent);
    }
  }));

  await compilerCtx.fs.writeFiles(writeFiles);

  return true;
}
