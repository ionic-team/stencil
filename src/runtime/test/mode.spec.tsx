import { Component, setMode, getMode } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('mode', () => {

  it('md mode', async () => {
    setMode(() => 'md');
    @Component({
      tag: 'cmp-a',
      styleUrls: {
        ios: `./ios.css`,
        md: `./ios.css`,
      }
    })
    class CmpA {
      render() {
        return `Hola`;
      }
    }
    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(getMode(root)).toEqual('md');
  });

  it('md mode', async () => {
    setMode(() => 'ios');
    @Component({
      tag: 'cmp-a',
      styles: `div { color: red; }`
    })
    class CmpA {
      render() {
        return `Hola`;
      }
    }
    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(getMode(root)).toEqual('ios');
  });


});
