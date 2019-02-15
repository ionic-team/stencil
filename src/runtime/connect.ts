import { doc } from '@platform';


export const getConnect = (tagName: string) => {
  function componentOnReady(): Promise<any> {
    let element = doc.querySelector(tagName) as any;
    if (!element) {
      element = doc.createElement(tagName);
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
}
