import { setupDomTests, waitForChanges } from '../util';

describe('lifecycle-update', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/lifecycle-update/index.html');
  });
  afterEach(tearDownDom);

  it('fire load methods in order', async () => {
    let loads = app.querySelectorAll('#output li');
    expect(loads.length).toBe(2);
    expect(loads[0].textContent).toBe('lifecycle-update-a componentWillLoad');
    expect(loads[1].textContent).toBe('lifecycle-update-a componentDidLoad');

    const button = app.querySelector('button');
    button.click();
    await waitForChanges();

    loads = app.querySelectorAll('#output li');
    expect(loads[0].textContent).toBe('lifecycle-update-a componentWillLoad');
    expect(loads[1].textContent).toBe('lifecycle-update-a componentDidLoad');

    expect(loads[2].textContent).toBe('async add child components to lifecycle-update-a 1');
    expect(loads[3].textContent).toBe('lifecycle-update-a componentWillUpdate 1');
    expect(loads[4].textContent).toBe('lifecycle-update-b componentWillLoad 1');
    expect(loads[5].textContent).toBe('lifecycle-update-c componentWillLoad 1');
    expect(loads[6].textContent).toBe('lifecycle-update-c componentDidLoad 1');
    expect(loads[7].textContent).toBe('lifecycle-update-b componentDidLoad 1');
    expect(loads[8].textContent).toBe('lifecycle-update-a componentDidUpdate 1');
    expect(loads.length).toBe(9);

    button.click();
    await waitForChanges();

    loads = app.querySelectorAll('#output li');
    expect(loads[0].textContent).toBe('lifecycle-update-a componentWillLoad');
    expect(loads[1].textContent).toBe('lifecycle-update-a componentDidLoad');
    expect(loads[2].textContent).toBe('async add child components to lifecycle-update-a 1');
    expect(loads[3].textContent).toBe('lifecycle-update-a componentWillUpdate 1');
    expect(loads[4].textContent).toBe('lifecycle-update-b componentWillLoad 1');
    expect(loads[5].textContent).toBe('lifecycle-update-c componentWillLoad 1');
    expect(loads[6].textContent).toBe('lifecycle-update-c componentDidLoad 1');
    expect(loads[7].textContent).toBe('lifecycle-update-b componentDidLoad 1');
    expect(loads[8].textContent).toBe('lifecycle-update-a componentDidUpdate 1');
    expect(loads[9].textContent).toBe('async add child components to lifecycle-update-a 2');
    expect(loads[10].textContent).toBe('lifecycle-update-a componentWillUpdate 2');
    expect(loads[11].textContent).toBe('lifecycle-update-b componentWillLoad 2');
    expect(loads[12].textContent).toBe('lifecycle-update-c componentWillLoad 2');
    expect(loads[13].textContent).toBe('lifecycle-update-c componentDidLoad 2');
    expect(loads[14].textContent).toBe('lifecycle-update-b componentDidLoad 2');
    expect(loads[15].textContent).toBe('lifecycle-update-a componentDidUpdate 2');
    expect(loads.length).toBe(16);
  });
});
