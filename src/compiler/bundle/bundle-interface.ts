import type { BuildConditionals } from '../../declarations';
import type { SourceFile, TransformerFactory } from 'typescript';
import type { PreserveEntrySignaturesOption } from 'rollup';

export interface BundleOptions {
  id: string;
  conditionals?: BuildConditionals;
  externalRuntime?: boolean;
  platform: 'client' | 'hydrate' | 'worker';
  customTransformers?: TransformerFactory<SourceFile>[];
  inputs: { [entryKey: string]: string };
  loader?: { [id: string]: string };
  inlineDynamicImports?: boolean;
  inlineWorkers?: boolean;
  preserveEntrySignatures?: PreserveEntrySignaturesOption,
}
