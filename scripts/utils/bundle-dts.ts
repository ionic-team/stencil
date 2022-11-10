import { generateDtsBundle } from 'dts-bundle-generator/dist/bundle-generator.js';
import fs from 'fs-extra';

import { BuildOptions } from './options';

export async function bundleDts(opts: BuildOptions, inputFile: string) {
  const cachedDtsOutput = inputFile + '-bundled.d.ts';

  if (!opts.isProd) {
    try {
      return await fs.readFile(cachedDtsOutput, 'utf8');
    } catch (e) {}
  }

  const entries = [
    {
      filePath: inputFile,
    },
  ];

  let outputCode = generateDtsBundle(entries).join('\n');

  outputCode = cleanDts(outputCode);

  await fs.writeFile(cachedDtsOutput, outputCode);

  return outputCode;
}

export function cleanDts(dtsContent: string) {
  dtsContent = dtsContent.replace(/\/\/\/ <reference types="node" \/>/g, '');

  dtsContent = dtsContent.replace(/NodeJS.Process/g, 'any');

  dtsContent = dtsContent.replace(/import \{ URL \} from \'url\';/g, '');

  return dtsContent.trim() + '\n';
}
