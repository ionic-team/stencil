import { BuildConditionals } from '../../declarations';
import { SourceFile, TransformerFactory } from 'typescript';

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
}
