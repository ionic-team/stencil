import { BuildContext, ComponentMeta, FileMeta } from '../interfaces';
import * as ts from 'typescript';


export function getComponentMeta(ctx: BuildContext): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visitClass(fileMeta: FileMeta, classNode: ts.ClassDeclaration) {
      fileMeta.cmpMeta = getComponentDecoratorData(classNode);

      if (fileMeta.cmpMeta) {
        fileMeta.hasCmpClass = true;
        fileMeta.cmpClassName = classNode.name.getText().trim();

        const classWithoutDecorators = ts.createClassDeclaration(
            undefined!, classNode.modifiers!, classNode.name!, classNode.typeParameters!,
            classNode.heritageClauses!, classNode.members);

        return classWithoutDecorators;
      }

      fileMeta.hasCmpClass = false;
      return classNode;
    }

    function visit(fileMeta: FileMeta, node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {

        case ts.SyntaxKind.ClassDeclaration:
          return visitClass(fileMeta, node as ts.ClassDeclaration);

        default:
          return ts.visitEachChild(node, (node) => {
            return visit(fileMeta, node);
          }, transformContext);
      }
    }

    return (tsSourceFile) => {
      const fileMeta = ctx.files.get(tsSourceFile.fileName);
      if (fileMeta && fileMeta.hasCmpClass) {
        return visit(fileMeta, tsSourceFile) as ts.SourceFile;
      }

      return tsSourceFile;
    }
  }

}


function getComponentDecoratorData(classNode: ts.ClassDeclaration) {
  let metaData: ComponentMeta = null;

  if (!classNode.decorators) {
    return metaData;
  }

  let isComponent = false;

  classNode.decorators.forEach(decorator => {

    decorator.forEachChild(decoratorChild => {

      decoratorChild.forEachChild(componentChild => {

        if (componentChild.getText().trim() === 'Component') {
          isComponent = true;

        } else if (isComponent) {
          metaData = parseComponentMetaData(componentChild.getText());
        }

      });

    });
  });

  return metaData;
}


function parseComponentMetaData(text: string): ComponentMeta {
  try {
    const fnStr = `return ${text};`;
    let cmpMeta: ComponentMeta = new Function(fnStr)();

    return updateComponentMeta(cmpMeta, text);

  } catch (e) {
    console.log(`parseComponentMetaData: ${e}`);
    console.log(text);
  }
  return null;
}


function updateComponentMeta(cmpMeta: ComponentMeta, orgText: string) {
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

  return cmpMeta;
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
