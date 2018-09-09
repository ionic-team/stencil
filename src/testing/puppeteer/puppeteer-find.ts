import * as pd from './puppeteer-declarations';
import { E2EElement } from './puppeteer-element';


export async function find(page: pd.E2EPageInternal, selector: string) {
  const { lightSelector, shadowSelector } = getSelector(selector);

  const elmHandle = await page.$(lightSelector);

  if (!elmHandle) {
    return null;
  }

  const elm = new E2EElement(page, elmHandle, shadowSelector);

  page._elements.push(elm);

  await elm.e2eSync();

  return elm;
}


export async function findAll(page: pd.E2EPageInternal, selector: string) {
  const { lightSelector, shadowSelector } = getSelector(selector);

  const elmHandles = await page.$$(lightSelector);

  const elms = elmHandles.map(async elmHandle => {
    const elm = new E2EElement(page, elmHandle, shadowSelector);

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
