import { doc } from '@platform';


export function getConnect(tagName: string) {
  return {
    create() {
      let element = doc.querySelector(tagName) as any;
      if (!element) {
        element = doc.createElement(tagName);
      }
      if (element.componentOnReady) {
        return element.componentOnReady().then(() =>
          element.create(...arguments)
        );
      }
      return undefined;
    }
  };
}
