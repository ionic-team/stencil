import { AppRoot } from './app-root';
import lastName from './some-file.js';


describe('app-root', () => {

  it('should be a test', () => {
    const appRoot = new AppRoot();
    appRoot.first = 'Marty';
    appRoot.last = lastName;
    expect(appRoot.first).toBe('Marty');
  });

});
