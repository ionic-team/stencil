import { MockElement } from './node';
import { Selector, parse } from 'css-what';


export function closest(selector: string, elm: MockElement) {
  while (elm != null) {
    if (elm.matches(selector)) {
      return elm;
    }
    elm = elm.parentNode as any;
  }
  return null;
}


export function matches(selector: string, elm: MockElement) {
  const selectors = parse(selector);
  return matchesSelectors(selectors, elm);
}


export function selectOne(selector: string, elm: MockElement) {
  const selectors = parse(selector);
  return selectOneRecursion(selectors, elm);
}


function selectOneRecursion(selectors: Selector[][], elm: MockElement): MockElement {
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
    if (matchesSelectors(selectors, children[i]) === true) {
      return children[i];
    }
    const childMatch = selectOneRecursion(selectors, children[i]);
    if (childMatch != null) {
      return childMatch;
    }
  }
  return null;
}


export function selectAll(selector: string, elm: MockElement) {
  const selectors = parse(selector);
  const foundElms: MockElement[] = [];
  selectAllRecursion(selectors, elm, foundElms);
  return foundElms;
}

function selectAllRecursion(selectors: Selector[][], elm: MockElement, found: MockElement[]) {
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
    if (matchesSelectors(selectors, children[i]) === true) {
      found.push(children[i]);
    }
    selectAllRecursion(selectors, children[i], found);
  }
}


function matchesSelectors(selectors: Selector[][], elm: MockElement) {
  for (let i = 0, ii = selectors.length; i < ii; i++) {
    if (matchesEverySelector(selectors[i], elm) === true) {
      return true;
    }
  }
  return false;
}


function matchesEverySelector(selectorData: Selector[], elm: MockElement) {
  for (let i = 0, ii = selectorData.length; i < ii; i++) {
    if (matchesSelector(selectorData[i], elm) === false) {
      return false;
    }
  }
  return true;
}


function matchesSelector(selectorData: Selector, elm: MockElement) {
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
