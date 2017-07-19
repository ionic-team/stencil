import { BuildConfig, BuildContext, Diagnostic } from '../interfaces';
import { CORE_NAME, LOADER_NAME, PROJECT_NAMESPACE_REGEX } from '../../util/constants';
import { createOnWarnFn, transpiledInMemoryPlugin } from '../bundle/bundle-modules';
import { generatePreamble, normalizePath } from '../util';
import { LoadComponentRegistry, ProjectRegistry } from '../../util/interfaces';


export function generateProjectFiles(config: BuildConfig, ctx: BuildContext, componentRegistry: LoadComponentRegistry[], diagnostics: Diagnostic[]) {
  const sys = config.sys;

  config.logger.debug(`build, generateProjectFiles: ${config.namespace}`);

  const projectFileName = config.namespace.toLowerCase();

  const projectRegistry: ProjectRegistry = {
    namespace: config.namespace,
    components: componentRegistry,
    loader: `${projectFileName}.js`,
  };

  let projectCoreFileName: string;
  let projectCoreEs5FileName: string;

  // bundle the project's entry file (if one was provided)
  return generateProjectEntry(config, ctx, diagnostics).then(entryContent => {

    return Promise.all([
      generateCore(config, entryContent),
      generateCoreEs5(config, entryContent)
    ]);

  }).then(results => {
    const coreContent = results[0];
    const coreEs5Content = results[1];

    if (config.devMode) {
      // dev mode core filename just keeps the same name, no content hashing
      projectRegistry.core = `${projectFileName}/${projectFileName}.${CORE_NAME}.js`;
      projectCoreFileName = `${projectFileName}.${CORE_NAME}.js`;

      projectRegistry.coreEs5 = `${projectFileName}/${projectFileName}.${CORE_NAME}.ce.js`;
      projectCoreEs5FileName = `${projectFileName}.${CORE_NAME}.ce.js`;

    } else {
      // prod mode renames the core file with its hashed content
      const contentHash = sys.generateContentHash(coreContent, config.hashedFileNameLength);
      projectRegistry.core = `${projectFileName}/${projectFileName}.${contentHash}.js`;
      projectCoreFileName = `${projectFileName}.${contentHash}.js`;

      const contentEs5Hash = sys.generateContentHash(coreEs5Content, config.hashedFileNameLength);
      projectRegistry.coreEs5 = `${projectFileName}/${projectFileName}.${contentEs5Hash}.ce.js`;
      projectCoreEs5FileName = `${projectFileName}.${contentEs5Hash}.ce.js`;
    }

    // write the project core file
    const projectCoreFilePath = sys.path.join(config.buildDir, projectFileName, projectCoreFileName);
    if (ctx.projectFiles.core !== coreContent) {
      // core file is actually different from our last saved version
      config.logger.debug(`build, write project core: ${projectCoreFilePath}`);
      ctx.filesToWrite[projectCoreFilePath] = ctx.projectFiles.core = coreContent;
      ctx.projectFileBuildCount++;
    }

    // write the project core ES5 file
    const projectCoreEs5FilePath = sys.path.join(config.buildDir, projectFileName, projectCoreEs5FileName);
    if (ctx.projectFiles.coreEs5 !== coreEs5Content) {
      // core es5 file is actually different from our last saved version
      config.logger.debug(`build, project core es5: ${projectCoreEs5FilePath}`);
      ctx.filesToWrite[projectCoreEs5FilePath] = ctx.projectFiles.coreEs5 = coreEs5Content;
      ctx.projectFileBuildCount++;
    }

  }).then(() => {
    // create the loader after creating the loader file name
    return generateLoader(config, projectCoreFileName, projectCoreEs5FileName, componentRegistry).then(loaderContent => {
      // write the project loader file
      const projectLoaderFileName = `${projectRegistry.loader}`;
      const projectLoaderFilePath = sys.path.join(config.buildDir, projectLoaderFileName);
      if (ctx.projectFiles.loader !== loaderContent) {
        // project loader file is actually different from our last saved version
        config.logger.debug(`build, project loader: ${projectLoaderFilePath}`);
        ctx.filesToWrite[projectLoaderFilePath] = ctx.projectFiles.loader = loaderContent;
        ctx.projectFileBuildCount++;
      }
    });

  }).then(() => {
    // create a json file for the project registry
    const registryJson = JSON.stringify(projectRegistry, null, 2);
    if (ctx.projectFiles.registryJson !== registryJson) {
      // project registry json file is actually different from our last saved version
      const registryFilePath = getRegistryJsonFilePath(config);
      config.logger.debug(`build, project registry: ${registryFilePath}`);
      ctx.filesToWrite[registryFilePath] = ctx.projectFiles.registryJson = registryJson;
      ctx.projectFileBuildCount++;
    }

  }).catch(err => {
    config.logger.error('generateProjectFiles', err);
  });
}


