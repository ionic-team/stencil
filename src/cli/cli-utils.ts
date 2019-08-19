import * as d from '../declarations';
import { parse as getEditorConfig } from 'editorconfig';
import { normalizePath } from '@utils';


export function getConfigFilePath(process: NodeJS.Process, sys: d.StencilSystem, configArg: string) {
  if (configArg) {
    if (!sys.path.isAbsolute(configArg)) {
      // passed in a custom stencil config location
      // but it's relative, so prefix the cwd
      return normalizePath(sys.path.join(process.cwd(), configArg));
    }

    // config path already an absolute path, we're good here
    return normalizePath(configArg);
  }

  // nothing was passed in, use the current working directory
  return normalizePath(process.cwd());
}

/**
 * Get the desired indentation as a string with respect to `.editorconfig`. Defaults to two spaces.
 */
export async function getIndentation(filePath: string) {
  const config = await getEditorConfig(filePath);

  if (config.indent_style === 'tab') {
    return '\t';
  }

  const indentSize = typeof config.indent_size === 'number' ? config.indent_size : 2;

  return ' '.repeat(indentSize);
}
