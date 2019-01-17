import { AppRegistry, BuildCtx, CompilerCtx, Config, SourceTarget } from '../../declarations';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import { generatePreamble } from '../util';
import { getGlobalEsmBuildPath, getGlobalFileName, getGlobalJsBuildPath } from './app-file-naming';
import rollupPluginReplace from '../bundle/rollup-plugins/rollup-plugin-replace';
import inMemoryFsRead from '../bundle/rollup-plugins/in-memory-fs-read';
import { minifyJs } from '../minifier';
import { transpileToEs5Main } from '../transpile/transpile-to-es5-main';


export async function generateBrowserAppGlobalScript(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, appRegistry: AppRegistry, sourceTarget: SourceTarget) {
  const globalJsContents = await generateAppGlobalContent(config, compilerCtx, buildCtx, sourceTarget);

  if (globalJsContents.length > 0) {
    appRegistry.global = getGlobalFileName(config);

    const globalJsContent = generateGlobalJs(config, globalJsContents);

    compilerCtx.appFiles.global = globalJsContent;

    if (sourceTarget !== 'es5') {
      const promises = config.outputTargets.filter(o => o.appBuild).map(outputTarget => {
        const appGlobalFilePath = getGlobalJsBuildPath(config, outputTarget as any);
        return compilerCtx.fs.writeFile(appGlobalFilePath, globalJsContent);
      });
      await Promise.all(promises);
    }
  }
  return globalJsContents;
}

export async function generateEsmAppGlobalScript(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, sourceTarget: SourceTarget) {
  const globalJsContents = await generateAppGlobalContent(config, compilerCtx, buildCtx, sourceTarget);

  if (globalJsContents.length > 0) {
    const globalEsmContent = generateGlobalEsm(config, globalJsContents);
    const promises = config.outputTargets.filter(o => o.type === 'dist').map(outputTarget => {
      const appGlobalFilePath = getGlobalEsmBuildPath(config, outputTarget as any, sourceTarget);
      return compilerCtx.fs.writeFile(appGlobalFilePath, globalEsmContent);
    });
    await Promise.all(promises);
  }

  return globalJsContents;
}


export async function generateAppGlobalContent(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, sourceTarget: SourceTarget) {
  const [projectGlobalJsContent, dependentGlobalJsContents] = await Promise.all([
    bundleProjectGlobal(config, compilerCtx, buildCtx, sourceTarget, config.namespace, config.globalScript),
    loadDependentGlobalJsContents(config, compilerCtx, buildCtx, sourceTarget),
  ]);

  return [
    projectGlobalJsContent,
    ...dependentGlobalJsContents
  ].join('\n').trim();
}


async function loadDependentGlobalJsContents(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, sourceTarget: SourceTarget) {
  const collections = compilerCtx.collections.filter(m => m.global && m.global.jsFilePath);

  const dependentGlobalJsContents = await Promise.all(collections.map(collectionManifest => {
    return bundleProjectGlobal(config, compilerCtx, buildCtx, sourceTarget, collectionManifest.collectionName, collectionManifest.global.jsFilePath);
  }));

  return dependentGlobalJsContents;
}


async function bundleProjectGlobal(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, sourceTarget: SourceTarget, namespace: string, entry: string): Promise<string> {
  // stencil by itself does not have a global file
  // however, other collections can provide a global js
  // which will bundle whatever is in the global, and then
  // prepend the output content on top of the core js
  // this way external collections can provide a shared global at runtime

  if (typeof entry !== 'string') {
    // looks like they never provided an entry file, which is fine, so let's skip this
    return '';
  }

  if (entry.toLowerCase().endsWith('.ts')) {
    entry = entry.substr(0, entry.length - 2) + 'js';
  } else if (entry.toLowerCase().endsWith('.tsx')) {
    entry = entry.substr(0, entry.length - 3) + 'js';
  }

  // ok, so the project also provided an entry file, so let's bundle it up and
  // the output from this can be tacked onto the top of the project's core file
  // start the bundler on our temporary file
  try {
    const replaceObj = {
      'process.env.NODE_ENV': config.devMode ? '"development"' : '"production"'
    };
    const rollup = await config.sys.rollup.rollup({
      input: entry,
      plugins: [
        config.sys.rollup.plugins.nodeResolve({
          jsnext: true,
          main: true
        }),
        config.sys.rollup.plugins.emptyJsResolver(),
        config.sys.rollup.plugins.commonjs({
          include: 'node_modules/**',
          sourceMap: false
        }),
        rollupPluginReplace({
          values: replaceObj
        }),
        inMemoryFsRead(config, compilerCtx, buildCtx),
        ...config.plugins
      ],
      onwarn: createOnWarnFn(config, buildCtx.diagnostics)
    });

    const results = await rollup.generate({ format: 'es' });

    // cool, so we balled up all of the globals into one string
    buildCtx.global = compilerCtx.moduleFiles[config.globalScript];

    // wrap our globals code with our own iife
    return await wrapGlobalJs(config, compilerCtx, buildCtx, sourceTarget, namespace, results.output[0].code);

  } catch (e) {
    loadRollupDiagnostics(config, compilerCtx, buildCtx, e);
  }

  return '';
}


async function wrapGlobalJs(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, sourceTarget: SourceTarget, globalJsName: string, jsContent: string) {
  jsContent = (jsContent || '').trim();

  // just format it a touch better in dev mode
  jsContent = `\n/** ${globalJsName || ''} global **/\n\n${jsContent}`;

  jsContent = jsContent
    .split(/\r?\n/)
    .map(line => (line.length > 0) ? '    ' + line : line)
    .join('\n');

  if (sourceTarget === 'es5') {
    // global could already be in es2017
    // transpile it down to es5
    buildCtx.debug(`transpile global to es5: ${globalJsName}`);
    const transpileResults = await transpileToEs5Main(config, compilerCtx, jsContent);
    if (transpileResults.diagnostics && transpileResults.diagnostics.length) {
      buildCtx.diagnostics.push(...transpileResults.diagnostics);
    } else {
      jsContent = transpileResults.code;
    }
  }

  if (config.minifyJs) {
    jsContent = await minifyJs(config, compilerCtx, buildCtx.diagnostics, jsContent, sourceTarget, false);
  }

  return `\n(function(Context, resourcesUrl){${jsContent}\n})(x,r);\n`;
}


export function generateGlobalJs(config: Config, globalJsContents: string) {
  const output = [
    generatePreamble(config) + '\n',
    `(function(namespace,resourcesUrl){`,
    `"use strict";\n`,
    globalJsContents,
    `\n})("${config.namespace}");`
  ].join('');

  return output;
}


export function generateGlobalEsm(config: Config, globalJsContents: string) {
  const output = [
    generatePreamble(config) + '\n',
    `export default function appGlobal(n, x, w, d, r, h) {`,
    globalJsContents,
    `\n}`
  ].join('');

  return output;
}
