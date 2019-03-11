import * as d from '@declarations';
import { isOutputTargetDistCollection } from './output-utils';
import { COLLECTION_MANIFEST_FILE_NAME, flatOne, normalizePath } from '@utils';
import { generateTypesAndValidate } from '../types/generate-types';
import { getComponentAssetsCopyTasks } from '../copy/assets-copy-tasks';
import { performCopyTasks } from '../copy/copy-tasks';


export async function outputCollections(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDistCollection);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate collections started`, true);

  copyAssets(config, compilerCtx, buildCtx, outputTargets);

  await Promise.all([
    writeTypes(config, compilerCtx, buildCtx, outputTargets),
    writeJsFiles(config, compilerCtx, buildCtx, outputTargets),
    writeManifests(config, compilerCtx, buildCtx, outputTargets)
  ]);

  timespan.finish(`generate collections finished`);
}

function copyAssets(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistCollection[]) {
  const copyTasks = flatOne(outputTargets.map(o => ([
    ...getComponentAssetsCopyTasks(config, buildCtx, o.dir, false),
  ])));
  return performCopyTasks(config, compilerCtx, buildCtx, copyTasks);
}


function writeJsFiles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistCollection[]) {
  return Promise.all(
    buildCtx.moduleFiles
      .map(moduleFile => writeModuleFile(config, compilerCtx, moduleFile, outputTargets))
  );
}

async function writeModuleFile(config: d.Config, compilerCtx: d.CompilerCtx, moduleFile: d.Module, outputTargets: d.OutputTargetDistCollection[]) {
  const relPath = config.sys.path.relative(config.srcDir, moduleFile.jsFilePath);
  const jsContent = await compilerCtx.fs.readFile(moduleFile.jsFilePath);
  await Promise.all(
    outputTargets.map(o => {
      const outputFilePath = config.sys.path.join(o.collectionDir, relPath);
      return compilerCtx.fs.writeFile(outputFilePath, jsContent);
    })
  );
}

async function writeManifests(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistCollection[]) {
  const collectionData = JSON.stringify(serializeCollectionManifest(config, buildCtx.moduleFiles), null, 2);
  return Promise.all(
    outputTargets.map(o => writeManifest(config, compilerCtx, collectionData, o))
  );
}

// this maps the json data to our internal data structure
// apping is so that the internal data structure "could"
// change, but the external user data will always use the same api
// over the top lame mapping functions is basically so we can loosly
// couple core component meta data between specific versions of the compiler
async function writeManifest(config: d.Config, compilerCtx: d.CompilerCtx, collectionData: string, outputTarget: d.OutputTargetDistCollection) {
  // get the absolute path to the directory where the collection will be saved
  const collectionDir = normalizePath(outputTarget.collectionDir);

  // create an absolute file path to the actual collection json file
  const collectionFilePath = normalizePath(config.sys.path.join(collectionDir, COLLECTION_MANIFEST_FILE_NAME));

  // don't bother serializing/writing the collection if we're not creating a distribution
  await compilerCtx.fs.writeFile(collectionFilePath, collectionData);
}


export function serializeCollectionManifest(config: d.Config, moduleFiles: d.Module[]): d.CollectionManifest {
  // create the single collection we're going to fill up with data
  return {
    entries: moduleFiles.map(mod => config.sys.path.relative(config.srcDir, mod.jsFilePath)),
    compiler: {
      name: config.sys.compiler.name,
      version: config.sys.compiler.version,
      typescriptVersion: config.sys.compiler.typescriptVersion
    }
  };
}

export async function writeTypes(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistCollection[]) {

  const pkgData = await readPackageJson(config, compilerCtx);
  const timespan = buildCtx.createTimeSpan(`generate types started`, true);

  await Promise.all(outputTargets.map(outputsTarget => {
    return generateTypesAndValidate(config, compilerCtx, buildCtx, pkgData, outputsTarget);
  }));

  timespan.finish(`generate types finished`);
}


async function readPackageJson(config: d.Config, compilerCtx: d.CompilerCtx) {
  const pkgJsonPath = config.sys.path.join(config.rootDir, 'package.json');

  let pkgJson: string;
  try {
    pkgJson = await compilerCtx.fs.readFile(pkgJsonPath);

  } catch (e) {
    throw new Error(`Missing "package.json" file for distribution: ${pkgJsonPath}`);
  }

  let pkgData: d.PackageJsonData;
  try {
    pkgData = JSON.parse(pkgJson);

  } catch (e) {
    throw new Error(`Error parsing package.json: ${pkgJsonPath}, ${e}`);
  }

  return pkgData;
}
