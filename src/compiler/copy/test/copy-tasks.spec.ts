import * as d from '@stencil/core/declarations';
import { createGlobCopyTask, getDestAbsPath, getSrcAbsPath, isCopyTaskFile, processCopyTasks } from '../local-copy-tasks';
import { mockConfig } from '@stencil/core/testing';
import { normalizePath } from '@stencil/core/utils';


describe('copy tasks', () => {

  let config: d.Config;
  let outputTarget: d.OutputTargetWww;

  beforeEach(() => {
    config = mockConfig();
    config.srcDir = '/User/marty/my-app/src';
    config.outputTargets = [
      {
        type: 'www',
        dir: '/User/marty/my-app/www'
      }
    ];
    outputTarget = config.outputTargets[0] as d.OutputTargetWww;
  });

  describe('processCopyTasks', () => {

    it('should resolve with null copy task', async () => {
      const r = await processCopyTasks(config, null, []);
      expect(r).toEqual([]);
    });

  });

  describe('createGlobCopyTask', () => {

    it('should get glob files and set absolute dest with absolute dest', () => {
      const copyTask: d.CopyTask = {
        src: 'assets/**/*.js',
        dest: '/User/marty/my-app/www/abs-images'
      };
      const destDir = '/User/marty/my-app/www';
      const p = createGlobCopyTask(config, copyTask, destDir, 'assets/bear.js');
      const normalizedDest = normalizePath(p.dest);

      expect(normalizedDest).toBe('/User/marty/my-app/www/abs-images/bear.js');
    });

    it('should get glob files and set absolute dest with relative dest', () => {
      const copyTask: d.CopyTask = {
        src: 'assets/**/*.js',
        dest: 'images'
      };
      const destDir = '/User/marty/my-app/www';
      const p = createGlobCopyTask(config, copyTask, destDir, 'assets/bear.js');
      const normalizedDest = normalizePath(p.dest);
      expect(normalizedDest).toBe('/User/marty/my-app/www/images/bear.js');
    });

    it('should get glob files and set absolute dest when missing dest', () => {
      const copyTask: d.CopyTask = {
        src: 'assets/**/*.js'
      };
      const destDir = '/User/marty/my-app/www';
      const p = createGlobCopyTask(config, copyTask, destDir, 'assets/bear.js');
      const normalizedDest = normalizePath(p.dest);
      expect(normalizedDest).toBe('/User/marty/my-app/www/assets/bear.js');
    });

  });

  describe('getDestAbsPath', () => {

    it('should get "dest" path when "dest" is relative and "src" is relative', () => {
      const src = 'assets/bear.jpg';
      const dest = 'images/bear.jpg';
      const p = getDestAbsPath(config, src, outputTarget.dir, dest);
      const normalizedPath = normalizePath(p);
      expect(normalizedPath).toBe('/User/marty/my-app/www/images/bear.jpg');
    });

    it('should get "dest" path when "dest" is relative and "src" is absolute', () => {
      const src = '/User/marty/my-app/src/assets/bear.jpg';
      const dest = 'images/bear.jpg';
      const p = getDestAbsPath(config, src, outputTarget.dir, dest);
      const normalizedPath = normalizePath(p);
      expect(normalizedPath).toBe('/User/marty/my-app/www/images/bear.jpg');
    });

    it('should get "dest" path when "dest" is absolute', () => {
      const src = '/User/marty/my-app/src/assets/bear.jpg';
      const dest = '/User/marty/my-app/www/images/bear.jpg';
      const p = getDestAbsPath(config, src, outputTarget.dir, dest);
      const normalizedPath = normalizePath(p);
      expect(normalizedPath).toBe('/User/marty/my-app/www/images/bear.jpg');
    });

    it('should get "dest" path when missing "dest" path and "src" is relative', () => {
      const src = 'assets/bear.jpg';
      const p = getDestAbsPath(config, src, outputTarget.dir, undefined);
      const normalizedPath = normalizePath(p);
      expect(normalizedPath).toBe('/User/marty/my-app/www/assets/bear.jpg');
    });

    it('should throw error when missing "dest" path and "src" is absolute', () => {
      expect(() => {
        getDestAbsPath(config, '/User/big/bear.jpg', outputTarget.dir, undefined);
      }).toThrow();
    });

  });

  describe('getSrcAbsPath', () => {

    it('should get from relative node_module file path', () => {
      const p = getSrcAbsPath(config, '../node_modules/some-package/index.js');
      const normalizedPath = normalizePath(p);
      expect(normalizedPath).toBe('/User/marty/my-app/node_modules/some-package/index.js');
    });

    it('should get from relative file path', () => {
      const p = getSrcAbsPath(config, 'assets/bear.jpg');
      const normalizedPath = normalizePath(p);
      expect(normalizedPath).toBe('/User/marty/my-app/src/assets/bear.jpg');
    });

    it('should get from absolute file path', () => {
      const p = getSrcAbsPath(config, '/User/big/bear.jpg');
      expect(p).toBe('/User/big/bear.jpg');
    });

  });

  describe('isCopyTaskFile', () => {

    it('not copy abs path src file', () => {
      config.copy = [
        { src: '/User/marty/my-app/src/assets/image.jpg' }
      ];
      const filePath = '/User/marty/my-app/src/something-else/image.jpg';
      expect(isCopyTaskFile(config, filePath)).toBe(false);
    });

    it('copy abs path src file', () => {
      config.copy = [
        { src: '/User/marty/my-app/src/assets/image.jpg' }
      ];
      const filePath = '/User/marty/my-app/src/assets/image.jpg';
      expect(isCopyTaskFile(config, filePath)).toBe(true);
    });

    it('not copy relative path src file', () => {
      config.copy = [
        { src: './assets/image.jpg' }
      ];
      const filePath = '/User/marty/my-app/src/something-else/image.jpg';
      expect(isCopyTaskFile(config, filePath)).toBe(false);
    });

    it('copy relative path src file', () => {
      config.copy = [
        { src: './assets/image.jpg' }
      ];
      const filePath = '/User/marty/my-app/src/assets/image.jpg';
      expect(isCopyTaskFile(config, filePath)).toBe(true);
    });

    it('not copy abs path src dir', () => {
      config.copy = [
        { src: '/User/marty/my-app/src/assets' }
      ];
      const filePath = '/User/marty/my-app/src/something-else/image.jpg';
      expect(isCopyTaskFile(config, filePath)).toBe(false);
    });

    it('copy abs path src dir', () => {
      config.copy = [
        { src: '/User/marty/my-app/src/assets' }
      ];
      const filePath = '/User/marty/my-app/src/assets/image.jpg';
      expect(isCopyTaskFile(config, filePath)).toBe(true);
    });

    it('not copy relative path src dir', () => {
      config.copy = [
        { src: 'assets' }
      ];
      const filePath = '/User/marty/my-app/src/something-else/image.jpg';
      expect(isCopyTaskFile(config, filePath)).toBe(false);
    });

    it('copy relative path src dir', () => {
      config.copy = [
        { src: 'assets' }
      ];
      const filePath = '/User/marty/my-app/src/assets/image.jpg';
      expect(isCopyTaskFile(config, filePath)).toBe(true);
    });

    it('copy assets glob file', () => {
      config.copy = [
        { src: 'assets/**/*.jpg' }
      ];
      const filePath = '/User/marty/my-app/src/assets/image.jpg';
      expect(isCopyTaskFile(config, filePath)).toBe(true);
    });

    it('copy assets glob wildcard', () => {
      config.copy = [
        { src: 'assets/*' }
      ];
      const filePath = '/User/marty/my-app/src/assets/image.jpg';
      expect(isCopyTaskFile(config, filePath)).toBe(true);
    });

    it('not copy assets glob wildcard', () => {
      config.copy = [
        { src: 'assets/*' }
      ];
      const filePath = '/User/marty/my-app/src/something-else/image.jpg';
      expect(isCopyTaskFile(config, filePath)).toBe(false);
    });

  });

});
