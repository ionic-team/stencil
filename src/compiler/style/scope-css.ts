import * as d from '../../declarations';
import { DEFAULT_STYLE_MODE, catchError } from '@utils';


export async function scopeComponentCss(config: d.Config, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta, mode: string, cssText: string) {
  try {
    const scopeId = getScopeId(cmp, mode);

    const hostScopeId = getElementScopeId(scopeId, true);
    const slotScopeId = getElementScopeId(scopeId, false);

    cssText = await config.sys.scopeCss(cssText, scopeId, hostScopeId, slotScopeId);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  return cssText;
}

export const getScopeId = (cmpMeta: d.ComponentCompilerMeta, mode?: string) => {
  return ('sc-' + cmpMeta.tagName) + ((mode && mode !== DEFAULT_STYLE_MODE) ? '-' + mode : '');
};


export const getElementScopeId = (scopeId: string, isHostElement?: boolean) => {
  return scopeId + (isHostElement ? '-h' : '-s');
};
