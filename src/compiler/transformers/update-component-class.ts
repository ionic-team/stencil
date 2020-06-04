import * as d from '../../declarations';
import ts from 'typescript';

export const updateComponentClass = (
  transformOpts: d.TransformOptions,
  classNode: ts.ClassDeclaration,
  heritageClauses: ts.HeritageClause[] | ts.NodeArray<ts.HeritageClause>,
  members: ts.ClassElement[],
) => {
  let classModifiers = Array.isArray(classNode.modifiers) ? classNode.modifiers.slice() : [];

  if (transformOpts.module === 'cjs') {
    // CommonJS, leave component class as is

    if (transformOpts.componentExport === 'customelement') {
      // remove export from class
      classModifiers = classModifiers.filter(m => {
        return m.kind !== ts.SyntaxKind.ExportKeyword;
      });
    }
  }

  // ESM with export
  return ts.updateClassDeclaration(classNode, classNode.decorators, classModifiers, classNode.name, classNode.typeParameters, heritageClauses, members);
};
