import { testClasslist, testAttributes } from '../utils';

const extension = {
  toMatchClasses(element: HTMLElement, classlist: string[]) {
    try {
      testClasslist(element, classlist);
      return {
        message: () => 'expected to not match classes',
        pass: true,
      };
    } catch (msg) {
      return {
        message: () => msg,
        pass: false,
      };
    }
  },
  toMatchAttributes(element: HTMLElement, attributes: { [attr: string]: string }) {
    try {
      testAttributes(element, attributes);
      return {
        message: () => 'expected to not match attributes',
        pass: true,
      };
    } catch (msg) {
      return {
        message: () => msg,
        pass: false,
      };
    }
  }
};

declare global {
  namespace jest {
    interface Matchers {
      toMatchClasses(classlist: string[]): void;
      toMatchAttributes(attributes: { [attr: string]: string }): void;
    }
  }
}

expect.extend(extension);
