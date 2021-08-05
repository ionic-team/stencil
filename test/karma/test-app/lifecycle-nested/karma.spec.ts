import { setupDomTests } from '../util';

describe('lifecycle-nested', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/lifecycle-nested/index.html');
  });
  afterEach(tearDownDom);

  it('fire load methods in order for nested elements', async () => {
    let loads = app.querySelectorAll('.lifecycle-loads li');
    expect(loads.length).toBe(6);
    expect(loads[0].textContent).toBe('componentWillLoad-c');
    expect(loads[1].textContent).toBe('componentWillLoad-b');
    expect(loads[2].textContent).toBe('componentWillLoad-a');
    expect(loads[3].textContent).toBe('componentDidLoad-a');
    expect(loads[4].textContent).toBe('componentDidLoad-b');
    expect(loads[5].textContent).toBe('componentDidLoad-c');
  });
});
