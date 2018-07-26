import * as d from '../../declarations';
import { minifyJs } from '../minifier';


export async function minifyInlineScripts(config: d.Config, compilerCtx: d.CompilerCtx, doc: Document, diagnostics: d.Diagnostic[]) {
  const scripts = doc.querySelectorAll('script');
  const promises: Promise<any>[] = [];

  for (let i = 0; i < scripts.length; i++) {
    promises.push(minifyInlineScript(config, compilerCtx, diagnostics, scripts[i]));
  }

  await Promise.all(promises);
}


export function canMinifyInlineScript(script: HTMLScriptElement) {
  if (script.hasAttribute('src')) {
    return false;
  }

  let type = script.getAttribute('type');
  if (typeof type === 'string') {
    type = type.trim().toLowerCase();
    if (!VALID_SCRIPT_TYPES.includes(type)) {
      return false;
    }
  }

  if (script.innerHTML.includes('/*')) {
    return true;
  }

  if (script.innerHTML.includes('  ')) {
    return true;
  }

  if (script.innerHTML.includes('\t')) {
    return true;
  }

  return false;
}

const VALID_SCRIPT_TYPES = ['application/javascript', 'application/ecmascript', ''];


export async function minifyInlineScript(config: d.Config, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], script: HTMLScriptElement) {
  if (!canMinifyInlineScript(script)) {
    return;
  }

  const minifyResults = await minifyJs(config, compilerCtx, script.innerHTML, 'es5', false);
  minifyResults.diagnostics.forEach(diagnostic => {
    diagnostics.push(diagnostic);
  });

  if (typeof minifyResults.output === 'string') {
    script.innerHTML = minifyResults.output;
  }
}
