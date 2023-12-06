import ts from 'typescript';
import type * as d from '../../declarations';
export declare const addModuleMetadataProxies: (tsSourceFile: ts.SourceFile, moduleFile: d.Module) => ts.SourceFile;
/**
 * Create a call expression for wrapping a component represented as a class
 * expression in a proxy. This call expression takes the form:
 *
 * ```ts
 * PROXY_CUSTOM_ELEMENT(Clazz, Metadata);
 * ```
 *
 * where
 * - `PROXY_CUSTOM_ELEMENT` is a Stencil internal identifier that will be
 *   replaced with the name of the actual function name at compile time
 * - `Clazz` is a class expression to be proxied
 * - `Metadata` is the compiler metadata associated with the Stencil component
 *
 * @param compilerMeta compiler metadata associated with the component to be
 * wrapped in a proxy
 * @param clazz the class expression to proxy
 * @returns the generated call expression
 */
export declare const createClassMetadataProxy: (compilerMeta: d.ComponentCompilerMeta, clazz: ts.ClassExpression) => ts.CallExpression;
