import * as d from '../declarations';
import { DEFAULT_STYLE_MODE } from './constants';


export function getScopeId(cmpMeta: d.ComponentMeta, mode?: string) {
  return ('scs-' + cmpMeta.tagNameMeta) + ((mode && mode !== DEFAULT_STYLE_MODE) ? '-' + mode : '');
}


export function getElementScopeId(scopeId: string, isHostElement?: boolean) {
  return scopeId + (isHostElement ? '-h' : '-s');
}
