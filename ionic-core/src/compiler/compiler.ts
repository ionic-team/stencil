import * as compiler from './build';
import { CompileOptions, CompilerContext, ComponentMeta, FileMeta } from './interfaces';
import { parseComponentSourceText } from './parser';
import { transformTemplateContent } from './transformer';
import { generateComponentDecorator, generateComponentFile } from './generator';
import { readFile } from './util';


export function compileDirectory(inputDirPath: string, opts?: CompileOptions, ctx?: CompilerContext) {

}


export function compileFile(inputFilePath: string, outputFilePath?: string, opts?: CompileOptions, ctx?: CompilerContext) {
  return readFile(inputFilePath, opts, ctx).then(sourceText => {

    const file: FileMeta = {
      inputFilePath: inputFilePath,
      outputFilePath: outputFilePath,
      inputSourceText: sourceText,
      outputSourceText: sourceText
    };

    return compileSourceText(sourceText, opts, ctx).then(components => {
      file.components = components;

      return generateComponentFile(file, opts, ctx).then(() => {
        return file;
      });
    });
  });
}


export function compileSourceText(sourceText: string, opts?: CompileOptions, ctx?: CompilerContext) {
  const components = parseComponentSourceText(sourceText, opts, ctx);

  const promises: Promise<ComponentMeta>[] = [];

  components.forEach(c => {
    if (c.template) {
      promises.push(Promise.resolve(c));

    } else if (c.templateUrl) {
      promises.push(loadTemplateFile(c, opts, ctx));
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


export function loadTemplateFile(c: ComponentMeta, opts?: CompileOptions, ctx?: CompilerContext) {
  let templateFilePath = c.templateUrl;

  return readFile(templateFilePath, opts, ctx)
    .then(template => {
      c.template = template;
      return c;
    })
    .catch(reason => {
      c.templateErrors = [reason];
      return c;
    });
}


export function compileTemplate(c: ComponentMeta, opts?: any, ctx?: CompilerContext): ComponentMeta {
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
