import { newE2EPage } from '../../../../dist/testing';


describe('@State', () => {

  it('should render all weekdays', async () => {
    const page = await newE2EPage({ html: `
      <state-cmp></state-cmp>
    `});

    const label = await page.find('state-cmp >>> label');
    expect(label).toEqualHtml('<label>What is your favorite day?</label>');

    const buttons = await page.findAll('state-cmp >>> button');
    expect(buttons).toHaveLength(7);
    expect(buttons[0]).toEqualText('Sunday');
    expect(buttons[1]).toEqualText('Monday');
    expect(buttons[2]).toEqualText('Tuesday');
    expect(buttons[3]).toEqualText('Wednesday');
    expect(buttons[4]).toEqualText('Thursday');
    expect(buttons[5]).toEqualText('Friday');
    expect(buttons[6]).toEqualText('Saturday');
    expect(buttons[6]).not.toEqualText('Sunday');
  });

  it('should select a day', async () => {
    const page = await newE2EPage({ html: `
      <state-cmp></state-cmp>
    `});

    const buttons = await page.findAll('state-cmp >>> button');
    await buttons[6].click();

    expect(buttons[6]).toHaveClass('selected');

    expect(buttons[1]).not.toHaveClass('selected');
  });

});
