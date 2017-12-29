import { AppRegistry, BuildConfig, BuildContext, LoadComponentRegistry } from '../../util/interfaces';
import { APP_NAMESPACE_REGEX, LOADER_NAME } from '../../util/constants';
import { generatePreamble } from '../util';
import { getAppPublicPath, getLoaderFileName, getLoaderDist, getLoaderWWW } from './app-file-naming';


export async function generateLoader(
  config: BuildConfig,
  ctx: BuildContext,
  appRegistry: AppRegistry
) {
  const appLoaderFileName = getLoaderFileName(config);
  appRegistry.loader = `../${appLoaderFileName}`;

  const clientLoaderSource = `${LOADER_NAME}.js`;

  let loaderContent = await config.sys.getClientCoreFile({ staticName: clientLoaderSource });

  loaderContent = injectAppIntoLoader(
    config,
    appRegistry.core,
    appRegistry.coreSsr,
    appRegistry.corePolyfilled,
    appRegistry.components,
    loaderContent
  );

  // write the app loader file
  if (ctx.appFiles.loaderContent !== loaderContent) {
    // app loader file is actually different from our last saved version
    config.logger.debug(`build, app loader: ${appLoaderFileName}`);
    ctx.appFiles.loaderContent = loaderContent;

    if (config.minifyJs) {
      // minify the loader
      const opts: any = { output: {}, compress: {}, mangle: {} };
      opts.ecma = 5;
      opts.output.ecma = 5;
      opts.compress.ecma = 5;
      opts.compress.arrows = false;

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

      const minifyJsResults = config.sys.minifyJs(loaderContent, opts);
      minifyJsResults.diagnostics.forEach(d => {
        config.logger[d.level](d.messageText);
      });
      if (!minifyJsResults.diagnostics.length) {
        loaderContent = minifyJsResults.output;
      }
    }

    loaderContent = generatePreamble(config) + '\n' + loaderContent;

    ctx.appFiles.loader = loaderContent;

    if (config.generateWWW) {
      const appLoaderWWW = getLoaderWWW(config);
      ctx.filesToWrite[appLoaderWWW] = loaderContent;
      ctx.appFiles[appLoaderWWW] = loaderContent;
    }

    if (config.generateDistribution) {
      const appLoaderDist = getLoaderDist(config);
      ctx.filesToWrite[appLoaderDist] = loaderContent;
      ctx.appFiles[appLoaderDist] = loaderContent;
    }

    ctx.appFileBuildCount++;
  }

  return loaderContent;
}


export function injectAppIntoLoader(
  config: BuildConfig,
  appCoreFileName: string,
  appCoreSsrFileName: string,
  appCorePolyfilledFileName: string,
  componentRegistry: LoadComponentRegistry[],
  loaderContent: string
) {
  const componentRegistryStr = JSON.stringify(componentRegistry);

  const publicPath = getAppPublicPath(config);

  loaderContent = loaderContent.replace(
    APP_NAMESPACE_REGEX,
    `"${config.namespace}","${publicPath}","${appCoreFileName}","${appCoreSsrFileName}","${appCorePolyfilledFileName}",${componentRegistryStr}`
  );

  return loaderContent;
}
