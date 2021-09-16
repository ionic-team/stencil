import { tryFn } from '@utils';

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
