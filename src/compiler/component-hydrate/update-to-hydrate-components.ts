import * as d from '../../declarations';
import { COMPILER_BUILD } from '../build/compiler-build-id';
import { dashToPascalCase, sortBy, toTitleCase } from '@utils';
import { transformToHydrateComponentText } from '../transformers/component-hydrate/tranform-to-hydrate-component';


export async function updateToHydrateComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmps: d.ComponentCompilerMeta[]) {
  const hydrateCmps = await Promise.all(
    cmps.map(cmp => updateToHydrateComponent(config, compilerCtx, buildCtx, cmp))
  );
  return sortBy(hydrateCmps, c => c.cmp.componentClassName);
}


async function updateToHydrateComponent(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta) {
  const inputFilePath = cmp.jsFilePath;
  const inputFileDir = config.sys.path.dirname(inputFilePath);
  const inputFileName = config.sys.path.basename(inputFilePath);
  const inputJsText = await compilerCtx.fs.readFile(inputFilePath);

  const cacheKey = await compilerCtx.cache.createKey('hydrate', COMPILER_BUILD.id, COMPILER_BUILD.transpiler, inputJsText);
  const outputFileName = `${cacheKey}-${inputFileName}`;
  const outputFilePath = config.sys.path.join(inputFileDir, outputFileName);

  const cmpData: d.ComponentCompilerData = {
    filePath: outputFilePath,
    exportLine: ``,
    cmp: cmp,
    uniqueComponentClassName: ``,
    importLine: ``
  };

  const pascalCasedClassName = dashToPascalCase(toTitleCase(cmp.tagName));

  if (cmp.componentClassName !== pascalCasedClassName) {
    cmpData.uniqueComponentClassName = pascalCasedClassName;
    cmpData.importLine = `import { ${cmp.componentClassName} as ${cmpData.uniqueComponentClassName} } from '${cmpData.filePath}';`;
  } else {
    cmpData.uniqueComponentClassName = cmp.componentClassName;
    cmpData.importLine = `import { ${cmpData.uniqueComponentClassName} } from '${cmpData.filePath}';`;
  }

  let outputJsText = await compilerCtx.cache.get(cacheKey);
  if (outputJsText == null) {
    outputJsText = transformToHydrateComponentText(compilerCtx, buildCtx, cmp, inputJsText);

    await compilerCtx.cache.put(cacheKey, outputJsText);
  }

  await compilerCtx.fs.writeFile(outputFilePath, outputJsText, { inMemoryOnly: true });

  return cmpData;
}