function generateLoader(config: BuildConfig, projectCoreFileName: string, projectCoreEs5FileName: string, componentRegistry: LoadComponentRegistry[]) {
  const sys = config.sys;

  let staticName = LOADER_NAME;
  if (config.devMode) {
    staticName += '.dev';
  }
  staticName += '.js';

  return sys.getClientCoreFile({ staticName: staticName }).then(stencilLoaderContent => {
    // replace the default loader with the project's namespace and components

    stencilLoaderContent = injectProjectIntoLoader(
      config,
      projectCoreFileName,
      projectCoreEs5FileName,
      componentRegistry,
      stencilLoaderContent
    );

    // concat the projects loader code
    const projectCode: string[] = [
      generatePreamble(config),
      stencilLoaderContent
    ];

    return projectCode.join('');
  });
}


export function injectProjectIntoLoader(config: BuildConfig, projectCoreFileName: string, projectCoreEs5FileName: string, componentRegistry: LoadComponentRegistry[], stencilLoaderContent: string) {
  let componentRegistryStr = JSON.stringify(componentRegistry);

  if (config.minifyJs) {
    const minifyResult = config.sys.minifyJs(componentRegistryStr);
    minifyResult.diagnostics.forEach(d => {
      config.logger[d.level](d.messageText);
    });
    if (minifyResult.output) {
      componentRegistryStr = minifyResult.output;
    }
  }

  const projectCoreUrl = getProjectPublicPath(config) + '/' + projectCoreFileName;
  const projectCoreEs5Url = getProjectPublicPath(config) + '/' + projectCoreEs5FileName;

  return stencilLoaderContent.replace(
    PROJECT_NAMESPACE_REGEX,
    `"${config.namespace}","${projectCoreUrl}","${projectCoreEs5Url}",${componentRegistryStr}`
  );
}


function generateCore(config: BuildConfig, entryContent: string) {
  const sys = config.sys;

  let staticName = CORE_NAME;
  if (config.devMode) {
    staticName += '.dev';
  }
  staticName += '.js';

  return sys.getClientCoreFile({ staticName: staticName }).then(coreContent => {
    // concat the projects core code
    const projectCode: string[] = [
      generatePreamble(config),
      entryContent,
      injectProjectIntoCore(config, coreContent)
    ];

    return projectCode.join('');
  });
}


export function injectProjectIntoCore(config: BuildConfig, coreContent: string) {
  // replace the default core with the project's namespace
  return coreContent.replace(
    PROJECT_NAMESPACE_REGEX,
    `"${config.namespace}","${getProjectPublicPath(config)}/"`
  );
}


function generateCoreEs5(config: BuildConfig, entryContent: string) {
  const sys = config.sys;

  let staticName = CORE_NAME + '.es5';
  if (config.devMode) {
    staticName += '.dev';
  }
  staticName += '.js';

  const documentRegistryPolyfill = config.sys.path.join('polyfills', 'document-register-element.js');

  return Promise.all([
    sys.getClientCoreFile({ staticName: staticName }),
    sys.getClientCoreFile({ staticName: documentRegistryPolyfill })

  ]).then(results => {
    const coreContent = results[0];
    const docRegistryPolyfillContent = results[1];

    // replace the default core with the project's namespace
    // concat the custom element polyfill and projects core code
    const projectCode: string[] = [
      docRegistryPolyfillContent + '\n\n',
      generatePreamble(config),
      entryContent,
      injectProjectIntoCore(config, coreContent)
    ];

    return projectCode.join('');
  });
}


function generateProjectEntry(config: BuildConfig, ctx: BuildContext, diagnostics: Diagnostic[]) {
  // stencil by itself does not have an entry file
  // however, projects like Ionic can provide an entry file
  // which will bundle whatever is in the entry, and then
  // prepend the output content on top of stencil's core js
  // this way projects like Ionic can provide a shared global at runtime

  if (!config.entry) {
    // looks like they never provided an entry file, which is fine, so let's skip this
    return Promise.resolve('');
  }

  // ok, so the project also provided an entry file, so let's bundle it up and
  // the output from this can be tacked onto the top of the project's core file
  // start the bundler on our temporary file
  return config.sys.rollup.rollup({
    entry: config.entry,
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
    onwarn: createOnWarnFn(diagnostics)

  }).catch(err => {
    throw err;
  })

  .then(rollupBundle => {
    // generate the bundler results
    const results = rollupBundle.generate({
      format: 'es'
    });

    return `(function(window, document, publicPath){\n${results.code}\n})(window, document, "${getProjectPublicPath(config)}/");\n\n`;

  }).then(output => {

    if (config.minifyJs) {
      // minify js
      const minifyJsResults = config.sys.minifyJs(output);
      minifyJsResults.diagnostics.forEach(d => {
        diagnostics.push(d);
      });

      if (minifyJsResults.output) {
        output = minifyJsResults.output;
      }
    }

    return output;
  });
}


export function getRegistryJsonFilePath(config: BuildConfig) {
  return normalizePath(config.sys.path.join(config.buildDir, `${config.namespace.toLowerCase()}.registry.json`));
}


export function getProjectBuildDir(config: BuildConfig) {
  return normalizePath(config.sys.path.join(config.buildDir, config.namespace.toLowerCase()));
}


export function getProjectPublicPath(config: BuildConfig) {
  return normalizePath(config.sys.path.join(config.publicPath, config.namespace.toLowerCase()));
}
