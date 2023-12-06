import ts from 'typescript';
import type * as d from '../../declarations';
/**
 * This method is responsible for replacing user-defined import path aliases ({@link https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping})
 * with generated relative import paths during the transformation step of the TS compilation process.
 * This action is taken to prevent issues with import paths not being transpiled at build time resulting in
 * unknown imports in output code for some output targets (`dist-collection` for instance). Output targets that do not run through a bundler
 * are unable to resolve imports using the aliased path names and TS intentionally does not replace resolved paths as a part of
 * their compiler ({@link https://github.com/microsoft/TypeScript/issues/10866})
 *
 * @param config The Stencil configuration object.
 * @param destinationFilePath The location on disk the file will be written to.
 * @param outputTarget The configuration for the collection output target.
 * @returns A factory for creating a {@link ts.Transformer}.
 */
export declare const mapImportsToPathAliases: (config: d.ValidatedConfig, destinationFilePath: string, outputTarget: d.OutputTargetDistCollection) => ts.TransformerFactory<ts.SourceFile>;
