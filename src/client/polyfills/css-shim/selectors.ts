import { CSSScope, CSSSelector, CSSTemplate, Declaration } from './interfaces';
import { StyleNode, types } from './css-parser';
import { compileTemplate, executeTemplate } from './template';
import { getScopesForElement } from './scope';

export function resolveValues(selectors: CSSSelector[]) {
  const props: {[prop: string]: CSSTemplate} = {};
  selectors.forEach(selector => {
    selector.declarations.forEach(dec => {
      props[dec.prop] = dec.value;
    });
  });

  const propsValues: any = {};
  const entries = Object.entries(props);

  for (let i = 0; i < 10; i++) {
    let dirty = false;
    entries.forEach(([key, value]) => {
      const propValue = executeTemplate(value, propsValues);
      if (propValue !== propsValues[key]) {
        propsValues[key] = propValue;
        dirty = true;
      }
    });
    if (!dirty) {
      break;
    }
  }
  return propsValues;
}


export function getSelectors(root: StyleNode, index = 0): CSSSelector[] {
  if (!root.rules) {
    return [];
  }
  const selectors: CSSSelector[] = [];

  root.rules
    .filter(rule => rule.type === types.STYLE_RULE)
    .forEach(rule => {
      const declarations = getDeclarations(rule.cssText);
      if (declarations.length > 0) {
        rule.parsedSelector.split(',').forEach(selector => {
          selector = selector.trim();
          selectors.push({
            selector: selector,
            declarations,
            specificity: computeSpecificity(selector),
            nu: index
          });
        });
      }
      index++;
    });

  return selectors;
}

export function computeSpecificity(_selector: string): number {
  return 1;
}

const IMPORTANT = '!important';
const FIND_DECLARATIONS = /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gm;

export function getDeclarations(cssText: string) {
  const declarations: Declaration[]  = [];
  let xArray;
  while (xArray = FIND_DECLARATIONS.exec(cssText.trim())) {
    const { value, important } = normalizeValue(xArray[2]);
    declarations.push({
      prop: xArray[1].trim(),
      value: compileTemplate(value),
      important,
    });
  }
  return declarations;
}

export function normalizeValue(value: string) {
  const regex = /\s+/gim;
  value = value.replace(regex, ' ').trim();
  const important = value.endsWith(IMPORTANT);
  if (important) {
    value = value.substr(0, value.length - IMPORTANT.length).trim();
  }
  return {
    value,
    important
  };
}

export function getActiveSelectors(
  hostEl: HTMLElement,
  hostScopeMap: WeakMap<HTMLElement, CSSScope>,
  globalScopes: CSSScope[],
): CSSSelector[] {

  // computes the css scopes that might affect this particular element
  const scopes = [
    // globalScopes are always took into account
    ...globalScopes,

    // the parent scopes are computed by walking parent dom until <html> is reached
    ...getScopesForElement(hostScopeMap, hostEl)
  ];

  // each scope might have an array of associated selectors
  // let's flatten the complete array of selectors from all the scopes
  const selectorSet = getSelectorsForScopes(scopes);

  // we filter to only the selectors that matches the hostEl
  const activeSelectors = selectorSet.filter(selector => matches(hostEl, selector.selector));

  // sort selectors by specifity
  return sortSelectors(activeSelectors);
}


export function getSelectorsForScopes(scopes: CSSScope[]) {
  const selectors: CSSSelector[] = [];
  scopes.forEach(scope => {
    selectors.push(...scope.selectors);
  });
  return selectors;
}

export function sortSelectors(selectors: CSSSelector[]) {
  selectors.sort((a, b) => {
    if (a.specificity === b.specificity) {
      return a.nu - b.nu;
    }
    return a.specificity - b.specificity;
  });
  return selectors;
}

export function matches(el: HTMLElement, selector: string) {
  return el.matches(selector);
}
