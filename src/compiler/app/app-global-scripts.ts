import { AppRegistry, BuildCtx, CompilerCtx, Config, SourceTarget } from '../../declarations';
import { buildExpressionReplacer } from '../build/replacer';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import { generatePreamble } from '../util';
import { getGlobalEsmBuildPath, getGlobalFileName, getGlobalJsBuildPath } from './app-file-naming';
import inMemoryFsRead from '../bundle/rollup-plugins/in-memory-fs-read';
import { minifyJs } from '../minifier';
import resolveCollections from '../bundle/rollup-plugins/resolve-collections';
import { transpileToEs5 } from '../transpile/core-build';


export async function generateAppGlobalScript(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, appRegistry: AppRegistry, sourceTarget?: SourceTarget) {
  const globalJsContents = await generateAppGlobalContents(config, compilerCtx, buildCtx, sourceTarget);

  if (globalJsContents.length) {
    appRegistry.global = getGlobalFileName(config);

    const globalJsContent = generateGlobalJs(config, globalJsContents);
    const globalEsmContent = generateGlobalEsm(config, globalJsContents);

    compilerCtx.appFiles.global = globalJsContent;

    const promises: Promise<any>[] = [];

    if (sourceTarget !== 'es5') {
      config.outputTargets.filter(o => o.appBuild).forEach(outputTarget => {
        const appGlobalFilePath = getGlobalJsBuildPath(config, outputTarget);
        promises.push(compilerCtx.fs.writeFile(appGlobalFilePath, globalJsContent));
      });
    }

    config.outputTargets.filter(o => o.type === 'dist').forEach(outputTarget => {
      const appGlobalFilePath = getGlobalEsmBuildPath(config, outputTarget, 'es5');
      promises.push(compilerCtx.fs.writeFile(appGlobalFilePath, globalEsmContent));
    });

    await Promise.all(promises);
  }

  return globalJsContents.join('\n').trim();
}


export async function generateAppGlobalContents(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, sourceTarget: SourceTarget): Promise<string[]> {
  const [projectGlobalJsContent, dependentGlobalJsContents] = await Promise.all([
    bundleProjectGlobal(config, compilerCtx, buildCtx, sourceTarget, config.namespace, config.globalScript),
    loadDependentGlobalJsContents(config, compilerCtx, buildCtx, sourceTarget),
  ]);

  return [
    projectGlobalJsContent,
    ...dependentGlobalJsContents
  ];
}


async function loadDependentGlobalJsContents(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, sourceTarget: SourceTarget): Promise<string[]> {
  const collections = compilerCtx.collections.filter(m => m.global && m.global.jsFilePath);

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
    return '';
  }

  // ok, so the project also provided an entry file, so let's bundle it up and
  // the output from this can be tacked onto the top of the project's core file
  // start the bundler on our temporary file
  let output = '';

  try {
    const rollup = await config.sys.rollup.rollup({
      input: entry,
      plugins: [
        resolveCollections(compilerCtx),
        config.sys.rollup.plugins.nodeResolve({
          jsnext: true,
          main: true
        }),
        config.sys.rollup.plugins.commonjs({
          include: 'node_modules/**',
          sourceMap: false
        }),
        inMemoryFsRead(config, config.sys.path, compilerCtx),
        ...config.plugins
      ],
      onwarn: createOnWarnFn(config, buildCtx.diagnostics)
    });

    const results = await rollup.generate({ format: 'es' });

    // cool, so we balled up all of the globals into one string

    // replace build time expressions, like process.env.NODE_ENV === 'production'
    // with a hard coded boolean
    results.code = buildExpressionReplacer(config, results.code);

    // wrap our globals code with our own iife
    output = await wrapGlobalJs(config, compilerCtx, buildCtx, sourceTarget, namespace, results.code);

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
    // global could already be in es2017
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

  return `\n(function(resourcesUrl){${jsContent}\n})(resourcesUrl);\n`;
}


export function generateGlobalJs(config: Config, globalJsContents: string[]) {
  const output = [
    generatePreamble(config) + '\n',
    `(function(namespace,resourcesUrl){`,
    `"use strict";\n`,
    globalJsContents.join('\n').trim(),
    `\n})("${config.namespace}");`
  ].join('');

  return output;
}


export function generateGlobalEsm(config: Config, globalJsContents: string[]) {
  const output = [
    generatePreamble(config) + '\n',
    `export default function appGlobal(namespace, Context, window, document, resourcesUrl, hydratedCssClass) {`,
    globalJsContents.join('\n').trim(),
    `\n}`
  ].join('');

  return output;
}
