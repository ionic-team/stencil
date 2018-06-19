import * as d from '../../../declarations';
import { createGlobCopyTask, getDestAbsPath, getSrcAbsPath, isCopyTaskFile, processCopyTasks } from '../config-copy-tasks';
import { mockConfig } from '../../../testing/mocks';
import { normalizePath } from '../../util';


describe('copy tasks', () => {

  let config: d.Config;

  beforeEach(() => {
    config = mockConfig();
    config.srcDir = '/User/marty/my-app/src';
    config.outputTargets['www'] = {};
    config.outputTargets['www'].dir = '/User/marty/my-app/www';
  });

  describe('processCopyTasks', () => {

    it('should throw error when dest is a glob', async () => {
      try {
        const copyTask: d.CopyTask = {
          src: 'assets',
          dest: '**/*'
        };
        await processCopyTasks(config, [], copyTask);
        expect('this should').toBe('get called');

      } catch (e) {}
    });

    it('should throw error when missing src', async () => {
      try {
        const copyTask: d.CopyTask = {};
        await processCopyTasks(config, [], copyTask);

      } catch (e) {}
    });

    it('should resolve with null copy task', async () => {
      const r = await processCopyTasks(config, [], null);
      expect(r).toBeUndefined();
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
      const p = getDestAbsPath(config, src, config.outputTargets['www'].dir, dest);
      const normalizedPath = normalizePath(p);
      expect(normalizedPath).toBe('/User/marty/my-app/www/images/bear.jpg');
    });

    it('should get "dest" path when "dest" is relative and "src" is absolute', () => {
      const src = '/User/marty/my-app/src/assets/bear.jpg';
      const dest = 'images/bear.jpg';
      const p = getDestAbsPath(config, src, config.outputTargets['www'].dir, dest);
      const normalizedPath = normalizePath(p);
      expect(normalizedPath).toBe('/User/marty/my-app/www/images/bear.jpg');
    });

    it('should get "dest" path when "dest" is absolute', () => {
      const src = '/User/marty/my-app/src/assets/bear.jpg';
      const dest = '/User/marty/my-app/www/images/bear.jpg';
      const p = getDestAbsPath(config, src, config.outputTargets['www'].dir, dest);
      const normalizedPath = normalizePath(p);
      expect(normalizedPath).toBe('/User/marty/my-app/www/images/bear.jpg');
    });

    it('should get "dest" path when missing "dest" path and "src" is relative', () => {
      const src = 'assets/bear.jpg';
      const p = getDestAbsPath(config, src, config.outputTargets['www'].dir, undefined);
      const normalizedPath = normalizePath(p);
      expect(normalizedPath).toBe('/User/marty/my-app/www/assets/bear.jpg');
    });

    it('should throw error when missing "dest" path and "src" is absolute', () => {
      expect(() => {
        getDestAbsPath(config, '/User/big/bear.jpg', config.outputTargets['www'].dir, undefined);
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
