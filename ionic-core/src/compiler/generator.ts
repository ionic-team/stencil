import { CompileOptions, CompilerContext, ComponentMeta, FileMeta } from './interfaces';
import { writeFile } from './util';


export function generateComponentFile(file: FileMeta, opts?: CompileOptions, ctx?: CompilerContext): Promise<boolean> {
  generateSourceTextOutput(file, opts, ctx);

  if (opts && opts.writeToDisk === false) {
    return Promise.resolve(false);
  }

  generateOutputFilePath(file, opts);

  if (file.inputFilePath === file.outputFilePath && file.inputSourceText === file.outputFilePath) {
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

    if (c.inputComponentDecorator !== c.outputComponentDecorator) {
      file.outputSourceText = file.outputSourceText.replace(
        c.inputComponentDecorator,
        c.outputComponentDecorator
      );
    }
  });
}


export function generateOutputFilePath(file: FileMeta, opts: CompileOptions) {
  if (file.outputFilePath) {
    return;
  }

  file.outputFilePath = file.inputFilePath;
}


export function generateComponentDecorator(c: ComponentMeta, opts?: CompileOptions, ctx?: CompilerContext) {
  if (c.templateRenderFn && (c.templateUrl || c.template)) {
    const d: string[] = [];

    d.push(`  selector: '${c.selector}'`);
    d.push(`  render: ${c.templateRenderFn}`);

    c.outputComponentDecorator = `Component({\n${d.join(',\n')}\n})`;
  }
}

