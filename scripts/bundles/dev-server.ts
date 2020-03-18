import fs from 'fs-extra';
import { join } from 'path';
import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupResolve from '@rollup/plugin-node-resolve';
import { aliasPlugin } from './plugins/alias-plugin';
import { gracefulFsPlugin } from './plugins/graceful-fs-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { writePkgJson } from '../utils/write-pkg-json';
import { BuildOptions } from '../utils/options';
import { RollupOptions, OutputChunk } from 'rollup';
import terser from 'terser';
import ts from 'typescript';

export async function devServer(opts: BuildOptions) {
  const inputDir = join(opts.transpiledDir, 'dev-server');

  // create public d.ts
  let dts = await fs.readFile(join(inputDir, 'public.d.ts'), 'utf8');
  dts = dts.replace('@stencil/core/internal', '../internal/index');
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

  // copy template files
  await fs.copy(join(opts.srcDir, 'dev-server', 'templates'), join(opts.output.devServerDir, 'templates'));

  // create content-type-db.json
  await createContentTypeData(opts);

  const devServerBundle: RollupOptions = {
    input: join(inputDir, 'index.js'),
    output: {
      format: 'cjs',
      file: join(opts.output.devServerDir, 'index.js'),
      esModule: false,
      preferConst: true,
    },
    external: ['assert', 'child_process', 'fs', 'os', 'path', 'util'],
    plugins: [
      gracefulFsPlugin(),
      aliasPlugin(opts),
      rollupResolve({
        preferBuiltins: true,
      }),
      rollupCommonjs(),
    ],
  };

  const devServerWorkerBundle: RollupOptions = {
    input: join(inputDir, 'server-worker.js'),
    output: {
      format: 'cjs',
      file: join(opts.output.devServerDir, 'server-worker.js'),
      esModule: false,
      preferConst: true,
    },
    external: ['assert', 'buffer', 'child_process', 'crypto', 'events', 'fs', 'http', 'https', 'net', 'os', 'path', 'querystring', 'stream', 'url', 'util', 'zlib'],
    plugins: [
      {
        name: 'devServerWorkerResolverPlugin',
        resolveId(importee) {
          if (importee.includes('open-in-editor-api')) {
            return {
              id: './open-in-editor-api.js',
              external: true,
            };
          }
          if (importee === 'ws') {
            return {
              id: './ws.js',
              external: true,
            };
          }
          return null;
        },
      },
      gracefulFsPlugin(),
      aliasPlugin(opts),
      rollupResolve({
        preferBuiltins: true,
      }),
      rollupCommonjs(),
      replacePlugin(opts),
    ],
  };

  const inputClientDir = join(inputDir, 'dev-client');

  const connectorName = 'connector.html';
  const devServerClientBundle: RollupOptions = {
    input: join(inputClientDir, 'index.js'),
    output: {
      format: 'cjs',
      file: join(opts.output.devServerDir, connectorName),
      strict: false,
      preferConst: true,
    },
    plugins: [
      {
        name: 'clientConnectorPlugin',
        generateBundle(_options, bundle) {
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
              const minifyResults = terser.minify(code);
              if (minifyResults.error) {
                throw minifyResults.error;
              }
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

  await fs.ensureDir(join(opts.output.devServerDir, 'hmr-client'));

  // copy hmr-client dts files
  await fs.copy(join(opts.transpiledDir, 'dev-server', 'hmr-client', 'index.d.ts'), join(opts.output.devServerDir, 'hmr-client', 'index.d.ts'));

  // write package.json
  writePkgJson(opts, join(opts.output.devServerDir, 'hmr-client'), {
    name: '@stencil/core/dev-server/hmr-client',
    description: 'Stencil HMR Client.',
    main: 'index.mjs',
    types: 'index.d.ts',
  });

  const hmrClientBundle: RollupOptions = {
    input: join(opts.transpiledDir, 'dev-server', 'hmr-client', 'index.js'),
    output: {
      format: 'esm',
      file: join(opts.output.devServerDir, 'hmr-client', 'index.mjs'),
    },
    plugins: [replacePlugin(opts), rollupResolve()],
  };

  return [devServerBundle, devServerWorkerBundle, devServerClientBundle, hmrClientBundle];
}

async function createContentTypeData(opts: BuildOptions) {
  // create a focused content-type lookup object from
  // the mime db json file
  const mimeDbSrcPath = join(opts.nodeModulesDir, 'mime-db', 'db.json');
  const mimeDbJson = await fs.readJson(mimeDbSrcPath);

  const contentTypeDestPath = join(opts.output.devServerDir, 'content-type-db.json');

  const exts = {};

  Object.keys(mimeDbJson).forEach(mimeType => {
    const mimeTypeData = mimeDbJson[mimeType];
    if (Array.isArray(mimeTypeData.extensions)) {
      mimeTypeData.extensions.forEach(ext => {
        exts[ext] = mimeType;
      });
    }
  });

  await fs.writeJson(contentTypeDestPath, exts);
}

const banner = `<!doctype html><html><head><meta charset="utf-8">
<title>Stencil Dev Server Connector __VERSION:STENCIL__ &#9889;</title></head>
<body style="background:black;color:white;font:18px monospace;text-align:center;">
Stencil Dev Server Connector __VERSION:STENCIL__ &#9889;
<script>`;

const intro = `(function(iframeWindow, appWindow, appDoc, config, exports) {
  "use strict";
`;

const outro = `
})(window, window.parent, window.parent.document, window.__DEV_CLIENT_CONFIG__, {});
`;

const footer = `\n</script></body></html>`;
