import { convertPathToFileProtocol, isFileUrl, isRemoteUrl } from '../url-paths';

describe('url-paths', () => {
  it('isFileUrl', () => {
    expect(isFileUrl('file://domain.com/file.txt')).toBe(true);
    expect(isFileUrl('FILE://domain.com/file.txt')).toBe(true);
    expect(isFileUrl('file:/domain.com/file.txt')).toBe(true);
    expect(isFileUrl('file:///domain.com/file.txt')).toBe(true);
    expect(isFileUrl('file:/domain.com/file.txt')).toBe(true);
    expect(isFileUrl('file:///c:/domain.com/file.txt')).toBe(true);
    expect(isFileUrl('C:/file.txt')).toBe(false);
    expect(isFileUrl('C:\\file.txt')).toBe(false);
    expect(isFileUrl('/User/file.txt')).toBe(false);
    expect(isFileUrl('')).toBe(false);
    expect(isFileUrl(null)).toBe(false);
  });

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

  it('convertPathToFileProtocol', () => {
    // https://en.wikipedia.org/wiki/File_URI_scheme
    expect(convertPathToFileProtocol('/User/file.txt')).toBe('file:///User/file.txt');
    expect(convertPathToFileProtocol('C:/User/file.txt')).toBe('file:///C:/User/file.txt');
    expect(convertPathToFileProtocol('C:\\User\\file.txt')).toBe('file:///C:/User/file.txt');
    expect(convertPathToFileProtocol('file:/dir/file.txt')).toBe('file:/dir/file.txt');
    expect(convertPathToFileProtocol('file://dir/file.txt')).toBe('file://dir/file.txt');
    expect(convertPathToFileProtocol('file:///dir/file.txt')).toBe('file:///dir/file.txt');
    expect(convertPathToFileProtocol('https://domain.com/file.txt')).toBe('https://domain.com/file.txt');
    expect(convertPathToFileProtocol('http://domain.com/file.txt')).toBe('http://domain.com/file.txt');
    expect(convertPathToFileProtocol(null)).toBe(null);
  });
});
