import { CompilerCtx, Config, HydrateResults } from '../../declarations';
import { minifyJs } from '../util';


export async function minifyInlineScripts(config: Config, compilerCtx: CompilerCtx, doc: Document, results: HydrateResults) {
  const scripts = doc.querySelectorAll('script');
  const promises: Promise<any>[] = [];

  for (let i = 0; i < scripts.length; i++) {
    promises.push(minifyInlineStyle(config, compilerCtx, results, scripts[i]));
  }

  await Promise.all(promises);
}


export async function minifyInlineStyle(config: Config, compilerCtx: CompilerCtx, results: HydrateResults, script: HTMLScriptElement) {
  if (script.hasAttribute('src')) {
    return;
  }

  if (script.innerHTML.includes('  ') || script.innerHTML.includes('\t')) {

    const minifyResults = await minifyJs(config, compilerCtx, script.innerHTML, 'es5', false);
    minifyResults.diagnostics.forEach(d => {
      results.diagnostics.push(d);
    });

    if (typeof minifyResults.output === 'string') {
      script.innerHTML = minifyResults.output;
    }

  }
}
