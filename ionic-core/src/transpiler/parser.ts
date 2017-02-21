import { ComponentMeta, FileMeta, TranspileOptions, TranspileContext } from './interfaces';
import * as ts from 'typescript';


export function parseTsSrcFile(file: FileMeta, opts: TranspileOptions, ctx: TranspileContext) {
  let tsSrcFile = ts.createSourceFile(file.filePath, file.srcText, ctx.tsConfig.options.target, true);

  inspectNode(tsSrcFile, file, opts, ctx);
}


function inspectNode(n: ts.Node, file: FileMeta, opts: TranspileOptions, ctx: TranspileContext) {
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


function inspectClassDecorator(n: ts.Node, file: FileMeta, opts: TranspileOptions, ctx: TranspileContext) {
  const text = n.getText();

  if (text.replace(/\s/g,'').indexOf('@Component({') !== 0) {
    return;
  }

  const parse = parseComponentDecorator(text);

  let c: ComponentMeta = {
    inputComponentDecorator: text,
    tag: parse.tag,
    template: parse.template,
    templateUrl: parse.templateUrl
  };

  file.components.push(c);
}


export function parseComponentDecorator(text: string): ComponentParse {
  const parsed: ComponentParse = {
    templateUrl: '',
    template: '',
    tag: ''
  };

  let match = TEMPLATE_REGEX.exec(text);
  if (match) {
    parsed.template = match[2].trim();
  }

  match = TEMPLATE_URL_REGEX.exec(text);
  if (match) {
    parsed.templateUrl = match[2].trim();
  }

  match = TAG_REGEX.exec(text);
  if (match) {
    parsed.tag = match[2].trim();
  } else {
    match = SELECTOR_REGEX.exec(text);
    if (match) {
      parsed.tag = match[2].trim();
      console.log(`${parsed.tag} - "selector" in component decorator has been deprecated, please use "tag" instead`);
    }
  }

  return parsed;
}


export interface ComponentParse {
  templateUrl: string;
  template: string;
  tag: string;
}


const TEMPLATE_REGEX = /\s*template\s*:\s*(['"`])(.*?)(['"`])/m;

const TEMPLATE_URL_REGEX = /\s*templateUrl\s*:\s*(['"`])(.*?)(['"`])/m;

const TAG_REGEX = /\s*tag\s*:\s*(['"`])(.*?)(['"`])/m;

const SELECTOR_REGEX = /\s*selector\s*:\s*(['"`])(.*?)(['"`])/m;
