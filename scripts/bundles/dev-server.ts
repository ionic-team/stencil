import fs from 'fs-extra';
import { join } from 'path';
import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupResolve from '@rollup/plugin-node-resolve';
import { dataToEsm } from '@rollup/pluginutils';
import { aliasPlugin } from './plugins/alias-plugin';
import { relativePathPlugin } from './plugins/relative-path-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { writePkgJson } from '../utils/write-pkg-json';
import type { BuildOptions } from '../utils/options';
import type { RollupOptions, OutputChunk, Plugin } from 'rollup';
import { minify } from 'terser';
import ts from 'typescript';
import { getBanner } from '../utils/banner';
import { contentTypesPlugin } from './plugins/content-types-plugin';

export async function devServer(opts: BuildOptions) {
  const inputDir = join(opts.buildDir, 'dev-server');

  // create public d.ts
  let dts = await fs.readFile(join(inputDir, 'index.d.ts'), 'utf8');
  dts = dts.replace('../declarations', '../internal/index');
  await fs.writeFile(join(opts.output.devServerDir, 'index.d.ts'), dts);

  // write package.json
  writePkgJson(opts, opts.output.devServerDir, {
    name: '@stencil/core/dev-server',
    description: 'Stencil Development Server which communicates with the Stencil Compiler.',
    main: 'index.js',
    types: 'index.d.ts',
  });

  // copy static files
  await fs.copy(join(opts.srcDir, 'dev-server', 'static'), join(opts.output.devServerDir, 'static'));

  // copy server-worker-thread.js
  await fs.copy(
    join(opts.srcDir, 'dev-server', 'server-worker-thread.js'),
    join(opts.output.devServerDir, 'server-worker-thread.js')
  );

  // copy template files
  await fs.copy(join(opts.srcDir, 'dev-server', 'templates'), join(opts.output.devServerDir, 'templates'));

  const external = [
    'assert',
    'buffer',
    'child_process',
    'crypto',
    'events',
    'fs',
    'http',
    'https',
    'net',
    'os',
    'path',
    'stream',
    'url',
    'util',
    'zlib',
  ];

  const plugins = [
    contentTypesPlugin(opts),
    {
      name: 'devServerWorkerResolverPlugin',
      resolveId(importee) {
        if (importee.includes('open-in-editor-api')) {
          return {
            id: './open-in-editor-api.js',
            external: true,
          };
        }
        return null;
      },
    },
    relativePathPlugin('@sys-api-node', '../sys/node/index.js'),
    relativePathPlugin('glob', '../sys/node/glob.js'),
    relativePathPlugin('graceful-fs', '../sys/node/graceful-fs.js'),
    relativePathPlugin('ws', './ws.js'),
    relativePathPlugin('../sys/node/node-sys.js', '../sys/node/node-sys.js'),
    aliasPlugin(opts),
    rollupResolve({
      preferBuiltins: true,
    }),
    rollupCommonjs(),
    replacePlugin(opts),
  ];

  const devServerIndexBundle: RollupOptions = {
    input: join(inputDir, 'index.js'),
    output: {
      format: 'cjs',
      file: join(opts.output.devServerDir, 'index.js'),
      hoistTransitiveImports: false,
      esModule: false,
      preferConst: true,
      banner: getBanner(opts, `Stencil Dev Server`, true),
    },
    external,
    plugins,
    treeshake: {
      moduleSideEffects: false,
    },
  };

  const devServerProcessBundle: RollupOptions = {
    input: join(inputDir, 'server-process.js'),
    output: {
      format: 'cjs',
      file: join(opts.output.devServerDir, 'server-process.js'),
      hoistTransitiveImports: false,
      esModule: false,
      preferConst: true,
      banner: getBanner(opts, `Stencil Dev Server Process`, true),
    },
    external,
    plugins,
    treeshake: {
      moduleSideEffects: false,
    },
  };

  function appErrorCssPlugin(): Plugin {
    return {
      name: 'appErrorCss',
      resolveId(id) {
        if (id.endsWith('app-error.css')) {
          return join(opts.srcDir, 'dev-server', 'client', 'app-error.css');
        }
        return null;
      },
      transform(code, id) {
        if (id.endsWith('.css')) {
          code = code.replace(/\n/g, ' ').trim();
          while (code.includes('  ')) {
            code = code.replace(/  /g, ' ');
          }
          return dataToEsm(code, { preferConst: true });
        }
        return null;
      },
    };
  }

  const connectorName = 'connector.html';
  const connectorBundle: RollupOptions = {
    input: join(inputDir, 'dev-server-client', 'index.js'),
    output: {
      format: 'cjs',
      file: join(opts.output.devServerDir, connectorName),
      strict: false,
      preferConst: true,
    },
    plugins: [
      {
        name: 'connectorPlugin',
        resolveId(id) {
          if (id === '@stencil/core/dev-server/client') {
            return join(inputDir, 'client', 'index.js');
          }
        },
      },
      appErrorCssPlugin(),
      {
        name: 'clientConnectorPlugin',
        async generateBundle(_options, bundle) {
          if (bundle[connectorName]) {
            let code = (bundle[connectorName] as OutputChunk).code;

            const tsResults = ts.transpileModule(code, {
              compilerOptions: {
                target: ts.ScriptTarget.ES5,
              },
            });

            if (tsResults.diagnostics.length > 0) {
              throw new Error(tsResults.diagnostics as any);
            }

            code = tsResults.outputText;

            code = intro + code + outro;

            if (opts.isProd) {
              const minifyResults = await minify(code, {
                compress: { hoist_vars: true, hoist_funs: true, ecma: 5 },
                format: { ecma: 5 },
              });
              code = minifyResults.code;
            }

            code = banner + code + footer;

            code = code.replace(/__VERSION:STENCIL__/g, opts.version);

            (bundle[connectorName] as OutputChunk).code = code;
          }
        },
      },
      replacePlugin(opts),
      rollupResolve(),
    ],
  };

  await fs.ensureDir(join(opts.output.devServerDir, 'client'));

  // copy dev server client dts files
  await fs.copy(join(opts.buildDir, 'dev-server', 'client'), join(opts.output.devServerDir, 'client'), {
    filter: (src) => {
      if (src.endsWith('.d.ts')) {
        return true;
      }
      const stats = fs.statSync(src);
      if (stats.isDirectory()) {
        return true;
      }
      return false;
    },
  });

  // write package.json
  writePkgJson(opts, join(opts.output.devServerDir, 'client'), {
    name: '@stencil/core/dev-server/client',
    description: 'Stencil Dev Server Client.',
    main: 'index.js',
    types: 'index.d.ts',
  });

  const devServerClientBundle: RollupOptions = {
    input: join(opts.buildDir, 'dev-server', 'client', 'index.js'),
    output: {
      format: 'esm',
      file: join(opts.output.devServerDir, 'client', 'index.js'),
      banner: getBanner(opts, `Stencil Dev Server Client`, true),
    },
    plugins: [appErrorCssPlugin(), replacePlugin(opts), rollupResolve()],
  };

  return [devServerIndexBundle, devServerProcessBundle, connectorBundle, devServerClientBundle];
}

const banner = `<!doctype html><html><head><meta charset="utf-8"><title>Stencil Dev Server Connector __VERSION:STENCIL__ &#9889</title><style>body{background:black;color:white;font:18px monospace;text-align:center}</style></head><body>

Stencil Dev Server Connector __VERSION:STENCIL__ &#9889;

<script>`;

const intro = `(function(iframeWindow, appWindow, config, exports) {
"use strict";
`;

const outro = `
})(window, window.parent, window.__DEV_CLIENT_CONFIG__, {});
`;

const footer = `\n</script></body></html>`;
