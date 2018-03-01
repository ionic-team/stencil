import { CompilerCtx, Config, HydrateResults } from '../../declarations';
import { minifyStyle } from '../style/minify-style';


export async function minifyInlineStyles(config: Config, compilerCtx: CompilerCtx, doc: Document, results: HydrateResults) {
  const styles = doc.querySelectorAll('style');
  const promises: Promise<any>[] = [];

  for (let i = 0; i < styles.length; i++) {
    promises.push(minifyInlineStyle(config, compilerCtx, results, styles[i]));
  }

  await Promise.all(promises);
}


export async function minifyInlineStyle(config: Config, compilerCtx: CompilerCtx, results: HydrateResults, style: HTMLStyleElement) {
  if (style.innerHTML.includes('  ') || style.innerHTML.includes('\t')) {

    style.innerHTML = await minifyStyle(config, compilerCtx, results.diagnostics, style.innerHTML);

  }
}
