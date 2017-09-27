import { ModuleFiles, ModuleFile } from '../../../util/interfaces';
import { HAS_SLOTS, HAS_NAMED_SLOTS } from '../../../util/constants';
import * as ts from 'typescript';
import * as util from './util';


export function updateFileMetaFromSlot(moduleFiles: ModuleFiles): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext: ts.TransformationContext) => {
    return (tsSourceFile) => {
      return visit(tsSourceFile.fileName, tsSourceFile) as ts.SourceFile;
    };

    function visit(fileName: string, node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.CallExpression:
          const fileMeta = updateFileMeta(node as ts.CallExpression, moduleFiles[fileName]);
          if (fileMeta) {
            moduleFiles[fileName] = fileMeta;
          }

        default:
          return ts.visitEachChild(node, (node) => {
            return visit(fileName, node);
          }, transformContext);
      }
    }
  };
}


export function updateModuleFileMetaFromSlot(moduleFile: ModuleFile): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext: ts.TransformationContext) => {
    return (tsSourceFile) => {
      return visit(tsSourceFile.fileName, tsSourceFile) as ts.SourceFile;
    };

    function visit(fileName: string, node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.CallExpression:
          updateFileMeta(node as ts.CallExpression, moduleFile);

        default:
          return ts.visitEachChild(node, (node) => {
            return visit(fileName, node);
          }, transformContext);
      }
    }
  };
}


function updateFileMeta(callNode: ts.CallExpression, fileMeta: ModuleFile) {
  if (fileMeta && (<ts.Identifier>callNode.expression).text === 'h') {
    const [tag, props] = callNode.arguments;

    if (tag && typeof (tag as ts.StringLiteral).text === 'string') {
      const tagName = (tag as ts.StringLiteral).text.trim().toLowerCase();

      if (tagName === 'slot') {
        return updateFileMetaWithSlots(fileMeta, props);
      }
    }
  }
  return null;
}


function updateFileMetaWithSlots(fileMeta: ModuleFile, props: ts.Expression): ModuleFile {
  // checking if there is a default slot and/or named slots in the compiler
  // so that during runtime there is less work to do

  if (!fileMeta || !fileMeta.cmpMeta) {
    return fileMeta;
  }

  if (fileMeta.cmpMeta.slotMeta === undefined) {
    fileMeta.cmpMeta.slotMeta = HAS_SLOTS;
  }

  if (props && props.kind === ts.SyntaxKind.ObjectLiteralExpression) {
    const jsxAttrs = util.objectLiteralToObjectMap(props as ts.ObjectLiteralExpression);

    for (var attrName in jsxAttrs) {
      if (attrName.toLowerCase().trim() === 'name') {
        var attrValue: string = (<any>jsxAttrs[attrName]).text.trim();

        if (attrValue.length > 0) {
          fileMeta.cmpMeta.slotMeta = HAS_NAMED_SLOTS;
          break;
        }
      }
    }
  }

  return fileMeta;
}
