import * as d from '../../declarations';
import { convertValueToLiteral, createStaticGetter } from './transform-utils';
import ts from 'typescript';


export const addComponentMetaStatic = (cmpNode: ts.ClassDeclaration, cmpMeta: d.ComponentCompilerMeta) => {
  const copyCmp = Object.assign({}, cmpMeta);

  // no need to copy all compiler meta data to the static getter
  delete copyCmp.assetsDirs;
  delete copyCmp.dependencies;
  delete copyCmp.excludeFromCollection;
  delete copyCmp.isCollectionDependency;
  delete copyCmp.docs;
  delete copyCmp.jsFilePath;
  delete copyCmp.potentialCmpRefs;
  delete copyCmp.styleDocs;
  delete copyCmp.sourceFilePath;

  const cmpMetaStaticProp = createStaticGetter('COMPILER_META', convertValueToLiteral(copyCmp));
  const classMembers = [...cmpNode.members, cmpMetaStaticProp];

  return ts.updateClassDeclaration(
    cmpNode,
    cmpNode.decorators,
    cmpNode.modifiers,
    cmpNode.name,
    cmpNode.typeParameters,
    cmpNode.heritageClauses,
    classMembers
  );
};
