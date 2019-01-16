import * as d from '../../declarations';
import { MEMBER_TYPE, PROP_TYPE } from '@stencil/core/utils';
import { mockConfig } from '../../testing/mocks';
import { Renderer, h } from '../index';


describe('Renderer', () => {

  let config: d.Config;
  let renderer: Renderer;

  beforeEach(() => {
    config = mockConfig();
  });

  it('hydrate elm attributes', async () => {
    const MyButton: d.ComponentConstructor = class {
      size = 'default';

      static get is() {
        return 'my-button';
      }
      static get properties() {
        return {
          size: {
            type: String,
            attr: 'size'
          }
        };
      }
      render() {
        return h(`button`, {
          class: {
            'button-default': this.size === 'default',
            'button-big': this.size === 'big'
          }
        }, h(`slot`, null));
      }
    };

    const cmpRegistry: d.ComponentRegistry = {
      'my-button': {
        bundleIds: 'my-button',
        tagNameMeta: 'my-button',
        membersMeta: {
          size: {
            memberType: MEMBER_TYPE.Prop,
            propType: PROP_TYPE.String,
            attribName: 'size'
          }
        },
        componentConstructor: MyButton
      } as d.ComponentMeta
    };

    renderer = new Renderer(config, cmpRegistry);
    const results = await renderer.hydrate({
      html: `<my-button size="big">Test</my-button>`
    });

    expect(results.diagnostics).toHaveLength(0);
    expect(results.html).toContain(`<button class="button-big"`);
  });

});
