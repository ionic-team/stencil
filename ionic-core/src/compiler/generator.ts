import { CompileOptions, CompilerContext, ComponentMeta, FileMeta } from './interfaces';
import { writeFile } from './util';


export function generateComponentFile(file: FileMeta, opts?: CompileOptions, ctx?: CompilerContext): Promise<boolean> {
  generateSourceTextOutput(file);

  if (opts && opts.writeToDisk === false) {
    return Promise.resolve(false);
  }

  generateOutputFilePath(file);

  if (file.inputFilePath === file.outputFilePath && file.inputSourceText === file.outputFilePath) {
    return Promise.resolve(false);
  }

  return writeFile(file.outputFilePath, file.outputSourceText, opts, ctx);
}


export function generateSourceTextOutput(file: FileMeta) {
  if (!file.components || !file.components.length) {
    return;
  }

  file.components.forEach(c => {
    generateComponentDecorator(c);

    if (c.inputComponentDecorator !== c.outputComponentDecorator) {
      file.outputSourceText = file.outputSourceText.replace(
        c.inputComponentDecorator,
        c.outputComponentDecorator
      );
    }
  });
}


export function generateOutputFilePath(file: FileMeta) {
  if (!file.outputFilePath) {
    file.outputFilePath = file.inputFilePath;
  }
}


export function generateComponentDecorator(c: ComponentMeta) {
  if (c.templateRenderFn && (c.templateUrl || c.template)) {
    const d: string[] = [];

    if (c.selector) {
      d.push(`  selector: '${c.selector}'`);
    }

    d.push(`  render: ${c.templateRenderFn}`);

    if (c.templateStaticRenderFns) {
      d.push(`  staticRenderFns: ${c.templateStaticRenderFns}`);
    }

    c.outputComponentDecorator = `Component({\n${d.join(',\n')}\n})`;
  }
}

