import { BuildConfig } from '../../util/interfaces';
import { parseCss } from './parse-css';
import { StringifyCss } from './stringify-css';


export function scopeCss(config: BuildConfig, cssContent: string, scopeIdSelector: string, filePath?: string) {
  const cssAst = parseCss(config, cssContent, filePath);

  const stringifyCss = new StringifyCss({ scopeIdSelector });

  return stringifyCss.compile(cssAst);
}
