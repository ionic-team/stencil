import { setupDomTests } from '../util';

describe('event-basic', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/event-basic/index.html');
  });
  afterEach(tearDownDom);

  it('should dispatch an event on load', () => {
    expect(app.querySelector('#counter').textContent).toBe('1');
  });
});
