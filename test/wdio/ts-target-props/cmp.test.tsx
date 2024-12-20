import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

import { setupIFrameTest } from '../util.js';

const testSuites = async (browser) => {
  await $('ts-target-props').waitForStable();

  return {
    defaultValue: (root: HTMLElement) => {
      expect(root.querySelector('.basicProp').textContent).toBe('basicProp');
      expect(root.querySelector('.decoratedProp').textContent).toBe('decoratedProp');
      expect(root.querySelector('.decoratedGetterSetterProp').textContent).toBe('decoratedGetterSetterProp');
      expect(root.querySelector('.basicState').textContent).toBe('basicState');
      expect(root.querySelector('.decoratedState').textContent).toBe('decoratedState');
    },
    viaAttributes: async (root: HTMLElement) => {
      root.setAttribute('decorated-prop', 'decoratedProp via attribute');
      root.setAttribute('decorated-getter-setter-prop', 'decoratedGetterSetterProp via attribute');
      root.setAttribute('basic-prop', 'basicProp via attribute');
      root.setAttribute('basic-state', 'basicState via attribute');
      root.setAttribute('decorated-state', 'decoratedState via attribute');

      await $('ts-target-props').waitForStable();

      expect(root.querySelector('.basicProp').textContent).toBe('basicProp via attribute');
      expect(root.querySelector('.decoratedProp').textContent).toBe('decoratedProp via attribute');
      expect(root.querySelector('.decoratedGetterSetterProp').textContent).toBe(
        'decoratedGetterSetterProp via attribute',
      );
      expect(root.querySelector('.basicState').textContent).toBe('basicState');
      expect(root.querySelector('.decoratedState').textContent).toBe('decoratedState');
    },
    viaProps: async (root: HTMLElement) => {
      await browser.execute(() => {
        const elm = document.querySelector('ts-target-props');
        elm.basicProp = 'basicProp via prop';
        elm.decoratedProp = 'decoratedProp via prop';
        elm.decoratedGetterSetterProp = 'decoratedGetterSetterProp via prop';
        // @ts-ignore
        elm.basicState = 'basicState via prop';
        // @ts-ignore
        elm.decoratedState = 'decoratedState via prop';
      });
      await $('ts-target-props').waitForStable();

      expect(root.querySelector('.basicProp').textContent).toBe('basicProp via prop');
      expect(root.querySelector('.decoratedProp').textContent).toBe('decoratedProp via prop');
      expect(root.querySelector('.decoratedGetterSetterProp').textContent).toBe('decoratedGetterSetterProp via prop');
      expect(root.querySelector('.basicState').textContent).toBe('basicState');
      expect(root.querySelector('.decoratedState').textContent).toBe('decoratedState');
    },
    reflectsStateChanges: async (root: HTMLElement) => {
      const buttons = root.querySelectorAll('button');
      expect(root.querySelector('.basicState').textContent).toBe('basicState');
      expect(root.querySelector('.decoratedState').textContent).toBe('decoratedState');
      buttons[0].click();
      expect(root.querySelector('.basicState').textContent).toBe('basicState changed');
      buttons[1].click();
      expect(root.querySelector('.decoratedState').textContent).toBe('decoratedState changed');
    },
    decorators: (root: HTMLElement) => {
      const buttons = root.querySelectorAll('button');
      // @ts-ignore
      expect(root.__decoratedProp()).toBe('decoratedProp decorated!');
      // @ts-ignore
      expect(root.__decoratedGetterSetterProp()).toBe('decoratedGetterSetterProp decorated!');
      // @ts-ignore
      expect(root.__decoratedState()).toBe('decoratedState decorated!');
      buttons[1].click();
      // @ts-ignore
      expect(root.__decoratedState()).toBe('decoratedState changed  decorated!');
    },
  };
};

