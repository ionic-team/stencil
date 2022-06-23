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

/**
 * Create a call expression for wrapping a component in a proxy. This call expression takes a form:
 * ```ts
 * PROXY_CUSTOM_ELEMENT(ComponentClassName, Metadata);
 * ```
 * where
 * - `PROXY_CUSTOM_ELEMENT` is a Stencil internal identifier that will be replaced with the name of the actual function
 * name at compile name
 * - `ComponentClassName` is the name Stencil component's class
 * - `Metadata` is the compiler metadata associated with the Stencil component
 *
 * @param compilerMeta compiler metadata associated with the component to be wrapped in a proxy
 * @returns the generated call expression
 */
export const createComponentMetadataProxy = (compilerMeta: d.ComponentCompilerMeta): ts.CallExpression => {
  const compactMeta: d.ComponentRuntimeMetaCompact = formatComponentRuntimeMeta(compilerMeta, true);

  const literalCmpClassName = ts.factory.createIdentifier(compilerMeta.componentClassName);
  const literalMeta = convertValueToLiteral(compactMeta);

  return ts.factory.createCallExpression(
    ts.factory.createIdentifier(PROXY_CUSTOM_ELEMENT),
    [],
    [literalCmpClassName, literalMeta]
  );
};

/**
 * Create a call expression for wrapping a component represented as an anonymous class in a proxy. This call expression
 * takes a form:
 * ```ts
 * PROXY_CUSTOM_ELEMENT(Clazz, Metadata);
 * ```
 * where
 * - `PROXY_CUSTOM_ELEMENT` is a Stencil internal identifier that will be replaced with the name of the actual function
 * name at compile name
 * - `Clazz` is an anonymous class to be proxied
 * - `Metadata` is the compiler metadata associated with the Stencil component
 *
 * @param compilerMeta compiler metadata associated with the component to be wrapped in a proxy
 * @param clazz the anonymous class to proxy
 * @returns the generated call expression
 */
export const createAnonymousClassMetadataProxy = (
  compilerMeta: d.ComponentCompilerMeta,
  clazz: ts.Expression
): ts.CallExpression => {
  const compactMeta: d.ComponentRuntimeMetaCompact = formatComponentRuntimeMeta(compilerMeta, true);
  const literalMeta = convertValueToLiteral(compactMeta);

  return ts.factory.createCallExpression(ts.factory.createIdentifier(PROXY_CUSTOM_ELEMENT), [], [clazz, literalMeta]);
};
