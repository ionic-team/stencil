import { BuildConfig, BuildContext, Diagnostic } from '../../util/interfaces';
import { buildError, buildWarn, normalizePath } from '../util';
import { COLLECTION_DEPENDENCIES_DIR } from '../manifest/manifest-data';
import { COLLECTION_MANIFEST_FILE_NAME } from '../../util/constants';
import { getAppFileName } from '../app/app-file-naming';
import { readFile } from '../util';


export function generateDistribution(config: BuildConfig, ctx: BuildContext): Promise<any> {
  if (!config.generateDistribution) {
    // don't bother
    return Promise.resolve();
  }

  return Promise.all([
    readPackageJson(config, ctx.diagnostics),
    copySourceCollectionComponentsToDistribution(config, ctx),
    generateTypes(config)
  ]);
}


function readPackageJson(config: BuildConfig, diagnostics: Diagnostic[]) {
  const packageJsonPath = config.sys.path.join(config.rootDir, 'package.json');

  return new Promise((resolve, reject) => {
    config.sys.fs.readFile(packageJsonPath, 'utf-8', (err, packageJsonText) => {
      if (err) {
        reject(`Missing "package.json" file for distribution: ${packageJsonPath}`);
        return;
      }

      try {
        const packageJsonData = JSON.parse(packageJsonText);
        validatePackageJson(config, diagnostics, packageJsonData);
        resolve();

      } catch (e) {
        reject(e);
      }
    });
  });
}


export function validatePackageJson(config: BuildConfig, diagnostics: Diagnostic[], data: any) {
  const appNamespace = getAppFileName(config);

  validatePackageFiles(config, diagnostics, data);

  const mainFileName = appNamespace + '.js';
  const main = normalizePath(config.sys.path.join(config.sys.path.relative(config.rootDir, config.distDir), mainFileName));
  if (!data.main || normalizePath(data.main) !== main) {
    const err = buildError(diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "main" property is required when generating a distribution and must be set to: ${main}`;
  }

  const types = normalizePath(config.sys.path.join(config.sys.path.relative(config.rootDir, config.typesDir), 'index.d.ts'));
  if (!data.types || normalizePath(data.types) !== types) {
    const err = buildError(diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "types" property is required when generating a distribution and must be set to: ${types}`;
  }

  const collection = normalizePath(config.sys.path.join(config.sys.path.relative(config.rootDir, config.collectionDir), COLLECTION_MANIFEST_FILE_NAME));
  if (!data.collection || normalizePath(data.collection) !== collection) {
    const err = buildError(diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "collection" property is required when generating a distribution and must be set to: ${collection}`;
  }

  if (typeof config.namespace !== 'string' || config.namespace.toLowerCase().trim() === 'app') {
    const err = buildWarn(diagnostics);
    err.header = `config warning`;
    err.messageText = `When generating a distribution it is recommended to choose a unique namespace, which can be updated in the stencil.config.js file.`;
  }
}


export function validatePackageFiles(config: BuildConfig, diagnostics: Diagnostic[], packageJsonData: any) {
  if (packageJsonData.files) {
    const actualDistDir = normalizePath(config.sys.path.relative(config.rootDir, config.distDir));

    const validPaths = [
      `${actualDistDir}`,
      `${actualDistDir}/`,
      `./${actualDistDir}`,
      `./${actualDistDir}/`
    ];

    const containsDistDir = (packageJsonData.files as string[])
            .some(userPath => validPaths.some(validPath => normalizePath(userPath) === validPath));

    if (!containsDistDir) {
      const err = buildError(diagnostics);
      err.header = `package.json error`;
      err.messageText = `package.json "files" array must contain the distribution directory "${actualDistDir}/" when generating a distribution.`;
    }
  }
}


function copySourceCollectionComponentsToDistribution(config: BuildConfig, ctx: BuildContext) {
  // for any components that are dependencies, such as ionicons is a dependency of ionic
  // then we need to copy the dependency to the dist so it just works downstream
  const promises: Promise<any>[] = [];

  ctx.manifest.modulesFiles.forEach(moduleFile => {
    if (!moduleFile.isCollectionDependency || !moduleFile.originalCollectionComponentPath) return;

    const src = moduleFile.jsFilePath;
    const dest = config.sys.path.join(config.collectionDir, COLLECTION_DEPENDENCIES_DIR, moduleFile.originalCollectionComponentPath);
    const copyPromise = config.sys.copy(src, dest);

    promises.push(copyPromise);
  });

  return Promise.all(promises);
}


async function generateTypes(config: BuildConfig) {
  const PromiseList: Promise<any>[] = [];

  // If index.d.ts file exists at the root then copy it.
  try {
    let indexDtsContent = await readFile(config.sys, config.sys.path.join(config.srcDir, 'index.d.ts'));
    if (typeof indexDtsContent === 'string') {
      indexDtsContent = indexDtsContent.trim();
      if (indexDtsContent.length) {
        // don't bother copying this file if there is no content
        PromiseList.push(config.sys.copy(
          config.sys.path.join(config.srcDir, 'index.d.ts'),
          config.sys.path.join(config.typesDir, 'index.d.ts')
        ));
      }
    }
  } catch (e) {}

  // copy the generated components.d.ts fiel
  PromiseList.push(config.sys.copy(
    config.sys.path.join(config.srcDir, COMPONENTS_DTS),
    config.sys.path.join(config.typesDir, COMPONENTS_DTS)
  ));

  return Promise.all(PromiseList);
}


export const COMPONENTS_DTS = 'components.d.ts';