describe('Checks class properties and runtime decorators of different es targets', () => {
  describe('default / control - 2017 dist output', () => {
    it('renders default values', async () => {
      render({ template: () => <ts-target-props /> });
      (await testSuites(browser)).defaultValue(document.querySelector('ts-target-props'));
    });

    it('re-renders values via attributes', async () => {
      render({ template: () => <ts-target-props /> });
      (await testSuites(browser)).viaAttributes(document.querySelector('ts-target-props'));
    });

    it('re-renders values via props', async () => {
      render({
        html: `
        <ts-target-props></ts-target-props>`,
      });
      (await testSuites(browser)).viaProps(document.querySelector('ts-target-props'));
    });

    it('reflects internal state changes to the dom', async () => {
      render({ template: () => <ts-target-props /> });
      (await testSuites(browser)).reflectsStateChanges(document.querySelector('ts-target-props'));
    });

    it('makes sure decorators "work"', async () => {
      render({ template: () => <ts-target-props /> });
      (await testSuites(browser)).decorators(document.querySelector('ts-target-props'));
    });
  });

  describe('es2022 dist output', () => {
    let iframe: HTMLElement;

    it('renders default values', async () => {
      iframe = await setupIFrameTest('/ts-target-props/es2022.dist.html');
      browser.switchToFrame(iframe);
      (await testSuites(browser)).defaultValue(iframe.querySelector('ts-target-props'));
    });

    it('re-renders values via attributes', async () => {
      iframe = await setupIFrameTest('/ts-target-props/es2022.dist.html');
      browser.switchToFrame(iframe);
      (await testSuites(browser)).viaAttributes(iframe.querySelector('ts-target-props'));
    });

    it('re-renders values via props', async () => {
      iframe = await setupIFrameTest('/ts-target-props/es2022.dist.html');
      browser.switchToFrame(iframe);
      (await testSuites(browser)).viaProps(iframe.querySelector('ts-target-props'));
    });

    it('reflects internal state changes to the dom', async () => {
      iframe = await setupIFrameTest('/ts-target-props/es2022.dist.html');
      browser.switchToFrame(iframe);
      (await testSuites(browser)).reflectsStateChanges(iframe.querySelector('ts-target-props'));
    });

    it('makes sure decorators "work"', async () => {
      iframe = await setupIFrameTest('/ts-target-props/es2022.dist.html');
      browser.switchToFrame(iframe);
      (await testSuites(browser)).decorators(iframe.querySelector('ts-target-props'));
    });
  });

  describe('es2022 dist-custom-elements output', () => {
    let iframe: HTMLElement;

    it('renders default values', async () => {
      iframe = await setupIFrameTest('/ts-target-props/es2022.custom-element.html');
      browser.switchToFrame(iframe);
      (await testSuites(browser)).defaultValue(iframe.querySelector('ts-target-props'));
    });

    it('re-renders values via attributes', async () => {
      iframe = await setupIFrameTest('/ts-target-props/es2022.custom-element.html');
      browser.switchToFrame(iframe);
      (await testSuites(browser)).viaAttributes(iframe.querySelector('ts-target-props'));
    });

    it('re-renders values via props', async () => {
      iframe = await setupIFrameTest('/ts-target-props/es2022.custom-element.html');
      browser.switchToFrame(iframe);
      (await testSuites(browser)).viaProps(iframe.querySelector('ts-target-props'));
    });

    it('reflects internal state changes to the dom', async () => {
      iframe = await setupIFrameTest('/ts-target-props/es2022.custom-element.html');
      browser.switchToFrame(iframe);
      (await testSuites(browser)).reflectsStateChanges(iframe.querySelector('ts-target-props'));
    });

    it('makes sure decorators "work"', async () => {
      iframe = await setupIFrameTest('/ts-target-props/es2022.custom-element.html');
      browser.switchToFrame(iframe);
      (await testSuites(browser)).decorators(iframe.querySelector('ts-target-props'));
    });
  });
});
