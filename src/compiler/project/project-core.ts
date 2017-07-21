import { BuildConfig } from '../../util/interfaces';
import { CORE_NAME, PROJECT_NAMESPACE_REGEX } from '../../util/constants';
import { generatePreamble } from '../util';


export function generateCore(config: BuildConfig, globalJsContent: string[], publicPath: string) {
  let staticName = CORE_NAME;
  if (config.devMode) {
    staticName += '.dev';
  }
  staticName += '.js';

  return config.sys.getClientCoreFile({ staticName: staticName }).then(coreContent => {
    // concat the projects core code
    const projectCode: string[] = [
      generatePreamble(config),
      globalJsContent.join('\n'),
      injectProjectIntoCore(config, coreContent, publicPath)
    ];

    return projectCode.join('');
  });
}


export function injectProjectIntoCore(config: BuildConfig, coreContent: string, publicPath: string) {
  // replace the default core with the project's namespace
  return coreContent.replace(
    PROJECT_NAMESPACE_REGEX,
    `"${config.namespace}","${publicPath}/"`
  );
}


export function generateCoreEs5(config: BuildConfig, globalJsContent: string[], publicPath: string) {
  let staticName = CORE_NAME + '.es5';
  if (config.devMode) {
    staticName += '.dev';
  }
  staticName += '.js';

  const documentRegistryPolyfill = config.sys.path.join('polyfills', 'document-register-element.js');

  return Promise.all([
    config.sys.getClientCoreFile({ staticName: staticName }),
    config.sys.getClientCoreFile({ staticName: documentRegistryPolyfill })

  ]).then(results => {
    const coreContent = results[0];
    const docRegistryPolyfillContent = results[1];

    // replace the default core with the project's namespace
    // concat the custom element polyfill and projects core code
    const projectCode: string[] = [
      docRegistryPolyfillContent + '\n\n',
      generatePreamble(config),
      globalJsContent.join('\n'),
      injectProjectIntoCore(config, coreContent, publicPath)
    ];

    return projectCode.join('');
  });
}
