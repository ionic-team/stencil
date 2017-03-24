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

  file.cmpMeta = parseComponentMeta(text);

  updateComponentMeta(file.cmpMeta, orgText);

  if (!ctx.components) {
    ctx.components = [];
  }

  const metaCopy: ComponentMeta = Object.assign({}, file.cmpMeta);
  delete metaCopy.modes;

  ctx.components.push(metaCopy);

  file.srcTextWithoutDecorators = file.srcTextWithoutDecorators.replace(orgText, '');
}


function updateComponentMeta(cmpMeta: ComponentMeta, orgText: string) {
  if (!cmpMeta) {
    throw `invalid component decorator`;
  }

  if (!cmpMeta.tag || cmpMeta.tag.trim() == '') {
    throw `tag missing in component decorator: ${orgText}`;
  }

  updateTag(cmpMeta);
  updateHostCss(cmpMeta);
  updateProperties(cmpMeta);
  updateObservedAttributes(cmpMeta);
}


function updateTag(cmpMeta: ComponentMeta) {
  cmpMeta.tag = cmpMeta.tag.trim().toLowerCase();

  let invalidChars = cmpMeta.tag.replace(/\w|-/g, '');
  if (invalidChars !== '') {
    throw `"${cmpMeta.tag}" tag contains invalid characters: ${invalidChars}`
  }

  if (cmpMeta.tag.indexOf('-') === -1) {
    throw `"${cmpMeta.tag}" tag must contain a dash (-)`;
  }

  if (cmpMeta.tag.indexOf('-') === 0) {
    throw `"${cmpMeta.tag}" tag cannot start with a dash (-)`;
  }

  if (cmpMeta.tag.lastIndexOf('-') === cmpMeta.tag.length - 1) {
    throw `"${cmpMeta.tag}" tag cannot end with a dash (-)`;
  }

}


function updateHostCss(cmpMeta: ComponentMeta) {
  if (!cmpMeta.hostCss) {
    const tagSplit = cmpMeta.tag.split('-');
    tagSplit.shift();
    cmpMeta.hostCss = tagSplit.join('-');
  }
}


function updateProperties(cmpMeta: ComponentMeta) {
  const validPropTypes = ['string', 'boolean', 'number', 'Array', 'Object'];

  cmpMeta.props = cmpMeta.props || {};

  cmpMeta.props.color = cmpMeta.props.color || {};

  cmpMeta.props.mode = cmpMeta.props.mode || {};

  Object.keys(cmpMeta.props).forEach(propName => {

    if (propName.indexOf('-') > -1) {
      throw `"${propName}" property name cannot have a dash (-) in it`;
    }

    if (!isNaN(<any>propName.charAt(0))) {
      throw `"${propName}" property name cannot start with a number`;
    }

    const prop = cmpMeta.props[propName];
    if (prop.type) {
      if (typeof prop.type === 'string') {
        prop.type = (<any>prop.type).trim();
      }

      if (validPropTypes.indexOf(prop.type) === -1) {
        throw `"${propName}" invalid for property type: ${prop.type}`;
      }
    }

  });
}


function updateObservedAttributes(cmpMeta: ComponentMeta) {
  cmpMeta.observedAttributes = cmpMeta.observedAttributes || [];

  Object.keys(cmpMeta.props).forEach(propName => {
    const attrName = camelCaseToDash(propName);
    if (cmpMeta.observedAttributes.indexOf(attrName) === -1) {
      cmpMeta.observedAttributes.push(attrName);
    }
  });
}


function camelCaseToDash(str: string) {
  return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}


function parseComponentMeta(text: string): ComponentMeta {
  return eval(`(function(){ return ${text}; })()`);
}
