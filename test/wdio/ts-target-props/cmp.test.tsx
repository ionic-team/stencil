import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

import { setupIFrameTest } from '../util.js';

const testSuites = async (root: HTMLTsTargetPropsElement) => {
  function getTxt(selector: string) {
    browser.waitUntil(() => !!root.querySelector(selector), { timeout: 3000 });
    return root.querySelector(selector).textContent.trim();
  }

  return {
    defaultValue: async () => {
      expect(getTxt('.basicProp')).toBe('basicProp');
      expect(getTxt('.decoratedProp')).toBe('-5');
      expect(getTxt('.decoratedGetterSetterProp')).toBe('999');
      expect(getTxt('.basicState')).toBe('basicState');
      expect(getTxt('.decoratedState')).toBe('10');
    },
    viaAttributes: async () => {
      root.setAttribute('decorated-prop', '200');
      root.setAttribute('decorated-getter-setter-prop', '-5');
      root.setAttribute('basic-prop', 'basicProp via attribute');
      root.setAttribute('basic-state', 'basicState via attribute');
      root.setAttribute('decorated-state', 'decoratedState via attribute');

      await browser.pause(100);

      expect(getTxt('.basicProp')).toBe('basicProp via attribute');
      expect(getTxt('.decoratedProp')).toBe('25');
      expect(getTxt('.decoratedGetterSetterProp')).toBe('0');
      expect(getTxt('.basicState')).toBe('basicState');
      expect(getTxt('.decoratedState')).toBe('10');
    },
    viaProps: async (nativeElement: boolean = false) => {
      root.basicProp = 'basicProp via prop';
      root.decoratedProp = -3;
      root.decoratedGetterSetterProp = 543;
      // @ts-ignore
      root.basicState = 'basicState via prop';
      // @ts-ignore
      root.decoratedState = 3;

      await browser.pause(100);

      expect(getTxt('.basicProp')).toBe('basicProp via prop');
      expect(getTxt('.decoratedProp')).toBe('-3');
      expect(getTxt('.decoratedGetterSetterProp')).toBe('543');

      // you can change internal state via prop within native elements because the class instance === the element
      const basicStateMatch = !nativeElement ? 'basicState' : 'basicState via prop';
      expect(getTxt('.basicState')).toBe(basicStateMatch);
      const decoratedStateMatch = !nativeElement ? '10' : '3';
      expect(getTxt('.decoratedState')).toBe(decoratedStateMatch);
    },
    reflectsStateChanges: async () => {
      const buttons = root.querySelectorAll('button');
      expect(getTxt('.basicState')).toBe('basicState');
      expect(getTxt('.decoratedState')).toBe('10');

      buttons[0].click();
      await browser.pause(100);
      expect(getTxt('.basicState')).toBe('basicState changed');

      buttons[1].click();
      await browser.pause(100);
      expect(getTxt('.decoratedState')).toBe('0');
    },
  };
};

describe('Checks class properties and runtime decorators of different es targets', () => {
  describe('default / control - 2017 dist output', () => {
    it('renders default values', async () => {
      render({ template: () => <ts-target-props /> });
      await (await $('ts-target-props')).waitForStable();
      await (await testSuites(document.querySelector('ts-target-props'))).defaultValue();
    });

    it('re-renders values via attributes', async () => {
      render({ template: () => <ts-target-props /> });
      await (await $('ts-target-props')).waitForStable();
      await (await testSuites(document.querySelector('ts-target-props'))).viaAttributes();
    });

    it('re-renders values via props', async () => {
      render({
        html: `
        <ts-target-props></ts-target-props>`,
      });
      await (await $('ts-target-props')).waitForStable();
      await (await testSuites(document.querySelector('ts-target-props'))).viaProps();
    });

    it('reflects internal state changes to the dom', async () => {
      render({ template: () => <ts-target-props /> });
      await (await $('ts-target-props')).waitForStable();
      await (await testSuites(document.querySelector('ts-target-props'))).reflectsStateChanges();
    });
  });

  describe('es2022 dist output', () => {
    let frameContent: HTMLElement;

    beforeEach(async () => {
      frameContent = await setupIFrameTest('/ts-target-props/es2022.dist.html', 'es2022-dist');
      const frameEle = await browser.$('#es2022-dist');
      frameEle.waitUntil(async () => !!frameContent.querySelector('.basicState'), { timeout: 5000 });
    });

    it('renders default values', async () => {
      const { defaultValue } = await testSuites(frameContent.querySelector('ts-target-props'));
      await defaultValue();
    });

    it('re-renders values via attributes', async () => {
      const { viaAttributes } = await testSuites(frameContent.querySelector('ts-target-props'));
      await viaAttributes();
    });

    it('re-renders values via props', async () => {
      const { viaProps } = await testSuites(frameContent.querySelector('ts-target-props'));
      await viaProps();
    });

    it('reflects internal state changes to the dom', async () => {
      const { reflectsStateChanges } = await testSuites(frameContent.querySelector('ts-target-props'));
      await reflectsStateChanges();
    });
  });

  describe('es2022 dist-custom-elements output', () => {
    let frameContent: HTMLElement;

    beforeEach(async () => {
      await browser.switchToParentFrame();
      frameContent = await setupIFrameTest('/ts-target-props/es2022.custom-element.html', 'es2022-custom-elements');
      const frameEle = await browser.$('iframe#es2022-custom-elements');
      frameEle.waitUntil(async () => !!frameContent.querySelector('.basicState'), { timeout: 5000 });
    });

    it('renders default values', async () => {
      const { defaultValue } = await testSuites(frameContent.querySelector('ts-target-props'));
      await defaultValue();
    });

    it('re-renders values via attributes', async () => {
      const { viaAttributes } = await testSuites(frameContent.querySelector('ts-target-props'));
      await viaAttributes();
    });

    it('re-renders values via props', async () => {
      const { viaProps } = await testSuites(frameContent.querySelector('ts-target-props'));
      await viaProps(true);
    });

    it('reflects internal state changes to the dom', async () => {
      const { reflectsStateChanges } = await testSuites(frameContent.querySelector('ts-target-props'));
      await reflectsStateChanges();
    });
  });
});
