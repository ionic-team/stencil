import { MockElement } from './node';
import cssWhat from 'css-what';


export function matches(selector: string, elm: MockElement) {
  const selectors = cssWhat(selector);
  return matchesSelectors(selectors, elm);
}


export function selectOne(selector: string, elm: MockElement) {
  const selectors = cssWhat(selector);
  return selectOneRecursion(selectors, elm);
}


function selectOneRecursion(selectors: cssWhat.ParseResults, elm: MockElement): MockElement {
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
  const selectors = cssWhat(selector);
  const foundElms: MockElement[] = [];
  selectAllRecursion(selectors, elm, foundElms);
  return foundElms;
}

function selectAllRecursion(selectors: cssWhat.ParseResults, elm: MockElement, found: MockElement[]) {
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
    if (matchesSelectors(selectors, children[i]) === true) {
      found.push(children[i]);
    }
    selectAllRecursion(selectors, children[i], found);
  }
}


function matchesSelectors(selectors: cssWhat.ParseResults, elm: MockElement) {
  for (let i = 0, ii = selectors.length; i < ii; i++) {
    if (matchesEverySelector(selectors[i], elm) === true) {
      return true;
    }
  }
  return false;
}


function matchesEverySelector(selectorData: cssWhat.Selector[], elm: MockElement) {
  for (let i = 0, ii = selectorData.length; i < ii; i++) {
    if (matchesSelector(selectorData[i], elm) === false) {
      return false;
    }
  }
  return true;
}


function matchesSelector(selectorData: cssWhat.Selector, elm: MockElement) {
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
