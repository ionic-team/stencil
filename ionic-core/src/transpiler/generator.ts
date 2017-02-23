import { TranspileOptions, TranspileContext, ComponentMeta, FileMeta } from './interfaces';
import { compileTemplate } from './template-compiler';


export function generateComponentFile(file: FileMeta, opts?: TranspileOptions, ctx?: TranspileContext) {
  file.srcTransformedText = file.srcText;

  if (!file.components || !file.components.length) {
    return file;
  }

  file.components.forEach(c => {
    generateComponentDecorator(c);

    if (c.inputComponentDecorator !== c.outputComponentDecorator) {
      file.srcTransformedText = file.srcTransformedText.replace(
        c.inputComponentDecorator,
        c.outputComponentDecorator
      );
    }
  });

  return file;
}


export function generateComponentDecorator(c: ComponentMeta) {
  c.outputComponentDecorator = c.inputComponentDecorator;

  if (c.templateRenderFn && (c.templateUrl || c.template)) {
    const meta = generateComponentDecoratorMeta(c);

    c.outputComponentDecorator = `@Component(${meta})`;
  }
}


export function generateComponentDecoratorMeta(c: ComponentMeta) {
  const d: string[] = [];

  if (c.tag) {
    d.push(`  tag: '${c.tag}'`);
  }

  d.push(`  render: ${c.templateRenderFn}`);

  if (c.templateStaticRenderFns) {
    d.push(`  staticRenderFns: ${c.templateStaticRenderFns}`);
  }

  return `{\n${d.join(',\n')}\n}`;
}


export function generateComponentMeta(tag: string, template: string) {
  const c = compileTemplate(template)

  if (c.errors && c.errors.length) {
    throw c.errors.join('\n');
  }

  c.tag = tag;

  return generateComponentDecoratorMeta(c);
}