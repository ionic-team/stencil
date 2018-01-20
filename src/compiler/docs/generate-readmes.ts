import { addAutoGenerate } from './auto-docs';
import { AUTO_GENERATE_COMMENT } from './constants';
import { CompilerCtx, Config, ModuleFile } from '../../declarations';


export function generateReadmes(config: Config, ctx: CompilerCtx): Promise<any> {
  if (!config.generateDocs) {
    return Promise.resolve();
  }

  const cmpDirectories: string[] = [];
  const promises: Promise<any>[] = [];
  const warnings: string[] = [];

  const moduleFiles = Object.keys(ctx.moduleFiles).sort();

  moduleFiles.forEach(filePath => {
    const moduleFile = ctx.moduleFiles[filePath];

    if (!moduleFile.cmpMeta) {
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

      promises.push(genereateReadme(config, ctx, moduleFile, dirPath));
    }
  });

  return Promise.all(promises);
}


async function genereateReadme(config: Config, ctx: CompilerCtx, moduleFile: ModuleFile, dirPath: string) {
  const readMePath = config.sys.path.join(dirPath, 'readme.md');

  try {
    const content = await ctx.fs.readFile(readMePath);
    // update
    return updateReadme(config, ctx, moduleFile, readMePath, content);

  } catch (e) {
    // create
    return createReadme(config, ctx, moduleFile, readMePath);
  }
}


async function createReadme(config: Config, ctx: CompilerCtx, moduleFile: ModuleFile, readMePath: string) {
  const content: string[] = [];

  content.push(`# ${moduleFile.cmpMeta.tagNameMeta}`);
  content.push(``);
  content.push(``);
  content.push(``);
  addAutoGenerate(moduleFile.cmpMeta, content);

  await ctx.fs.writeFile(readMePath, content.join('\n'));
  config.logger.info(`created readme docs: ${moduleFile.cmpMeta.tagNameMeta}`);
}


async function updateReadme(config: Config, ctx: CompilerCtx, moduleFile: ModuleFile, readMePath: string, existingContent: string) {
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

  if (updatedContent.trim() === existingContent.trim()) {
    return true;
  }

  await ctx.fs.writeFile(readMePath, updatedContent);

  config.logger.info(`updated readme docs: ${moduleFile.cmpMeta.tagNameMeta}`);
  return true;
}
