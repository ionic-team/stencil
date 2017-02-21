import { TranspileOptions, TranspileContext, ComponentMeta, FileMeta } from './interfaces';


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
    const d: string[] = [];

    if (c.tag) {
      d.push(`  tag: '${c.tag}'`);
    }

    d.push(`  render: ${c.templateRenderFn}`);

    if (c.templateStaticRenderFns) {
      d.push(`  staticRenderFns: ${c.templateStaticRenderFns}`);
    }

    c.outputComponentDecorator = `@Component({\n${d.join(',\n')}\n})`;
  }
}

