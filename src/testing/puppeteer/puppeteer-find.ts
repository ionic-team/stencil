import * as pd from './puppeteer-declarations';
import { E2EElement } from './puppeteer-element';
import * as puppeteer from 'puppeteer';


export async function find(page: pd.E2EPageInternal, rootHandle: puppeteer.ElementHandle, selector: string) {
  const { lightSelector, shadowSelector } = getSelector(selector);

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

  const elm = new E2EElement(page, elmHandle);
  await elm.e2eSync();
  return elm;
}


export async function findAll(page: pd.E2EPageInternal, rootHandle: puppeteer.ElementHandle, selector: string) {
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


function getSelector(selector: string) {
  const splt = selector.split('>>>');

  const lightSelector = splt[0].trim();
  const shadowSelector = (splt.length > 1 ? splt[1].trim() : null);

  return { lightSelector, shadowSelector };
}
