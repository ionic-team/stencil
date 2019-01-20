import * as d from '@declarations';
import { catchError, getElementScopeId, getScopeId } from '@utils';
import { sys } from '@sys';


export async function scopeComponentCss(buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta, mode: string, cssText: string) {
  try {
    const scopeId = getScopeId(cmp, mode);

    const hostScopeId = getElementScopeId(scopeId, true);
    const slotScopeId = getElementScopeId(scopeId);

    cssText = await sys.scopeCss(cssText, scopeId, hostScopeId, slotScopeId);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  return cssText;
}
