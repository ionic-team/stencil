import * as d from '../declarations';
import fs from 'graceful-fs';
import { join, parse, relative } from 'path';
import { promisify } from 'util';
import { validateComponentTag } from '@utils';
import prompt from 'prompts';
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
    (await prompt({ name: 'tagName', type: 'text', message: 'Component tag name (dash-case):' })).tagName as string;

  const { dir, base: componentName } = parse(input);
  const prefix = componentName.split('-')[0];
  const afterPrefix = componentName.split('-').slice(1).join('-');
  
  const tagError = validateComponentTag(componentName);
  if (tagError) {
    config.logger.error(tagError);
    return exit(1);
  }

  const extensionsToGenerate: GeneratableExtension[] = ['tsx', ...(await chooseFilesToGenerate())];

  const outDir = join(baseDir, srcDir, 'components', dir, afterPrefix);
  await mkdir(outDir, { recursive: true });

  const writtenFiles = await Promise.all(
    extensionsToGenerate.map(extension =>
      writeFileByExtension(outDir, prefix, afterPrefix, extension, extensionsToGenerate.includes('css')),
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
  (await prompt({
    name: 'filesToGenerate',
    type: 'multiselect',
    message: 'Which additional files do you want to generate?',
    choices: [
      { value: 'css', title: 'Stylesheet', selected: true },
      { value: 'spec.ts', title: 'Spec Test', selected: true },
      { value: 'e2e.ts', title: 'E2E Test', selected: true },
    ] as any[],
  })).filesToGenerate as GeneratableExtension[];

/**
 * Get a file's boilerplate by its extension and write it to disk.
 */
const writeFileByExtension = async (path: string, prefix: string, afterPrefix: string, extension: GeneratableExtension, withCss: boolean) => {
  const outFile = join(path, `${afterPrefix}.${extension}`);
  const boilerplate = getBoilerplateByExtension(prefix, afterPrefix, extension, withCss);

  await writeFile(outFile, boilerplate, { flag: 'wx' });

  return outFile;
};

/**
 * Get the boilerplate for a file by its extension.
 */
const getBoilerplateByExtension = (prefix: string, afterPrefix: string, extension: GeneratableExtension, withCss: boolean) => {
  switch (extension) {
    case 'tsx':
      return getComponentBoilerplate(prefix, afterPrefix, withCss);

    case 'css':
      return getStyleUrlBoilerplate();

    case 'spec.ts':
      return getSpecTestBoilerplate(prefix, afterPrefix);

    case 'e2e.ts':
      return getE2eTestBoilerplate(`${prefix}-${afterPrefix}`);

    default:
      throw new Error(`Unkown extension "${extension}".`);
  }
};

/**
 * Get the boilerplate for a component.
 */
const getComponentBoilerplate = (prefix: string, afterPrefix: string, hasStyle: boolean) => {
  const decorator = [`{`];
  decorator.push(`  tag: '${prefix}-${afterPrefix}',`);
  if (hasStyle) {
    decorator.push(`  styleUrl: '${afterPrefix}.css',`);
  }
  decorator.push(`  shadow: true`);
  decorator.push(`}`);

  return `import { Component, Host, h } from '@stencil/core';

@Component(${decorator.join('\n')})
export class ${toPascalCase(afterPrefix)} {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
`;
};

/**
 * Get the boilerplate for style.
 */
const getStyleUrlBoilerplate = () =>
`:host {
  display: block;
}
`;

/**
 * Get the boilerplate for a spec test.
 */
const getSpecTestBoilerplate = (prefix: string, afterPrefix: string) =>
`import { ${toPascalCase(afterPrefix)} } from './${afterPrefix}';

describe('${prefix}-${afterPrefix}', () => {
  it('builds', () => {
    expect(new ${toPascalCase(afterPrefix)}()).toBeTruthy();
  });
});
`;

/**
 * Get the boilerplate for an E2E test.
 */
const getE2eTestBoilerplate = (name: string) =>
`import { newE2EPage } from '@stencil/core/testing';

describe('${name}', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<${name}></${name}>');

    const element = await page.find('${name}');
    expect(element).toHaveAttribute('data-hydrated');
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
