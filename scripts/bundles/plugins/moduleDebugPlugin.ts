import { Plugin } from 'rollup';

export function moduleDebugPlugin(): Plugin {

  return {
    name: 'aliasPlugin',
    transform(code, id) {
      const comment = `// MODULE: ${id}\n`;
      return comment + code;
    }
  }
}
