import type { BuildConditionals } from '../../declarations';
import type { SourceFile, TransformerFactory } from 'typescript';
import type { PreserveEntrySignaturesOption } from 'rollup';

/**
 * Options for bundled output passed on Rollup
 *
 * This covers the ID for the bundle, the platform it runs on, input modules,
 * and more
 */
export interface BundleOptions {
  id: string;
  conditionals?: BuildConditionals;
  externalRuntime?: boolean;
  platform: 'client' | 'hydrate' | 'worker';
  customTransformers?: TransformerFactory<SourceFile>[];
  /**
   * This is equivalent to the Rollup `input` configuration option. It's
   * an object mapping names to entry points which tells Rollup to bundle
   * each thing up as a separate output chunk.
   *
   * @see {@link https://rollupjs.org/guide/en/#input}
   */
  inputs: { [entryKey: string]: string };
  /**
   * A map of strings which are passed to the Stencil-specific loader plugin
   * which we use to resolve the imports of Stencil project files when building
   * with Rollup.
   *
   * @see {@link loader-plugin:loaderPlugin}
   */
  loader?: { [id: string]: string };
  inlineDynamicImports?: boolean;
  inlineWorkers?: boolean;
  /**
   * Duplicate of Rollup's `preserveEntrySignatures` option.
   *
   * "Controls if Rollup tries to ensure that entry chunks have the same
   * exports as the underlying entry module."
   *
   * @see {@link https://rollupjs.org/guide/en/#preserveentrysignatures}
   */
  preserveEntrySignatures?: PreserveEntrySignaturesOption;
}
