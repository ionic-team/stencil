
export function getConnect(tagName: string) {
  return {
    create() {
      let element = document.querySelector(tagName) as any;
      if (!element) {
        element = document.createElement(tagName);
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
