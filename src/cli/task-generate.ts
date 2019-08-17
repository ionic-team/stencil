import * as d from '../declarations';
import fs from 'fs';
import { join, parse, relative } from 'path';
import { promisify } from 'util';
import inquirer from 'inquirer';
import exit from 'exit';

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
    (await inquirer.prompt([{ name: 'name', message: 'Component name (dash-case):' }])).name;

  const { dir, base: componentName } = parse(input);

  if (!componentName.includes('-')) {
    config.logger.error('The name needs to be in dash case.');
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

  config.logger.info();
  config.logger.info(`${config.logger.gray('$')} stencil generate ${input}`);
  config.logger.info();
  config.logger.info('The following files have been generated:');
  writtenFiles.map(file => config.logger.info(`- ${relative(baseDir, file)}`));
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
  const boilerplate = getBoilerplateByExtension(name, extension, withCss);

  await writeFile(outFile, boilerplate, { flag: 'wx' });

  return outFile;
};

/**
 * Get the boilerplate for a file by its extension.
 */
const getBoilerplateByExtension = (name: string, extension: GeneratableExtension, withCss: boolean) => {
  switch (extension) {
    case 'tsx':
      return getComponentBoilerplate(name, withCss);

    case 'css':
      return '';

    case 'spec.ts':
      return getSpecTestBoilerplate(name);

    case 'e2e.ts':
      return getE2eTestBoilerplate(name);
  }
};

/**
 * Get the boilerplate for a component.
 */
const getComponentBoilerplate = (name: string, style = false) => `import { h, Component, Host } from '@stencil/core';

@Component({ tag: '${name}'${style ? `, styleUrl: '${name}.css'` : ''}, shadow: true })
export class ${toPascalCase(name)} {
	render() {
		return (
			<Host>
				<slot></slot>
			</Host>
		);
	}
}
`;

/**
 * Get the boilerplate for a spec test.
 */
const getSpecTestBoilerplate = (name: string) => `import { ${toPascalCase(name)} } from './${name}';

describe('${name}', () => {
  it('builds', () => {
    expect(new ${toPascalCase(name)}()).toBeTruthy();
  });
});
`;

/**
 * Get the boilerplate for an E2E test.
 */
const getE2eTestBoilerplate = (name: string) => `import { newE2EPage } from '@stencil/core/testing';

describe('${name}', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<${name}></${name}>');

    const element = await page.find('${name}');
    expect(element).toHaveClass('hydrated');
  });
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
