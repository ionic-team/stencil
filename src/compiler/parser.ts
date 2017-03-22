import { FileMeta, CompilerOptions, CompilerContext, ComponentMeta } from './interfaces';
import { getTsScriptTarget } from './util';
import * as ts from 'typescript';


export function parseTsSrcFile(file: FileMeta, opts: CompilerOptions, ctx: CompilerContext) {
  let tsSrcFile = ts.createSourceFile(file.filePath, file.srcText, getTsScriptTarget(opts.scriptTarget), true);

  inspectNode(tsSrcFile, file, opts, ctx);
}


function inspectNode(n: ts.Node, file: FileMeta, opts: CompilerOptions, ctx: CompilerContext) {
  if (n.kind === ts.SyntaxKind.ClassDeclaration) {
    ts.forEachChild(n, childNode => {
      if (childNode.kind === ts.SyntaxKind.Decorator) {
        inspectClassDecorator(childNode, file, opts, ctx);
      }
    });
  }

  ts.forEachChild(n, childNode => {
    inspectNode(childNode, file, opts, ctx);
  });
}


function inspectClassDecorator(n: ts.Node, file: FileMeta, opts: CompilerOptions, ctx: CompilerContext) {
  let orgText = n.getText();

  if (orgText.replace(/\s/g,'').indexOf('@Component({') !== 0) {
    return;
  }

  const text = orgText.replace('@Component', '');

  const cmpMeta = parseComponentMeta(text);

  updateComponentMeta(cmpMeta, orgText);

  file.components.push(cmpMeta);

  if (!ctx.components) {
    ctx.components = [];
  }

  const metaCopy: ComponentMeta = Object.assign({}, cmpMeta);
  delete metaCopy.preprocessStyles;

  ctx.components.push(metaCopy);
}


function updateComponentMeta(cmpMeta: ComponentMeta, orgText: string) {
  if (!cmpMeta.tag) {
    throw `tag missing in component decorator: ${orgText}`;
  }

  if (cmpMeta.tag.indexOf('-') === -1) {
    throw `tag must have a dash (-): ${cmpMeta.tag}`;
  }

  if (cmpMeta.tag.indexOf('-') === 0) {
    throw `tag cannot start with a dash (-): ${cmpMeta.tag}`;
  }

  if (cmpMeta.tag.indexOf('-') === cmpMeta.tag.length - 1) {
    throw `tag cannot end with a dash (-): ${cmpMeta.tag}`;
  }

  if (!cmpMeta.hostCss) {
    const tagSplit = cmpMeta.tag.split('-');
    cmpMeta.hostCss = tagSplit[tagSplit.length - 1];
  }
}


function parseComponentMeta(text: string): ComponentMeta {
  return eval(`(function(){ return ${text}; })()`);
}
