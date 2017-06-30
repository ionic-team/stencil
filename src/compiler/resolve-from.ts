import { StencilSystem } from './interfaces';


export function resolveFrom(sys: StencilSystem, fromDir: string, moduleId: string, silent: boolean = false): string {
  if (typeof fromDir !== 'string') {
    throw new TypeError(`Expected \`fromDir\` to be of type \`string\`, got \`${typeof fromDir}\``);
  }

  if (typeof moduleId !== 'string') {
    throw new TypeError(`Expected \`moduleId\` to be of type \`string\`, got \`${typeof moduleId}\``);
  }

  fromDir = sys.path.resolve(fromDir);
  const fromFile = sys.path.join(fromDir, 'noop.js');

  const resolveFileName = () => sys.module._resolveFilename(moduleId, {
    id: fromFile,
    filename: fromFile,
    paths: sys.module._nodeModulePaths(fromDir)
  });

  if (silent) {
    try {
      return resolveFileName();
    } catch (err) {
      return null;
    }
  }

  return resolveFileName();
}
