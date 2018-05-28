import * as d from '../../declarations';
import { catchError } from '../util';


export async function scopeComponentCss(config: d.Config, buildCtx: d.BuildCtx, cmpMeta: d.ComponentMeta, cssText: string) {
  try {
    const scopeAttribute = getScopeAttribute(cmpMeta);
    const hostScopeAttr = getHostScopeAttribute(cmpMeta);
    const slotScopeAttr = getSlotScopeAttribute(cmpMeta);

    cssText = await config.sys.scopeCss(cssText, scopeAttribute, hostScopeAttr, slotScopeAttr);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  return cssText;
}


export function getScopeAttribute(cmpMeta: d.ComponentMeta) {
  return `data-${cmpMeta.tagNameMeta}`;
}


export function getHostScopeAttribute(cmpMeta: d.ComponentMeta) {
  return `data-${cmpMeta.tagNameMeta}-host`;
}


export function getSlotScopeAttribute(cmpMeta: d.ComponentMeta) {
  return `data-${cmpMeta.tagNameMeta}-slot`;
}
