import * as compiler from './build';
import * as fs from 'fs';
import { CompileOptions, CompilerContext, ComponentItem} from './interfaces';
import { parseComponentDecorator } from './parser';


export function compileDirectory(inputDirPath: string, outputDirPath: string, opts?: CompileOptions, ctx?: CompilerContext) {

}


export function compileFile(inputFilePath: string, outputFilePath: string, opts?: CompileOptions, ctx?: CompilerContext) {
  return readFile(inputFilePath, opts, ctx).then(content => {
    return compileFileContent(inputFilePath, content, opts, ctx);
  });
}


export function compileFileContent(filePath: string, content: string, opts?: CompileOptions, ctx?: CompilerContext) {
  const items = parseComponentDecorator(content, opts, ctx);

  const promises: Promise<ComponentItem>[] = [];

  items.forEach(item => {
    item.filePath = filePath;

    if (item.templateContent) {
      promises.push(Promise.resolve(item));

    } else if (item.templateUrl) {
      promises.push(loadTemplateFile(item, opts, ctx));
    }
  });

  return Promise.all(promises).then(items => {
    items.forEach(item => {
      compileTemplate(item, opts, ctx);
    });

    return items;
  });
}


export function loadTemplateFile(item: ComponentItem, opts?: CompileOptions, ctx?: CompilerContext) {
  let templateFilePath = item.templateUrl;

  return readFile(templateFilePath, opts, ctx)
    .then(inputTemplateContent => {
      item.templateContent = inputTemplateContent;
      return item;
    })
    .catch(reason => {
      item.errors = [reason];
      return item;
    });
}


export function compileTemplate(item: ComponentItem, opts?: any, ctx?: CompilerContext): ComponentItem {
  try {
    const compilerResult = compiler.compile(item.templateContent, opts);

    item.ast = compilerResult.ast;
    item.templateRender = compilerResult.render;
    item.staticRenderFns = compilerResult.staticRenderFns;
    item.errors = (<any>compilerResult).errors;

  } catch (e) {
    item.errors = [e ? e.toString() : 'invalid template'];
  }

  return item;
}


function readFile(filePath: string, opts: CompileOptions, ctx: CompilerContext): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, content) => {
      if (err) {
        reject(err);

      } else {
        resolve(content.toString());
      }
    });
  });
}
