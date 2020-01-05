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
  return matchesSelectors(selectors, elm) !== null;
}


export function selectOne(selector: string, elm: MockElement) {
  const selectors = parse(selector);
  return selectOneRecursion(selectors, elm);
}


function selectOneRecursion(selectors: Selector[][], elm: MockElement): MockElement {
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
    const selectedElm = matchesSelectors(selectors, children[i]);
    if (selectedElm) {
      return selectedElm;
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
    const selectedElm = matchesSelectors(selectors, children[i]);
    if (selectedElm) {
      found.push(children[i]);
    }
    selectAllRecursion(selectors, children[i], found);
  }
}


function matchesSelectors(selectors: Selector[][], elm: MockElement): MockElement {
  for (let i = 0, ii = selectors.length; i < ii; i++) {
    const selectedElm = matchesEverySelector(selectors[i], elm);
    if (selectedElm) {
      return selectedElm;
    }
  }
  return null;
}


function matchesEverySelector(selectorData: Selector[], elm: MockElement): MockElement {
  let currElm = elm;
  for (let i = 0, ii = selectorData.length; i < ii; i++) {
    if (isCssCombinator(selectorData[i])) { 
      const childSelectors = selectorData.slice(i+1);
      if (childSelectors.length == 0) {
        return null;
      }
      return matchChildElements(childSelectors, elm.children);
    }
    else if (matchesSelector(selectorData[i], currElm) === false) {
      return null;
    }
  }
  return currElm;
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
  }

  return false;
}

function isCssCombinator(selectorData: Selector) {
  if (selectorData.type === 'child') {
    return true;
  }

  // TODO: handle other combinators
  return false;
}

function matchChildElements(selectorData: Selector[], children: MockElement[]) {
  for (const child of children) {
    const s = matchesEverySelector(selectorData, child);
    if (s) {
      return s;
    }
  }
  return null;

}
