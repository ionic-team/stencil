import type * as d from '../../declarations';
import { normalizePath } from '@utils';
import ts from 'typescript';

export const getModule = (compilerCtx: d.CompilerCtx, filePath: string) => compilerCtx.moduleMap.get(normalizePath(filePath));

export const createModule = (
  staticSourceFile: ts.SourceFile, // this is NOT the original
  staticSourceFileText: string,
  emitFilepath: string,
): d.Module => ({
  sourceFilePath: normalizePath(staticSourceFile.fileName),
  jsFilePath: emitFilepath,
  staticSourceFile,
  staticSourceFileText,
  cmps: [],
  coreRuntimeApis: [],
  collectionName: null,
  dtsFilePath: null,
  excludeFromCollection: false,
  externalImports: [],
  hasVdomAttribute: false,
  hasVdomClass: false,
  hasVdomFunctional: false,
  hasVdomKey: false,
  hasVdomListener: false,
  hasVdomPropOrAttr: false,
  hasVdomRef: false,
  hasVdomRender: false,
  hasVdomStyle: false,
  hasVdomText: false,
  hasVdomXlink: false,
  htmlAttrNames: [],
  htmlParts: [],
  htmlTagNames: [],
  isCollectionDependency: false,
  isLegacy: false,
  localImports: [],
  originalCollectionComponentPath: null,
  originalImports: [],
  potentialCmpRefs: [],
});
