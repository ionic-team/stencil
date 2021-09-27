import { uuidv4 } from '@utils';

describe('uuidv4', () => {
  it('outputs a UUID', () => {
    const pattern = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
    const uuid = uuidv4();
    expect(!!uuid.match(pattern)).toBe(true);
  });
});
