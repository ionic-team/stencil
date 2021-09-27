import { isInteractive } from '@utils';
import { createSystem } from '../../compiler/sys/stencil-sys';

describe('isInteractive', () => {
  const sys = createSystem();

  it('returns false by default', () => {
    const result = isInteractive(sys, { flags: { ci: false } }, { ci: false, tty: false });
    expect(result).toBe(false);
  });

  it('returns false when tty is false', () => {
    const result = isInteractive(sys, { flags: { ci: true } }, { ci: true, tty: false });
    expect(result).toBe(false);
  });

  it('returns false when ci is true', () => {
    const result = isInteractive(sys, { flags: { ci: true } }, { ci: true, tty: true });
    expect(result).toBe(false);
  });

  it('returns true when tty is true and ci is false', () => {
    const result = isInteractive(sys, { flags: { ci: false } }, { ci: false, tty: true });
    expect(result).toBe(true);
  });
});
