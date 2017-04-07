import { BuildContext, FileMeta, CompilerConfig, ComponentMeta } from './interfaces';
import { getTsScriptTarget } from './transpile';
import * as ts from 'typescript';


export function parseTsSrcFile(file: FileMeta, config: CompilerConfig, ctx: BuildContext) {
  const scriptTarget = getTsScriptTarget(config.compilerOptions.target);
  const tsSrcFile = ts.createSourceFile(file.filePath, file.srcText, scriptTarget, true);

  inspectNode(tsSrcFile, file, config, ctx);
}


function inspectNode(n: ts.Node, file: FileMeta, config: CompilerConfig, ctx: BuildContext) {

  if (n.kind === ts.SyntaxKind.ClassDeclaration) {
    ts.forEachChild(n, childNode => {
      if (childNode.kind === ts.SyntaxKind.Decorator) {
        inspectClassDecorator(childNode, file);
      }
    });
  }

  ts.forEachChild(n, childNode => {
    inspectNode(childNode, file, config, ctx);
  });
}


function inspectClassDecorator(n: ts.Node, file: FileMeta) {
  let orgText = n.getText();

  if (orgText.replace(/\s/g,'').indexOf('@Component({') !== 0) {
    return;
  }

  const text = orgText.replace('@Component', '');

  file.cmpMeta = parseComponentMeta(text);

  updateComponentMeta(file.cmpMeta, orgText);

  file.srcTextWithoutDecorators = file.srcText.replace(orgText, '');
}


function updateComponentMeta(cmpMeta: ComponentMeta, orgText: string) {
  if (!cmpMeta) {
    throw `invalid component decorator`;
  }

  if ((<any>cmpMeta).selector) {
    console.log(`Please use "tag" instead of "selector" in component decorator: ${(<any>cmpMeta).selector}`);
    cmpMeta.tag = (<any>cmpMeta).selector;
  }

  if (!cmpMeta.tag || cmpMeta.tag.trim() == '') {
    throw `tag missing in component decorator: ${orgText}`;
  }

  updateTag(cmpMeta);
  updateModes(cmpMeta);
  updateStyles(cmpMeta);
  updateProperties(cmpMeta);
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


function updateModes(cmpMeta: ComponentMeta) {
  cmpMeta.modes = cmpMeta.modes = {};
}


function updateStyles(cmpMeta: ComponentMeta) {
  const styleModes: {[modeName: string]: string} = (<any>cmpMeta).styleUrls;

  if (styleModes) {
    Object.keys(styleModes).forEach(styleModeName => {
      cmpMeta.modes[styleModeName] = {
        styleUrls: [styleModes[styleModeName]]
      }
    });
  }
}


function updateProperties(cmpMeta: ComponentMeta) {
  if (!cmpMeta.props) return;

  const validPropTypes = ['string', 'boolean', 'number', 'Array', 'Object'];

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
        prop.type = (<any>prop.type).trim().toLowerCase();
      }

      if (<any>prop.type === 'array') {
        prop.type = 'Array';
      }

      if (<any>prop.type === 'object') {
        prop.type = 'Object';
      }

      if (validPropTypes.indexOf(prop.type) === -1) {
        throw `"${propName}" invalid for property type: ${prop.type}`;
      }
    }

  });
}


function parseComponentMeta(text: string): ComponentMeta {
  return new Function(`return ${text};`)();
}
