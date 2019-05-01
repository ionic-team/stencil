import * as d from '../../declarations';
import { DEFAULT_STYLE_MODE, catchError } from '@utils';


export async function scopeComponentCss(config: d.Config, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta, mode: string, cssText: string, commentOriginalSelector: boolean) {
  try {
    const scopeId = getScopeId(cmp.tagName, mode);
    cssText = await config.sys.scopeCss(cssText, scopeId, commentOriginalSelector);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  return cssText;
}

export const getScopeId = (tagName: string, mode?: string) => {
  return ('sc-' + tagName) + ((mode && mode !== DEFAULT_STYLE_MODE) ? '-' + mode : '');
};
