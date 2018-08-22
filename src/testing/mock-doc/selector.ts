import { MockElement } from './node';


export function selectOne(selector: string, elm: MockElement) {
  const selectors = parseSelector(selector) as SelectorResults;
  return selectOneRecursion(selectors, elm);
}

function selectOneRecursion(selectors: SelectorResults, elm: MockElement): MockElement {
  const children = elm.children;
  for (let i = 0; i < children.length; i++) {
    if (matchesSelectors(selectors, children[i])) {
      return children[i];
    }
    const childMatch = selectOneRecursion(selectors, children[i]);
    if (childMatch) {
      return childMatch;
    }
  }
  return null;
}


export function selectAll(selector: string, elm: MockElement) {
  const selectors = parseSelector(selector);
  const found: MockElement[] = [];
  selectAllRecursion(selectors, elm, found);
  return found;
}

function selectAllRecursion(selectors: SelectorResults, elm: MockElement, found: MockElement[]) {
  const children = elm.children;
  for (let i = 0; i < children.length; i++) {
    if (matchesSelectors(selectors, children[i])) {
      found.push(children[i]);
    }
    selectAllRecursion(selectors, children[i], found);
  }
}


function matchesSelectors(selectors: SelectorResults, elm: MockElement) {
  for (let i = 0; i < selectors.length; i++) {
    if (matchesEverySelector(selectors[i], elm)) {
      return true;
    }
  }
  return false;
}


function matchesEverySelector(selectorData: SelectorData[], elm: MockElement) {
  for (let i = 0; i < selectorData.length; i++) {
    if (!matchesSelector(selectorData[i], elm)) {
      return false;
    }
  }
  return true;
}


function matchesSelector(selectorData: SelectorData, elm: MockElement) {
  switch (selectorData.type) {
    case 'tag':
      return elm.nodeName.toLowerCase() === selectorData.name.toLowerCase();

    case 'attribute':
      if (selectorData.name === 'class') {
        return elm.classList.contains(selectorData.value);
      }
      if (selectorData.action === 'exists') {
        return elm.hasAttribute(selectorData.name);
      }
      if (selectorData.action === 'equals') {
        return elm.getAttribute(selectorData.name) === selectorData.value;
      }
      return false;

    case 'child':
      // TODO
      return true;
  }

  return false;
}


function parseSelector(selector: string) {
  return require('css-what')(selector);
}

export interface SelectorData {
  type: 'tag' | 'child' | 'attribute' | 'universal';
  name: string;
  action: 'exists' | 'equals' | 'element';
  value: string;
}

export type SelectorResults = SelectorData[][];
