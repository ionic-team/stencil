import * as d from '../../declarations';
import { minifyJs } from '../util';


export async function minifyInlineScripts(config: d.Config, compilerCtx: d.CompilerCtx, doc: Document, diagnostics: d.Diagnostic[]) {
  const scripts = doc.querySelectorAll('script');
  const promises: Promise<any>[] = [];

  for (let i = 0; i < scripts.length; i++) {
    promises.push(minifyInlineStyle(config, compilerCtx, diagnostics, scripts[i]));
  }

  await Promise.all(promises);
}


export async function minifyInlineStyle(config: d.Config, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], script: HTMLScriptElement) {
  if (script.hasAttribute('src')) {
    return;
  }

  if (script.innerHTML.includes('  ') || script.innerHTML.includes('\t')) {

    const minifyResults = await minifyJs(config, compilerCtx, script.innerHTML, 'es5', false);
    minifyResults.diagnostics.forEach(diagnostic => {
      diagnostics.push(diagnostic);
    });

    if (typeof minifyResults.output === 'string') {
      script.innerHTML = minifyResults.output;
    }

  }
}
