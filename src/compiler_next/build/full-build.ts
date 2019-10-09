import * as d from '../../declarations';
import { build } from './build';
import { BuildContext } from '../../compiler/build/build-ctx';
import ts from 'typescript';


export const createFullBuild = async (config: d.Config, compilerCtx: d.CompilerCtx) => {
  const tsBuilder: ts.BuilderProgram = null;

  const buildCtx = new BuildContext(config, compilerCtx);
  buildCtx.start();

  return build(config, compilerCtx, buildCtx, tsBuilder);
};
