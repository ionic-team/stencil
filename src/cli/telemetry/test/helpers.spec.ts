import { isInteractive, tryFn, uuidv4, hasDebug, hasVerbose } from '../helpers';
import { createSystem } from '../../../compiler/sys/stencil-sys';

describe('hasDebug', () => {
  it('Returns true when a flag is passed', () => {
    const config = {
      flags: {
        debug: true,
        verbose: false,
      },
    };

    expect(hasDebug(config)).toBe(true);
  });

  it('Returns false when a flag is not passed', () => {
    const config = {
      flags: {
        debug: false,
        verbose: false,
      },
    };

    expect(hasDebug(config)).toBe(false);
  });
});

describe('hasVerbose', () => {
  it('Returns true when both flags are passed', () => {
    const config = {
      flags: {
        debug: true,
        verbose: true,
      },
    };

    expect(hasVerbose(config)).toBe(true);
  });

  it('Returns false when the verbose flag is passed, and debug is not', () => {
    const config = {
      flags: {
        debug: false,
        verbose: true,
      },
    };

    expect(hasVerbose(config)).toBe(false);
  });

  it('Returns false when the flag is not passed', () => {
    const config = {
      flags: {
        debug: false,
        verbose: false,
      },
    };

    expect(hasVerbose(config)).toBe(false);
  });
});

describe('uuidv4', () => {
  it('outputs a UUID', () => {
    const pattern = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
    const uuid = uuidv4();
    expect(!!uuid.match(pattern)).toBe(true);
  });
});

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

describe('tryFn', () => {
  it('handles failures correctly', async () => {
    const result = await tryFn(async () => {
      throw new Error('Uh oh!');
    });

    expect(result).toBe(null);
  });

  it('handles success correctly', async () => {
    const result = await tryFn(async () => {
      return true;
    });

    expect(result).toBe(true);
  });

  it('handles returning false correctly', async () => {
    const result = await tryFn(async () => {
      return false;
    });

    expect(result).toBe(false);
  });
});
