import { getDoc } from '@platform';


export const getConnect = (elm: HTMLElement, tagName: string) => {
  function componentOnReady(): Promise<any> {
    let element = getDoc(elm).querySelector(tagName) as any;
    if (!element) {
      element = getDoc(elm).createElement(tagName);
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
