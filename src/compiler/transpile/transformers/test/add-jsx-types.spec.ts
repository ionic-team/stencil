import addJsxTypes from '../add-jsx-types';
import { ModuleFiles } from '../../../../util/interfaces';
import { transformSourceString } from '../util';
import {
  TYPE_ANY, TYPE_BOOLEAN, TYPE_NUMBER,
  MEMBER_PROP, MEMBER_METHOD, MEMBER_PROP_CONNECT, MEMBER_PROP_MUTABLE, MEMBER_STATE, MEMBER_PROP_CONTEXT
} from '../../../../util/constants';
import * as ts from 'typescript';


describe('add-jsx-types transform', () => {

  describe('baseline test', () => {
    it('simple test', () => {
      const files: ModuleFiles = {
        'source.ts': {
          cmpMeta: {
            componentClass: 'Redirect',
            eventsMeta: [],
            hostMeta: {},
            isShadowMeta: false,
            listenersMeta: [],
            membersMeta: {
              activeRouter: {
                ctrlId: 'activeRouter',
                memberType: MEMBER_PROP_CONTEXT
              },
              url: {
                attribName: 'url',
                memberType: MEMBER_STATE,
              },
              thing: {
                attribName: 'thing',
                memberType: MEMBER_PROP
              },
              other: {
                attribName: 'otherNumber',
                memberType: MEMBER_METHOD,
                propType: TYPE_NUMBER
              }
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
}
interface HTMLStencilRouterRedirectElement extends Redirect, HTMLElement {
}
declare var HTMLStencilRouterRedirectElement: {
    prototype: HTMLStencilRouterRedirectElement;
    new (): HTMLStencilRouterRedirectElement;
};
declare global {
    interface HTMLElementTagNameMap {
        "stencil-router-redirect": HTMLStencilRouterRedirectElement;
    }
    interface ElementTagNameMap {
        "stencil-router-redirect": HTMLStencilRouterRedirectElement;
    }
    namespace JSX {
        interface IntrinsicElements {
            "stencil-router-redirect": JSXElements.StencilRouterRedirectAttributes;
        }
    }
    namespace JSXElements {
        export interface StencilRouterRedirectAttributes extends HTMLAttributes {
            thing?: any;
            other?: number;
        }
    }
}`
      );
    });
  });
});
