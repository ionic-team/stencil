import { CompileOptions, CompilerContext, ComponentMeta, FileMeta } from './interfaces';
import { writeFile } from './util';


export function generateComponentFile(file: FileMeta, opts?: CompileOptions, ctx?: CompilerContext): Promise<boolean> {
  generateSourceTextOutput(file, opts, ctx);

  if (!file.outputFilePath || opts.writeToDisk === false) {
    return Promise.resolve(false);
  }

  return writeFile(file.outputFilePath, file.outputSourceText, opts, ctx);
}


export function generateSourceTextOutput(file: FileMeta, opts?: CompileOptions, ctx?: CompilerContext) {
  if (!file.components || !file.components.length) {
    return;
  }

  file.components.forEach(c => {
    generateComponentDecorator(c, opts, ctx);
  });
}


export function generateComponentDecorator(c: ComponentMeta, opts?: CompileOptions, ctx?: CompilerContext) {
  const d: string[] = [];

  if (c.templateRenderFn && (c.templateUrl || c.template)) {
    d.push(`  render: '${c.templateRenderFn}'`);
  }

  if (d.length) {
    d.unshift(`  selector: '${c.selector}'`);

    c.outputComponentDecorator = `@Component({\n${d.join(',\n')}\n})`;
  }
}

