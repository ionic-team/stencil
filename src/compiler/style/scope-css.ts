import * as d from '../../declarations';
import { catchError } from '../util';
import { getChildScopeAttribute, getHostScopeAttribute, getScopeId, getSlotScopeAttribute } from '../../util/scope';

export async function scopeComponentCss(config: d.Config, buildCtx: d.BuildCtx, cmpMeta: d.ComponentMeta, mode: string, cssText: string) {
  try {
    const scopeId = getScopeId(cmpMeta, mode);

    const scopeAttribute = getChildScopeAttribute(scopeId);
    const hostScopeAttr = getHostScopeAttribute(scopeId);
    const slotScopeAttr = getSlotScopeAttribute(scopeId);

    cssText = await config.sys.scopeCss(cssText, scopeAttribute, hostScopeAttr, slotScopeAttr);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
  return cssText;
}
