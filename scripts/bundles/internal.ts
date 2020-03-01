import fs from 'fs-extra';
import { BuildOptions } from '../utils/options';
import { cleanDts } from '../utils/bundle-dts';
import { internalAppData } from './interal-app-data';
import { internalClient } from './internal-platform-client';
import { internalHydrate } from './internal-platform-hydrate';
import { internalTesting } from './internal-platform-testing';
import { join } from 'path';
import { writePkgJson } from '../utils/write-pkg-json';


export async function internal(opts: BuildOptions) {
  const inputInternalDir = join(opts.transpiledDir, 'internal');

  await fs.emptyDir(opts.output.internalDir);

  await copyStencilInternalDts(opts, opts.output.internalDir);

  await createStencilCoreEntry(opts.output.internalDir);

  // copy @stencil/core/internal default entry, which defaults to client
  // but we're not exposing all of Stencil's internal code (only the types)
  await fs.copyFile(
    join(inputInternalDir, 'default.js'),
    join(opts.output.internalDir, 'index.mjs')
  );

  // write @stencil/core/internal/package.json
  writePkgJson(opts, opts.output.internalDir, {
    name: '@stencil/core/internal',
    description: 'Stencil internals only to be imported by the Stencil Compiler. Breaking changes can and will happen at any time.',
    main: 'index.mjs',
    types: 'index.d.ts'
  });

  const clientPlatformBundle = await internalClient(opts);
  const hydratePlatformBundles = await internalHydrate(opts);
  const testingPlatform = await internalTesting(opts);

  return [
    ...clientPlatformBundle,
    ...hydratePlatformBundles,
    ...testingPlatform,
    await internalAppData(opts),
  ];
};


async function copyStencilInternalDts(opts: BuildOptions, outputInternalDir: string) {
  const declarationsInputDir = join(opts.transpiledDir, 'declarations');

  // copy to @stencil/core/internal

  // @stencil/core/internal/index.d.ts
  const indexDtsSrcPath = join(declarationsInputDir, 'index.d.ts');
  const indexDtsDestPath = join(outputInternalDir, 'index.d.ts');
  let indexDts = cleanDts(await fs.readFile(indexDtsSrcPath, 'utf8'));
  indexDts = prependExtModules(indexDts);
  await fs.writeFile(indexDtsDestPath, indexDts);

  // @stencil/core/internal/stencil-private.d.ts
  const privateDtsSrcPath = join(declarationsInputDir, 'stencil-private.d.ts');
  const privateDtsDestPath = join(outputInternalDir, 'stencil-private.d.ts');
  const privateDts = cleanDts(await fs.readFile(privateDtsSrcPath, 'utf8'));
  await fs.writeFile(privateDtsDestPath, privateDts);

  // @stencil/core/internal/stencil-public.compiler.d.ts
  const compilerDtsSrcPath = join(declarationsInputDir, 'stencil-public-compiler.d.ts');
  const compilerDtsDestPath = join(outputInternalDir, 'stencil-public-compiler.d.ts');
  const compilerDts = cleanDts(await fs.readFile(compilerDtsSrcPath, 'utf8'));
  await fs.writeFile(compilerDtsDestPath, compilerDts);

  // @stencil/core/internal/stencil-public-docs.d.ts
  const docsDtsSrcPath = join(declarationsInputDir, 'stencil-public-docs.d.ts');
  const docsDtsDestPath = join(outputInternalDir, 'stencil-public-docs.d.ts');
  const docsDts = cleanDts(await fs.readFile(docsDtsSrcPath, 'utf8'));
  await fs.writeFile(docsDtsDestPath, docsDts);

  // @stencil/core/internal/stencil-public-runtime.d.ts
  const runtimeDtsSrcPath = join(declarationsInputDir, 'stencil-public-runtime.d.ts');
  const runtimeDtsDestPath = join(outputInternalDir, 'stencil-public-runtime.d.ts');
  const runtimeDts = cleanDts(await fs.readFile(runtimeDtsSrcPath, 'utf8'));
  await fs.writeFile(runtimeDtsDestPath, runtimeDts);

  // @stencil/core/internal/stencil-core.d.ts file
  // actual public dts when importing @stencil/core
  const stencilCoreDtsSrc = join(opts.transpiledDir, 'declarations', 'stencil-core.d.ts');
  const stencilCoreDtsDst = join(outputInternalDir, 'stencil-core.d.ts');
  await fs.copyFile(stencilCoreDtsSrc, stencilCoreDtsDst);

  // @stencil/core/internal/stencil-ext-modules.d.ts (.svg/.css)
  const srcExtModuleOutput = join(opts.srcDir, 'declarations', 'stencil-ext-modules.d.ts');
  const dstExtModuleOutput = join(outputInternalDir, 'stencil-ext-modules.d.ts');
  await fs.copyFile(srcExtModuleOutput, dstExtModuleOutput);
}

function prependExtModules(content: string) {
  return `/// <reference path="./stencil-ext-modules.d.ts" />\n` + content;
}

async function createStencilCoreEntry(outputInternalDir: string) {
  // write @stencil/core entry (really only used for node resolving, not its actual code as you can see)
  await fs.writeFile(
    join(outputInternalDir, 'stencil-core.js'),
    `exports.h = function() {};`
  );
}
