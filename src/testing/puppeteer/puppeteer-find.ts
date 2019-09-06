import * as pd from './puppeteer-declarations';
import { E2EElement } from './puppeteer-element';
import * as puppeteer from 'puppeteer';


export async function find(page: pd.E2EPageInternal, rootHandle: puppeteer.ElementHandle, selector: pd.FindSelector) {
  const { lightSelector, shadowSelector, text, contains } = getSelector(selector);

  let elmHandle: puppeteer.ElementHandle;

  if (typeof lightSelector === 'string') {
    elmHandle = await findWithCssSelector(page, rootHandle, lightSelector, shadowSelector);

  } else {
    elmHandle = await findWithText(page, rootHandle, text, contains);
  }

  if (!elmHandle) {
    return null;
  }

  const elm = new E2EElement(page, elmHandle);
  await elm.e2eSync();
  return elm;
}


async function findWithCssSelector(page: pd.E2EPageInternal, rootHandle: puppeteer.ElementHandle, lightSelector: string, shadowSelector: string) {
  let elmHandle = await rootHandle.$(lightSelector);

  if (!elmHandle) {
    return null;
  }

  if (shadowSelector) {
    const shadowHandle = await page.evaluateHandle((elm: HTMLElement, shadowSelector: string) => {

      if (!elm.shadowRoot) {
        throw new Error(`shadow root does not exist for element: ${elm.tagName.toLowerCase()}`);
      }

      return elm.shadowRoot.querySelector(shadowSelector);

    }, elmHandle, shadowSelector);

    await elmHandle.dispose();

    if (!shadowHandle) {
      return null;
    }

    elmHandle = shadowHandle.asElement();
  }

  return elmHandle;
}


async function findWithText(page: pd.E2EPageInternal, rootHandle: puppeteer.ElementHandle, text: string, contains: string) {
  const jsHandle = await page.evaluateHandle((rootElm: HTMLElement, text: string, contains: string) => {
    let foundElm: any = null;

    function checkContent(elm: Node) {
      if (!elm || foundElm) {
        return;
      }

      if (elm.nodeType === 3) {
        if (typeof text === 'string' && elm.textContent.trim() === text) {
          foundElm = elm.parentElement;
          return;
        }
        if (typeof contains === 'string' && elm.textContent.includes(contains)) {
          foundElm = elm.parentElement;
          return;
        }
      } else {
        if (elm.nodeName === 'SCRIPT' || elm.nodeName === 'STYLE') {
          return;
        }
        checkContent((elm as Element).shadowRoot);
        if (elm.childNodes) {
          for (let i = 0; i < elm.childNodes.length; i++) {
            checkContent(elm.childNodes[i]);
          }
        }
      }
    }

    checkContent(rootElm);

    return foundElm;

  }, rootHandle, text, contains);

  if (jsHandle) {
    return jsHandle.asElement();
  }

  return null;
}


export async function findAll(page: pd.E2EPageInternal, rootHandle: puppeteer.ElementHandle, selector: pd.FindSelector) {
  const foundElms: E2EElement[] = [];

  const { lightSelector, shadowSelector } = getSelector(selector);

  const lightElmHandles = await rootHandle.$$(lightSelector);
  if (lightElmHandles.length === 0) {
    return foundElms;
  }

  if (shadowSelector) {
    // light dom selected, then shadow dom selected inside of light dom elements
    for (let i = 0; i < lightElmHandles.length; i++) {
      const executionContext = lightElmHandles[i].executionContext();

      const shadowJsHandle = await executionContext.evaluateHandle((elm, shadowSelector) => {
        if (!elm.shadowRoot) {
          throw new Error(`shadow root does not exist for element: ${elm.tagName.toLowerCase()}`);
        }

        return elm.shadowRoot.querySelectorAll(shadowSelector);

      }, lightElmHandles[i], shadowSelector);

      await lightElmHandles[i].dispose();

      const shadowJsProperties = await shadowJsHandle.getProperties();
      await shadowJsHandle.dispose();

      for (const shadowJsProperty of shadowJsProperties.values()) {
        const shadowElmHandle = shadowJsProperty.asElement();
        if (shadowElmHandle) {
          const elm = new E2EElement(page, shadowElmHandle);
          await elm.e2eSync();
          foundElms.push(elm);
        }
      }
    }

  } else {
    // light dom only
    for (let i = 0; i < lightElmHandles.length; i++) {
      const elm = new E2EElement(page, lightElmHandles[i]);
      await elm.e2eSync();
      foundElms.push(elm);
    }
  }

  return foundElms;
}


function getSelector(selector: pd.FindSelector) {
  const rtn = {
    lightSelector: null as string,
    shadowSelector: null as string,
    text: null as string,
    contains: null as string
  };

  if (typeof selector === 'string') {
    const splt = selector.split('>>>');

    rtn.lightSelector = splt[0].trim();
    rtn.shadowSelector = (splt.length > 1 ? splt[1].trim() : null);

  } else if (typeof selector.text === 'string') {
    rtn.text = selector.text.trim();

  } else if (typeof selector.contains === 'string') {
    rtn.contains = selector.contains.trim();

  } else {
    throw new Error(`invalid find selector: ${selector}`);
  }

  return rtn;
}
