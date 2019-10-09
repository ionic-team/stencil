import { BuildConditionals, OutputTargetBaseNext } from '../../declarations';
import { BuilderProgram, CustomTransformers } from 'typescript';
import { OutputOptions } from 'rollup';


export interface BundleOptions {
  conditionals: BuildConditionals;
  platform: 'client' | 'hydrate';
  id: string;
  customTransformers: CustomTransformers;
  inputs: {[entryKey: string]: string};
  outputOptions: OutputOptions;
  outputTargets: OutputTargetBaseNext[];
  tsBuilder: BuilderProgram;
}
