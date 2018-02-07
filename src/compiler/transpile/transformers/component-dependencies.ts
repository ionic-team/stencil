import { ComponentMeta, ModuleFiles } from '../../../declarations';
import { MEMBER_TYPE } from '../../../util/constants';
import * as ts from 'typescript';


export function componentDependencies(allModuleFiles: ModuleFiles): ts.TransformerFactory<ts.SourceFile> {

  const allComponentTags = Object.keys(allModuleFiles)
    .map(filePath => allModuleFiles[filePath].cmpMeta)
    .filter(cmpMeta => cmpMeta && cmpMeta.tagNameMeta)
    .map(cmpMeta => cmpMeta.tagNameMeta);

  return (transformContext) => {

    function visit(node: ts.Node, cmpMeta: ComponentMeta): ts.VisitResult<ts.Node> {
      if (node.kind === ts.SyntaxKind.CallExpression) {
        callExpression(allComponentTags, cmpMeta, node as ts.CallExpression);

      } else if (node.kind === ts.SyntaxKind.StringLiteral) {
        stringLiteral(allComponentTags, cmpMeta, node as ts.StringLiteral);
      }

      return ts.visitEachChild(node, (node) => {
        return visit(node, cmpMeta);
      }, transformContext);
    }

    return (tsSourceFile) => {
      const moduleFile = allModuleFiles[tsSourceFile.fileName];

      if (moduleFile && moduleFile.cmpMeta) {
        moduleFile.cmpMeta.dependencies = moduleFile.cmpMeta.dependencies || [];

        if (moduleFile.cmpMeta.membersMeta) {
          Object.keys(moduleFile.cmpMeta.membersMeta).forEach(memberName => {
            const memberMeta = moduleFile.cmpMeta.membersMeta[memberName];
            if (memberMeta.memberType === MEMBER_TYPE.PropConnect) {
              moduleFile.cmpMeta.dependencies.push(memberMeta.ctrlId);
            }
          });
        }

        return visit(tsSourceFile, moduleFile.cmpMeta) as ts.SourceFile;
      }
      return tsSourceFile;
    };
  };
}


function callExpression(allComponentTags: string[], cmpMeta: ComponentMeta, node: ts.CallExpression) {
  if (node && node.arguments) {

    if (node.expression.kind === ts.SyntaxKind.Identifier) {
      // h('tag')
      callExpressionArg(allComponentTags, cmpMeta, node.expression as ts.Identifier, node.arguments);

    } else if (node.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
      // document.createElement('tag')

      if ((node.expression as ts.PropertyAccessExpression).name) {
        // const
        callExpressionArg(allComponentTags, cmpMeta, (node.expression as ts.PropertyAccessExpression).name as ts.Identifier, node.arguments);
      }
    }
  }
}


function callExpressionArg(allComponentTags: string[], cmpMeta: ComponentMeta, callExpressionName: ts.Identifier, args: ts.NodeArray<ts.Expression>) {
  if (TAG_CALL_EXPRESSIONS.includes(callExpressionName.escapedText as string)) {

    if (args[0] && args[0].kind === ts.SyntaxKind.StringLiteral) {
      addDependency(allComponentTags, cmpMeta, (args[0] as ts.StringLiteral).text);
    }
  }
}


function stringLiteral(allComponentTags: string[], cmpMeta: ComponentMeta, node: ts.StringLiteral) {
  let t = node.text;

  if (typeof t === 'string' && t.includes('<')) {
    t = t.toLowerCase()
         .replace(/\s/g, '~');

    const foundTags = allComponentTags
      .filter(tag => {
        return t.includes('<' + tag + '>') ||
               t.includes('<' + tag + '~');
      });

    foundTags.forEach(foundTag => {
      addDependency(allComponentTags, cmpMeta, foundTag);
    });
  }
}


function addDependency(allComponentTags: string[], cmpMeta: ComponentMeta, tag: string) {
  if (typeof tag === 'string') {
    tag = tag.toLowerCase().trim();

    if (!cmpMeta.dependencies.includes(tag) && allComponentTags.includes(tag)) {
      cmpMeta.dependencies.push(tag);
    }
  }
}


const TAG_CALL_EXPRESSIONS = [
  'h',
  'createElement',
  'createElementNS'
];
