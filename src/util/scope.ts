import * as d from '../declarations';
import { DEFAULT_STYLE_MODE } from './constants';

export function getScopeId(cmpMeta: d.ComponentMeta, mode?: string) {
  const id = `data-${cmpMeta.tagNameMeta}`;
  if (mode && mode !== DEFAULT_STYLE_MODE) {
    return `${id}-${mode}`;
  }
  return id;
}

export function getHostScopeAttribute(scopeId: string) {
  return `${scopeId}-host`;
}

export function getSlotScopeAttribute(scopeId: string) {
  return `${scopeId}-slot`;
}

