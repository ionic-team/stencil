import { AppRegistry, BuildConfig, BuildContext, SourceTarget } from '../../util/interfaces';
import { buildExpressionReplacer } from '../build/replacer';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import { generatePreamble, hasError } from '../util';
import { getAppPublicPath, getGlobalFileName, getGlobalDist, getGlobalWWW } from './app-file-naming';
import { transpileToEs5 } from '../transpile/core-build';
import transpiledInMemoryPlugin from '../bundle/rollup-plugins/transpile-in-memory';


export async function generateAppGlobalScript(config: BuildConfig, ctx: BuildContext, sourceTarget: SourceTarget, appRegistry: AppRegistry) {
  const globalJsContents = await generateAppGlobalContents(config, ctx, sourceTarget);

  if (globalJsContents.length) {
    appRegistry.global = getGlobalFileName(config);

    const globalJsContent = generateGlobalJs(config, globalJsContents);

    ctx.appFiles.global = globalJsContent;

    if (config.generateWWW) {
      const appGlobalWWWFilePath = getGlobalWWW(config);

      config.logger.debug(`build, app global www: ${appGlobalWWWFilePath}`);
      ctx.filesToWrite[appGlobalWWWFilePath] = globalJsContent;
    }

    if (config.generateDistribution) {
      const appGlobalDistFilePath = getGlobalDist(config);

      config.logger.debug(`build, app global dist: ${appGlobalDistFilePath}`);
      ctx.filesToWrite[appGlobalDistFilePath] = globalJsContent;
    }
  }

  return globalJsContents.join('\n').trim();
}


export function generateAppGlobalContents(config: BuildConfig, ctx: BuildContext, sourceTarget: SourceTarget) {
  let globalJsContents: string[] = [];

  return Promise.all([
    loadDependentGlobalJsContents(config, ctx, sourceTarget),
    bundleProjectGlobal(config, ctx, sourceTarget, config.namespace, config.globalScript)

  ]).then(results => {
    const dependentGlobalJsContents = results[0];
    const projectGlobalJsContent = results[1];

    globalJsContents = globalJsContents.concat(dependentGlobalJsContents);

    if (projectGlobalJsContent) {
      globalJsContents.push(projectGlobalJsContent);
    }

  }).then(() => {
    return globalJsContents;
  });
}


function loadDependentGlobalJsContents(config: BuildConfig, ctx: BuildContext, sourceTarget: SourceTarget): Promise<string[]> {
  if (!ctx.manifest.dependentManifests) {
    return Promise.resolve([]);
  }

  const dependentManifests = ctx.manifest.dependentManifests
                                .filter(m => m.global && m.global.jsFilePath);

  return Promise.all(dependentManifests.map(dependentManifest => {
    return bundleProjectGlobal(config, ctx, sourceTarget, dependentManifest.manifestName, dependentManifest.global.jsFilePath);
  }));
}


function bundleProjectGlobal(config: BuildConfig, ctx: BuildContext, sourceTarget: SourceTarget, namespace: string, entry: string): Promise<string> {
  // stencil by itself does not have a global file
  // however, other collections can provide a global js
  // which will bundle whatever is in the global, and then
  // prepend the output content on top of the core js
  // this way external collections can provide a shared global at runtime

  if (!entry) {
    // looks like they never provided an entry file, which is fine, so let's skip this
    return Promise.resolve(null);
  }

  // ok, so the project also provided an entry file, so let's bundle it up and
  // the output from this can be tacked onto the top of the project's core file
  // start the bundler on our temporary file
  return config.sys.rollup.rollup({
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
      transpiledInMemoryPlugin(config, ctx)
    ],
    onwarn: createOnWarnFn(ctx.diagnostics)

  }).catch(err => {
    loadRollupDiagnostics(config, ctx.diagnostics, err);
  })

  .then(rollupBundle => {
    // generate the bundler results
    if (hasError(ctx.diagnostics) || !rollupBundle) {
      return '';
    }

    return rollupBundle.generate({
      format: 'es'

    }).then(results => {
      // cool, so we balled up all of the globals into one string

      // replace build time expressions, like process.env.NODE_ENV === 'production'
      // with a hard coded boolean
      results.code = buildExpressionReplacer(config, results.code);

      // wrap our globals code with our own iife
      return wrapGlobalJs(config, ctx, sourceTarget, namespace, results.code);
    });

  }).then(output => {

    ctx.manifest.global = ctx.moduleFiles[config.globalScript];

    return output;
  });
}


function wrapGlobalJs(config: BuildConfig, ctx: BuildContext, sourceTarget: SourceTarget, globalJsName: string, jsContent: string) {
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
    const transpileResults = transpileToEs5(jsContent);
    if (transpileResults.diagnostics && transpileResults.diagnostics.length) {
      ctx.diagnostics.push(...transpileResults.diagnostics);
    } else {
      jsContent = transpileResults.code;
    }
  }

  if (config.minifyJs) {
    const opts: any = { output: {}, compress: {}, mangle: {} };

    if (sourceTarget === 'es5') {
      // minify in a cool es5 way
      opts.ecma = 5;
      opts.output.ecma = 5;
      opts.compress.ecma = 5;
      opts.compress.arrows = false;
    }

    if (config.logLevel === 'debug') {
      opts.mangle.keep_fnames = true;
      opts.compress.drop_console = false;
      opts.compress.drop_debugger = false;
      opts.output.beautify = true;
      opts.output.bracketize = true;
      opts.output.indent_level = 2;
      opts.output.comments = 'all';
      opts.output.preserve_line = true;
    }

    const minifyResults = config.sys.minifyJs(jsContent, opts);
    if (minifyResults.diagnostics && minifyResults.diagnostics.length) {
      ctx.diagnostics.push(...minifyResults.diagnostics);
    } else {
      jsContent = minifyResults.output;
    }
  }

  return `\n(function(publicPath){${jsContent}\n})(publicPath);\n`;
}


export function generateGlobalJs(config: BuildConfig, globalJsContents: string[]) {
  const publicPath = getAppPublicPath(config);

  const output = [
    generatePreamble(config, 'es2015'),
    `(function(appNamespace,publicPath){`,
    `"use strict";\n`,
    globalJsContents.join('\n').trim(),
    `\n})("${config.namespace}","${publicPath}");`
  ].join('');

  return output;
}
