import type { BuildCtx, CompilerCtx, LoadConfigInit, Module, UnvalidatedConfig, ValidatedConfig } from '@stencil/core/internal';
import { TestingLogger } from './testing-logger';
import { TestingSystem } from './testing-sys';
/**
 * Creates a mock instance of an internal, validated Stencil configuration object
 * the caller
 * @param overrides a partial implementation of `ValidatedConfig`. Any provided fields will override the defaults
 * provided by this function.
 * @returns the mock Stencil configuration
 */
export declare function mockValidatedConfig(overrides?: Partial<ValidatedConfig>): ValidatedConfig;
/**
 * Creates a mock instance of a Stencil configuration entity. The mocked configuration has no guarantees around the
 * types/validity of its data.
 * @param overrides a partial implementation of `UnvalidatedConfig`. Any provided fields will override the defaults
 * provided by this function.
 * @returns the mock Stencil configuration
 */
export declare function mockConfig(overrides?: Partial<UnvalidatedConfig>): UnvalidatedConfig;
/**
 * Creates a configuration object used to bootstrap a Stencil task invocation
 *
 * Several fields are intentionally undefined for this entity. While it would be trivial to stub them out, this mock
 * generation function operates under the assumption that entities like loggers and compiler system abstractions will
 * be shared by multiple entities in a test suite, who should provide those entities to this function
 *
 * @param overrides the properties on the default entity to manually override
 * @returns the default configuration initialization object, with any overrides applied
 */
export declare const mockLoadConfigInit: (overrides?: Partial<LoadConfigInit>) => LoadConfigInit;
export declare function mockCompilerCtx(config?: ValidatedConfig): CompilerCtx;
export declare function mockBuildCtx(config?: ValidatedConfig, compilerCtx?: CompilerCtx): BuildCtx;
export declare function mockLogger(): TestingLogger;
/**
 * Create a {@link CompilerSystem} entity for testing the compiler.
 *
 * This function acts as a thin wrapper around a {@link TestingSystem} entity creation. It exists to provide a logical
 * place in the codebase where we might expect Stencil engineers to reach for when attempting to mock a
 * {@link CompilerSystem} base type. Should there prove to be usage of both this function and the one it wraps,
 * reconsider if this wrapper is necessary.
 *
 * @returns a System instance for testing purposes.
 */
export declare function mockCompilerSystem(): TestingSystem;
export declare function mockDocument(html?: string | null): Document;
export declare function mockWindow(html?: string): Window;
/**
 * This gives you a mock Module, an interface which is the internal compiler
 * representation of a module. It includes a bunch of information necessary for
 * compilation, this mock basically sets sane defaults for all those values.
 *
 * @param mod is an override module that you can supply to set particular values
 * @returns a module object ready to use in tests!
 */
export declare const mockModule: (mod?: Partial<Module>) => Module;
