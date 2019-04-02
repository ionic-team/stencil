import { AppRoot } from './app-root';


describe('app-root', () => {

  it('should be a test', () => {
    const appRoot = new AppRoot();
    appRoot.first = 'Marty';
    appRoot.last = 'McFly';
    expect(appRoot.first).toBe('Marty');
  });

});
