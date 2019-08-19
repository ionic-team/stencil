import * as d from '../declarations';
import fs from 'fs';
import { join, parse, relative } from 'path';
import { promisify } from 'util';
import { validateComponentTag } from '@utils';
import inquirer from 'inquirer';
import exit from 'exit';
import { getIndentation } from './cli-utils';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);


/**
 * Task to generate component boilerplate.
 */
export async function taskGenerate(config: d.Config, flags: d.ConfigFlags) {
  if (!config.configPath) {
    config.logger.error('Please run this command in your root directory (i. e. the one containing stencil.config.ts).');
    exit(1);
  }

  const baseDir = parse(config.configPath).dir;
  const srcDir = config.srcDir || 'src';

  const input =
    flags.unknownArgs.find(arg => !arg.startsWith('-')) ||
    (await inquirer.prompt([{ name: 'name', message: 'Component tag name (dash-case):' }])).name;

  const { dir, base: componentName } = parse(input);

  const tagError = validateComponentTag(componentName);
  if (tagError) {
    config.logger.error(tagError);
    return exit(1);
  }

  const extensionsToGenerate: GeneratableExtension[] = ['tsx', ...(await chooseFilesToGenerate())];

  const outDir = join(baseDir, srcDir, 'components', dir, componentName);
  await mkdir(outDir, { recursive: true });

  const writtenFiles = await Promise.all(
    extensionsToGenerate.map(extension =>
      writeFileByExtension(outDir, componentName, extension, extensionsToGenerate.includes('css')),
    ),
  ).catch(error => config.logger.error(error));

  if (!writtenFiles) {
    return exit(1);
  }

  console.log();
  console.log(`${config.logger.gray('$')} stencil generate ${input}`);
  console.log();
  console.log(config.logger.bold('The following files have been generated:'));
  writtenFiles.map(file => console.log(`  - ${relative(baseDir, file)}`));
}

/**
 * Show a checkbox prompt to select the files to be generated.
 */
const chooseFilesToGenerate = async () =>
  (await inquirer.prompt([
    {
      name: 'filesToGenerate',
      type: 'checkbox',
      message: 'Which additional files do you want to generate?',
      choices: [
        { value: 'css', name: 'Stylesheet', checked: true },
        { value: 'spec.ts', name: 'Spec Test', checked: true },
        { value: 'e2e.ts', name: 'E2E Test', checked: true },
      ],
    },
  ])).filesToGenerate as GeneratableExtension[];

/**
 * Get a file's boilerplate by its extension and write it to disk.
 */
const writeFileByExtension = async (path: string, name: string, extension: GeneratableExtension, withCss: boolean) => {
  const outFile = join(path, `${name}.${extension}`);
  const indent = await getIndentation(outFile);

  const boilerplate = getBoilerplateByExtension(name, extension, withCss).replace(/\t/g, indent);

  await writeFile(outFile, boilerplate, { flag: 'wx' });

  return outFile;
};

/**
 * Get the boilerplate for a file by its extension.
 */
const getBoilerplateByExtension = (tagName: string, extension: GeneratableExtension, withCss: boolean) => {
  switch (extension) {
    case 'tsx':
      return getComponentBoilerplate(tagName, withCss);

    case 'css':
      return getStyleUrlBoilerplate();

    case 'spec.ts':
      return getSpecTestBoilerplate(tagName);

    case 'e2e.ts':
      return getE2eTestBoilerplate(tagName);

    default:
      throw new Error(`Unkown extension "${extension}".`);
  }
};

/**
 * Get the boilerplate for a component.
 */
const getComponentBoilerplate = (tagName: string, hasStyle: boolean) =>
`import { Component, Host, h } from '@stencil/core';

@Component({
\ttag: '${tagName}',${hasStyle ? `\n\tstyleUrl: '${tagName}.css',` : ''}
\tshadow: true
})
export class ${toPascalCase(tagName)} {

\trender() {
\t\treturn (
\t\t\t<Host>
\t\t\t\t<slot></slot>
\t\t\t</Host>
\t\t);
\t}

}
`;

/**
 * Get the boilerplate for style.
 */
const getStyleUrlBoilerplate = () =>
`:host {
\tdisplay: block;
}
`;

/**
 * Get the boilerplate for a spec test.
 */
const getSpecTestBoilerplate = (tagName: string) =>
`import { ${toPascalCase(tagName)} } from './${tagName}';

describe('${tagName}', () => {
\tit('builds', () => {
\t\texpect(new ${toPascalCase(tagName)}()).toBeTruthy();
\t});
});
`;

/**
 * Get the boilerplate for an E2E test.
 */
const getE2eTestBoilerplate = (name: string) =>
`import { newE2EPage } from '@stencil/core/testing';

describe('${name}', () => {
\tit('renders', async () => {
\t\tconst page = await newE2EPage();
\t\tawait page.setContent('<${name}></${name}>');

\t\tconst element = await page.find('${name}');
\t\texpect(element).toHaveClass('hydrated');
\t});
});
`;

/**
 * Convert a dash case string to pascal case.
 */
const toPascalCase = (str: string) =>
  str.split('-').reduce((res, part) => res + part[0].toUpperCase() + part.substr(1), '');

/**
 * Extensions available to generate.
 */
type GeneratableExtension = 'tsx' | 'css' | 'spec.ts' | 'e2e.ts';
