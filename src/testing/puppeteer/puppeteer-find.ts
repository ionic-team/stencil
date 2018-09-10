import * as pd from './puppeteer-declarations';
import { E2EElement } from './puppeteer-element';


export async function find(page: pd.E2EPageInternal, selector: string) {
  const { lightSelector, shadowSelector } = getSelector(selector);

  let elmHandle = await page.$(lightSelector);

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

    if (!shadowHandle) {
      return null;
    }

    elmHandle = shadowHandle.asElement();
  }

  const elm = new E2EElement(page, elmHandle);

  page._elements.push(elm);

  await elm.e2eSync();

  return elm;
}


export async function findAll(page: pd.E2EPageInternal, selector: string) {
  const { lightSelector, shadowSelector } = getSelector(selector);

  if (shadowSelector) {
    //
  }

  const elmHandles = await page.$$(lightSelector);

  const elms = elmHandles.map(async elmHandle => {
    const elm = new E2EElement(page, elmHandle);

    page._elements.push(elm);

    await elm.e2eSync();

    return elm;
  });

  return Promise.all(elms);
}


function getSelector(selector: string) {
  const splt = selector.split('>>>');

  const lightSelector = splt[0].trim();
  const shadowSelector = (splt.length > 1 ? splt[1].trim() : null);

  return { lightSelector, shadowSelector };
}
