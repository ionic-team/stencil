import * as d from '@declarations';
import { buildError } from '@utils';


export default function rollupPluginHelper(config: d.Config, compilerCtx: d.CompilerCtx, builtCtx: d.BuildCtx) {
  return {
    name: 'pluginHelper',

    async resolveId(importee: string, importer: string): Promise<string> {
      if (importee) {
        if (/\0/.test(importee)) {
          // ignore IDs with null character, these belong to other plugins
          return null;
        }
        if (importee.slice(-1) === '/') {
          importee === importee.slice(0, -1);
        }

        if (builtIns.has(importee) || globals.has(importee)) {
          let fromMsg = '';
          if (importer) {
            if (importer.endsWith('.js')) {
              const tsxFile = importer.substr(0, importer.length - 2) + 'tsx';
              const tsxFileExists = await compilerCtx.fs.access(tsxFile);
              if (tsxFileExists) {
                importer = tsxFile;

              } else {
                const tsFile = importer.substr(0, importer.length - 2) + 'ts';
                const tsFileExists = await compilerCtx.fs.access(tsFile);
                if (tsFileExists) {
                  importer = tsFile;
                }
              }
            }

            fromMsg = ` from ${config.sys.path.relative(config.rootDir, importer)}`;
          }

          const diagnostic = buildError(builtCtx.diagnostics);
          diagnostic.header = `Bundling Node Builtin${globals.has(importee) ? ` and Global` : ``}`;
          diagnostic.messageText = `For the import "${importee}" to be bundled${fromMsg}, ensure the "rollup-plugin-node-builtins" plugin${globals.has(importee) ? ` and "rollup-plugin-node-globals" plugin` : ``} is installed and added to the stencil config plugins. Please see the bundling docs for more information.`;
        }
      }

      return null;
    }
  };

}

const builtIns = new Set([
  'child_process',
  'cluster',
  'dgram',
  'dns',
  'module',
  'net',
  'readline',
  'repl',
  'tls',

  'assert',
  'console',
  'constants',
  'domain',
  'events',
  'path',
  'punycode',
  'querystring',
  '_stream_duplex',
  '_stream_passthrough',
  '_stream_readable',
  '_stream_writable',
  '_stream_transform',
  'string_decoder',
  'sys',
  'tty',

  'crypto',
  'fs',
]);

const globals = new Set([
  'assert',
  'Buffer',
  'buffer',
  'global',
  'http',
  'https',
  'os',
  'process',
  'stream',
  'timers',
  'url',
  'util',
  'vm',
  'zlib'
]);
