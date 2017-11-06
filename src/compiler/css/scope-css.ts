import { BuildContext, ComponentMeta } from '../../util/interfaces';
import { catchError } from '../util';
import { ShadowCss } from './shadow-css';


export function scopeComponentCss(ctx: BuildContext, cmpMeta: ComponentMeta, cssText: string) {
  try {
    const scopeAttribute = getScopeAttribute(cmpMeta);
    const hostScopeAttr = getHostScopeAttribute(cmpMeta);
    const slotScopeAttr = getSlotScopeAttribute(cmpMeta);

    cssText = scopeCss(cssText, scopeAttribute, hostScopeAttr, slotScopeAttr);

  } catch (e) {
    catchError(ctx.diagnostics, e);
  }

  return cssText;
}


export function scopeCss(cssText: string, scopeAttribute: string, hostScopeAttr: string, slotScopeAttr: string) {
  const sc = new ShadowCss();
  return sc.shimCssText(cssText, scopeAttribute, hostScopeAttr, slotScopeAttr);
}


export function getScopeAttribute(cmpMeta: ComponentMeta) {
  return `data-${cmpMeta.tagNameMeta}`;
}


export function getHostScopeAttribute(cmpMeta: ComponentMeta) {
  return `data-${cmpMeta.tagNameMeta}-host`;
}


export function getSlotScopeAttribute(cmpMeta: ComponentMeta) {
  return `data-${cmpMeta.tagNameMeta}-slot`;
}
