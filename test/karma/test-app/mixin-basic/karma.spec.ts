import { setupDomTests, waitForChanges } from '../util';

describe('mixin-basic', function() {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/mixin-basic/index.html');
  });
  afterEach(tearDownDom);

  it('rerenders a mixin component', async () => {
    const mixinCmp = app.querySelector('mixin-basic');
    expect(mixinCmp.querySelector('h1').textContent).toBe(`I'm a jsx node from a mixed in component`);
    expect(mixinCmp.querySelector('.privateMethodBasic').textContent).toBe(`I'm a private prop from basic class ssalc cisab morf porp etavirp a m'I1`);
    expect(mixinCmp.querySelector('.privateMethodComponent').textContent).toBe(`I'm a private prop from component tnenopmoc morf porp etavirp a m'I2`);
    expect(mixinCmp.querySelector('.stateBasic').textContent).toBe(`I'm a state from a basic class`);
    expect(mixinCmp.querySelector('.stateComponent').textContent).toBe(`I'm a state from a component`);
    expect(mixinCmp.propFromComponent).toBe(`I'm a prop from a component`);
    expect(mixinCmp.propFromBasicClass).toBe(`I'm a prop from a basic class`);
    expect(mixinCmp.nameClash).toBe(false);
    //@ts-ignore
    expect(mixinCmp.nameFiltered).toBe(undefined);

    expect(await mixinCmp.methodFromComponent()).toBe(`I'm a method from a component`);
    expect(await mixinCmp.methodFromBasicClass()).toBe(`I'm a method from a basic class`);

    mixinCmp.click();
    await waitForChanges();

    expect(mixinCmp.querySelector('.eventComponent').textContent).toBe(`I'm a listener from a component`);
    expect(mixinCmp.querySelector('.eventBasic').textContent).toBe(`I'm a listener from a basic class`);
  });
});
