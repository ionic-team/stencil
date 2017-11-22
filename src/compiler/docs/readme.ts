import { addAutoGenerate } from './auto-docs';
import { AUTO_GENERATE_COMMENT } from './constants';
import { BuildConfig, BuildContext, ModuleFile } from '../../util/interfaces';
import { readFile } from '../util';


export function genereateReadmes(config: BuildConfig, ctx: BuildContext) {
  const cmpDirectories: string[] = [];
  const promises: Promise<any>[] = [];

  Object.keys(ctx.moduleFiles).forEach(filePath => {
    const moduleFile = ctx.moduleFiles[filePath];

    if (!moduleFile.cmpMeta) {
      return;
    }

    const dirPath = config.sys.path.dirname(moduleFile.tsFilePath);

    if (cmpDirectories.indexOf(dirPath) > -1) {
      config.logger.error(`multiple components found in: ${dirPath}`);

    } else {
      cmpDirectories.push(dirPath);

      promises.push(genereateReadme(config, moduleFile, dirPath));
    }
  });

  return Promise.all(promises);
}


async function genereateReadme(config: BuildConfig, moduleFile: ModuleFile, dirPath: string) {
  config.logger.info(`generated docs: ${moduleFile.cmpMeta.tagNameMeta}`);

  const readMePath = config.sys.path.join(dirPath, 'readme.md');

  return readFile(config.sys, readMePath).then(content => {
    // update
    return updateReadme(config, moduleFile, readMePath, content);

  }).catch(() => {
    // create
    return createReadme(config, moduleFile, readMePath);
  });
}


function createReadme(config: BuildConfig, moduleFile: ModuleFile, readMePath: string) {
  let content: string[] = [];

  content.push(`# ${moduleFile.cmpMeta.tagNameMeta}`);
  content.push(``);
  content.push(``);
  content.push(``);
  addAutoGenerate(moduleFile.cmpMeta, content);

  return new Promise((resolve, reject) => {
    config.sys.fs.writeFile(readMePath, content.join('\n'), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


function updateReadme(config: BuildConfig, moduleFile: ModuleFile, readMePath: string, existingContent: string) {
  let content: string[] = [];

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
    return Promise.resolve(true);
  }

  addAutoGenerate(moduleFile.cmpMeta, content);

  return new Promise((resolve, reject) => {
    config.sys.fs.writeFile(readMePath, content.join('\n'), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}
