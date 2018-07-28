import { requiresCheck } from '../check-version';


describe('check-version', () => {

  it('does require check', () => {
    const now = 111;
    const lastCheck = 100;
    const checkInterval = 10;
    expect(requiresCheck(now, lastCheck, checkInterval)).toBe(true);
  });

  it('does not require check', () => {
    const now = 109;
    const lastCheck = 100;
    const checkInterval = 10;
    expect(requiresCheck(now, lastCheck, checkInterval)).toBe(false);
  });

});
