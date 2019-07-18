import * as d from '../../declarations';
import ts from 'typescript';


export const addMetadataProxy = (tsSourceFile: ts.SourceFile, moduleFile: d.Module) => {
  const statements = tsSourceFile.statements.slice();

  moduleFile.cmps.forEach(cmpMeta => {
    console.log(cmpMeta);
  });

  return ts.updateSourceFileNode(tsSourceFile, statements);
};
