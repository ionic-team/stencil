import { hasDebug, hasVerbose } from '@utils';

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
