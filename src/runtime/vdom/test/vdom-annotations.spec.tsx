import { Component, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { insertVdomAnnotations } from '../vdom-annotations';

describe('vdom-annotations', () => {
  let root: HTMLElement;

  beforeEach(async () => {
    @Component({ tag: 'cmpa-test', scoped: true })
    class CmpA {
      render() {
        return (
          <div>
            <slot></slot>
          </div>
        );
      }
    }

    @Component({ tag: 'cmpb-test', scoped: true })
    class CmpB {
      render() {
        return (
          <div>
            <slot></slot>
          </div>
        );
      }
    }

    const { root: rootElm } = await newSpecPage({
      components: [CmpA, CmpB],
      html: `<section>
        <cmpa-test>slotContent</cmpa-test>
        <cmpb-test>slotContent</cmpb-test>
      </section>`,
    });
    root = rootElm;
  });

  it('should add annotations when no static component is given', () => {
    insertVdomAnnotations(root.ownerDocument, []);
    /**
      <section>
        <cmpa-test s-id="1">
            <!--r.1-->o.0.1
            <div c-id="1.0.0.0">
              <!--t.1.1.1.0--> <!--t.0.1-->slotContent
            </div>
        </cmpa-test>
        <cmpb-test s-id="2">
            <!--r.2-->o.0.2
            <div c-id="2.0.0.0">
              <!--t.2.1.1.0--> <!--t.0.2-->slotContent
            </div>
        </cmpb-test>
      </section>
     */
    expect(root.ownerDocument.body.innerHTML).toMatchSnapshot();
  });

  it('should add annotations when cmpa-test is given as static component', () => {
    insertVdomAnnotations(root.ownerDocument, ['cmpa-test']);
    /**
      <section>
        <cmpa-test>
            <!---->o.0.1
            <div>
              <!--t.0.1-->slotContent
            </div>
        </cmpa-test>
        <cmpb-test s-id="1">
            <!--r.1-->o.0.2
            <div c-id="1.0.0.0">
              <!--t.1.1.1.0--> <!--t.0.2-->slotContent
            </div>
        </cmpb-test>
      </section>
     */
    expect(root.ownerDocument.body.innerHTML).toMatchSnapshot();
  });

  it('should add annotations when cmpa-test and cmpb-test is given as static component', () => {
    insertVdomAnnotations(root.ownerDocument, ['cmpa-test', 'cmpb-test']);
    /**
      <section>
        <cmpa-test>
            <!---->o.0.1
            <div>
              <!--t.0.1-->slotContent
            </div>
        </cmpa-test>
        <cmpb-test>
            <!---->o.0.2
            <div>
              <!--t.0.2-->slotContent
            </div>
        </cmpb-test>
      </section>
     */
    expect(root.ownerDocument.body.innerHTML).toMatchSnapshot();
  });
});
