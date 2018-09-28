import * as d from '../../../declarations';
import { buildError } from '../../util';


export default function rollupPluginHelper(config: d.Config, compilerCtx: d.CompilerCtx, builtCtx: d.BuildCtx) {
  return {
    name: 'pluginHelper',

    async resolveId(importee: string, importer: string): Promise<string> {
      if (importee) {
        if (importee.slice(-1) === '/') {
          importee === importee.slice(0, -1);
        }

        if (builtIns.has(importee)) {
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
          diagnostic.header = `Bundling Node Builtins`;
          diagnostic.messageText = `For the node builtin import "${importee}" to be bundled${fromMsg}, ensure the "rollup-plugin-node-builtins" plugin is installed and added to the stencil config plugins. Please see the bundling docs for more information.`;
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
  'http',
  'https',
  'os',
  'path',
  'punycode',
  'querystring',
  'stream',
  '_stream_duplex',
  '_stream_passthrough',
  '_stream_readable',
  '_stream_writable',
  '_stream_transform',
  'string_decoder',
  'sys',
  'timers',
  'tty',
  'url',
  'util',
  'vm',
  'zlib',

  'buffer',
  'crypto',
  'fs',
  'process',
]);
