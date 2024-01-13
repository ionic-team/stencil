import { MockElement } from './node';
import jQuery from './third-party/jquery';

export function matches(selector: string, elm: MockElement) {
  const r = jQuery.find(selector, undefined, undefined, [elm]);
  return r.length > 0;
}

export function selectOne(selector: string, elm: MockElement) {
  const r = jQuery.find(selector, elm, undefined, undefined);
  return r[0] || null;
}

export function selectAll(selector: string, elm: MockElement) {
  return jQuery.find(selector, elm, undefined, undefined);
}
