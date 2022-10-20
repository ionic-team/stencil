import Sizzle from 'sizzle';

import { MockElement } from './node';

export function matches(selector: string, elm: MockElement) {
  const r = Sizzle.matches(selector, [elm] as any);
  return r.length > 0;
}

export function selectOne(selector: string, elm: MockElement) {
  const r = Sizzle(selector, elm as any);
  return r[0] || null;
}

export function selectAll(selector: string, elm: MockElement) {
  return Sizzle(selector, elm as any);
}
