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
  let text = n.getText();

  if (text.replace(/\s/g,'').indexOf('@Component({') !== 0) {
    return;
  }

  text = text.replace('@Component', '');

  const meta = parseComponentMeta(text);

  file.components.push(meta);

  if (!ctx.components) {
    ctx.components = [];
  }

  const metaCopy: ComponentMeta = Object.assign({}, meta);
  delete metaCopy.preprocessStyles;

  ctx.components.push(metaCopy);
}


function parseComponentMeta(text: string): any {
  return eval(`(function(){ return ${text}; })()`);
}
