import { Component, forceUpdate, h, Prop } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { MockNode } from '../../../mock-doc';

describe('scoped slot', () => {
  it('should relocate nested default slot nodes', async () => {
    @Component({ tag: 'ion-test', scoped: true })
    class CmpA {
      render() {
        return (
          <spider>
            <slot></slot>
          </spider>
        );
      }
    }

    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<ion-test>88</ion-test>`,
    });

    expect(root.firstElementChild.nodeName).toBe('SPIDER');
    expect(root.firstElementChild.childNodes[1].textContent).toBe('88');
    expect(root.firstElementChild.childNodes).toHaveLength(2);
  });

  it('should use components default slot text content', async () => {
    @Component({ tag: 'ion-test', scoped: true })
    class CmpA {
      render() {
        return (
          <spider>
            <slot>default content</slot>
          </spider>
        );
      }
    }

    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<ion-test></ion-test>`,
    });

    expect(root.firstElementChild.nodeName).toBe('SPIDER');
    expect(root.firstElementChild.children).toHaveLength(0);
    expect(root.firstElementChild.textContent).toBe('default content');
    expect(root.firstElementChild.childNodes).toHaveLength(2);
  });

  it('should use components default slot node content', async () => {
    @Component({ tag: 'ion-test', scoped: true })
    class CmpA {
      render() {
        return (
          <spider>
            <slot>
              <div>default content</div>
            </slot>
          </spider>
        );
      }
    }

    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<ion-test></ion-test>`,
    });

    expect(root.firstElementChild.nodeName).toBe('SPIDER');
    expect(root.firstElementChild.firstElementChild.nodeName).toBe('DIV');
    expect(root.firstElementChild.firstElementChild.textContent).toBe('default content');
  });

  it('should relocate nested named slot nodes', async () => {
    @Component({ tag: 'ion-test', scoped: true })
    class CmpA {
      render() {
        return (
          <monkey>
            <slot name="start"></slot>
          </monkey>
        );
      }
    }

    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<ion-test><tiger slot="start">88</tiger></ion-test>`,
    });

    expect(root.firstElementChild.nodeName).toBe('MONKEY');
    expect(root.firstElementChild.firstElementChild.nodeName).toBe('TIGER');
    expect(root.firstElementChild.firstElementChild.textContent).toBe('88');
    expect(root.firstElementChild.firstElementChild.childNodes).toHaveLength(1);
  });

  it('no content', async () => {
    @Component({ tag: 'ion-parent', scoped: true })
    class Parent {
      render() {
        return (
          <lion>
            <ion-child></ion-child>
          </lion>
        );
      }
    }

    @Component({ tag: 'ion-child', scoped: true })
    class Child {
      render() {
        return <slot></slot>;
      }
    }

    const { root } = await newSpecPage({
      components: [Parent, Child],
      html: `<ion-parent></ion-parent>`,
    });

    expect(root.children).toHaveLength(1);
    expect(root.firstElementChild.nodeName).toBe('LION');
    expect(root.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(root.firstElementChild.firstElementChild.children).toHaveLength(0);
  });

  it('no content, nested child slot', async () => {
    @Component({ tag: 'ion-parent', scoped: true })
    class Parent {
      render() {
        return (
          <giraffe>
            <ion-child></ion-child>
          </giraffe>
        );
      }
    }

    @Component({ tag: 'ion-child', scoped: true })
    class Child {
      render() {
        return (
          <fish>
            <slot></slot>
          </fish>
        );
      }
    }

    const { root } = await newSpecPage({
      components: [Parent, Child],
      html: `<ion-parent></ion-parent>`,
    });

    expect(root.children).toHaveLength(1);
    expect(root.firstElementChild.nodeName).toBe('GIRAFFE');
    expect(root.firstElementChild.children).toHaveLength(1);
    expect(root.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(root.firstElementChild.firstElementChild.children).toHaveLength(1);
    expect(root.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('FISH');
    expect(root.firstElementChild.firstElementChild.firstElementChild.children).toHaveLength(0);
  });

  it('should put parent content in child default slot', async () => {
    @Component({ tag: 'ion-parent', scoped: true })
    class Parent {
      render() {
        return (
          <hippo>
            <ion-child>
              <aardvark>parent message</aardvark>
            </ion-child>
          </hippo>
        );
      }
    }

    @Component({ tag: 'ion-child', scoped: true })
    class Child {
      render() {
        return <slot></slot>;
      }
    }

    const { root } = await newSpecPage({
      components: [Parent, Child],
      html: `<ion-parent></ion-parent>`,
    });

    expect(root.firstElementChild.nodeName).toBe('HIPPO');
    expect(root.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(root.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('AARDVARK');
    expect(root.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('parent message');
  });

  it('should relocate parent content after child content dynamically changes slot wrapper tag', async () => {
    @Component({ tag: 'ion-parent', scoped: true })
    class Parent {
      @Prop() innerH = (<h1>parent text</h1>);

      render() {
        return <ion-child>{this.innerH}</ion-child>;
      }
    }

    @Component({ tag: 'ion-child', scoped: true })
    class Child {
      @Prop() Tag = 'section';

      render() {
        return (
          <this.Tag>
            <slot></slot>
          </this.Tag>
        );
      }
    }

    const { root, waitForChanges } = await newSpecPage({
      components: [Parent, Child],
      html: `<ion-parent></ion-parent>`,
    });

    expect(root.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(root.firstElementChild.firstElementChild.nodeName).toBe('SECTION');
    expect(root.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('H1');
    expect(root.firstElementChild.textContent).toBe('parent text');

    root.innerH = <h6>parent text update</h6>;
    await waitForChanges();

    expect(root.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(root.firstElementChild.firstElementChild.nodeName).toBe('SECTION');
    expect(root.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('H6');
    expect(root.firstElementChild.textContent).toBe('parent text update');

    const child = root.querySelector('ion-child');
    child.Tag = 'article';
    await waitForChanges();

    expect(root.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(root.firstElementChild.firstElementChild.nodeName).toBe('ARTICLE');
    expect(root.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('H6');
    expect(root.firstElementChild.textContent).toBe('parent text update');
  });

  it('should put parent content in child nested default slot', async () => {
    @Component({ tag: 'ion-parent', scoped: true })
    class Parent {
      render() {
        return (
          <badger>
            <ion-child>
              <dingo>parent message</dingo>
            </ion-child>
          </badger>
        );
      }
    }

    @Component({ tag: 'ion-child', scoped: true })
    class Child {
      render() {
        return (
          <camel>
            <owl>
              <slot></slot>
            </owl>
          </camel>
        );
      }
    }

    const { root, waitForChanges } = await newSpecPage({
      components: [Parent, Child],
      html: `<ion-parent></ion-parent>`,
    });

    expect(root.firstElementChild.nodeName).toBe('BADGER');
    expect(root.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(root.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('CAMEL');
    expect(root.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('OWL');
    expect(
      root.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName
    ).toBe('DINGO');
    expect(
      root.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent
    ).toBe('parent message');

    forceUpdate(root);
    await waitForChanges();

    expect(root.firstElementChild.nodeName).toBe('BADGER');
    expect(root.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(root.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('CAMEL');
    expect(root.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('OWL');
    expect(
      root.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName
    ).toBe('DINGO');
    expect(
      root.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent
    ).toBe('parent message');
  });

  it('should render conditional content into a nested default slot', async () => {
    @Component({ tag: 'ion-parent', scoped: true })
    class Parent {
      render() {
        return (
          <ion-child>
            <slot></slot>
          </ion-child>
        );
      }
    }

    @Component({ tag: 'ion-child', scoped: true })
    class Child {
      test = 0;

      render() {
        this.test++;

        if (this.test === 1) {
          return null;
        }

        if (this.test === 2) {
          return [<div>content 1</div>, <div>content 2</div>];
        }

        if (this.test === 3) {
          return null;
        }

        return <div>content 4</div>;
      }
    }

    const { root, waitForChanges } = await newSpecPage({
      components: [Parent, Child],
      html: `<ion-parent></ion-parent>`,
    });

    expect(root.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(root.firstElementChild.textContent).toBe('');

    const child = root.querySelector('ion-child');
    forceUpdate(child);
    await waitForChanges();

    expect(root.firstElementChild.textContent).toBe('content 1content 2');

    forceUpdate(child);
    await waitForChanges();

    expect(root.firstElementChild.textContent).toBe('');

    forceUpdate(child);
    await waitForChanges();
    expect(root.firstElementChild.textContent).toBe('content 4');
  });

  it('should update parent content in child default slot', async () => {
    @Component({ tag: 'ion-parent', scoped: true })
    class Parent {
      @Prop() msg = 'parent message';
      render() {
        return (
          <cheetah>
            <ion-child>
              <bear>{this.msg}</bear>
            </ion-child>
          </cheetah>
        );
      }
    }

    @Component({ tag: 'ion-child', scoped: true })
    class Child {
      render() {
        return (
          <chipmunk>
            <slot></slot>
          </chipmunk>
        );
      }
    }

    const { root, waitForChanges } = await newSpecPage({
      components: [Parent, Child],
      html: `<ion-parent></ion-parent>`,
    });

    expect(root.firstElementChild.nodeName).toBe('CHEETAH');
    expect(root.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(root.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('CHIPMUNK');
    expect(root.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('BEAR');
    expect(root.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe(
      'parent message'
    );

    root.msg = 'change 1';
    await waitForChanges();

    expect(root.firstElementChild.nodeName).toBe('CHEETAH');
    expect(root.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(root.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('CHIPMUNK');
    expect(root.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('BEAR');
    expect(root.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('change 1');

    root.msg = 'change 2';
    await waitForChanges();

    expect(root.firstElementChild.nodeName).toBe('CHEETAH');
    expect(root.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(root.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('CHIPMUNK');
    expect(root.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('BEAR');
    expect(root.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('change 2');
  });

  it('should update parent content inner text in child nested default slot', async () => {
    @Component({ tag: 'ion-parent', scoped: true })
    class Parent {
      @Prop() msg = 'parent message';
      render() {
        return (
          <ion-child>
            <whale>{this.msg}</whale>
          </ion-child>
        );
      }
    }

    @Component({ tag: 'ion-child', scoped: true })
    class Child {
      render() {
        return (
          <bull>
            <slot></slot>
          </bull>
        );
      }
    }

    const { root, waitForChanges } = await newSpecPage({
      components: [Parent, Child],
      html: `<ion-parent></ion-parent>`,
    });

    expect(root.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(root.firstElementChild.firstElementChild.nodeName).toBe('BULL');
    expect(root.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('WHALE');
    expect(root.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('parent message');

    root.msg = 'change 1';
    await waitForChanges();

    expect(root.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(root.firstElementChild.firstElementChild.nodeName).toBe('BULL');
    expect(root.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('WHALE');
    expect(root.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('change 1');

    root.msg = 'change 2';
    await waitForChanges();

    expect(root.firstElementChild.outerHTML).toEqualHtml(`
    <ion-child>
      <!---->
      <bull>
        <whale>
          change 2
        </whale>
      </bull>
    </ion-child>`);
  });

  it('should allow multiple slots with same name', async () => {
    let values = 0;

    @Component({ tag: 'ion-parent', scoped: true })
    class Parent {
      render() {
        return (
          <ion-child>
            <falcon slot="start">{++values}</falcon>
            <eagle slot="start">{++values}</eagle>
          </ion-child>
        );
      }
    }

    @Component({ tag: 'ion-child', scoped: true })
    class Child {
      render() {
        return (
          <mouse>
            <slot></slot>
            <slot name="start"></slot>
            <slot name="end"></slot>
          </mouse>
        );
      }
    }

    const { root, waitForChanges } = await newSpecPage({
      components: [Parent, Child],
      html: `<ion-parent></ion-parent>`,
    });

    expect(root.firstElementChild.outerHTML).toEqualHtml(`
    <ion-child>
      <!---->
      <mouse>
        <falcon slot=\"start\">
          1
        </falcon>
        <eagle slot=\"start\">
          2
        </eagle>
      </mouse>
    </ion-child>`);

    forceUpdate(root);
    await waitForChanges();

    expect(root.firstElementChild.outerHTML).toEqualHtml(`
    <ion-child>
      <!---->
      <mouse>
        <falcon slot=\"start\">
          3
        </falcon>
        <eagle slot=\"start\">
          4
        </eagle>
      </mouse>
    </ion-child>`);

    forceUpdate(root);
    await waitForChanges();

    expect(root.firstElementChild.outerHTML).toEqualHtml(`
    <ion-child>
      <!---->
      <mouse>
        <falcon slot=\"start\">
          5
        </falcon>
        <eagle slot=\"start\">
          6
        </eagle>
      </mouse>
    </ion-child>`);
  });

  it('should only render nested named slots and default slot', async () => {
    let values = 0;

    @Component({ tag: 'ion-parent', scoped: true })
    class Parent {
      render() {
        return (
          <ion-child>
            <butterfly>{(++values).toString()}</butterfly>
            <fox slot="end">{++values}</fox>
            <ferret slot="start">{++values}</ferret>
          </ion-child>
        );
      }
    }

    @Component({ tag: 'ion-child', scoped: true })
    class Child {
      render() {
        return (
          <flamingo>
            <slot name="start"></slot>
            <horse>
              <slot></slot>
              <bullfrog>
                <slot name="end"></slot>
              </bullfrog>
            </horse>
          </flamingo>
        );
      }
    }

    const { root, waitForChanges } = await newSpecPage({
      components: [Parent, Child],
      html: `<ion-parent></ion-parent>`,
    });

    expect(root.firstElementChild.outerHTML).toEqualHtml(`
    <ion-child>
      <!---->
      <flamingo>
        <ferret slot=\"start\">
          3
        </ferret>
        <horse>
          <butterfly>
            1
          </butterfly>
          <bullfrog>
            <fox slot=\"end\">
              2
            </fox>
          </bullfrog>
        </horse>
      </flamingo>
    </ion-child>`);

    forceUpdate(root);
    await waitForChanges();

    expect(root.firstElementChild.outerHTML).toEqualHtml(`
    <ion-child>
      <!---->
      <flamingo>
        <ferret slot=\"start\">
          6
        </ferret>
        <horse>
          <butterfly>
            4
          </butterfly>
          <bullfrog>
            <fox slot=\"end\">
              5
            </fox>
          </bullfrog>
        </horse>
      </flamingo>
    </ion-child>`);

    forceUpdate(root);
    await waitForChanges();

    expect(root.firstElementChild.outerHTML).toEqualHtml(`
    <ion-child>
      <!---->
      <flamingo>
        <ferret slot=\"start\">
          9
        </ferret>
        <horse>
          <butterfly>
            7
          </butterfly>
          <bullfrog>
            <fox slot=\"end\">
              8
            </fox>
          </bullfrog>
        </horse>
      </flamingo>
    </ion-child>`);
  });

  it('should allow nested default slots', async () => {
    let values = 0;

    @Component({ tag: 'ion-parent', scoped: true })
    class Parent {
      render() {
        return (
          <test-1>
            <test-2>
              <goat>{(++values).toString()}</goat>
            </test-2>
          </test-1>
        );
      }
    }

    @Component({ tag: 'test-1', scoped: true })
    class Test1 {
      render() {
        return (
          <seal>
            <slot></slot>
          </seal>
        );
      }
    }

    @Component({ tag: 'test-2', scoped: true })
    class Test2 {
      render() {
        return (
          <goose>
            <slot></slot>
          </goose>
        );
      }
    }

    const { root, waitForChanges } = await newSpecPage({
      components: [Parent, Test1, Test2],
      html: `<ion-parent></ion-parent>`,
    });

    expect(root.firstElementChild.outerHTML).toEqualHtml(`
    <test-1>
      <!---->
      <seal>
        <test-2>
          <!---->
          <goose>
            <goat>
              1
            </goat>
          </goose>
        </test-2>
      </seal>
    </test-1>`);

    forceUpdate(root);
    await waitForChanges();

    expect(root.firstElementChild.outerHTML).toEqualHtml(`
    <test-1>
      <!---->
      <seal>
        <test-2>
          <!---->
          <goose>
            <goat>
              2
            </goat>
          </goose>
        </test-2>
      </seal>
    </test-1>`);

    forceUpdate(root);
    await waitForChanges();

    expect(root.firstElementChild.outerHTML).toEqualHtml(`
    <test-1>
      <!---->
      <seal>
        <test-2>
          <!---->
          <goose>
            <goat>
              3
            </goat>
          </goose>
        </test-2>
      </seal>
    </test-1>`);
  });

  it('should allow nested default slots w/ default slot content', async () => {
    @Component({ tag: 'ion-parent', scoped: true })
    class Parent {
      render() {
        return (
          <test-1>
            <test-2>
              <goat>hey goat!</goat>
            </test-2>
          </test-1>
        );
      }
    }

    @Component({ tag: 'test-1', scoped: true })
    class Test1 {
      render() {
        return (
          <seal>
            <slot>
              <div>hey seal!</div>
            </slot>
          </seal>
        );
      }
    }

    @Component({ tag: 'test-2', scoped: true })
    class Test2 {
      render() {
        return (
          <goose>
            <slot>
              <div>hey goose!</div>
            </slot>
          </goose>
        );
      }
    }

    const { root } = await newSpecPage({
      components: [Parent, Test1, Test2],
      html: `<ion-parent></ion-parent>`,
    });

    expect(root.outerHTML).toEqualHtml(`
    <ion-parent>
      <test-1>
        <!---->
        <seal>
          <div hidden=\"\" style=\"display: none;\">
            hey seal!
          </div>
          <test-2>
            <!---->
            <goose>
              <div hidden=\"\" style=\"display: none;\">
                hey goose!
              </div>
              <goat>
                hey goat!
              </goat>
            </goose>
          </test-2>
        </seal>
      </test-1>
    </ion-parent>`);
  });

  it("should hide the slot's fallback content for a non-shadow component when slot content passed in", async () => {
    @Component({ tag: 'fallback-test', shadow: false })
    class NonShadowFallbackSlotTest {
      render() {
        return (
          <div>
            <slot>
              <p>Fallback Content</p>
            </slot>
          </div>
        );
      }
    }
    const { root } = await newSpecPage({
      components: [NonShadowFallbackSlotTest],
      html: `<fallback-test><span>Content</span></fallback-test>`,
    });

    expect(root.outerHTML).toEqualHtml(`
    <fallback-test>
      <!---->
      <div>
        <p hidden=\"\" style=\"display: none;\">
          Fallback Content
        </p>
        <span>
          Content
        </span>
      </div>
    </fallback-test>`);
  });

  it('should deal appropriately with deeply nested slots', async () => {
    @Component({ tag: 'slots-in-slots-test', shadow: false })
    class DeepNestedSlots {
      render() {
        return (
          <div>
            <slot name="content">
              <slot name="before">DEFAULT BEFORE</slot>
              <slot>DEFAULT CONTENT</slot>
              <slot name="after">
                DEFAULT AFTER
                <p>
                  <slot name="nested">DEFAULT NESTED</slot>
                </p>
              </slot>
            </slot>
          </div>
        );
      }
    }
    const { body } = await newSpecPage({
      components: [DeepNestedSlots, DeepNestedSlots, DeepNestedSlots, DeepNestedSlots, DeepNestedSlots],
      html: `
      <slots-in-slots-test></slots-in-slots-test>
      <slots-in-slots-test><span slot="content">hello</span></slots-in-slots-test>
      <slots-in-slots-test><span slot="before">hello</span></slots-in-slots-test>
      <slots-in-slots-test><span>hello</span></slots-in-slots-test>
      <slots-in-slots-test><span slot="after">hello</span></slots-in-slots-test>
      <slots-in-slots-test><span slot="nested">hello</span></slots-in-slots-test>
      `,
    });

    // nothing is slotted so all defaults should be visible
    const fallbackTest = body.children[0];
    expect(fallbackTest.outerHTML).toEqualHtml(`
    <slots-in-slots-test>
      <!---->
      <div>
        DEFAULT BEFORE DEFAULT CONTENT DEFAULT AFTER
        <p>
          DEFAULT NESTED
        </p>
      </div>
    </slots-in-slots-test>`);

    // the root 'content' slot is used so all fallback slots should be empty
    const parentSlotTest = body.children[1];
    expect(parentSlotTest.outerHTML).toEqualHtml(`
    <slots-in-slots-test>
      <!---->
      <div>
        <p hidden=\"\" style=\"display: none;\">
          DEFAULT NESTED
        </p>
        <span slot=\"content\">
          hello
        </span>
      </div>
    </slots-in-slots-test>`);

    // just the before slot is used so fallback should be empty.
    // the rest should have default content.
    const beforeSlotTest = body.children[2];
    expect(beforeSlotTest.outerHTML).toEqualHtml(`
    <slots-in-slots-test>
      <!---->
      <div>
        <span slot=\"before\">
          hello
        </span>
        DEFAULT CONTENT DEFAULT AFTER
        <p>
          DEFAULT NESTED
        </p>
      </div>
    </slots-in-slots-test>`);

    // just the default slot is used so fallback should be empty.
    // the rest should have default content.
    const defaultSlotTest = body.children[3];
    expect(defaultSlotTest.outerHTML).toEqualHtml(`
    <slots-in-slots-test>
      <!---->
      <div>
        DEFAULT BEFORE
        <span>
          hello
        </span>
        DEFAULT AFTER
        <p>
          DEFAULT NESTED
        </p>
      </div>
    </slots-in-slots-test>`);

    // just the after slot is used so fallback should be empty.
    // the fallback includes the 'nested' slot whose fallback content should be hidden.
    // the rest should show default content
    const afterSlotTest = body.children[4];
    expect(afterSlotTest.outerHTML).toEqualHtml(`
    <slots-in-slots-test>
      <!---->
      <div>
        DEFAULT BEFORE DEFAULT CONTENT
        <p hidden=\"\" style=\"display: none;\">
          DEFAULT NESTED
        </p>
        <span slot=\"after\">
          hello
        </span>
      </div>
    </slots-in-slots-test>`);

    // just the nested slot is used so fallback should be empty.
    // the rest should have default content.
    const nestedSlotTest = body.children[5];
    expect(nestedSlotTest.outerHTML).toEqualHtml(`
    <slots-in-slots-test>
      <!---->
      <div>
        DEFAULT BEFORE DEFAULT CONTENT DEFAULT AFTER
        <p>
          <span slot=\"nested\">
            hello
          </span>
        </p>
      </div>
    </slots-in-slots-test>`);
  });

  it('Show or hide fallback content on node removal / addition', async () => {
    @Component({ tag: 'fallback-test', shadow: false })
    class NonShadowFallbackSlotTest {
      render() {
        return (
          <div>
            <slot>
              <p>Fallback Content</p>
            </slot>
          </div>
        );
      }
    }
    const { root } = await newSpecPage({
      components: [NonShadowFallbackSlotTest],
      html: `<fallback-test><span>Content</span></fallback-test>`,
    });

    expect(root.outerHTML).toEqualHtml(`
    <fallback-test>
      <!---->
      <div>
        <p hidden=\"\" style=\"display: none;\">
          Fallback Content
        </p>
        <span>
          Content
        </span>
      </div>
    </fallback-test>`);

    const span = document.querySelector('span');
    span.remove();

    expect(root.outerHTML).toEqualHtml(`
    <fallback-test>
      <!---->
      <div>
        <p>
          Fallback Content
        </p>
      </div>
    </fallback-test>`);

    document.querySelector('fallback-test').appendChild(span);

    expect(root.outerHTML).toEqualHtml(`
    <fallback-test>
      <!---->
      <div>
        <p hidden=\"\" style=\"display: none;\">
          Fallback Content
        </p>
        <span>
          Content
        </span>
      </div>
    </fallback-test>`);
  });
});
