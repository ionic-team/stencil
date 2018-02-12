import { AppRegistry, BuildCtx, CompilerCtx, Config, SourceTarget } from '../../declarations';
import { buildExpressionReplacer } from '../build/replacer';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import { generatePreamble, minifyJs } from '../util';
import { getAppPublicPath, getGlobalDist, getGlobalFileName, getGlobalWWW } from './app-file-naming';
import { transpileToEs5 } from '../transpile/core-build';
import transpiledInMemoryPlugin from '../bundle/rollup-plugins/transpiled-in-memory';


export async function generateAppGlobalScript(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, appRegistry: AppRegistry, sourceTarget?: SourceTarget) {
  const globalJsContents = await generateAppGlobalContents(config, compilerCtx, buildCtx, sourceTarget);

  if (globalJsContents.length) {
    appRegistry.global = getGlobalFileName(config);

    const globalJsContent = generateGlobalJs(config, globalJsContents);

    compilerCtx.appFiles.global = globalJsContent;

    if (config.generateWWW) {
      const appGlobalWWWFilePath = getGlobalWWW(config);

      config.logger.debug(`build, app global www: ${appGlobalWWWFilePath}`);
      await compilerCtx.fs.writeFile(appGlobalWWWFilePath, globalJsContent);
    }

    if (config.generateDistribution) {
      const appGlobalDistFilePath = getGlobalDist(config);

      config.logger.debug(`build, app global dist: ${appGlobalDistFilePath}`);
      await compilerCtx.fs.writeFile(appGlobalDistFilePath, globalJsContent);
    }
  }

  return globalJsContents.join('\n').trim();
}


export async function generateAppGlobalContents(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, sourceTarget: SourceTarget) {
  let globalJsContents: string[] = [];

  const results = await Promise.all([
    loadDependentGlobalJsContents(config, compilerCtx, buildCtx, sourceTarget),
    bundleProjectGlobal(config, compilerCtx, buildCtx, sourceTarget, config.namespace, config.globalScript)
  ]);

  const dependentGlobalJsContents = results[0];
  const projectGlobalJsContent = results[1];

  globalJsContents = globalJsContents.concat(dependentGlobalJsContents);

  if (projectGlobalJsContent) {
    globalJsContents.push(projectGlobalJsContent);
  }

  return globalJsContents;
}


async function loadDependentGlobalJsContents(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, sourceTarget: SourceTarget): Promise<string[]> {
  if (!compilerCtx.collections) {
    return [];
  }

  const collections = Object.keys(compilerCtx.collections)
    .map(collectionName => {
      return compilerCtx.collections[collectionName];
    })
    .filter(m => m.global && m.global.jsFilePath);

  return Promise.all(collections.map(collectionManifest => {
    return bundleProjectGlobal(config, compilerCtx, buildCtx, sourceTarget, collectionManifest.collectionName, collectionManifest.global.jsFilePath);
  }));
}


async function bundleProjectGlobal(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, sourceTarget: SourceTarget, namespace: string, entry: string): Promise<string> {
  // stencil by itself does not have a global file
  // however, other collections can provide a global js
  // which will bundle whatever is in the global, and then
  // prepend the output content on top of the core js
  // this way external collections can provide a shared global at runtime

  if (!entry) {
    // looks like they never provided an entry file, which is fine, so let's skip this
    return null;
  }

  const cacheKey = compilerCtx.cache.createKey('bundleProjectGlobal', namespace, entry, sourceTarget);
  const cachedContent = await compilerCtx.cache.get(cacheKey);
  if (cachedContent != null) {
    return cachedContent;
  }

  // ok, so the project also provided an entry file, so let's bundle it up and
  // the output from this can be tacked onto the top of the project's core file
  // start the bundler on our temporary file
  let output = '';

  try {
    const rollup = await config.sys.rollup.rollup({
      input: entry,
      plugins: [
        config.sys.rollup.plugins.nodeResolve({
          jsnext: true,
          main: true
        }),
        config.sys.rollup.plugins.commonjs({
          include: 'node_modules/**',
          sourceMap: false
        }),
        transpiledInMemoryPlugin(config, compilerCtx),
        ...config.plugins
      ],
      onwarn: createOnWarnFn(buildCtx.diagnostics)
    });

    const results = await rollup.generate({ format: 'es' });

    // cool, so we balled up all of the globals into one string

    // replace build time expressions, like process.env.NODE_ENV === 'production'
    // with a hard coded boolean
    results.code = buildExpressionReplacer(config, results.code);

    // wrap our globals code with our own iife
    output = await wrapGlobalJs(config, compilerCtx, buildCtx, sourceTarget, namespace, results.code);

    await compilerCtx.cache.put(cacheKey, output);

    buildCtx.global = compilerCtx.moduleFiles[config.globalScript];

  } catch (e) {
    loadRollupDiagnostics(config, compilerCtx, buildCtx, e);
  }

  return output;
}


async function wrapGlobalJs(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, sourceTarget: SourceTarget, globalJsName: string, jsContent: string) {
  jsContent = (jsContent || '').trim();

  // just format it a touch better in dev mode
  jsContent = `\n/** ${globalJsName || ''} global **/\n\n${jsContent}`;

  const lines = jsContent.split(/\r?\n/);
  jsContent = lines.map(line => {
    if (line.length) {
      return '    ' + line;
    }
    return line;
  }).join('\n');

  if (sourceTarget === 'es5') {
    // global could already be in es2015
    // transpile it down to es5
    config.logger.debug(`transpile global to es5: ${globalJsName}`);
    const transpileResults = await transpileToEs5(compilerCtx, jsContent);
    if (transpileResults.diagnostics && transpileResults.diagnostics.length) {
      buildCtx.diagnostics.push(...transpileResults.diagnostics);
    } else {
      jsContent = transpileResults.code;
    }
  }

  if (config.minifyJs) {
    const minifyResults = await minifyJs(config, compilerCtx, jsContent, sourceTarget, false);
    if (minifyResults.diagnostics && minifyResults.diagnostics.length) {
      buildCtx.diagnostics.push(...minifyResults.diagnostics);
    } else {
      jsContent = minifyResults.output;
    }
  }

  return `\n(function(publicPath){${jsContent}\n})(publicPath);\n`;
}


export function generateGlobalJs(config: Config, globalJsContents: string[]) {
  const publicPath = getAppPublicPath(config);

  const output = [
    generatePreamble(config) + '\n',
    `(function(appNamespace,publicPath){`,
    `"use strict";\n`,
    globalJsContents.join('\n').trim(),
    `\n})("${config.namespace}","${publicPath}");`
  ].join('');

  return output;
}
