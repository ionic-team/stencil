import { BuildConfig, BuildContext } from '../../util/interfaces';
import { createOnWarnFn, transpiledInMemoryPlugin } from '../bundle/bundle-modules';
import { getJsFile } from '../util';


export function generateProjectGlobal(config: BuildConfig, ctx: BuildContext, publicPath: string) {
  let globalJsContents: string[] = [];

  return loadDependentGlobalJsContents(config, ctx, publicPath).then(dependentGlobalJsContents => {
    globalJsContents = globalJsContents.concat(dependentGlobalJsContents.filter(c => c));

    return bundleProjectGlobal(config, ctx, publicPath).then(projectGlobalJsContent => {
      if (projectGlobalJsContent) {
        globalJsContents.push(projectGlobalJsContent);
      }
    });

  }).then(() => {
    return globalJsContents;
  });
}


function loadDependentGlobalJsContents(config: BuildConfig, ctx: BuildContext, publicPath: string): Promise<string[]> {
  if (!ctx.manifest.dependentManifests) {
    return Promise.resolve([]);
  }

  const dependentManifests = ctx.manifest.dependentManifests
                               .filter(m => m.global && m.global.jsFilePath);

  return Promise.all(dependentManifests.map(dependentManifest => {
    return getJsFile(config.sys, ctx, dependentManifest.global.jsFilePath).then(jsContent => {
      return wrapGlobalJs(config, ctx, dependentManifest.manifestName, jsContent, publicPath);
    });
  }));
}


function bundleProjectGlobal(config: BuildConfig, ctx: BuildContext, publicPath: string): Promise<string> {
  // stencil by itself does not have a global file
  // however, projects like Ionic can provide a global file
  // which will bundle whatever is in the global, and then
  // prepend the output content on top of stencil's core js
  // this way projects like Ionic can provide a shared global at runtime

  if (!config.global) {
    // looks like they never provided an entry file, which is fine, so let's skip this
    return Promise.resolve(null);
  }

  // ok, so the project also provided an entry file, so let's bundle it up and
  // the output from this can be tacked onto the top of the project's core file
  // start the bundler on our temporary file
  return config.sys.rollup.rollup({
    entry: config.global,
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
    throw err;
  })

  .then(rollupBundle => {
    // generate the bundler results
    const results = rollupBundle.generate({
      format: 'es'
    });

    const globalJsName = config.namespace;
    return wrapGlobalJs(config, ctx, globalJsName, results.code, publicPath);

  }).then(output => {

    ctx.manifest.global = ctx.moduleFiles[config.global];

    return output;
  });
}


function wrapGlobalJs(config: BuildConfig, ctx: BuildContext, globalJsName: string, jsContent: string, publicPath: string) {
  jsContent = (jsContent || '').trim();

  jsContent = `\n/** ${globalJsName || ''} global **/\n"use strict";\n${jsContent}\n\n`;

  if (!config.minifyJs) {
    // just format it a touch better in dev mode
    let lines = jsContent.split(/\r?\n/);
    jsContent = lines.map(line => {
      if (line.length) {
        return '    ' + line;
      }
      return line;
    }).join('\n');
  }

  jsContent = `(function(window, document, publicPath){${jsContent}})(window, document, "${publicPath}/");\n`;

  if (config.minifyJs) {
    // minify js
    const minifyJsResults = config.sys.minifyJs(jsContent);
    minifyJsResults.diagnostics.forEach(d => {
      ctx.diagnostics.push(d);
    });

    if (minifyJsResults.output) {
      jsContent = minifyJsResults.output;
    }
  }

  return jsContent;
}
