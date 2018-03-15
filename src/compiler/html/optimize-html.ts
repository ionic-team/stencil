import * as d from '../../declarations';
import { assetVersioning } from './asset-versioning';
import { collapseHtmlWhitepace } from './collapse-html-whitespace';
import { inlineComponentStyles } from '../style/inline-styles';
import { inlineExternalAssets } from './inline-external-assets';
import { inlineLoaderScript } from './inline-loader-script';
import { insertCanonicalLink } from './canonical-link';
import { minifyInlineScripts } from './minify-inline-scripts';
import { minifyInlineStyles } from '../style/minify-inline-styles';
import { catchError } from '../util';


export async function optimizeHtml(
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  hydrateTarget: d.OutputTargetHydrate,
  windowLocationPath: string,
  doc: Document,
  styles: string[],
  diagnostics: d.Diagnostic[]
) {
  const promises: Promise<any>[] = [];

  if (hydrateTarget.hydrateComponents) {
    doc.documentElement.setAttribute('data-ssr', '');
  }

  if (hydrateTarget.canonicalLink) {
    try {
      insertCanonicalLink(config, doc, windowLocationPath);

    } catch (e) {
      diagnostics.push({
        level: 'error',
        type: 'hydrate',
        header: 'Insert Canonical Link',
        messageText: e
      });
    }
  }

  if (hydrateTarget.inlineStyles) {
    try {
      inlineComponentStyles(config, hydrateTarget, doc, styles, diagnostics);

    } catch (e) {
      diagnostics.push({
        level: 'error',
        type: 'hydrate',
        header: 'Inline Component Styles',
        messageText: e
      });
    }
  }

  if (hydrateTarget.inlineLoaderScript) {
    // remove the script to the external loader script request
    // inline the loader script at the bottom of the html
    promises.push(inlineLoaderScript(config, compilerCtx, hydrateTarget, windowLocationPath, doc));
  }

  if (hydrateTarget.inlineAssetsMaxSize > 0) {
    promises.push(inlineExternalAssets(config, compilerCtx, hydrateTarget, windowLocationPath, doc));
  }

  if (hydrateTarget.collapseWhitespace && !config.devMode && config.logLevel !== 'debug') {
    // collapseWhitespace is the default
    try {
      config.logger.debug(`optimize ${windowLocationPath}, collapse html whitespace`);
      collapseHtmlWhitepace(doc.documentElement);

    } catch (e) {
      diagnostics.push({
        level: 'error',
        type: 'hydrate',
        header: 'Reduce HTML Whitespace',
        messageText: e
      });
    }
  }

  // need to wait on to see if external files are inlined
  await Promise.all(promises);

  // reset for new promises
  promises.length = 0;

  if (config.minifyCss) {
    promises.push(minifyInlineStyles(config, compilerCtx, doc, diagnostics));
  }

  if (config.minifyJs) {
    promises.push(minifyInlineScripts(config, compilerCtx, doc, diagnostics));
  }

  if (config.assetVersioning) {
    promises.push(assetVersioning(config, compilerCtx, hydrateTarget, windowLocationPath, doc));
  }

  await Promise.all(promises);
}


export async function optimizeIndexHtml(
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  hydrateTarget: d.OutputTargetHydrate,
  windowLocationPath: string,
  diagnostics: d.Diagnostic[]
) {
  try {
    hydrateTarget.html = await compilerCtx.fs.readFile(hydrateTarget.indexHtml);

    try {
      const dom = config.sys.createDom();
      const win = dom.parse(hydrateTarget);
      const doc = win.document;
      const styles: string[] = [];

      await optimizeHtml(config, compilerCtx, hydrateTarget, windowLocationPath, doc, styles, diagnostics);

      // serialize this dom back into a string
      await compilerCtx.fs.writeFile(hydrateTarget.indexHtml, dom.serialize());

    } catch (e) {
      catchError(diagnostics, e);
    }

  } catch (e) {
    // index.html file doesn't exist, which is fine
  }
}
