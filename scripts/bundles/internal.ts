import fs from 'fs-extra';
import { BuildOptions } from '../utils/options';
import { bundleDts } from '../utils/bundle-dts';
import { internalAppData } from './interal-app-data';
import { internalClient } from './internal-platform-client';
import { internalHydrate } from './internal-platform-hydrate';
import { internalTesting } from './internal-platform-testing';
import { internalRuntime } from './internal-runtime';
import { join } from 'path';
import { writePkgJson } from '../utils/write-pkg-json';


export async function internal(opts: BuildOptions) {
  const inputInternalDir = join(opts.transpiledDir, 'internal');

  await fs.emptyDir(opts.output.internalDir);

  await createStencilInternalDtsBundle(opts, inputInternalDir, opts.output.internalDir);

  await createStencilCoreEntry(opts, opts.output.internalDir);

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
    await internalRuntime(opts),
  ];
};


async function createStencilInternalDtsBundle(opts: BuildOptions, inputInternalDir: string, outputInternalDir: string) {
  // bundle @stencil/core/internal/index.d.ts
  const internalDtsEntry = join(inputInternalDir, 'index.d.ts');
  let internalDtsContent = await bundleDts(opts, internalDtsEntry);

  // copy extension module d.ts (.svg/.css) to bundled internal.d.ts
  const srcExtModuleOutput = join(opts.srcDir, 'declarations', 'ext-modules.d.ts');
  const dstExtModuleOutput = join(outputInternalDir, 'ext-modules.d.ts');
  await fs.copyFile(srcExtModuleOutput, dstExtModuleOutput);

  // add the ext-modules.d.ts reference to the bundled internal d.ts file
  internalDtsContent = `/// <reference path="./ext-modules.d.ts" />\n${internalDtsContent}`;

  // dts bundling puts an export on LocalJSX
  // but LocalJSX is the one type that should not actually get exported
  internalDtsContent = internalDtsContent.replace('export declare namespace LocalJSX', 'declare namespace LocalJSX');

  // write the bundled @stencil/core/internal/index.d.ts file
  const internalDstOutput = join(outputInternalDir, 'index.d.ts');
  await fs.writeFile(internalDstOutput, internalDtsContent);
}


async function createStencilCoreEntry(opts: BuildOptions, outputInternalDir: string) {
  // write @stencil/core entry (really only used for node resolving, not its actual code as you can see)
  await fs.writeFile(
    join(outputInternalDir, 'stencil.core.js'),
    `exports.h = function() {};`
  );

  // copy declarations/stencil-core.d.ts as the @stencil/core package public types
  await fs.copyFile(
    join(opts.transpiledDir, 'declarations', 'stencil-core.d.ts'),
    join(outputInternalDir, 'stencil.core.d.ts')
  );
}
