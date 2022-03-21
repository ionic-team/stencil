import type * as d from '../../../declarations';

import { generateComponentTypes } from "../generate-component-types";


describe('generateComponentTypes', () => {

  describe('generating event types', () => {

    let res: d.TypesModule;

    beforeEach(() => {
      res = generateComponentTypes(<any>{
        tagName: 'my-component',
        properties: [],
        virtualProperties: [],
        methods: [],
        events: [{
          name: 'ionChange',
          complexType: {
            original: 'number'
          },
          internal: false,
          docs: {
            text: '',
            tags: []
          }
        }]
      }, false);
    });

    it('jsx types should include the custom events', () => {
      expect(res.jsx).toContain('"onIonChange"?: (event: ComponentEvents.MyComponentEventDetail<number>) => void');
    });

  });


});
