import { toLowerCase } from '../utils';

describe('createProviderConsumer', () => {
  it('should have a provider and consumer', () => {
    expect(toLowerCase('ThisString')).toEqual('thisstring');
  });
});
