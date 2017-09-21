import addJsxTypes from '../add-jsx-types';
import { ModuleFiles } from '../../../../util/interfaces';
import { transformSourceString } from '../util';
import * as ts from 'typescript';


describe('add-jsx-types transform', () => {

  describe('baseline test', () => {
    it('simple test', () => {
      const files: ModuleFiles = {
        'source.ts': {
          cmpMeta: {
            eventsMeta: [],
            hostMeta: {},
            isShadowMeta: false,
            listenersMeta: [],
            membersMeta: {
              activeRouter: {
                ctrlId: 'activeRouter',
                memberType: 3,
              },
              url: {
                attribName: 'url',
                memberType: 1,
              },
            },
            propsDidChangeMeta: [],
            propsWillChangeMeta: [],
            tagNameMeta: 'stencil-router-redirect',
          },
          tsFilePath: '/path/module.tsx',
        }
      };
      const source =
`import { Component, Prop } from "@stencil/core";
import { ActiveRouter, RouterHistory } from "../../global/interfaces";

export class Redirect {
    activeRouter: ActiveRouter;
    url: string;
    componentWillLoad() {
        const history: RouterHistory = this.activeRouter.get("history");
        if (!history) {
            return;
        }
        return history.replace(this.url, {});
    }
}`;

      const output = transformSourceString(source, [addJsxTypes(files)]);

      expect(output).toEqual(
        `h("example-element", { "c": { "red": true } }, t("HI"));\n`
      );
    });
  });
});
