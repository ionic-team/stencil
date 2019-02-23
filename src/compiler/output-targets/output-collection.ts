import * as d from '@declarations';
import { sys } from '@sys';
import { isOutputTargetDistCollection } from './output-utils';
import { COLLECTION_MANIFEST_FILE_NAME, normalizePath } from '@utils';
import { generateTypesAndValidate } from '../types/generate-types';
export async function outputCollections(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDistCollection);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate collections started`, true);

  await Promise.all([
      writeCollectionManifests(config, compilerCtx, buildCtx, outputTargets),
      writeCollectionModules(config, compilerCtx, buildCtx, outputTargets),
      writeTypes(config, compilerCtx, buildCtx, outputTargets)
  ]);

  timespan.finish(`generate collections finished`);
}


function writeCollectionModules(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistCollection[]) {
  return buildCtx.moduleFiles.map(moduleFile =>
    writeCollectionModule(config, compilerCtx, moduleFile, outputTargets)
  );
}

async function writeCollectionModule(config: d.Config, compilerCtx: d.CompilerCtx, moduleFile: d.Module, outputTargets: d.OutputTargetDistCollection[]) {
  const relPath = sys.path.relative(config.srcDir, moduleFile.jsFilePath);
  const content = await compilerCtx.fs.readFile(moduleFile.jsFilePath);

  return Promise.all(outputTargets.map(outputTarget => {
    const outputFilePath = sys.path.join(outputTarget.dir, relPath);
    return compilerCtx.fs.writeFile(outputFilePath, content);
  }));
}


export async function writeCollectionManifests(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistCollection[]) {
  await Promise.all(outputTargets.map(async outputTarget => {
    await writeManifest(config, compilerCtx, buildCtx, outputTarget);
  }));
}

// this maps the json data to our internal data structure
// apping is so that the internal data structure "could"
// change, but the external user data will always use the same api
// over the top lame mapping functions is basically so we can loosly
// couple core component meta data between specific versions of the compiler
async function writeManifest(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistCollection) {
  // get the absolute path to the directory where the collection will be saved
  const collectionDir = normalizePath(outputTarget.dir);

  // create an absolute file path to the actual collection json file
  const collectionFilePath = normalizePath(sys.path.join(collectionDir, COLLECTION_MANIFEST_FILE_NAME));

  // serialize the collection into a json string and
  // add it to the list of files we need to write when we're ready
  const collectionData = serializeCollectionManifest(config, compilerCtx, collectionDir, buildCtx.moduleFiles, buildCtx.global);

  // don't bother serializing/writing the collection if we're not creating a distribution
  await compilerCtx.fs.writeFile(collectionFilePath, JSON.stringify(collectionData, null, 2));
}


export function serializeCollectionManifest(_config: d.Config, _compilerCtx: d.CompilerCtx, _collectionDir: string, moduleFiles: d.Module[], _globalModule: d.Module): d.CollectionData {
  // create the single collection we're going to fill up with data

  return {
    modules: moduleFiles.map(mod => mod.jsFilePath),
    compiler: {
      name: sys.compiler.name,
      version: sys.compiler.version,
      typescriptVersion: sys.compiler.typescriptVersion
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
  const pkgJsonPath = sys.path.join(config.rootDir, 'package.json');

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
