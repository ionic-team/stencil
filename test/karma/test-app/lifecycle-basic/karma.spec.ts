import { setupDomTests, waitForChanges } from '../util';

describe('lifecycle-basic', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/lifecycle-basic/index.html');
  });
  afterEach(tearDownDom);

  it('fire load methods in order', async () => {
    let loads = app.querySelectorAll('.lifecycle-loads-a li');
    expect(loads.length).toBe(6);
    expect(loads[0].textContent).toBe('componentWillLoad-a');
    expect(loads[1].textContent).toBe('componentWillLoad-b');
    expect(loads[2].textContent).toBe('componentWillLoad-c');
    expect(loads[3].textContent).toBe('componentDidLoad-c');
    expect(loads[4].textContent).toBe('componentDidLoad-b');
    expect(loads[5].textContent).toBe('componentDidLoad-a');

    let updates = app.querySelectorAll('.lifecycle-updates-a li');
    expect(updates.length).toBe(0);

    const button = app.querySelector('button');
    button.click();
    await waitForChanges();

    loads = app.querySelectorAll('.lifecycle-loads-a li');
    expect(loads.length).toBe(6);
    expect(loads[0].textContent).toBe('componentWillLoad-a');
    expect(loads[1].textContent).toBe('componentWillLoad-b');
    expect(loads[2].textContent).toBe('componentWillLoad-c');
    expect(loads[3].textContent).toBe('componentDidLoad-c');
    expect(loads[4].textContent).toBe('componentDidLoad-b');
    expect(loads[5].textContent).toBe('componentDidLoad-a');

    updates = app.querySelectorAll('.lifecycle-updates-a li');
    expect(updates.length).toBe(6);

    expect(updates[0].textContent).toBe('componentWillUpdate-a');
    expect(updates[1].textContent).toBe('componentWillUpdate-b');
    expect(updates[2].textContent).toBe('componentWillUpdate-c');
    expect(updates[3].textContent).toBe('componentDidUpdate-c');
    expect(updates[4].textContent).toBe('componentDidUpdate-b');
    expect(updates[5].textContent).toBe('componentDidUpdate-a');
  });
});
