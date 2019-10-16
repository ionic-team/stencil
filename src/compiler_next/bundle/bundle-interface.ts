import { BuildConditionals, OutputTargetBaseNext } from '../../declarations';
import { BuilderProgram, SourceFile, TransformerFactory } from 'typescript';
import { OutputOptions } from 'rollup';


export interface BundleOptions {
  conditionals: BuildConditionals;
  platform: 'client' | 'hydrate';
  id: string;
  customTransformers: TransformerFactory<SourceFile>[];
  inputs: {[entryKey: string]: string};
  outputOptions: OutputOptions;
  outputTargets: OutputTargetBaseNext[];
  tsBuilder: BuilderProgram;
}
