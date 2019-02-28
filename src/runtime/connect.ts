import { getDocument } from '@platform';


export const getConnect = (elm: HTMLElement, tagName: string) => {
  function componentOnReady(): Promise<any> {
    let element = getDocument(elm).querySelector(tagName) as any;
    if (!element) {
      element = getDocument(elm).createElement(tagName);
    }
    return element.componentOnReady();
  }

  function create() {
    return componentOnReady()
      .then(el => el.create(...arguments));
  }
  return {
    create,
    componentOnReady,
  };
};
