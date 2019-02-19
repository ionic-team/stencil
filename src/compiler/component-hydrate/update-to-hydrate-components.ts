import * as d from '@declarations';
import { COMPILER_BUILD } from '../build/compiler-build-id';
import { sortBy } from '@utils';
import { sys } from '@sys';
import { transformToHydrateComponentText } from '../transformers/component-hydrate/tranform-to-hydrate-component';


export async function updateToHydrateComponents(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmps: d.ComponentCompilerMeta[]) {
  const hydrateCmps = await Promise.all(
    cmps.map(cmp => updateToHydrateComponent(compilerCtx, buildCtx, build, cmp))
  );
  return sortBy(hydrateCmps, c => c.cmp.componentClassName);
}


async function updateToHydrateComponent(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmp: d.ComponentCompilerMeta) {
  const inputFilePath = cmp.jsFilePath;
  const inputFileDir = sys.path.dirname(inputFilePath);
  const inputFileName = sys.path.basename(inputFilePath);
  const inputJsText = await compilerCtx.fs.readFile(inputFilePath);

  const cacheKey = compilerCtx.cache.createKey('hydrate', COMPILER_BUILD.id, COMPILER_BUILD.transpiler, inputJsText);
  const outputFileName = `${cacheKey}-${inputFileName}`;
  const outputFilePath = sys.path.join(inputFileDir, outputFileName);

  const cmpData: d.ComponentCompilerData = {
    filePath: outputFilePath,
    exportLine: ``,
    cmp: cmp
  };

  let outputJsText = await compilerCtx.cache.get(cacheKey);
  if (outputJsText == null) {
    outputJsText = transformToHydrateComponentText(compilerCtx, buildCtx, build, cmp, inputJsText);

    await compilerCtx.cache.put(cacheKey, outputJsText);
  }

  await compilerCtx.fs.writeFile(outputFilePath, outputJsText, { inMemoryOnly: true });

  return cmpData;
}
