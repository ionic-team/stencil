import { getDoc } from '@platform';


export const getConnect = (tagName: string, elm: HTMLElement) => {
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
