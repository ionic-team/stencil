import * as d from '../../declarations';
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
export async function taskGenerate(config: d.Config) {
  if (!config.configPath) {
    config.logger.error('Please run this command in your root directory (i. e. the one containing stencil.config.ts).');
    exit(1);
  }

  const absoluteSrcDir = config.srcDir;

  if (!absoluteSrcDir) {
    config.logger.error(`Stencil's srcDir was not specified.`);
    return exit(1);
  }

  const input =
    config.flags.unknownArgs.find(arg => !arg.startsWith('-')) || ((await prompt({ name: 'tagName', type: 'text', message: 'Component tag name (dash-case):' })).tagName as string);

  const { dir, base: componentName } = parse(input);
  const prefix = config.componentGeneratorConfig?.prefix;
  const componentTag = prefix ? `${prefix}-${componentName}` : `app-${componentName}`;
  const styleExt = config.componentGeneratorConfig?.styleFormat || 'css';

  const tagError = validateComponentTag(componentTag);
  if (tagError) {
    config.logger.error(tagError);
    return exit(1);
  }

  const extensionsToGenerate: GeneratableExtension[] = ['tsx', ...(await chooseFilesToGenerate(styleExt))];

  const testFolder = extensionsToGenerate.some(isTest)
    ? 'test'
    : '';

  const outDir = join(absoluteSrcDir, 'components', dir, componentName);
  await mkdir(join(outDir, testFolder), { recursive: true });

  const writtenFiles = await Promise.all(
    extensionsToGenerate.map(extension => writeFileByExtension(outDir, componentName, componentTag, extension, extensionsToGenerate.includes('css'), styleExt)),
  ).catch(error => config.logger.error(error));

  if (!writtenFiles) {
    return exit(1);
  }

  console.log();
  console.log(`${config.logger.gray('$')} stencil generate ${input}`);
  console.log();
  console.log(config.logger.bold('The following files have been generated:'));

  const absoluteRootDir = config.rootDir;
  writtenFiles.map(file => console.log(`  - ${relative(absoluteRootDir, file)}`));
}

/**
 * Show a checkbox prompt to select the files to be generated.
 */
const chooseFilesToGenerate = async (styleExt: string) =>
  (
    await prompt({
      name: 'filesToGenerate',
      type: 'multiselect',
      message: 'Which additional files do you want to generate?',
      choices: [
        { value: 'css', title: `Stylesheet (.${styleExt})`, selected: true },
        { value: 'spec.tsx', title: 'Spec Test  (.spec.tsx)', selected: true },
        { value: 'e2e.ts', title: 'E2E Test (.e2e.ts)', selected: true },
      ] as any[],
    })
  ).filesToGenerate as GeneratableExtension[];

/**
 * Get a file's boilerplate by its extension and write it to disk.
 */
const writeFileByExtension = async (path: string, name: string, tag: string, extension: GeneratableExtension, withCss: boolean, styleExt: string) => {
  if (isTest(extension)) {
    path = join(path, 'test');
  }

  const ext = isStyle(extension) ? styleExt : extension;
  const outFile = join(path, `${name}.${ext}`);
  const boilerplate = getBoilerplateByExtension(name, tag, extension, withCss, styleExt);

  await writeFile(outFile, boilerplate, { flag: 'wx' });

  return outFile;
};

const isTest = (extension: string) => {
  return extension === 'e2e.ts' || extension === 'spec.tsx';
};

const isStyle = (extension: string) => {
  return extension === 'css';
};

/**
 * Get the boilerplate for a file by its extension.
 */
const getBoilerplateByExtension = (componentName: string, tagName: string, extension: GeneratableExtension, withCss: boolean, styleExt: string) => {
  switch (extension) {
    case 'tsx':
      return getComponentBoilerplate(componentName, tagName, withCss, styleExt);

    case 'css':
      return getStyleUrlBoilerplate();

    case 'spec.tsx':
      return getSpecTestBoilerplate(componentName, tagName);

    case 'e2e.ts':
      return getE2eTestBoilerplate(tagName);

    default:
      throw new Error(`Unknown extension "${extension}".`);
  }
};

/**
 * Get the boilerplate for a component.
 */
const getComponentBoilerplate = (componentName: string, tagName: string, hasStyle: boolean, styleExt: string) => {
  const decorator = [`{`];
  decorator.push(`  tag: '${tagName}',`);
  if (hasStyle) {
    decorator.push(`  styleUrl: '${componentName}.${styleExt}',`);
  }
  decorator.push(`  shadow: true,`);
  decorator.push(`}`);

  return `import { Component, Host, h } from '@stencil/core';

@Component(${decorator.join('\n')})
export class ${toPascalCase(tagName)} {

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
const getSpecTestBoilerplate = (componentName: string, tagName: string) =>
  `import { newSpecPage } from '@stencil/core/testing';
import { ${toPascalCase(tagName)} } from '../${componentName}';

describe('${tagName}', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [${toPascalCase(tagName)}],
      html: \`<${tagName}></${tagName}>\`,
    });
    expect(page.root).toEqualHtml(\`
      <${tagName}>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </${tagName}>
    \`);
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
    expect(element).toHaveClass('hydrated');
  });
});
`;

/**
 * Convert a dash case string to pascal case.
 */
const toPascalCase = (str: string) => str.split('-').reduce((res, part) => res + part[0].toUpperCase() + part.substr(1), '');

/**
 * Extensions available to generate.
 */
type GeneratableExtension = 'tsx' | 'css' | 'spec.tsx' | 'e2e.ts';
