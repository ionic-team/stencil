import { Fragment, h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('lifecycle-basic', function () {
  beforeEach(() => {
    render({
      template: () => <lifecycle-basic-a></lifecycle-basic-a>,
    });
  });

  it('fire load methods in order', async () => {
    await $('lifecycle-basic-a').waitForExist();

    await browser.pause(200);

    let loads = await $('.lifecycle-loads-a').$$('li');
    await expect(loads.length).toBe(6);

    await expect(loads[0]).toHaveText('componentWillLoad-a');
    await expect(loads[1]).toHaveText('componentWillLoad-b');
    await expect(loads[2]).toHaveText('componentWillLoad-c');
    await expect(loads[3]).toHaveText('componentDidLoad-c');
    await expect(loads[4]).toHaveText('componentDidLoad-b');
    await expect(loads[5]).toHaveText('componentDidLoad-a');

    let updates = await $('.lifecycle-updates-a').$$('li');
    await expect(updates).not.toBeExisting();

    const button = $('button');
    await button.click();

    loads = await $('.lifecycle-loads-a').$$('li');
    await expect(loads.length).toBe(6);

    await expect(loads[0]).toHaveText('componentWillLoad-a');
    await expect(loads[1]).toHaveText('componentWillLoad-b');
    await expect(loads[2]).toHaveText('componentWillLoad-c');
    await expect(loads[3]).toHaveText('componentDidLoad-c');
    await expect(loads[4]).toHaveText('componentDidLoad-b');
    await expect(loads[5]).toHaveText('componentDidLoad-a');

    updates = await $('.lifecycle-updates-a').$$('li');
    await expect(updates.length).toBe(6);

    await expect(updates[0]).toHaveText('componentWillUpdate-a');
    await expect(updates[1]).toHaveText('componentWillUpdate-b');
    await expect(updates[2]).toHaveText('componentWillUpdate-c');
    await expect(updates[3]).toHaveText('componentDidUpdate-c');
    await expect(updates[4]).toHaveText('componentDidUpdate-b');
    await expect(updates[5]).toHaveText('componentDidUpdate-a');
  });
});
