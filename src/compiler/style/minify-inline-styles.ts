import * as d from '../../declarations';
import { minifyStyle } from '../style/minify-style';


export async function minifyInlineStyles(config: d.Config, compilerCtx: d.CompilerCtx, doc: Document, diagnostics: d.Diagnostic[]) {
  const styles = doc.querySelectorAll('style');
  const promises: Promise<any>[] = [];

  for (let i = 0; i < styles.length; i++) {
    promises.push(minifyInlineStyle(config, compilerCtx, diagnostics, styles[i]));
  }

  await Promise.all(promises);
}


export async function minifyInlineStyle(config: d.Config, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], style: HTMLStyleElement) {
  if (style.innerHTML.includes('  ') || style.innerHTML.includes('\t')) {

    style.innerHTML = await minifyStyle(config, compilerCtx, diagnostics, style.innerHTML);

  }
}
