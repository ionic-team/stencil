import * as d from '../../declarations';


export async function writeLazyEntryModule(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetBuild, derivedModule: d.DerivedModule, bundleId: string, jsText: string) {
  let fileName = bundleId;
  if (derivedModule.sourceTarget === 'es5') {
    fileName += `.es5`;
  }
  fileName += `.entry.js`;

  const filePath = config.sys.path.join(outputTarget.buildDir, fileName);

  await compilerCtx.fs.writeFile(filePath, jsText);
}


export async function writeLazyChunkModule(_config: d.Config, _compilerCtx: d.CompilerCtx, chunk: d.DerivedChunk) {
  console.log('write chunk', chunk.entryKey, chunk.filename, chunk.code);
  // if (derivedModule.isBrowser) {
  //   const fileName = `${chunk.entryKey}${derivedModule.sourceTarget === 'es5' ? '.es5' : ''}.js`;
  //   const jsText = replaceBundleIdPlaceholder(chunk.code, chunk.filename);
  //   await writeBrowserJSFile(config, compilerCtx, fileName, jsText);

  // } else {
  //   await writeEsmJSFile(config, compilerCtx, derivedModule.sourceTarget, chunk.filename, chunk.code);
  // }
}


// async function writeBrowserJSFile(config: d.Config, compilerCtx: d.CompilerCtx, fileName: string, jsText: string) {
//   const outputTargets = config.outputTargets.filter(outputTarget => outputTarget.appBuild) as d.OutputTargetBuild[];

//   await Promise.all(outputTargets.map(async outputTarget => {
//     // get the absolute path to where it'll be saved in www
//     const buildPath = pathJoin(config, getAppBuildDir(config, outputTarget), fileName);

//     // write to the build dir
//     await compilerCtx.fs.writeFile(buildPath, jsText);
//   }));
// }


// async function writeEsmJSFile(config: d.Config, compilerCtx: d.CompilerCtx, sourceTarget: d.SourceTarget, fileName: string, jsText: string) {
//   const outputTargets = config.outputTargets.filter(outputTarget => outputTarget.type === 'dist') as d.OutputTargetDist[];

//   const promises = outputTargets.map(async outputTarget => {
//     // get the absolute path to where it'll be saved in www
//     const buildPath = pathJoin(config, getDistEsmComponentsDir(config, outputTarget, sourceTarget), fileName);

//     // write to the build dir
//     await compilerCtx.fs.writeFile(buildPath, jsText);
//   });

//   await Promise.all(promises);
// }
