import * as d from '../../../declarations';
import { compilerBuild } from '../../../version';
import { dashToPascalCase, sortBy, toTitleCase } from '@utils';
import { transformToHydrateComponentText } from '../../../compiler/transformers/component-hydrate/tranform-to-hydrate-component';
import { basename, dirname, join } from 'path';


export const updateToHydrateComponents = async (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmps: d.ComponentCompilerMeta[]) => {
  const hydrateCmps = await Promise.all(
    cmps.map(cmp => updateToHydrateComponent(compilerCtx, buildCtx, cmp))
  );
  return sortBy(hydrateCmps, c => c.cmp.componentClassName);
};


const updateToHydrateComponent = async (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta) => {
  const moduleFile = compilerCtx.moduleMap.get(cmp.sourceFilePath);

  const inputFilePath = cmp.jsFilePath;
  const inputFileDir = dirname(inputFilePath);
  const inputFileName = basename(inputFilePath);
  const inputJsText = moduleFile.staticSourceFileText;

  const cacheKey = await compilerCtx.cache.createKey('hydrate', compilerBuild.buildId, compilerBuild.transpilerId, inputJsText);
  const outputFileName = `${cacheKey}-${inputFileName}`;
  const outputFilePath = join(inputFileDir, outputFileName);

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
};
