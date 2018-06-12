import * as d from '../../../declarations';
import { getModuleFile } from '../../build/compiler-ctx';
import { MEMBER_TYPE } from '../../../util/constants';
import * as ts from 'typescript';


export function componentDependencies(compilerCtx: d.CompilerCtx): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visit(node: ts.Node, moduleFile: d.ModuleFile): ts.VisitResult<ts.Node> {
      if (node.kind === ts.SyntaxKind.CallExpression) {
        callExpression(moduleFile, node as ts.CallExpression);

      } else if (node.kind === ts.SyntaxKind.StringLiteral) {
        stringLiteral(moduleFile, node as ts.StringLiteral);
      }

      return ts.visitEachChild(node, (node) => {
        return visit(node, moduleFile);
      }, transformContext);
    }

    return (tsSourceFile) => {
      const moduleFile = getModuleFile(compilerCtx, tsSourceFile.fileName);

      // reset since we're doing a full parse again
      moduleFile.potentialCmpRefs.length = 0;
      moduleFile.hasSlot = false;
      moduleFile.hasSvg = false;

      addPropConnects(compilerCtx, moduleFile);

      return visit(tsSourceFile, moduleFile) as ts.SourceFile;
    };
  };
}


function addPropConnects(compilerCtx: d.CompilerCtx, moduleFile: d.ModuleFile) {
  if (!moduleFile.cmpMeta) {
    return;
  }

  if (moduleFile.cmpMeta.membersMeta) {
    Object.keys(moduleFile.cmpMeta.membersMeta).forEach(memberName => {
      const memberMeta = moduleFile.cmpMeta.membersMeta[memberName];
      if (memberMeta.memberType === MEMBER_TYPE.PropConnect) {
        addPropConnect(compilerCtx, moduleFile, memberMeta.ctrlId);
      }
    });
  }
}


function addPropConnect(compilerCtx: d.CompilerCtx, moduleFile: d.ModuleFile, tag: string) {
  moduleFile.potentialCmpRefs.push({
    tag: tag
  });

  compilerCtx.collections.forEach(collection => {

    collection.bundles.forEach(bundle => {
      if (bundle.components.includes(tag)) {
        bundle.components.forEach(bundleTag => {
          if (bundleTag !== tag) {
            moduleFile.potentialCmpRefs.push({
              tag: bundleTag
            });
          }
        });
      }
    });

  });
}


function callExpression(moduleFile: d.ModuleFile, node: ts.CallExpression) {
  if (node.arguments && node.arguments[0]) {

    if (node.expression.kind === ts.SyntaxKind.Identifier) {
      // h('tag')
      callExpressionArg(moduleFile, node.expression as ts.Identifier, node.arguments);

    } else if (node.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
      // document.createElement('tag')
      if ((node.expression as ts.PropertyAccessExpression).name) {
        callExpressionArg(moduleFile, (node.expression as ts.PropertyAccessExpression).name as ts.Identifier, node.arguments);
      }
    }
  }
}


function callExpressionArg(moduleFile: d.ModuleFile, callExpressionName: ts.Identifier, args: ts.NodeArray<ts.Expression>) {

  if (TAG_CALL_EXPRESSIONS.includes(callExpressionName.escapedText as string)) {

    if (args[0].kind === ts.SyntaxKind.StringLiteral) {
      let tag = (args[0] as ts.StringLiteral).text;

      if (typeof tag === 'string') {
        tag = tag.toLowerCase();
        if (tag.includes('-')) {
          moduleFile.potentialCmpRefs.push({
            tag: tag
          });

        } else if (tag === 'slot') {
          moduleFile.hasSlot = true;

        } else if (tag === 'svg') {
          moduleFile.hasSvg = true;
        }
      }
    }
  }
}


function stringLiteral(moduleFile: d.ModuleFile, node: ts.StringLiteral) {
  if (typeof node.text === 'string' && node.text.includes('</')) {

    if (node.text.includes('-')) {
      moduleFile.potentialCmpRefs.push({
        html: node.text
      });
    }

    if (!moduleFile.hasSlot && node.text.includes('<slot')) {
      moduleFile.hasSlot = true;
    }

    if (!moduleFile.hasSvg && node.text.includes('<svg')) {
      moduleFile.hasSvg = true;
    }
  }
}


const TAG_CALL_EXPRESSIONS = [
  'h',
  'createElement',
  'createElementNS'
];
