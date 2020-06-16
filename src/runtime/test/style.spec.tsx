import { Component, setMode, getMode } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

describe('style', () => {
  it('get style string', async () => {
    @Component({
      tag: 'cmp-a',
      styles: `div { color: red; }`,
    })
    class CmpA {
      render() {
        return `innertext`;
      }
    }

    const { root, styles } = await newSpecPage({
      components: [CmpA],
      includeAnnotations: true,
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toHaveClass('hydrated');
    expect(styles.get('sc-cmp-a')).toBe(`div { color: red; }`);
  });

  describe('mode', () => {
    it('md mode', async () => {
      setMode(() => 'md');
      @Component({
        tag: 'cmp-a',
        styles: {
          ios: `:host { color: black }`,
          md: `:host { color: red }`,
        },
      })
      class CmpA {
        render() {
          return `Hola`;
        }
      }

      const { root, styles } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`,
      });

      expect(styles.get('sc-cmp-a-md')).toEqual(':host { color: red }');
      expect(getMode(root)).toEqual('md');
    });

    it('ios mode', async () => {
      setMode(() => 'ios');
      @Component({
        tag: 'cmp-a',
        styles: {
          ios: `:host { color: black };`,
          md: `:host { color: red };`,
        },
      })
      class CmpA {
        render() {
          return `Hola`;
        }
      }
      const { root, styles } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`,
      });

      expect(styles.get('sc-cmp-a-ios')).toEqual(':host { color: black };');
      expect(getMode(root)).toEqual('ios');
    });
  });
});
