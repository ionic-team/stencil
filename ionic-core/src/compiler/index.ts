import * as compiler from './build';
import * as fs from 'fs';
import { CompileOptions, CompilerContext, ComponentItem} from './interfaces';
import { parseFileContent } from './parser';


export function compileDirectory(inputDirPath: string, outputDirPath: string, opts?: CompileOptions, ctx?: CompilerContext) {

}


export function compileFile(inputFilePath: string, outputFilePath: string, opts?: CompileOptions, ctx?: CompilerContext) {
  return readFile(inputFilePath, opts, ctx).then(content => {
    return compileFileContent(inputFilePath, content, opts, ctx);
  });
}


export function compileFileContent(componentFilePath: string, content: string, opts?: CompileOptions, ctx?: CompilerContext) {
  const promises: Promise<ComponentItem>[] = [];

  const parseResults = parseFileContent(content, opts, ctx);


  return Promise.all(promises);
}


export function parseComponentContent(componentFilePath: string, componentContent: string, opts?: CompileOptions, ctx?: CompilerContext): Promise<ComponentItem> {
  const item: ComponentItem = {
    hasValidComponent: false
  };

  var isValid = true;

  if (!isValid) {
    return Promise.resolve(item);
  }

  item.inputTemplateContent = null;
  item.inputTemplateUrl = './button.html';

  if (!item.inputTemplateContent && item.inputTemplateUrl) {
    return loadTemplateFile(componentFilePath, item.inputTemplateUrl, opts, ctx).then(inputTemplateContent => {
      item.inputTemplateContent = inputTemplateContent;

      compileTemplate(item, opts, ctx);

      return Promise.resolve(item);
    });
  }

  compileTemplate(item, opts, ctx);

  return Promise.resolve(item);
}


export function loadTemplateFile(componentFilePath: string, templateFilePath: string, opts?: CompileOptions, ctx?: CompilerContext) {

  return readFile(templateFilePath, opts, ctx);
}


export function compileTemplate(item: ComponentItem, opts?: any, ctx?: CompilerContext): ComponentItem {
  const compilerResult = compiler.compile(item.inputTemplateContent, opts);

  item.ast = compilerResult.ast;
  item.outputRenderContent = compilerResult.render;
  item.staticRenderFns = compilerResult.staticRenderFns;
  item.errors = (<any>compilerResult).errors;

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
