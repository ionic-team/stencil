import ts from 'typescript';

import type * as d from '../../declarations';

export const updateComponentClass = (
  transformOpts: d.TransformOptions,
  classNode: ts.ClassDeclaration,
  heritageClauses: ts.HeritageClause[] | ts.NodeArray<ts.HeritageClause>,
  members: ts.ClassElement[]
) => {
  let classModifiers = Array.isArray(classNode.modifiers) ? classNode.modifiers.slice() : [];

  if (transformOpts.module === 'cjs') {
    // CommonJS, leave component class as is

    if (transformOpts.componentExport === 'customelement') {
      // remove export from class
      classModifiers = classModifiers.filter((m) => {
        return m.kind !== ts.SyntaxKind.ExportKeyword;
      });
    }
    return ts.factory.updateClassDeclaration(
      classNode,
      classNode.decorators,
      classModifiers,
      classNode.name,
      classNode.typeParameters,
      heritageClauses,
      members
    );
  }

  // ESM with export
  return createConstClass(transformOpts, classNode, heritageClauses, members);
};

const createConstClass = (
  transformOpts: d.TransformOptions,
  classNode: ts.ClassDeclaration,
  heritageClauses: ts.HeritageClause[] | ts.NodeArray<ts.HeritageClause>,
  members: ts.ClassElement[]
) => {
  const className = classNode.name;

  const classModifiers = (Array.isArray(classNode.modifiers) ? classNode.modifiers : []).filter((m) => {
    // remove the export
    return m.kind !== ts.SyntaxKind.ExportKeyword;
  });

  const constModifiers: ts.Modifier[] = [];

  if (transformOpts.componentExport !== 'customelement') {
    constModifiers.push(ts.factory.createModifier(ts.SyntaxKind.ExportKeyword));
  }

  return ts.factory.createVariableStatement(
    constModifiers,
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          className,
          undefined,
          undefined,
          ts.factory.createClassExpression(
            undefined,
            classModifiers,
            undefined,
            classNode.typeParameters,
            heritageClauses,
            members
          )
        ),
      ],
      ts.NodeFlags.Const
    )
  );
};
