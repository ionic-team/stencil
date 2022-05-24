import { isRemoteUrl } from '../url-paths';

describe('url-paths', () => {
  it('isRemoteUrl', () => {
    expect(isRemoteUrl('https://domain.com/file.txt')).toBe(true);
    expect(isRemoteUrl('http://domain.com/file.txt')).toBe(true);
    expect(isRemoteUrl('HTTP://domain.com/file.txt')).toBe(true);
    expect(isRemoteUrl('file://domain.com/file.txt')).toBe(false);
    expect(isRemoteUrl('C:/file.txt')).toBe(false);
    expect(isRemoteUrl('C:\\file.txt')).toBe(false);
    expect(isRemoteUrl('/User/file.txt')).toBe(false);
    expect(isRemoteUrl('')).toBe(false);
    expect(isRemoteUrl(null)).toBe(false);
  });
});
