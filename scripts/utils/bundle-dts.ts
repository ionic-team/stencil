import fs from 'fs-extra';
import { generateDtsBundle } from 'dts-bundle-generator/bundle-generator.js';
import { BuildOptions } from './options';


export async function bundleDts(opts: BuildOptions, inputFile: string) {
  const cachedDtsOutput = inputFile + '-bundled.d.ts';

  if (!opts.isProd) {
    try {
      return await fs.readFile(cachedDtsOutput, 'utf8');
    } catch (e) {}
  }

  const entries = [{
    filePath: inputFile
  }];

  let outputCode = generateDtsBundle(entries).join('\n');

  outputCode = outputCode.replace(/\/\/\/ <reference types="node" \/>/g, '');

  outputCode = outputCode.replace(/NodeJS.Process/g, 'any');

  outputCode = outputCode.replace(/import \{ URL \} from \'url\';/g, '');

  outputCode = outputCode.trim();

  await fs.writeFile(cachedDtsOutput, outputCode);

  return outputCode;
}
