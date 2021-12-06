import type * as d from '../../declarations';
import { convertValueToLiteral } from './transform-utils';
import { formatComponentRuntimeMeta } from '@utils';
import { PROXY_CUSTOM_ELEMENT, RUNTIME_APIS, addCoreRuntimeApi } from './core-runtime-apis';
import ts from 'typescript';

export const addModuleMetadataProxies = (tsSourceFile: ts.SourceFile, moduleFile: d.Module) => {
  const statements = tsSourceFile.statements.slice();

  addCoreRuntimeApi(moduleFile, RUNTIME_APIS.proxyCustomElement);

  statements.push(...moduleFile.cmps.map(addComponentMetadataProxy));

  return ts.updateSourceFileNode(tsSourceFile, statements);
};

const addComponentMetadataProxy = (compilerMeta: d.ComponentCompilerMeta) => {
  return ts.createStatement(createComponentMetadataProxy(compilerMeta));
};

export const createComponentMetadataProxy = (compilerMeta: d.ComponentCompilerMeta) => {
  const compactMeta: d.ComponentRuntimeMetaCompact = formatComponentRuntimeMeta(compilerMeta, true);

  const literalCmpClassName = ts.createIdentifier(compilerMeta.componentClassName);
  const literalMeta = convertValueToLiteral(compactMeta);

  return ts.createCall(ts.createIdentifier(PROXY_CUSTOM_ELEMENT), [], [literalCmpClassName, literalMeta]);
};
