import type { Config } from '../declarations';
import type { CoreCompiler } from './load-compiler';
import { IS_NODE_ENV } from '../compiler/sys/environment';
import { validateComponentTag } from '@utils';

/**
 * Task to generate component boilerplate.
 */
export const taskGenerate = async (coreCompiler: CoreCompiler, config: Config) => {
  if (!IS_NODE_ENV) {
    config.logger.error(`"generate" command is currently only implemented for a NodeJS environment`);
    return config.sys.exit(1);
  }

  const path = coreCompiler.path;

  if (!config.configPath) {
    config.logger.error('Please run this command in your root directory (i. e. the one containing stencil.config.ts).');
    return config.sys.exit(1);
  }

  const absoluteSrcDir = config.srcDir;

  if (!absoluteSrcDir) {
    config.logger.error(`Stencil's srcDir was not specified.`);
    return config.sys.exit(1);
  }

  const { prompt } = await import('prompts');

  const input =
    config.flags.unknownArgs.find((arg) => !arg.startsWith('-')) ||
    ((await prompt({ name: 'tagName', type: 'text', message: 'Component tag name (dash-case):' })).tagName as string);

  const { dir, base: componentName } = path.parse(input);

  const tagError = validateComponentTag(componentName);
  if (tagError) {
    config.logger.error(tagError);
    return config.sys.exit(1);
  }

  const extensionsToGenerate: GeneratableExtension[] = ['tsx', ...(await chooseFilesToGenerate())];

  const testFolder = extensionsToGenerate.some(isTest) ? 'test' : '';

  const outDir = path.join(absoluteSrcDir, 'components', dir, componentName);
  await config.sys.createDir(path.join(outDir, testFolder), { recursive: true });

  const writtenFiles = await Promise.all(
    extensionsToGenerate.map((extension) =>
      writeFileByExtension(coreCompiler, config, outDir, componentName, extension, extensionsToGenerate.includes('css'))
    )
  ).catch((error) => config.logger.error(error));

  if (!writtenFiles) {
    return config.sys.exit(1);
  }

  console.log();
  console.log(`${config.logger.gray('$')} stencil generate ${input}`);
  console.log();
  console.log(config.logger.bold('The following files have been generated:'));

  const absoluteRootDir = config.rootDir;
  writtenFiles.map((file) => console.log(`  - ${path.relative(absoluteRootDir, file)}`));
};

/**
 * Show a checkbox prompt to select the files to be generated.
 */
const chooseFilesToGenerate = async () => {
  const { prompt } = await import('prompts');
  return (
    await prompt({
      name: 'filesToGenerate',
      type: 'multiselect',
      message: 'Which additional files do you want to generate?',
      choices: [
        { value: 'css', title: 'Stylesheet (.css)', selected: true },
        { value: 'spec.tsx', title: 'Spec Test  (.spec.tsx)', selected: true },
        { value: 'e2e.ts', title: 'E2E Test (.e2e.ts)', selected: true },
      ] as any[],
    })
  ).filesToGenerate as GeneratableExtension[];
};

/**
 * Get a file's boilerplate by its extension and write it to disk.
 */
const writeFileByExtension = async (
  coreCompiler: CoreCompiler,
  config: Config,
  path: string,
  name: string,
  extension: GeneratableExtension,
  withCss: boolean
) => {
  if (isTest(extension)) {
    path = coreCompiler.path.join(path, 'test');
  }
  const outFile = coreCompiler.path.join(path, `${name}.${extension}`);
  const boilerplate = getBoilerplateByExtension(name, extension, withCss);

  await config.sys.writeFile(outFile, boilerplate);

  return outFile;
};

const isTest = (extension: string) => {
  return extension === 'e2e.ts' || extension === 'spec.tsx';
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
const getComponentBoilerplate = (tagName: string, hasStyle: boolean) => {
  const decorator = [`{`];
  decorator.push(`  tag: '${tagName}',`);
  if (hasStyle) {
    decorator.push(`  styleUrl: '${tagName}.css',`);
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
const getSpecTestBoilerplate = (tagName: string) =>
  `import { newSpecPage } from '@stencil/core/testing';
import { ${toPascalCase(tagName)} } from '../${tagName}';

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
const toPascalCase = (str: string) =>
  str.split('-').reduce((res, part) => res + part[0].toUpperCase() + part.substr(1), '');

/**
 * Extensions available to generate.
 */
type GeneratableExtension = 'tsx' | 'css' | 'spec.tsx' | 'e2e.ts';
