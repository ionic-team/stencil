import * as compiler from './build';
import { CompileOptions, CompilerContext, ComponentMeta, FileMeta } from './interfaces';
import { parseComponentSourceText } from './parser';
import { transformTemplateContent } from './transformer';
import { generateComponentDecorator, generateComponentFile } from './generator';
import { readFile, readDir } from './util';
import * as path from 'path';


export function compileDirectory(opts: CompileOptions, ctx?: CompilerContext) {
  const inputDirPath = opts.inputDir;
  const sourceDirPath = opts.sourceFileDir || inputDirPath;

  return readDir(inputDirPath, sourceDirPath, opts, ctx).then(filePaths => {

    const promises = filePaths.filter(f => f.ext === 'js').map(file => {
      return compileFile(file, opts, ctx);
    });

    return Promise.all(promises);
  });
}


export function compileFile(file: FileMeta, opts?: CompileOptions, ctx?: CompilerContext) {
  return readFile(file.inputFilePath, opts, ctx).then(sourceText => {

    file.inputSourceText = sourceText;
    file.outputSourceText = sourceText;

    return compileSourceText(sourceText, file, opts, ctx).then(components => {
      file.components = components;

      return generateComponentFile(file, opts, ctx).then(() => {
        return file;
      });
    });
  });
}


export function compileSourceText(sourceText: string, file?: FileMeta, opts?: CompileOptions, ctx?: CompilerContext) {
  const components = parseComponentSourceText(sourceText, opts, ctx);

  const promises: Promise<ComponentMeta>[] = [];

  components.forEach(c => {
    if (!c.templateRenderFn) {
      if (c.template) {
        promises.push(Promise.resolve(c));

      } else if (c.templateUrl) {
        promises.push(loadTemplateFile(c, file, opts, ctx));
      }
    }
  });

  return Promise.all(promises).then(components => {
    components.forEach(c => {
      compileTemplate(c, opts, ctx);
      generateComponentDecorator(c, opts, ctx);
    });

    return components;
  });
}


export function loadTemplateFile(c: ComponentMeta, file: FileMeta, opts?: CompileOptions, ctx?: CompilerContext) {
  if (!file) {
    return Promise.reject(`missing file info for ${c.templateUrl}`);
  }

  let sourceFileDir = path.dirname(file.sourceFileDirPath);
  let templateFilePath = path.join(sourceFileDir, c.templateUrl);

  return readFile(templateFilePath, opts, ctx)
    .then(template => {
      c.template = template;
      return c;
    })
    .catch(reason => {
      console.log(reason);
      c.templateErrors = [reason];
      return c;
    });
}


export function compileTemplate(c: ComponentMeta, opts?: any, ctx?: CompilerContext): ComponentMeta {
  if (c.templateRenderFn) {
    return c;
  }

  if (!c.template) {
    c.templateErrors = [`missing template`];
    return c;
  }

  try {
    c.transformedTemplate = transformTemplateContent(c.template);

    const compileResult = compiler.compile(c.transformedTemplate, opts);

    c.templateAst = compileResult.ast;
    c.templateRenderSource = compileResult.render;
    c.templateStaticRenderFns = compileResult.staticRenderFns;
    c.templateErrors = (<any>compileResult).errors;

    if (!c.templateErrors.length && c.templateRenderSource) {
      c.templateRenderFn = `function (_c, context){${c.templateRenderSource}}`;
    }

  } catch (e) {
    c.templateErrors = [e ? e.toString() : 'compile template error'];
  }

  return c;
}
