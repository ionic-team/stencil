import { h, Fragment } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';
import { $, expect } from '@wdio/globals';

describe('scoped-slot-assigned-methods', () => {
  beforeEach(async () => {
    // @ts-expect-error - no components array?
    render({
      template: () => (
        <scoped-slot-assigned-methods>
          <>
            <p>My initial slotted content.</p>
            Plain text
            <div slot="plain-slot">Plain slot content.</div>
          </>
        </scoped-slot-assigned-methods>
      ),
    });
    await $('scoped-slot-assigned-methods div').waitForExist();
  });

  it('tests assignedElements method on a `<slot-fb>`', async () => {
    const component: any = document.querySelector('scoped-slot-assigned-methods');
    expect(component.getSlotAssignedElements).toBeDefined();

    let nodes = await component.getSlotAssignedElements();
    expect(nodes).toBeDefined();
    expect(nodes.length).toBe(1);
    expect(nodes[0].outerHTML).toBe('<p>My initial slotted content.</p>');
    component.removeChild(nodes[0]);

    expect(await component.getSlotAssignedElements()).toHaveLength(0);
    nodes = await component.getSlotAssignedElements({ flatten: true });
    expect(nodes).toHaveLength(0);

    const div = document.createElement('div');
    div.slot = 'nested-slot';
    div.textContent = 'Nested slotted content';
    component.appendChild(div);
    expect(await component.getSlotAssignedElements()).toHaveLength(0);

    nodes = await component.getSlotAssignedElements({ flatten: true });
    expect(nodes).toHaveLength(1);
    expect(nodes[0].outerHTML).toBe('<div slot="nested-slot">Nested slotted content</div>');
  });

  it('tests assignedNodes method on a `<slot-fb>`', async () => {
    const component: any = document.querySelector('scoped-slot-assigned-methods');
    expect(component.getSlotAssignedNodes).toBeDefined();

    let nodes = await component.getSlotAssignedNodes();
    expect(nodes).toBeDefined();
    expect(nodes.length).toBe(2);
    expect(nodes[0].outerHTML).toBe('<p>My initial slotted content.</p>');
    component.removeChild(nodes[0]);

    nodes = await component.getSlotAssignedNodes();
    expect(nodes).toHaveLength(1);
    expect(nodes[0].nodeValue).toBe('Plain text');
    component.removeChild(nodes[0]);
    expect(await component.getSlotAssignedNodes()).toHaveLength(0);

    nodes = await component.getSlotAssignedNodes({ flatten: true });
    expect(nodes).toHaveLength(1);
    expect(nodes[0].nodeValue).toBe('Fallback content');

    const div = document.createElement('div');
    div.slot = 'nested-slot';
    div.textContent = 'Nested slotted content';
    component.appendChild(div);
    expect(await component.getSlotAssignedNodes()).toHaveLength(0);

    nodes = await component.getSlotAssignedNodes({ flatten: true });
    expect(nodes).toHaveLength(1);
    expect(nodes[0].outerHTML).toBe('<div slot="nested-slot">Nested slotted content</div>');
  });

  it('tests assignedElements / assignedNodes method on a plain slot (a text / comment node)', async () => {
    const component: any = document.querySelector('scoped-slot-assigned-methods');
    expect(component.getSlotAssignedElements).toBeDefined();

    let eles = await component.getSlotAssignedElements(undefined, true);
    let nodes = await component.getSlotAssignedNodes(undefined, true);
    expect(eles).toBeDefined();
    expect(nodes).toBeDefined();
    expect(nodes.length).toBe(1);
    expect(eles.length).toBe(1);
    expect(nodes[0].outerHTML).toBe('<div slot="plain-slot">Plain slot content.</div>');
    expect(eles[0].outerHTML).toBe('<div slot="plain-slot">Plain slot content.</div>');
    component.removeChild(nodes[0]);

    expect(await component.getSlotAssignedElements(undefined, true)).toHaveLength(0);
    expect(await component.getSlotAssignedNodes(undefined, true)).toHaveLength(0);
    nodes = await component.getSlotAssignedElements({ flatten: true }, true);

    expect(nodes).toHaveLength(0);
  });
});
