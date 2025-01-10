import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

import { setupIFrameTest } from '../util.js';

const testSuites = async (browser) => {
  const ele = await $('ts-target-props');
  await ele.waitForDisplayed({ timeout: 5000 });

  return {
    defaultValue: async () => {
      expect(await $('.basicProp').getText()).toBe('basicProp');
      expect(await $('.decoratedProp').getText()).toBe('-5');
      expect(await $('.decoratedGetterSetterProp').getText()).toBe('999');
      expect(await $('.basicState').getText()).toBe('basicState');
      expect(await $('.decoratedState').getText()).toBe('10');
    },
    viaAttributes: async () => {
      await browser.execute(() => {
        const elm = document.querySelector('ts-target-props');
        elm.setAttribute('decorated-prop', '200');
        elm.setAttribute('decorated-getter-setter-prop', '-5');
        elm.setAttribute('basic-prop', 'basicProp via attribute');
        elm.setAttribute('basic-state', 'basicState via attribute');
        elm.setAttribute('decorated-state', 'decoratedState via attribute');
        return;
      });

      expect(await $('.basicProp').getText()).toBe('basicProp via attribute');
      expect(await $('.decoratedProp').getText()).toBe('25');
      expect(await $('.decoratedGetterSetterProp').getText()).toBe('0');
      expect(await $('.basicState').getText()).toBe('basicState');
      expect(await $('.decoratedState').getText()).toBe('10');
    },
    viaProps: async (nativeElement: boolean = false) => {
      await browser.execute(() => {
        const elm = document.querySelector('ts-target-props');
        elm.basicProp = 'basicProp via prop';
        elm.decoratedProp = -3;
        elm.decoratedGetterSetterProp = 543;
        // @ts-ignore
        elm.basicState = 'basicState via prop';
        // @ts-ignore
        elm.decoratedState = 3;
        return;
      });

      expect(await $('.basicProp').getText()).toBe('basicProp via prop');
      expect(await $('.decoratedProp').getText()).toBe('-3');
      expect(await $('.decoratedGetterSetterProp').getText()).toBe('543');
      expect(await $('.decoratedState').getText()).toBe('10');

      // you can change internal state via prop within native elements because the class instance === the element
      const basicStateMatch = !nativeElement ? 'basicState' : 'basicState via prop';
      expect(await $('.basicState').getText()).toBe(basicStateMatch);
      const decoratedStateMatch = !nativeElement ? '10' : '3';
      expect(await $('.decoratedState').getText()).toBe(decoratedStateMatch);
    },
    reflectsStateChanges: async (nativeElement: boolean = false) => {
      const buttons = await $$('button');
      const basicStateMatch = !nativeElement ? 'basicState' : 'basicState via prop';
      expect(await $('.basicState').getText()).toBe(basicStateMatch);
      const decoratedStateMatch = !nativeElement ? '10' : '3';
      expect(await $('.decoratedState').getText()).toBe(decoratedStateMatch);

      buttons[0].click();
      await $('ts-target-props').waitForStable();
      expect(await $('.basicState').getText()).toBe('basicState changed');

      buttons[1].click();
      await $('ts-target-props').waitForStable();
      expect(await $('.decoratedState').getText()).toBe('0');
    },
  };
};

describe('Checks class properties and runtime decorators of different es targets', () => {
  describe('default / control - 2017 dist output', () => {
    it('renders default values', async () => {
      render({ template: () => <ts-target-props /> });
      await (await testSuites(browser)).defaultValue();
    });

    it('re-renders values via attributes', async () => {
      render({ template: () => <ts-target-props /> });
      await (await testSuites(browser)).viaAttributes();
    });

    it('re-renders values via props', async () => {
      render({
        html: `
        <ts-target-props></ts-target-props>`,
      });
      await (await testSuites(browser)).viaProps();
    });

    it('reflects internal state changes to the dom', async () => {
      render({ template: () => <ts-target-props /> });
      await (await testSuites(browser)).reflectsStateChanges();
    });
  });

  describe('es2022 dist output', () => {
    before(async () => {
      await browser.switchToParentFrame();
      const frameContent = await setupIFrameTest('/ts-target-props/es2022.dist.html', 'es2022-dist');
      const frameEle = await browser.$('#es2022-dist');
      frameEle.waitUntil(async () => !!frameContent.querySelector('.basicState'), { timeout: 5000 });
      await browser.switchToFrame(frameEle);
    });

    it('renders default values', async () => {
      const { defaultValue } = await testSuites(browser);
      await defaultValue();
    });

    it('re-renders values via attributes', async () => {
      const { viaAttributes } = await testSuites(browser);
      await viaAttributes();
    });

    it('re-renders values via props', async () => {
      const { viaProps } = await testSuites(browser);
      await viaProps();
    });

    it('reflects internal state changes to the dom', async () => {
      const { reflectsStateChanges } = await testSuites(browser);
      await reflectsStateChanges();
    });
  });

  describe('es2022 dist-custom-elements output', () => {
    before(async () => {
      await browser.switchToParentFrame();
      await setupIFrameTest('/ts-target-props/es2022.custom-element.html', 'es2022-custom-elements');
      const frameEle = await browser.$('iframe#es2022-custom-elements');
      await browser.switchToFrame(frameEle);
    });

    it('renders default values', async () => {
      const { defaultValue } = await testSuites(browser);
      await defaultValue();
    });

    it('re-renders values via attributes', async () => {
      const { viaAttributes } = await testSuites(browser);
      await viaAttributes();
    });

    it('re-renders values via props', async () => {
      const { viaProps } = await testSuites(browser);
      await viaProps(true);
    });

    it('reflects internal state changes to the dom', async () => {
      const { reflectsStateChanges } = await testSuites(browser);
      await reflectsStateChanges();
    });
  });
});
