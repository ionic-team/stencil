import { findRegex } from './utils';
import { CSSTemplate, CSSVariables } from './interfaces';
import { COMMENTS, TRAILING_LINES, VAR_ASSIGN_START, VAR_USAGE_START } from './regex';

export function resolveVar(props: CSSVariables, prop: string, fallback: CSSTemplate | undefined): string {
  if (props[prop]) {
    return props[prop];
  }
  if (fallback) {
    return executeTemplate(fallback, props);
  }
  return '';
}

export function findVarEndIndex(cssText: string, offset: number) {
  let count = 0;
  let i = offset;

  for (; i < cssText.length; i++) {
    const c = cssText[i];
    if (c === '(') {
      count++;
    } else if (c === ')') {
      count--;
      if (count <= 0) {
        return i + 1;
      }
    }
  }
  return i;
}

export function parseVar(cssText: string, offset: number) {
  const varPos = findRegex(VAR_USAGE_START, cssText, offset);
  if (!varPos) {
    return null;
  }
  const endVar = findVarEndIndex(cssText, varPos.start);
  const varContent = cssText.substring(varPos.end, endVar - 1);
  const [propName, ...fallback] = varContent.split(',');
  return {
    start: varPos.start,
    end: endVar,
    propName: propName.trim(),
    fallback: fallback.length > 0 ? fallback.join(',').trim() : undefined,
  };
}

export function compileVar(cssText: string, template: CSSTemplate, offset: number): number {
  const varMeta = parseVar(cssText, offset);
  if (!varMeta) {
    template.push(cssText.substring(offset, cssText.length));
    return cssText.length;
  }
  const propName = varMeta.propName;
  const fallback = varMeta.fallback != null ? compileTemplate(varMeta.fallback) : undefined;

  template.push(cssText.substring(offset, varMeta.start), params => resolveVar(params, propName, fallback));
  return varMeta.end;
}

export function executeTemplate(template: CSSTemplate, props: CSSVariables): string {
  let final = '';
  for (let i = 0; i < template.length; i++) {
    const s = template[i];
    final += typeof s === 'string' ? s : s(props);
  }
  return final;
}

export function findEndValue(cssText: string, offset: number): number {
  let onStr = false;
  let double = false;
  let i = offset;
  for (; i < cssText.length; i++) {
    const c = cssText[i];
    if (onStr) {
      if (double && c === '"') {
        onStr = false;
      }
      if (!double && c === "'") {
        onStr = false;
      }
    } else {
      if (c === '"') {
        onStr = true;
        double = true;
      } else if (c === "'") {
        onStr = true;
        double = false;
      } else if (c === ';') {
        return i + 1;
      } else if (c === '}') {
        return i;
      }
    }
  }
  return i;
}

export function removeCustomAssigns(cssText: string) {
  let final = '';
  let offset = 0;
  while (true) {
    const assignPos = findRegex(VAR_ASSIGN_START, cssText, offset);
    const start = assignPos ? assignPos.start : cssText.length;
    final += cssText.substring(offset, start);
    if (assignPos) {
      offset = findEndValue(cssText, start);
    } else {
      break;
    }
  }
  return final;
}

export function compileTemplate(cssText: string): CSSTemplate {
  let index = 0;
  cssText = cssText.replace(COMMENTS, '');

  cssText = removeCustomAssigns(cssText).replace(TRAILING_LINES, '');

  const segments: CSSTemplate = [];
  while (index < cssText.length) {
    index = compileVar(cssText, segments, index);
  }
  return segments;
}
