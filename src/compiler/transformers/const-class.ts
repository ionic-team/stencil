import * as d from '../../declarations';
import ts from 'typescript';


export const createConstClass = (transformOpts: d.TransformOptions, classNode: ts.ClassDeclaration, heritageClauses: ts.HeritageClause[] | ts.NodeArray<ts.HeritageClause>, members: ts.ClassElement[]) => {
  const className = classNode.name;

  const classModifiers = (Array.isArray(classNode.modifiers) ? classNode.modifiers : []).filter(m => {
    // remove the export
    return m.kind !== ts.SyntaxKind.ExportKeyword;
  });

  const constModifiers: ts.Modifier[] = [];

  if (transformOpts.componentExport !== 'customelement') {
    constModifiers.push(ts.createModifier(ts.SyntaxKind.ExportKeyword));
  }

  return ts.createVariableStatement(
    constModifiers,
    ts.createVariableDeclarationList(
      [
        ts.createVariableDeclaration(
          className,
          undefined,
          ts.createClassExpression(
            classModifiers,
            undefined,
            classNode.typeParameters,
            heritageClauses,
            members
          )
        )
      ],
      ts.NodeFlags.Const
    )
  );
};
