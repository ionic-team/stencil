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

  const tagError = validateComponentTag(componentName);
  if (tagError) {
    config.logger.error(tagError);
    return exit(1);
  }

  let cssExtension = "css";
  if (!!config.plugins.find(plugin => plugin.name === "sass")) {
    cssExtension = "scss";
  } else if (!!config.plugins.find(plugin => plugin.name === "less")) {
    cssExtension = "less";
  } else if (!!config.plugins.find(plugin => plugin.name === "stylus")) {
    cssExtension = "styl";
  }
  const extensionsToGenerate: GeneratableExtension[] = ['tsx', ...(await chooseFilesToGenerate(cssExtension))];

  const outDir = join(absoluteSrcDir, 'components', dir, componentName);
  await mkdir(outDir, { recursive: true });

  const writtenFiles = await Promise.all(
    extensionsToGenerate.map(extension => writeFileByExtension(outDir, componentName, extension, (extensionsToGenerate as string[]).includes(cssExtension), cssExtension)),
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
const chooseFilesToGenerate = async (cssExtension: string) =>
  (
    await prompt({
      name: 'filesToGenerate',
      type: 'multiselect',
      message: 'Which additional files do you want to generate?',
      choices: [
        { value: cssExtension, title: `Stylesheet (.${cssExtension})`, selected: true },
        { value: 'spec.tsx', title: 'Spec Test  (.spec.tsx)', selected: true },
        { value: 'e2e.ts', title: 'E2E Test (.e2e.ts)', selected: true },
      ] as any[],
    })
  ).filesToGenerate as GeneratableExtension[];

/**
 * Get a file's boilerplate by its extension and write it to disk.
 */
const writeFileByExtension = async (path: string, name: string, extension: GeneratableExtension, withCss: boolean, cssExtension: string) => {
  const outFile = join(path, `${name}.${extension}`);
  const boilerplate = getBoilerplateByExtension(name, extension, withCss, cssExtension);

  await writeFile(outFile, boilerplate, { flag: 'wx' });

  return outFile;
};

/**
 * Get the boilerplate for a file by its extension.
 */
const getBoilerplateByExtension = (tagName: string, extension: GeneratableExtension, withCss: boolean, cssExtension: string) => {
  switch (extension) {
    case 'tsx':
      return getComponentBoilerplate(tagName, withCss, cssExtension);

    case cssExtension:
      return getStyleUrlBoilerplate();

    case 'spec.tsx':
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
const getComponentBoilerplate = (tagName: string, hasStyle: boolean, cssExtension: string) => {
  const decorator = [`{`];
  decorator.push(`  tag: '${tagName}',`);
  if (hasStyle) {
    decorator.push(`  styleUrl: '${tagName}.${cssExtension}',`);
  }
  decorator.push(`  shadow: true,`);
  decorator.push(`}`);

  return `import { Component, ComponentInterface, Host, h } from '@stencil/core';

@Component(${decorator.join('\n')})
export class ${toPascalCase(tagName)} implements ComponentInterface {

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
const getSpecTestBoilerplate = (tagName: string) =>
  `import { newSpecPage } from '@stencil/core/testing';
import { ${toPascalCase(tagName)} } from './${tagName}';

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
type GeneratableExtension = 'tsx' | 'css' | 'scss' | 'less' | 'spec.tsx' | 'e2e.ts';
