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
          const callNode = node as ts.CallExpression;

          if ((<ts.Identifier>callNode.expression).text === 'h') {
            const [tag, props] = callNode.arguments;
            const tagName = (<ts.StringLiteral>tag).text.trim().toLowerCase();

            if (tagName === 'slot') {
              moduleFiles[fileName] = updateFileMetaWithSlots(moduleFiles[fileName], props);
            }
          }

        default:
          return ts.visitEachChild(node, (node) => {
            return visit(fileName, node);
          }, transformContext);
      }
    }
  };
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
