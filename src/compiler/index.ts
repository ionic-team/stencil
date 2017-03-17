import { CompilerOptions, CompilerContext } from './interfaces';
import { compileComponents } from './compile-components';
import { buildLoaders } from './build-loaders';


export function compile(opts: CompilerOptions, ctx: CompilerContext = {}) {
  return compileComponents(opts, ctx).then(() => {
    return buildLoaders(opts, ctx);
  });
}
