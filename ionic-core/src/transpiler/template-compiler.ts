import { ComponentMeta, FileMeta, TranspileOptions, TranspileContext } from './interfaces';
import { readFile } from './util';
import * as path from 'path';
import * as compiler from './template-compiler-build';


export function compileTemplateSourceText(file: FileMeta, opts: TranspileOptions, ctx: TranspileContext) {
  const promises: Promise<ComponentMeta>[] = [];

  file.components.forEach(c => {
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
    });
    return components;
  });
}


export function loadTemplateFile(c: ComponentMeta, file: FileMeta, opts: TranspileOptions, ctx: TranspileContext) {
  let sourceFileDir = path.dirname(file.filePath);
  let templateFilePath = path.join(sourceFileDir, c.templateUrl);

  let templateFile = ctx.files.get(templateFilePath);
  if (templateFile && templateFile.srcText) {
    c.template = templateFile.srcText;
    return Promise.resolve(c);
  }

  return readFile(templateFilePath)
    .then(srcText => {
      let templateFile: FileMeta = {
        filePath: templateFilePath,
        srcText: srcText,
      };
      ctx.files.set(templateFilePath, templateFile);
      c.template = srcText;
      return c;
    })
    .catch(reason => {
      addError(c, reason);
      return c;
    });
}


export function compileTemplate(c: ComponentMeta, opts: TranspileOptions, ctx: TranspileContext, attempt = 0): ComponentMeta {
  attempt++;
  if (attempt > 10) {
    addError(c, `compileTemplate infinite loop detected`);
    return c;
  }

  if (c.templateRenderFn) {
    return c;
  }

  if (!c.template) {
    addError(c, `missing template`);
    return c;
  }

  try {
    c.transformedTemplate = c.template;

    const compilerOptions = {
      preserveWhitespace: opts.preserveWhitespace
    };

    const compileResult = compiler.compile(c.transformedTemplate, compilerOptions);

    c.templateAst = compileResult.ast;
    c.templateRenderSource = compileResult.render;

    const errors = (<any>compileResult).errors || [];
    for (var i = 0; i < errors.length; i++) {

      if (requiresRootElement(errors[i])) {
        c.template = `<div>${c.template}</div>`;
        return compileTemplate(c, opts, ctx, attempt);
      }

      addError(c, errors[i]);
    }

    if (c.templateRenderSource) {
      c.templateRenderFn = fnWrap(c.templateRenderSource);
    }

    c.templateStaticRenderFnsSource = compileResult.staticRenderFns;
    if (c.templateStaticRenderFnsSource && c.templateStaticRenderFnsSource.length) {
      c.templateStaticRenderFns = '[' + c.templateStaticRenderFnsSource.map(fnWrap).join(',') + ']';
    }

  } catch (e) {
    addError(c, e ? e.toString() : `compile template error`);
  }

  return c;
}


function requiresRootElement(err: string) {
  return err.indexOf('one root element') > -1 || err.indexOf('requires a root element') > -1;
}


function fnWrap(code: string) {
  return `function(){${code}}`;
}


function addError(c: ComponentMeta, msg: string) {
  c.errors = c.errors || [];
  c.errors.push(msg);
  return msg;
}
