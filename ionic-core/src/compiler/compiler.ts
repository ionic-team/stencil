import * as compiler from './build';
import { CompileOptions, CompilerContext, ComponentMeta, FileMeta } from './interfaces';
import { parseComponentSourceText } from './parser';
import { transformTemplate } from './transformer';
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

  }).catch(reason => {
    console.error(reason);
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

    components.forEach(c => {
      if (c.errors && c.errors.length) {
        c.errors.forEach(err => {
          console.error(err);
        });
      }
    });

    return components;
  });
}


export function loadTemplateFile(c: ComponentMeta, file: FileMeta, opts?: CompileOptions, ctx?: CompilerContext) {
  if (!file) {
    return Promise.reject(addError(c, `missing file info for ${c.templateUrl}`));
  }

  let sourceFileDir = path.dirname(file.sourceFileDirPath);
  let templateFilePath = path.join(sourceFileDir, c.templateUrl);

  return readFile(templateFilePath, opts, ctx)
    .then(template => {
      c.template = template;
      return c;
    })
    .catch(reason => {
      addError(c, reason);
      return c;
    });
}


export function compileTemplate(c: ComponentMeta, opts?: CompileOptions, ctx?: CompilerContext, attempt = 0): ComponentMeta {
  attempt++;
  if (attempt > 20) {
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
    c.transformedTemplate = transformTemplate(c.template);

    opts = opts || {};
    const compilerOptions = {
      preserveWhitespace: opts.preserveWhitespace,
      warn: opts.warn
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
      c.templateStaticRenderFns = '[' + c.templateStaticRenderFnsSource.map(fnWrap).join(',') + ']'
    }

  } catch (e) {
    addError(c, e ? e.toString() : `compile template error`);
  }

  return c;
}


function requiresRootElement(err: string) {
  return err.indexOf('one root element') > -1 || err.indexOf('requires a root element') > -1
}


function fnWrap(code: string) {
  return `function(){${code}}`;
}


function addError(c: ComponentMeta, msg: string) {
  c.errors = c.errors || [];
  c.errors.push(msg);
  return msg;
}
