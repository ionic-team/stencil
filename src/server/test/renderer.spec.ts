import { ComponentConstructor, ComponentMeta, ComponentRegistry, Config } from '../../declarations';
import { Renderer } from '../index';
import { h } from '../../core/renderer/h';
import { MEMBER_TYPE, PROP_TYPE } from '../../util/constants';
import { mockConfig } from '../../testing/mocks';


describe('Renderer', () => {

  let config: Config;
  let renderer: Renderer;

  beforeEach(() => {
    config = mockConfig();
  });

  it('hydrate elm attributes', async () => {
    const MyButton: ComponentConstructor = class {
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

    const cmpRegistry: ComponentRegistry = {
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
      } as ComponentMeta
    };

    renderer = new Renderer(config, cmpRegistry);
    const results = await renderer.hydrate({
      html: `<my-button size="big">Test</my-button>`
    });

    expect(results.diagnostics).toHaveLength(0);
    expect(results.html).toContain(`<button class="button-big"`);
  });

});
